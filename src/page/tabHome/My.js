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
    Button,
    Alert, Dimensions,
} from 'react-native';
import ListRow from '../common/ListRow';
import {Actions} from 'react-native-router-flux';
import Touch from "../public/Touch";
import UserBiz from '../../biz/UserBiz';
import {observer} from 'mobx-react';
import TextUtils from '../../utils/TextUtils';
import DeviceInfo from 'react-native-device-info';
import {Overlay} from "teaset";
import DisplayUtils from "../../utils/DisplayUtils";

@observer
export default class My extends Component {

    userInfo = global.userInfo;

    constructor(props) {
        super(props);
        // let userinfo = global.userinfo;
        //
        // console.log(userinfo);
        // let info = UserBiz.userInfo;
        // this.userInfo.access_token = userinfo.access_token;
        // this.userInfo.expires_in = userinfo.expires_in;
        // this.userInfo.img_url = userinfo.img_url;
        // this.userInfo.mobile = userinfo.mobile;
        // this.userInfo.sex = userinfo.sex;
        // this.userInfo.user_name = userinfo.user_name;
        // this.userInfo.user_type = userinfo.user_type;
        // this.userInfo.grade = userinfo.grade||{};
        // this.userInfo.subject = userinfo.subject||{};
        // UserBiz.updateUserInfo(this.userInfo);

    }

    render() {
        let version = DeviceInfo.getVersion();
        let imgUri = TextUtils.isEmpty(this.userInfo.img_url) ? require('../../images/head_teacher.png') : {uri: this.userInfo.img_url};

        let subjectAndGradeStr = '';
        if (this.userInfo.grade.grade_name
            && this.userInfo.grade.grade_name.length > 0
            && this.userInfo.subject.name &&
            this.userInfo.subject.name.length > 0) {
            subjectAndGradeStr = '[ '
                + this.userInfo.grade.grade_name
                + this.userInfo.subject.name
                + ' ]';
        }


        return (
            <View style={styles.bg}>
                <Touch
                    opacity={0.8}
                    onPress={() => Actions.info()}
                >
                    <View style={styles.top}>
                        <Image source={require('../../images/my-bg.png')} style={styles.topBg}/>
                        <View style={styles.headImg}>

                            <Image source={imgUri} style={styles.headImgUrl}/>
                        </View>
                        <Text style={styles.headText}>{this.userInfo.user_name} {subjectAndGradeStr}</Text>
                        <Image source={require('../../images/my-arrow.png')} style={styles.arrow}/>
                    </View>
                </Touch>
                <ListRow
                    title='设置'
                    style={styles.listrow}
                    accessory='indicator'
                    onPress={() => Actions.setting()}
                    bottomSeparator='none'
                    icon={require('../../images/shezhi_03.png')}
                />
                <ListRow
                    title='意见反馈'
                    style={styles.listrow}
                    accessory='indicator'
                    onPress={() => Actions.feedback()}
                    bottomSeparator='none'
                    icon={require('../../images/yijian_06.png')}
                />
                <ListRow
                    title='邀请好友'
                    style={styles.listrow}
                    accessory='indicator'
                    onPress={() => {
                        // Actions
                        Actions.shareBoardImg({
                            shareInfo: {
                                title: '123',
                                desc: '456',
                                img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/share.png'
                            },
                            types: 2
                        });
                    }}
                    bottomSeparator='none'
                    icon={require('../../images/yaoqing_08.png')}
                />
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 65,
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#c6c6c6',
                    }}>v{version}</Text>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    bg: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#fff'
    },
    listrow: {
        paddingTop: 25,
        paddingBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        marginBottom: 0.5,
    },
    top: {
        width: Dimensions.get('window').width,
        height: 205,
        alignItems: 'center',
    },
    topBg: {
        width: Dimensions.get('window').width,
        height: 205,
        position: 'absolute'
    },
    headImg: {
        width: 80,
        height: 80,
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 100,
        alignItems: 'center',
        marginTop: 53,
    },
    headImgUrl: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: 'transparent'
    },
    headText: {
        color: "#fff",
        position: 'absolute',
        bottom: 30,
        backgroundColor: 'transparent'
    },
    arrow: {
        position: 'absolute',
        right: 24,
        top: 85,
        width: 8,
        height: 13,
    }
});