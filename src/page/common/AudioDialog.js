/**
 * Created by heaton on 2018/3/14.
 * Desription : 语音录制播放UI
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DisplayUtils from '../../utils/DisplayUtils';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import AudioPlayUtils from '../../utils/AudioPlayUtils';
import Sound from 'react-native-sound';

import RNFetchBlob from 'react-native-fetch-blob';
import HttpUtils from "../../utils/HttpUtils";
import {API} from "../../Config";
import Toast from '../../utils/Toast';
import TextUtils from "../../utils/TextUtils";

const SCREEN = DisplayUtils.SCREEN;
const MAX_VOICE_COUNT = 3;
const MAX_VOICE_TIMES = 60;

const STATES = {
    DEFAULT: 0,//默认状态不显示
    START_RECORD: 1,//开始录音
    RECORDING: 2,//录音中
    STOP_RECORD: 3,//录音结束
    UN_RECORD: 4,//不可录音
    ERROR: 5,//错误
};

export default class AudioDialog extends Component {
    voiceRefs = [];
    // 构造
    constructor(props) {
        super(props);
        console.log('AudioDialog constructor', this.props.uploadOptions);
        this.state = {
            voiceList: Array.from(this.props.voiceList),
            voiceCount: this.props.voiceList.length,
            buttonText: '按住录音',
            currRecordTime: 0,
            recordState: STATES.DEFAULT
        };
    }

    componentDidMount() {
        AudioRecorder.onProgress = (data) => {
            console.log(data);
            this.setState({currRecordTime: Math.floor(data.currentTime + 1)});
            if (data.currentTime + 1 >= MAX_VOICE_TIMES) {
                this._stopRecord();
            }
        };
        AudioRecorder.onFinished = (data) => {
            if (Platform.OS === 'ios' && data.status === "OK") {
                this._finishRecord(data.audioFileURL);
            }
        }
    }

    _createCurrAudioPath() {
        return AudioUtils.DocumentDirectoryPath + '/voice' + this.state.voiceCount + '.aac';
    }

    _prepareRecord() {
        AudioPlayUtils.stop();
        this.voiceRefs.map((voiceRef)=>{
            if(voiceRef){
                voiceRef.setState({isPlaying:false});
            }
        });
        console.log('state', this.state.recordState);
        if (this.state.voiceCount >= MAX_VOICE_COUNT) {
            this.setState({
                recordState: STATES.UN_RECORD,
                buttonText: '按住录音',
            });
            return;
        }
        let audioPath = this._createCurrAudioPath();
        console.log('audioPath -- ', audioPath);
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac"
        });
        this.setState({
            recordState: STATES.START_RECORD,
            buttonText: '按住录音',
        });

    }

    async _startRecord() {
        console.log('state', this.state.recordState);
        if (this.state.recordState != STATES.START_RECORD) {
            // this.setState({
            //     recordState: STATES.DEFAULT,
            // });
            return;
        }
        try {
            let path = await AudioRecorder.startRecording();
            console.log('start await', path);
            this.setState({
                recordState: STATES.RECORDING,
                buttonText: '正在录音'
            });
        } catch (err) {
            console.log('start err ', err);
            this.setState({
                recordState: STATES.ERROR,
                buttonText: '按住录音',
            });
        }
    }

    async _stopRecord() {
        console.log('state', this.state.recordState);
        if (this.state.recordState != STATES.RECORDING) {
            this.setState({
                recordState: STATES.DEFAULT,
                buttonText: '按住录音',
            });
            // return;
        }
        try {
            let path = await AudioRecorder.stopRecording();
            if (Platform.OS === 'android') {
                this._finishRecord(path);
            }
            console.log('stop success', path);
        } catch (err) {
            this.setState({
                recordState: STATES.ERROR,
                buttonText: '按住录音',
            });
            console.log('stop err', err);
        }
    }

    _finishRecord(path) {
        if (path.indexOf('file://') == 0) {
            path = path.replace('file://', '');
        }
        console.log('finish --- ', path);

        if(this.state.currRecordTime < 1){
            Toast.error("录音时间太短");
            this.setState({
                currRecordTime: 0,
                buttonText: '按住录音',
            });
            return;
        }

        RNFetchBlob.fs
            .readFile(path, 'base64')
            .then((base64Str) => {
                let titleIndex = base64Str.indexOf('data:audio/aac;base64,');
                console.log(titleIndex);
                let tmpArr = this.state.voiceList;
                let time = this.state.currRecordTime;
                tmpArr.push({
                    url: path,
                    time: time,
                    base64Str: base64Str
                });
                this.setState({
                    recordState: STATES.DEFAULT,
                    voiceCount: tmpArr.length,
                    voiceList: tmpArr,
                    currRecordTime: 0,
                    buttonText: '按住录音',
                });
            })
            .catch((err) => {
                console.log('转换文件为base64错误', err);
            });
    }


    _deleteVoiceItem(item, index) {
        console.log(item, index);
        let tmpArr = Array.from(this.state.voiceList);
        tmpArr.splice(index, 1);
        console.log(tmpArr);
        this.setState({
            voiceList: tmpArr,
            voiceCount: tmpArr.length,
        })
    }

    _renderVoiceItems() {
        return this.state.voiceList.map((item, index) => {
            console.log(item);
            return (
                <VoiceItemView
                    ref={ref => this.voiceRefs[index] = ref}
                    key={index}
                    voiceItem={item}
                    itemStyle={{marginRight: index == this.state.voiceList.length ? 0 : 10}}
                    deleteItem={() => this._deleteVoiceItem(item, index)}
                    voiceRefs={this.voiceRefs}
                    voiceIndex={index}/>
            );
        });
    }

    _renderStateMessage() {
        let messageView = null;
        switch (this.state.recordState) {
            case STATES.DEFAULT:
                messageView = null;
                break;
            case STATES.START_RECORD:
                messageView = (
                    <View style={styles.messageRootView}>
                        <Image source={require('../../images/speak_cancel.png')}
                               style={{width: 60, height: 60, marginBottom: 10}}/>
                        <Text style={{color: '#fff'}}>松开取消录音</Text>
                    </View>
                );
                break;
            case STATES.RECORDING:
                messageView = (
                    <View style={styles.messageRootView}>
                        <Image source={require('../../images/record.gif')}
                               style={{width: 60, height: 60, marginBottom: 10}}/>
                        <Text style={{color: '#fff'}}>松开结束录音{this.state.currRecordTime}</Text>
                    </View>
                );
                break;
            case STATES.STOP_RECORD:
                messageView = (
                    <View style={styles.messageRootView}>
                        <Image source={require('../../images/record.gif')}
                               style={{width: 60, height: 60, marginBottom: 10}}/>
                        <Text style={{color: '#fff'}}>录音成功</Text>
                    </View>
                );
                break;
            case STATES.UN_RECORD:
                messageView = (
                    <View style={styles.messageRootView}>
                        <Image source={require('../../images/speak_overtime.png')}
                               style={{width: 60, height: 60, marginBottom: 10}}/>
                        <Text style={{color: '#ffffff'}}>最多可录制3段语音</Text>
                    </View>
                );
                break;
        }
        return messageView;
    }

    _submit() {
        AudioPlayUtils.stop();
        let files = [];
        this.state.voiceList.map((item, index) => {
            let voice = {};
            if (item.url.indexOf('http') >= 0) {
                voice.voice_file = item.url;
            } else {
                voice.voice_file = item.base64Str;
                voice.format_type = 'aac';
            }
            voice.voice_time = item.time;
            files.push(voice);
        });
        console.log('files', files);

        if (this.props.voiceList.length === 0 && files.length < 1){
            Toast.error("至少录制一条语音");
            return;
        }

        console.log('_submit this.props.uploadOptions', this.props.uploadOptions);
        let params = {
            id: this.props.uploadOptions.voice_id,
            student_id: this.props.uploadOptions.student_id,
            task_id: this.props.uploadOptions.task_id,
            test_number: this.props.uploadOptions.test_number,
            voice_type: this.props.uploadOptions.voice_type,
            files: JSON.stringify(files),
        };
        console.log('params', params);
        HttpUtils.request(API.UpdateVoice, params)
            .then((data) => {
                console.log(data);
                this.props.submitSuccess(data);
                Actions.pop();
            })
            .catch((err) => {
                console.log(err);
                Toast.error("保存语音失败");
            });
    }


    render() {
        let voiceViews = this._renderVoiceItems();
        let messageView = this._renderStateMessage();
        let buttonBgColor =
            this.state.recordState == STATES.DEFAULT
            || this.state.recordState == STATES.ERROR
            || this.state.recordState == STATES.UN_RECORD
                ? '#ffffff' : '#4791ff';
        let buttonTextColor =
            this.state.recordState == STATES.DEFAULT
            || this.state.recordState == STATES.ERROR
            || this.state.recordState == STATES.UN_RECORD
                ? '#4791ff' : '#ffffff';
        return (
            <View style={styles.root}>
                {messageView}
                <View style={styles.contentView}>
                    <View style={styles.headerView}>
                        <TouchableOpacity
                            onPress={() => {
                                AudioPlayUtils.stop();
                                Actions.pop();
                            }}>
                            <Text style={[styles.cancelText, styles.f15, {color: '#A2A2A2'}]}>取消</Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleText, styles.f15, {color: '#A2A2A2'}]}>
                            还可录制<Text
                            style={{color: '#4791ff', fontSize: 15}}>{MAX_VOICE_COUNT - this.state.voiceCount}</Text>段语音
                        </Text>
                        <TouchableOpacity
                            onPress={() => this._submit()}>
                            <Text style={[styles.sureText, styles.f15]}>发送</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.voiceRootView}>
                        {voiceViews}
                    </View>
                    <TouchableWithoutFeedback
                        onPressIn={() => this._prepareRecord()}
                        onPressOut={() => this._stopRecord()}
                        onLongPress={() => this._startRecord()}>
                        <View style={[styles.footerView, {backgroundColor: buttonBgColor}]}>
                            <Text style={[styles.buttonText, {color: buttonTextColor}]}>{this.state.buttonText}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

class VoiceItemView extends React.Component {
    //
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isPlaying: false,
        };
    }

    _stopPlay() {
        const {voiceRefs,voiceIndex} = this.props;
        if(voiceRefs){
            for(let i = 0;i<voiceRefs.length;i++){
                if(i != voiceIndex && voiceRefs[i]){
                    voiceRefs[i].setState({isPlaying:false});
                }
            }
        }
    }

    _playAudio(url) {
        this._stopPlay();
        if (this.state.isPlaying) {
            AudioPlayUtils.stop();
            this.setState({isPlaying: false});
        } else {
            AudioPlayUtils.play(url, (state) => {
                if (state == 1) {
                    this.setState({isPlaying: true});
                } else if (state == 2) {
                    this.setState({isPlaying: false});
                } else {
                    Toast.error("语音播放异常");
                    this.setState({isPlaying: false});
                }
            });
        }
    }

    render() {
        let {voiceItem, itemStyle, deleteItem} = this.props;
        let imgUrl = require('../../images/audio_line.png');
        let playUrl = require('../../images/play_audio.gif');
        let voiceImage = this.state.isPlaying ? playUrl : imgUrl;
        return (
            <View style={[styles.voiceItemRoot, itemStyle]}>
                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => this._playAudio(voiceItem.url)}>
                    <View style={styles.voiceItem}>
                        <Image style={{width: 20, height: 20}} source={voiceImage}/>
                        <View style={{flex: 1}}/>
                        <Text style={{color: '#ffffff'}}>{voiceItem.time}"</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteVoice}
                    onPress={() => {
                        if(this.state.isPlaying){
                            AudioPlayUtils.stop();
                        }
                        this.props.deleteItem();
                    }}>
                    <Image style={{width: 20, height: 20}} source={require('../../images/speak_delete_normal.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "rgba(50,52,52,0.3)",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    contentView: {
        width: SCREEN.width,
        backgroundColor: '#ffffff',
        paddingBottom: (TextUtils.isIphoneX()) ? 30 : 10
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F6F7',
        paddingBottom: 6,
        paddingTop: 6,
    },
    cancelText: {
        padding: 10
    },
    titleText: {
        flex: 1,
        textAlign: 'center'
    },
    sureText: {
        padding: 10,
        color: '#4791ff'
    },
    footerView: {
        backgroundColor: '#4791ff',
        borderRadius: 30,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderWidth: 1,
        borderColor: '#4791ff'
    },
    buttonText: {
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    voiceRootView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        marginTop: 10,
        marginLeft: 10,
    },
    voiceItemRoot: {
        width: (SCREEN.width - 40) / 3
    },
    voiceItem: {
        backgroundColor: '#4791ff',
        borderRadius: 30,
        flexDirection: 'row',
        padding: 10,
        marginTop: 8,
        marginBottom: 8,
    },
    deleteVoice: {
        position: 'absolute',
        right: -5,
        top: 2,
    },
    messageRootView: {
        position: 'absolute',
        width: 150,
        height: 150,
        left: (SCREEN.width - 150) / 2,
        top: (SCREEN.height - 150) / 2,
        backgroundColor: 'rgba(52,52,52,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    f15: {
        fontSize: 15,
    }
});