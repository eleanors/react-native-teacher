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
    Image,
    ScrollView,
    NativeModules, StatusBar, NativeEventEmitter, Platform,
} from 'react-native';
import DisplayUtils from '../../../utils/DisplayUtils';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import Video from '../../task/Subject/Video/index';
import VideoPlayer from 'react-native-native-video-player';
import {
    ListRow,
} from 'teaset';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import ClassBiz from '../../../biz/ClassBiz';
import Toast from "../../../utils/Toast";

export default class LiveCourse extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            videos: [],
            recommend: {
                count_question: 0
            },
            lesson_task: {
                count_question: 0,
                corrections_student_count: 0,
                finish_student_count: 0,
            }
        };

        if (Platform.OS === 'ios') {
            let LiveVideo = NativeModules.LiveVideo;
            let emitter = new NativeEventEmitter(LiveVideo);
            //用获取的模块创建监听器
            console.log('message');
            this.subScription = emitter.addListener("EventVideo", (parameter) => {
                console.log(parameter);
                if (parameter.test == "true") {

                    Orientation.lockToLandscape();
                } else {
                    Orientation.lockToPortrait();
                    console.log(233333);
                    StatusBar.setHidden(false, false);
                    StatusBar.setBarStyle('dark-content', true);
                }
            });
        }

        HttpUtils.request(API.GetLiveLesson,{
            lesson_course_id: this.props.lesson_course_id,
            class_number: this.props.class_number,
        }).then(res=>{
            console.log(res);
            this.setState(res);
        })

    }

    componentWillUnmount() {
        if (Platform.OS === 'ios') {
            this.subScription.remove();
        }
    }

    first = true;

    _onEnter(){
        if(this.first){
            this.first = false;
        }else{
            this._update();
        }
    }

    _update(){
        HttpUtils.request(API.GetLiveLesson,{
            lesson_course_id: this.props.lesson_course_id,
            class_number: this.props.class_number,
        }).then(res=>{
            console.log(res);
            this.setState(res);
        })
    }

    _renderList(list){
        console.log(123);
        return list.map((item,k)=>{
            return (

                <TouchableOpacity
                    onPress={()=>{
                        // let url = 'http://img.tiku.qinxue100.com/subject/gaoshuxue/paper_video_questions/5d01d63685c0c8fb1bb89d75d3078452.mp4';
                        if (Platform.OS === 'ios') {
                            console.log('VideoPlayer', VideoPlayer)
                            NativeModules.LiveVideo.showVideoPlayer(item.url);
                        }else{
                            VideoPlayer.showVideoPlayer(item.url);
                        }
                    }}
                    key={k}
                >
                    <View style={styles.li}>
                        <Image source={require('../../../images/videoAvatar.png')} style={styles.videoAvatar} />
                        <Text style={styles.videoText} numberOfLines={2}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        })
    }

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true} style={styles.bg}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>{this.state.course_name}</Text>
                    <View style={styles.descView}>
                        <Text style={styles.teacher}>讲师：{this.state.teacher_name}</Text>
                        <Text style={styles.time}>{this.state.start_time}</Text>
                    </View>
                </View>
                <View style={styles.infoView}>
                    <View style={styles.videoView}>
                        <View style={styles.listTitle}>
                            <LinearGradient
                                style={styles.line}
                                colors={['#4279ff', '#4296ff', '#42afff']}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}>
                            </LinearGradient>
                            <Text style={styles.videoTitle}>本讲视频</Text>
                        </View>

                        <View style={styles.videoList}>
                            {(this.state.videos.length > 0)
                                ?
                                this._renderList(this.state.videos) :
                                <Text style={{marginTop: 10,color: '#a8a8b1',marginLeft: 15,}}>暂无视频</Text>
                            }
                        </View>

                    </View>


                    <ListRow
                        title={
                            <View>
                                <View style={styles.listTitle}>
                                    <LinearGradient
                                        style={styles.line}
                                        colors={['#4279ff', '#4296ff', '#42afff']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}>
                                    </LinearGradient>
                                    <Text style={styles.videoTitle}>刻意练习</Text>
                                </View>
                                <View>
                                    <Text style={styles.titleNum}>共{(this.state.lesson_task.count_question)?this.state.lesson_task.count_question:0}题</Text>
                                </View>
                            </View>
                        }
                        detail={
                            <View>
                                {(this.state.lesson_task.is_dead === 0)?

                                    <Text style={styles.detailText}>{this.state.lesson_task.finish_student_count}/{this.state.lesson_task.class_student_count}</Text>
                                    :
                                    <Text style={{color: '#a8a8b1'}}>已截止</Text>
                                }
                            </View>
                        }
                        accessory='indicator'
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detailStyle={styles.detailStyle}
                        onPress={()=>{
                            if(this.state.lesson_task.task_id){

                                Actions.taskDetail({taskId: this.state.lesson_task.task_id,})
                            }
                        }}
                    />

                    <ListRow
                        title={
                            <View>
                                <View style={styles.listTitle}>
                                    <LinearGradient
                                        style={styles.line}
                                        colors={['#4279ff', '#4296ff', '#42afff']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}>
                                    </LinearGradient>
                                    <Text style={styles.videoTitle}>测评报告</Text>
                                </View>
                            </View>
                        }
                        accessory='indicator'
                        style={[styles.listrow,{paddingTop: 30, paddingBottom: 30}]}
                        titleStyle={styles.titleStyle}
                        detailStyle={styles.detailStyle}
                        onPress={()=> {
                            if(parseInt(this.state.lesson_task.finish_student_count) === 0){
                                return Actions.errToast({msg: '没有学生提交作业'});
                            }else if(parseInt(this.state.is_correct) === 0){
                                return Actions.errToast({msg: '未批改解答题'});
                            }else{
                                return Actions.testReport({task_id: this.state.lesson_task.task_id});
                            }
                        }}
                        bottomSeparator='none'
                    />

                    <ListRow
                        bottomSeparator='none'
                        title={
                            <View>
                                <View style={styles.listTitle}>
                                    <LinearGradient
                                        style={styles.line}
                                        colors={['#4279ff', '#4296ff', '#42afff']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}>
                                    </LinearGradient>
                                    <Text style={styles.videoTitle}>推荐试题</Text>
                                </View>
                                <View>
                                    <Text style={styles.titleNum}>共{(this.state.recommend.count_question)?this.state.recommend.count_question:0}题</Text>
                                </View>
                            </View>
                        }
                        accessory='indicator'
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        detailStyle={styles.detailStyle}
                        onPress={()=>{
                            if(this.state.recommend.task_id){
                                Actions.testRecommend({paper_id: this.state.recommend.paper_id, title: this.state.course_name + '推荐试题'})
                            }
                        }}
                    />

                </View>
                <View style={{height: 30,}}>

                </View>
            </ScrollView>
        );
    }
}

