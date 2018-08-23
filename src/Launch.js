/**
 * Created by heaton on 2017/12/19.
 * Desription :
 */

'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    StatusBar,
    Animated,
    Dimensions,
    NetInfo,
    Button,
    Platform,
    ImageBackground,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
import Config, {API, StorageKeys} from './Config';
import Update from './biz/common/Update';
import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Http from "./utils/HttpUtils";
import UserBiz from "./biz/UserBiz";
import Toast from './utils/Toast';
import CodePush from 'react-native-code-push';
import GlobalFloatUtils from './utils/GlobalFloatUtils';

export default class App extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: new Animated.Value(0),
            isPlaying: true
        };
        GlobalFloatUtils.dismissFloat();
        let storage = new Storage({

            storageBackend: AsyncStorage,

            defaultExpires: null,

            enableCache: true,

        });

        global.storage = storage;

        StatusBar.setBarStyle('dark-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        }


        //获取设备信息
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('型号', DeviceInfo.getModel());
            console.log('品牌', DeviceInfo.getBrand());
            console.log('屏幕宽度', parseInt(Dimensions.get('window').width));
            console.log('屏幕高度', parseInt(Dimensions.get('window').height));
            console.log('当前版本', Config.version);
            console.log('当前网络状态', connectionInfo);
            let type = -1;
            switch (connectionInfo.type) {
                case 'none':
                    type = -1;
                    break;
                case 'wifi':
                    type = 3;
                    break;
                case 'cellular':
                    type = 4;
                    break;
                case 'unknown':
                    type = 0;
                    break;
            }
            global.deviceInfo = {
                model: DeviceInfo.getModel(),
                vendor: DeviceInfo.getBrand(),
                network_type: type,
                width: parseInt(Dimensions.get('window').width),
                height: parseInt(Dimensions.get('window').height),
                os_version: DeviceInfo.getVersion(),
            };
            console.log(1111, global.deviceInfo)
        });


    }

    componentDidMount() {
        CodePush.notifyApplicationReady();
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 1,
        }).start(({finished}) => {
            console.log(finished);
            Update.checkNativeVersion()
                .then(() => {
                    console.log('then ++++ ');
                    //无版本更新
                    storage.load({key: 'access-token'}).then(res => {

                        console.log('access-token from storage', res);
                        global.access_token = res;
                        //獲取用戶信息
                        Http.request(API.getUserInfo).then(userinfo => {
                            let user = new UserBiz();
                            user.updateUserInfo(userinfo);
                            global.userInfo = user.userInfo;

                            storage.load({key: StorageKeys.DefaultSubjectAndGradeKey})
                                .then((result) => {
                                    global.subjectAndGrade = {
                                        gradeType: result.gradeType,
                                        subjectId: result.subjectId,
                                        name: result.name
                                    };
                                    Actions.reset('main');
                                    SplashScreen.hide();
                                })
                                .catch((err) => {
                                    global.subjectAndGrade = {
                                        gradeType: 3,
                                        subjectId: 1,
                                        name: '高中数学'
                                    };
                                    Actions.reset('main');
                                    SplashScreen.hide();
                                });
                        }).catch((err) => {
                            SplashScreen.hide();
                            /**
                             * 启动动画，显示登录按钮
                             */
                            Actions.reset('sign');
                        });
                    }).catch(err => {
                        console.log('err_access_token', err);
                        SplashScreen.hide();
                        /**
                         * 启动动画，显示登录按钮
                         */
                        Actions.reset('sign');
                    });
                })
                .catch(() => {
                    SplashScreen.hide();
                    Actions.reset('sign');
                    // console.log('catch +++ ');
                    Toast.message("报错----");
                });
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                <ImageBackground
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                        alignItems: 'center'
                    }}
                    source={require('./images/splash.png')}>
                    <Text style={{
                        position: 'absolute',
                        bottom: 80,
                        textAlign: 'center',
                        fontSize: 20,
                    }}> ITS 秦学云课堂 </Text>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});
