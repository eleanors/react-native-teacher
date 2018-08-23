'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    WebView,
    RefreshControl,
    ScrollView,
    TouchableOpacity, Dimensions, PixelRatio
} from 'react-native';
import {Actions} from "react-native-router-flux";
import Touch from "../../public/Touch";
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import AHWebView from "../../common/AHWebView";
import Video from './Video/index'
import Radio from "./Radio";
import Checkbox from "./Checkbox";
import Explain from "./Explain";
import AudioPlayUtils from '../../../utils/AudioPlayUtils';
const ScrollableTabView = require('../correct/TabBar/tabbar');
import DisplayUtils from '../../../utils/DisplayUtils';
import TextUtils from '../../../utils/TextUtils';


export default class SubjectItem extends Component {
    // 构造

    static defaultProps = {
        cb: () => {
        }
    };

    onRightError() {
        console.log(this.state.info);
        Actions.subjectError({
            info: {
                cloud_data: this.state.info,
                test_type: this.state.test_type
            }
        });
    }

    onRightCollect() {
        let data = [
            {
                cloud_subject_id: this.state.info.cloud_subject_id,
                cloud_test_id: this.state.info.cloud_test_id,
                test_type: this.state.test_type,
            }
        ];
        Actions.myCollection({meSeletedArr: data});
    }