let width = (Dimensions.get('window').width - 54) / 2;

const styles = StyleSheet.create({
    videoText: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 15,
        color: '#fff',
        backgroundColor: 'transparent'
    },
    videoAvatar: {
        width: width,
        height: width /1.77,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    li: {
        width: width,
        height: width /1.77,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    videoList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (Dimensions.get('window').width - 34),
        paddingBottom: 20,
    },
    videoView: {
        marginLeft: 17,
        marginRight: 17,
        marginTop: 20,
        borderBottomWidth: 1,
        borderColor: '#edecec',
        paddingLeft: 10,
        paddingRight: 10
    },
    titleNum: {
        color: '#a8a8b1',
        marginLeft: 15,
        marginTop: 5,
    },
    detailText:{
        color: '#a8a8b1',
    },
    listrow: {
        borderBottomWidth: 1,
        borderColor: '#edecec',
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 15,
        marginRight: 15,
    },
    listTitle: {
        flexDirection: 'row',
    },
    line: {
        width: 3,
        height: 16,
        borderRadius: 10,
        marginTop: 4,
    },
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
    },
    titleView: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#edecec'
    },
    title: {
        fontSize: 16,
        color: "#3d4f5e",
    },
    descView: {
        flexDirection: 'row',
    },
    teacher: {
        flex: 1,
        lineHeight: 30,
        color: '#a8a8b1',
    },
    time: {
        flex: 1,
        textAlign: 'right',
        lineHeight: 30,
        color: '#a8a8b1',
    },
    infoView: {
        // marginLeft: 10,
        // marginRight: 10,
    },
    videoTitle: {
        fontSize: 16,
        color: '#3d4f5e',
        marginLeft: 10,
    },
});