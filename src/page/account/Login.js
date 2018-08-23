import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    Keyboard,
    View,
    TouchableOpacity,
} from 'react-native';
import Highlight from '../public/TouchHighlight';
import {Actions} from "react-native-router-flux";
import {
    Input,
} from 'teaset';
import {API, StorageKeys} from '../../Config';
import Http from '../../utils/HttpUtils';
import UserBiz from "../../biz/UserBiz";
import InputClean from "../common/InputClean";


export default class Login extends Component {
    title;

    constructor(props) {
        super(props);
        console.log(props);
        this.title = props.title;
        console.log('platform', Platform.OS);
        this.state = {
            mobile: '',
            password: '',
            client_type: (Platform.OS === 'ios') ? 2 : 1
        };
    }

    Logins() {

        Keyboard.dismiss();

        if (this.state.mobile.length == 0) {
            return Actions.errToast({msg: '手机号不可以为空'});
        }

        if (this.state.password.length == 0) {
            return Actions.errToast({msg: '密码不能为空'});
        }


        let reg = /^1\d{10}$/;
        if (this.state.mobile.length !== 11 || !reg.test(this.state.mobile)) {
            return Actions.errToast({msg: '错误的手机号'});
        }
        if (this.state.password.length < 6) {
            return Actions.errToast({msg: '错误的密码'});
        }


        let loginInfo = {
            mobile: this.state.mobile,
            password: this.state.password,
            client_type: this.state.client_type,
            customer_type: 1,
            device_id: global.clientId,
            info: JSON.stringify(global.deviceInfo),
        };
        Http.request(API.Login, loginInfo).then(result => {
            console.log(result);
            global.storage.save({
                key: 'access-token',
                data: result.access_token
            });

            global.access_token = result.access_token;

            Http.request(API.getUserInfo).then(userinfo => {
                //保存
                let user = new UserBiz();
                user.updateUserInfo(userinfo);
                global.userInfo = user.userInfo;
                storage.load({key:StorageKeys.DefaultSubjectAndGradeKey})
                    .then((result)=>{
                        global.subjectAndGrade = {
                            gradeType: result.gradeType,
                            subjectId: result.subjectId,
                            name:result.name
                        };
                        Actions.reset('main');
                    })
                    .catch((err)=>{
                        global.subjectAndGrade = {
                            gradeType: 3,
                            subjectId: 1,
                            name:'高中数学'
                        };
                        Actions.reset('main');
                    });
            });
        });
        console.log(loginInfo);
    }

    static onRight(...props) {
        Actions.forget();
    }

    render() {
        return (
            <View style={styles.bg}>
                <View>

                    <Image source={require('../../images/login-point.png')} style={styles.point}/>
                    <Text style={styles.loginText}>登录</Text>
                    <Text style={styles.loginDesc}>填写账号和密码</Text>

                </View>
                <View style={styles.inputs}>
                    <View style={styles.inputRoot}>
                        <InputClean
                            onchange={text => this.setState({mobile: text})}
                            style={styles.input}
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='numeric'
                            maxLength={11}
                            blurOnSubmit={true}
                            placeholder="请输入手机号"
                            clearInput={()=>this.setState({mobile:''})}
                        />
                    </View>
                    <View style={styles.inputRoot}>
                        <InputClean
                            secureTextEntry={true}
                            password={true}
                            onchange={text => this.setState({password: text})}
                            style={styles.input}
                            placeholder="请输入密码"
                            maxLength={15}
                            clearInput={()=>this.setState({password:''})}
                        />
                    </View>

                    <Highlight
                        style={styles.button}
                        onPress={() => this.Logins()}
                        normalColor='#4791ff'
                        activeColor='#3c6cb3'
                    >
                        <View>
                            <Text style={styles.buttonText}>登录</Text>
                        </View>
                    </Highlight>

                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        marginTop: 123,
        backgroundColor: '#fff'
    },
    point: {
        width: 30,
        height: 22,
        position: 'absolute',
        top: 0,
        left: 50,
    },
    loginText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#3c4e5d',
        backgroundColor:'transparent',
    },
    loginDesc: {
        color: '#b5b5b5',
        backgroundColor:'transparent',
    },
    inputs: {
        marginTop: 40,
    },
    inputRoot:{
        flexDirection:'row',
        backgroundColor: '#f8f8f8',
        marginTop: 20,
        alignItems:'center',
        borderRadius: 5,
    },
    inputClear:{
        width:15,
        height:15,
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderWidth: 0,
        height: 50,
        flex:1,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4791ff',
        borderWidth: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        backgroundColor: 'transparent',
    }

});