    stopPlayVideo() {
        if (this.videoView) {
            this.videoView.pause();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            info: {
                topic: ''
            },
            test_type: 1,
            fullScreen: false,
            voice_list: {
                type: 2,
                voice: [],
                id: 0
            },
            isRefreshing: false,
            hideTopic: false,
            maxTopic: 200,
        };
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData(callBack) {
        if (this.props.taskId && this.props.test_number) {
            HttpUtils.request(API.getTestDetail, {
                task_id: this.props.taskId,
                test_number: this.props.test_number
            }).then((res) => {
                console.log(res);
                let voice_list = res.cloud_data.voice_list;
                let voice_list2 = {};
                if (voice_list && voice_list[0]) {
                    for (let i in voice_list) {
                        if (voice_list[i].type === 2) {
                            voice_list2 = voice_list[i];
                        }
                    }
                }
                if (!voice_list2.type) {
                    voice_list2.type = 2;
                    voice_list2.voice = [];
                    voice_list2.id = 0;
                }
                this.setState({
                    info: res.cloud_data,
                    test_type: res.test_type,
                    voice_list: voice_list2,
                    isRefreshing: false,
                });
                this.props.cb(res);
                console.log('_fetchData', callBack);
                if (callBack) {
                    callBack();
                }
            }).catch(() => {
                this.setState({isRefreshing: false,});
            });
        } else {
            HttpUtils.request(API.getSubjectDetail, {
                cloud_test_id: this.props.cloudTestId,
                cloud_subject_id: this.props.cloudSubjectId,
                test_count: 1
            }).then((res) => {
                this.setState({
                    info: res.list,
                    test_type: res.list.test_type,
                    isRefreshing: false,
                });
                this.props.cb(res);
                console.log('_fetchData', callBack);
                if (callBack) {
                    callBack();
                }
            }).catch(() => {
                this.setState({isRefreshing: false,});
            });
        }
    }


    onFullScreen(status) {
        if (this.props.fullScreen) {
            this.props.fullScreen(status);
        }
        this.setState({
            fullScreen: status
        })
        Actions.refresh({hideNavBar: status});
    }

    _renderTopic() {
        let material_from = '';
        if(this.state.info.material_from && this.state.info.material_from.length > 0){
            material_from += '<div style="width: 100%;overflow: hidden;">';
            for(let i in this.state.info.material_from){
                let num = parseInt(i) + 1;
                material_from += '<div style="margin-bottom: 10px;"><div style="width: 8%;float: left">('+ num +')</div><div style="width: 92%;float:left;">' + this.state.info.material_from[i].topic + '</div></div><br/><br/>';
                if(this.state.info.material_from[i].options_a){
                    material_from += '<div style="width: 5%;float: left">A. </div><div style="width: 95%;float:left;">' + this.state.info.material_from[i].options_a + '</div><br/><br/>';
                }
                if(this.state.info.material_from[i].options_b){
                    material_from += '<div style="width: 5%;float: left">B. </div><div style="width: 95%;float:left;">' + this.state.info.material_from[i].options_b + '</div><br/><br/>';
                }
                if(this.state.info.material_from[i].options_c){
                    material_from += '<div style="width: 5%;float: left">C. </div><div style="width: 95%;float:left;">' + this.state.info.material_from[i].options_c + '</div><br/><br/>';
                }
                if(this.state.info.material_from[i].options_d){
                    material_from += '<div style="width: 5%;float: left">D. </div><div style="width: 95%;float:left;">' + this.state.info.material_from[i].options_d + '</div><br/><br/>';
                }
                if(this.state.info.material_from[i].options_e){
                    material_from += '<div style="width: 5%;float: left">E. </div><div style="width: 95%;float:left;">' + this.state.info.material_from[i].options_e + '</div><br/><br/>';
                }
                if(this.state.info.material_from[i].options_f){
                    material_from += '<div style="width: 5%;float: left">F. </div><div style="width: 95%;float:left;">' + this.state.info.material_from[i].options_f + '</div><br/><br/>';
                }
            }
            material_from += '</div><br/>'
        }
        return (
            <AHWebView
                html={this.state.info.topic + '<br/>' + material_from}
                maxHeight={200}
                topic={true}
                viewStyle={{width: Dimensions.get('window').width - 30, marginLeft: 15}}
                webStyle={{width: Dimensions.get('window').width - 30,}}
            />
        );
    }

    _renderOptions() {
        return (
            <View style={{}}>
                {(this.state.test_type === 1) ?
                    <View style={[styles.line,]}>
                        <Radio
                            taskId={this.props.taskId}
                            test_number={this.props.test_number}
                            info={this.state.info}
                        />
                    </View>
                    :
                    null
                }
                {(this.state.test_type === 2) ?
                    <View style={styles.line}>
                        <Checkbox
                            taskId={this.props.taskId}
                            test_number={this.props.test_number}
                            info={this.state.info}
                        />
                    </View>
                    :
                    null
                }
                {(this.state.test_type === 3) ?
                    <Explain
                        info={this.state.info}
                    />
                    :
                    null
                }
            </View>
        );
    }

    _top() {
        return (
            <View style={{paddingTop: 10,}}>

                {/*题干*/}
                {this._renderTopic()}

                {/*选项*/}
                {this._renderOptions()}

            </View>
        );
    }

    _closeAll(list) {
        for (let i in list) {
            list[i].play = false;
        }
        return list;
    }

    _audioList(list) {
        return list.map((item, k) => {
            let path = (item.url) ? item.url : item.voice_url;
            let width = 75 + 30 * (((item.time) ? item.time : item.voice_time) / 60);
            let imgUrl = require('../../../images/audio_line.png');
            let playUrl = require('../../../images/play_audio.gif');
            return (
                <TouchableOpacity activeOpacity={0.8} key={k} onPress={() => {
                    let voice_list = this.state.voice_list;
                    if (item.play) {
                        item.play = false;
                        console.log(1212, list);
                        AudioPlayUtils.stop();
                        voice_list.voice = list;
                        this.setState({
                            voice_list: voice_list
                        })
                    } else {
                        list = this._closeAll(list);
                        if (this.videoView) {
                            this.videoView.pause();
                        }
                        AudioPlayUtils.play(path, (status) => {
                            console.log(status);
                            if (status === 1) {
                                item.play = true;
                                voice_list.voice = list;
                                this.setState({
                                    voice_list: voice_list
                                })
                            } else {
                                item.play = false;
                                voice_list.voice = list;
                                this.setState({
                                    voice_list: voice_list
                                });
                            }
                        });
                    }

                    this.props.closeAll(this);
                }}>
                    <View style={[styles.audioItem, {width: width}]}>
                        <Image style={styles.audioItemLine} source={(item.play) ? playUrl : imgUrl}/>
                        <Text style={styles.audioItemText}>{(item.time) ? item.time : item.voice_time}″</Text>
                    </View>
                </TouchableOpacity>
            );
        })
    }

    _renderSolutionTitle() {
        let voiceTitle = this.state.voice_list.voice.length > 0 ? '编辑语音' : '添加语音';
        let rightTitle = this.props.types === 1 ? (
            <Touch onPress={() => {
                console.log('press ', this.state.voice_list);
                if (this.videoView) {
                    this.videoView.pause();
                }
                Actions.audioDialog({
                    voiceList: this.state.voice_list.voice,
                    uploadOptions: {
                        voice_id: this.state.voice_list.id,
                        student_id: 0,
                        task_id: this.props.taskId,
                        test_number: this.props.test_number,
                        voice_type: 2,
                    },
                    submitSuccess: (res) => {
                        console.log('upload audio submitSuccess', res);
                        let list = [];
                        for (let i in res.voice_list) {
                            console.log(222, res);
                            list.push({
                                time: res.voice_list[i].voice_time,
                                url: res.voice_list[i].voice_url
                            });
                        }
                        console.log('update voice success', res);
                        this.setState({
                            voice_list: {
                                id: res.id,
                                voice: list,
                                type: 2
                            }
                        })
                    }
                })
            }} style={styles.editAudio}>
                <Text style={[styles.editAudioText,]}>{voiceTitle}</Text>
            </Touch>
        ) : null;
        let audioView = this.props.types === 1 ? (
            <View style={styles.audioList}>
                {this._audioList(this.state.voice_list.voice)}
            </View>
        ) : null;


        return (
            <View style={[styles.line,]}>
                <View style={styles.videoTitle}>
                    <View style={styles.AudioTitleLine}>
                    </View>
                    <Text style={[styles.videoTitleText, {marginTop: 3}]}>解析</Text>
                    {rightTitle}
                </View>
                {audioView}
            </View>
        );
    }

    _bottom() {

        let solution = '';
        if(this.state.info.material_from && this.state.info.material_from.length > 0) {
            for (let i in this.state.info.material_from) {
                let num = parseInt(i) + 1;
                solution += '<div style="margin-bottom: 10px;overflow: hidden"><div style="width: 8%;float: left">('+ num +')</div><div style="width: 92%;float:left;">' + this.state.info.material_from[i].solution + '</div></div><br/>';
            }
        }
        return (
            <View style={{}}>
                {
                    this.state.info.solution || this.props.types === 1 ? this._renderSolutionTitle() : null
                }

                {(this.state.info.solution || solution !== '') ?
                    <View style={{}}>
                        <AHWebView
                            html={this.state.info.solution + solution}
                            viewStyle={{
                                width: Dimensions.get('window').width - 30,
                                marginLeft: 15,
                                marginTop: 30,
                                marginBottom: 10,
                            }}
                            webStyle={{width: Dimensions.get('window').width - 30}}
                        />
                    </View>
                    :
                    null
                }

            </View>
        );
    }


    _testType(type) {
        console.log(2333333333,type);
        switch (type) {
            case 1:
                return '单选题';
            case 2:
                return '多选题';
            case 3:
                return '解答题';
            default:
                return '';
        }
    }

    render() {

        //增加判断
        let srcHeight;
        if (this.props.markValue == 1) {
            srcHeight = Dimensions.get('window').height - 65;
        } else {
            srcHeight = Dimensions.get('window').height - 115;
        }
        return (
            <View style={{flex: 1}}>
                {(this.props.types === 2 && !this.state.fullScreen) ?
                    <View style={styles.title}>
                        <Text style={styles.titleNum}>{this.props.keys}</Text>
                        <Text style={styles.titleNum2}>/{this.props.counts}</Text>
                        <Text style={styles.titleType}>  {this._testType(this.state.test_type)}</Text>
                    </View>
                    :
                    null
                }

                {this.state.info.video_url ?
                    <Video
                        ref={ref => this.videoView = ref}
                        url={this.state.info.video_url}
                        onFullScreen={status => this.onFullScreen(status)}
                        style={styles.video}
                        scrollBounce={true}
                        rotateToFullScreen
                        lockPortraitOnFsExit={true}
                        onPlayPress={() => {
                            AudioPlayUtils.stop();
                            let voiceList = this.state.voice_list.voice.map((item) => {
                                item.play = false;
                                return item;
                            });
                            console.log('onPlayPress', voiceList);
                            this.setState({
                                voiceList: {
                                    voice: voiceList,
                                }
                            })
                        }}
                        ScrollViewStyle={{
                            flex: 1,
                            backgroundColor: '#fff',
                        }}
                        contentAbove={
                            <View>
                                {this._top()}
                                <View style={styles.videoTitle}>
                                    <View style={styles.videoTitleLine}>
                                    </View>
                                    <Text style={[styles.videoTitleText, {marginTop: 3}]}>视频讲解</Text>
                                </View>
                            </View>
                        }
                        contentBelow={this._bottom()}
                        onRefresh={(callBack)=> {
                            console.log('callBack', callBack);
                            this._fetchData(callBack);
                        }}
                    />
                    :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        rticalScrollIndicator={false}
                        alwaysBounceVertical={true}
                        style={[styles.scrollView, {height: srcHeight}]}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this._fetchData()}
                                colors={['#ff0000', '#ff0000', '#ff0000']}
                            />
                        }
                    >
                        {this._top()}
                        {this._bottom()}
                    </ScrollView>
                }

                {this.state.test_type === 3 && !this.state.fullScreen && this.props.types === 1 ?
                    <View style={[styles.contentBottom, {marginBottom: (TextUtils.isIphoneX()) ? 20 : 0}]}>
                        <Touch onPress={() => {
                            // todo 跳转批改作业
                            // console.log(TextUtils.isIphoneX());
                            Actions.correctList(this.props);
                        }}>
                            <View style={styles.contentButton}>
                                <Text style={{textAlign: 'center', color: '#fff'}}>批改解答题</Text>
                            </View>
                        </Touch>
                    </View>
                    :
                    null
                }
            </View>
        );
    }

}
const styles = StyleSheet.create({
    audioList: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 20,
        paddingRight: 20,
    },
    audioItem: {
        height: 35,
        backgroundColor: "#4791ff",
        borderRadius: 100,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        marginRight: 20,
    },
    audioItemLine: {
        width: 14,
        height: 10,
        marginLeft: 15,
    },
    audioItemText: {
        position: 'absolute',
        color: '#fff',
        right: 15,
    },
    editAudio: {
        width: 100,
        height: 40,
        position: 'absolute',
        right: 15,
        top: 12,
    },
    editAudioText: {
        textAlign: 'right',
        color: '#4791ff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    contentBottom: {
        height: 70,
        backgroundColor: '#ffffff',
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentButton: {
        backgroundColor: '#5394ff',
        justifyContent: 'center',
        width: 180,
        height: 50,
        borderRadius: 100,
    },
    videoTitle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10,
        paddingBottom: 10,
        height: 55,
        paddingLeft: 15,
    },
    videoTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    videoTitleLine: {
        width: 3,
        height: 15,
        backgroundColor: '#4791ff',
        marginTop: 4,
        borderRadius: 5,
        marginRight: 10,
    },
    AudioTitleLine: {
        width: 3,
        height: 15,
        backgroundColor: '#ffa14e',
        marginTop: 4,
        borderRadius: 5,
        marginRight: 10,
    },
    video: {
        marginTop: 20,
        flex: 1,
        width: Dimensions.get('window').width - 40,
        marginLeft: 20,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    scrollView: {
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
    },
    line: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        width: Dimensions.get('window').width,

    },
    answer: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    radio: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20,
    },
    rightRadio: {
        backgroundColor: '#dae9ff',
    },
    radioText: {
        fontSize: 18,
    },
    answerPercent: {
        position: 'absolute',
        right: 10,
        top: 20,
        width: 60,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        borderColor: '#4b4b4b',
        borderWidth: 1
    },
    rightAnswerPercent: {
        backgroundColor: '#4791ff',
        borderColor: '#4791ff',
    },
    answerPercentText: {
        textAlign: 'center',
    },
    rightAnswerPercentText: {
        color: '#fff',
    },

    title: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        width: Dimensions.get('window').width,
        backgroundColor: '#fff'
    },
    titleNum: {
        color: '#4791ff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    titleNum2: {
        color: '#b5b5b5',
        marginTop: 10,
    },
    titleType: {
        marginTop: 8,
        color: '#4791ff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});