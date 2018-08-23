'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import AHWebView from "../../common/AHWebView";
import Touch from "../../public/Touch";
import {Actions} from "react-native-router-flux";
import ShareBoard from "../../common/ShareBoard";


export default class PublishSuccess extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log('props', this.props);
    }

    _rendeMessage(){
        return this.props.teaching ? (<View>
            <View style={styles.successTextView}>
                <Text style={styles.successText}>教案已生成！</Text>
            </View>
            <View style={styles.successTextView}>
                <Text style={styles.successDesc}>点击<Text style={styles.successDescSpan}>打印教案</Text>通过QQ或微信</Text>
                <Text style={styles.successDesc}>分享给电脑端进行<Text style={styles.successDescSpan}>打印</Text></Text>
            </View>
        </View>)
        : 
        (<View><View style={styles.successTextView}>
                <Text style={styles.successText}>作业发布成功！</Text>
            </View>
            <View style={styles.successTextView}>
                <Text style={styles.successDesc}>如果学生不方便使用手机完成作业</Text>
                <Text style={styles.successDesc}>可以将作业<Text style={styles.successDescSpan}>打印</Text>出来在纸上完成</Text>
                <Text style={styles.successDesc}>然后使用手机<Text style={styles.successDescSpan}>录入作业结果</Text></Text>
            </View>
        </View>)
    }


    render() {
        return (
            <View>
                <View style={styles.close}>
                    <Touch onPress={()=> {
                        setTimeout(() => Actions.popTo('_classList'), 200);
                    }}>
                        <Image source={require('../../../images/close-gray.png')} style={styles.closeImg}/>
                    </Touch>
                </View>
                <View style={styles.success}>
                    <Image source={require('../../../images/publich-success.png')} style={styles.successImg}/>
                </View>
                {this._rendeMessage()}
                <Touch opacity={0.8} onPress={()=> {
                    console.log(this.props.classList);
                    console.log('this.props.data', this.props.data);
                    if (this.props.classList.length > 1) {
                        Actions.printTask({data: this.props.data.shareInfo, classList: this.props.classList, teaching: this.props.teaching});
                    } else {
                        let info = this.props.data.shareInfo[0];

                        Actions.shareBoard({
                            shareInfo: {
                                title: info.share_title,
                                desc: info.share_desc,
                                url: info.pdf_url,
                                img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png'
                            }
                        });
                    }

                }}>
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.buttonView}>
                            <Text style={styles.buttonText}>{this.props.teaching?'打印教案':'打印作业'}</Text>
                        </View>
                    </View>
                </Touch>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    close: {
        paddingRight: 20,
        width: 100,
        height: 50,
        position: 'absolute',
        right: 0,
        top: 10
    },
    closeImg: {
        width: 16,
        height: 16,
        marginTop: 30,
        marginLeft: 50,
    },
    success: {
        marginTop: 100,
        alignItems: 'center',
    },
    successImg: {
        width: 135,
        height: 220,
    },
    successTextView: {
        marginTop: 20,
    },
    successText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    successDesc: {
        marginTop: 10,
        textAlign: 'center'
    },
    successDescSpan: {
        color: '#ff8a2b'
    },
    buttonView: {
        width: 180,
        height: 55,
        backgroundColor: '#1cd99d',
        marginTop: 60,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        backgroundColor: 'transparent',
    },
});