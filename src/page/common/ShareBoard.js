/**
 * Created by heaton on 2017/12/18.
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
} from 'react-native';
import Touch from '../public/TouchHighlight';
import DisplayUtils from '../../utils/DisplayUtils';
import {Actions} from "react-native-router-flux";
import {Overlay, Toast} from 'teaset';
import * as QQ from 'react-native-qqsdk';
import * as WeChat from 'react-native-wechat';
import Loading from '../../page/common/Loading';

export default class ShareBoard extends Component {

    static defaultProps = {
        /**
         * shareMessage:{url:'',title:'',desc:'',img:''}
         */
        shareInfo: null,
        types: 1
    };

    // 构造
    constructor(props) {
        super(props);
        WeChat.registerApp('wx0cf37f2f9cb9d9e8');
        // 初始状态
        this.state = {};
    }

    shareQQ(shareInfo) {
        if (!shareInfo) {
            console.log('shareMessage 为空');
            Toast.message("分享消息为空，请检查分享内容");
            return;
        }
        QQ.isQQClientInstalled().then(()=>{
            return QQ.shareNews(
                shareInfo.url+'',
                shareInfo.img+'',
                shareInfo.title+'',
                shareInfo.desc+'',
                QQ.shareScene.QQ
            ).then((res) => {
                Toast.message("分享QQ消息成功");
            }).catch((error) => {
                Toast.message("分享消息为空，请检查分享内容");
                console.log(error);
            });
        }).catch(()=>{
            Toast.message("没有安装QQ");
        });

    }

    shareWX(shareInfo) {
        if (!shareInfo) {
            console.log('shareMessage 为空');
            Toast.message("分享QQ消息失败");
            return;
        }
        // WeChat.isWXAppInstalled().then((isInstalled)=>{
        //     console.log('isInstalled',isInstalled);
        //     if(!isInstalled){
        //         return Toast.message("没有安装微信");
        //     }
            return WeChat.shareToSession({
                type: 'news',
                title: ''+shareInfo.title,
                description: ''+shareInfo.desc,
                webpageUrl: ''+shareInfo.url,
                thumbImage: ''+shareInfo.img
            }).then(() => {
                Toast.message("分享微信消息成功");
            }).catch((err) => {
                Toast.message("分享微信消息失败");
                console.log("shareToSession -- ：" + JSON.stringify(err));
            });
        // }).catch(()=>{
        //
        //     Toast.message("没有安装微信");
        // })

    }


    _showLoading() {
        let overlayView = (
            <Overlay.View
                style={{alignItems: 'center', justifyContent: 'center'}}
                modal={true}
                overlayOpacity={0}>
                <Loading/>
            </Overlay.View>
        );
        return Overlay.show(overlayView);
    }

    _hideLoading(key) {
        Overlay.hide(key);
    }


    render() {

        return (
            <View style={styles.root}>
                <TouchableOpacity style={{
                    width: DisplayUtils.SCREEN.width,
                    height: DisplayUtils.SCREEN.height - 150
                }} onPress={() => {
                    Actions.pop()
                }}>
                </TouchableOpacity>
                <View style={styles.shareBoard}>
                    <Text style={styles.title}>分享至</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.action]}
                                          onPress={this.shareQQ.bind(this, this.props.shareInfo)}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../../images/share_qq.png')} style={styles.image}/>
                                <Text style={styles.actionTitle}>QQ</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.action]}
                                          onPress={this.shareWX.bind(this, this.props.shareInfo)}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: -3}}>
                                <Image source={require('../../images/share_wechat.png')} style={styles.image}/>
                                <Text style={styles.actionTitle}>微信好友</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    shareBoard: {
        height: 160,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        padding: 15,
        color: '#131313'
    },
    divideLine: {
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.px2dp(1),
        backgroundColor: '#ccc',
    },
    actions: {
        margin: 15,
        flexDirection: 'row',
    },
    action: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionTitle: {
        fontSize: 16,
        color: '#ccc',
        marginTop: 5,
    },
    cancelView: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelTitle: {
        fontSize: 18,
        color: '#ccc'
    },
    image: {
        width: 50,
        height: 50,
    },
});