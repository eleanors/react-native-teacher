/**
 * 添加课程
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Keyboard,
    NativeEventEmitter,
    DeviceEventEmitter,
    Platform,
    NativeModules,
    Image
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../utils/HttpUtils";
import {API} from "../../Config";
import RadioGroup from  '../common/RadioGroup';
import Toast from '../../utils/Toast';
import ClassBiz from '../../biz/ClassBiz';
import TextUtils from '../../utils/TextUtils';
import SpeechConversionText from '../../utils/VoiceToTextUtil';
import {
    ListRow,
    Label
} from 'teaset';
import moment from 'moment';
let number = 200;
export default class CourseDesc extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            content: this.props.detail,
            show: false,
            voiceText: '',
            typeText: '启动中...',
            transferText: '',
            keyboardHeight: 0,
        };

    }

    _VoiceToText() {
        this.state.transferText = (this.state.content) ? this.state.content : '';
        if (this.state.content && this.state.content.length >= number) {
            Toast.error('已超出' + number + '字');
            return;
        }

        this.setState(
            {
                btnText: '松开结束',
                voiceText: '',
                show: true,
            });

        if (Platform.OS == 'ios') {
            return SpeechConversionText.VoiceToText({});
        } else {
            let aai = NativeModules.aai;
            aai.start();
        }
    }


    _stopVoiceToText() {
        let oldStr = this.state.transferText;
        let newStr = this.state.voiceText;

        if (newStr) {
            let voiveString;
            if (Platform.OS == 'ios') {
                if (oldStr) {
                    voiveString = oldStr + '\n' + newStr + '。';
                } else {
                    voiveString = newStr + '。';
                }
            } else {
                voiveString = oldStr + '\n' + newStr;
            }

            if (voiveString.length > number) {
                this.state.content = voiveString.substring(0, number);
            } else {
                this.state.content = voiveString;
            }
        }

        this.props.callback(this.state.content);
        this.setState({
            btnText: '按住说话',
            typeText: '',
            show: false,
        });

        if (Platform.OS == 'ios') {
            return SpeechConversionText.CloseRecognition({});
        } else {
            let aai = NativeModules.aai;
            aai.stop();
        }
    }

    componentWillUnmount() {
        console.log('this.subScription.remove');
        this.subScription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    componentWillMount() {
        let that = this;
        /** * 用于JS注册的监听 */
        if (Platform.OS === 'ios') {
            let SpeechConversionText = NativeModules.SpeechConversionText;
            SpeechConversionText.startObserving();
            let emitter = new NativeEventEmitter(SpeechConversionText);
            //用获取的模块创建监听器 
            that.subScription = emitter.addListener("EventVoiceToText", (parameter)=>this._voiceText(parameter, this));
        } else {
            this.subScription = DeviceEventEmitter.addListener('txaai', (parameter)=>this._voiceText(parameter, this));
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    _keyboardDidShow(e) {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        })

    }

    _keyboardDidHide(e) {
        this.setState({
            keyboardHeight: 0
        })
    }

    _voiceText(parameter, that) {

        if (parameter.type === 1) {
            this.setState({
                typeText: '语音转文字中...',
            });
        } else if (parameter.type === 2) {
            if (this.state.content) {
                if ((parameter.text.length + this.state.content.length) > number) {
                    this._stopVoiceToText();
                }
            } else {
                if ((parameter.text.length) > number) {
                    this._stopVoiceToText();
                }
            }

            this.setState({
                voiceText: parameter.text,
                typeText: '语音转文字中...',
            });
        } else {
            // Toast.error('识别失败');
            this._stopVoiceToText();
        }
    }


    render() {

        let v = this.state.show ? <View
            style={[styles.blackStyle, {height: Dimensions.get('window').height - this.state.keyboardHeight - 150}]}>
            <Text
                style={{
                    color: '#D5D5D5',
                    fontSize: 14
                }}>{this.state.voiceText}</Text>
            <Text
                style={{
                    color: '#878686',
                    position: 'absolute',
                    left: 15,
                    bottom: 10
                }}>{this.state.typeText}</Text>
        </View> : null;

        let btn = <View style={{
            position: 'absolute',
            zIndex: 20,
            right: DisplayUtils.SCREEN.width / 2,
            marginRight: -25,
            bottom: this.state.keyboardHeight + 80
        }}>
            <TouchableOpacity onPressIn={() => this._VoiceToText()}
                              onPressOut={()=> this._stopVoiceToText()}
                              style={{zIndex: 20}}>
                <View style={styles.btn}>
                    <Image
                        source={require('../../images/btn_voice_normal.png')}
                        style={{height: 50, width: 50, zIndex: 20}}/>
                </View>
            </TouchableOpacity>
        </View>;

        return (
            <View style={styles.bg}>
                {v}
                <TextInput
                    style={[styles.input]}
                    placeholder='请输入详细课程介绍，最多200字'
                    numberOfLines={100}
                    multiline={true}
                    autoFocus={true}
                    onChangeText={text => {
                        this.setState({content: text});
                        this.props.callback(text);
                    }}
                    value={this.state.content}
                    maxLength={number}
                />
                {btn}
            </View>
        );
    }
}
const styles = StyleSheet.create({

    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff'
    },
    input: {
        borderWidth: 0,
        padding: 15,
        height: Dimensions.get('window').height,
        justifyContent: 'space-between',
        textAlign: 'left',
        textAlignVertical: 'top',
    },
    btn: {
        width: 50,
        height: 50,
        backgroundColor: 'transparent',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    blackStyle: {
        position: 'absolute',
        width: Dimensions.get('window').width - 30,
        padding: 10,
        top: 15,
        zIndex: 10,
        backgroundColor: 'black',
        borderRadius: 6,
        left: 15,
        right: 15,
        opacity: 0.9
    }
});