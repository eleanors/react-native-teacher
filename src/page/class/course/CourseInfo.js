/**
 * 课程详情
 */


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import {
    ListRow,
    Label
} from 'teaset';
import moment from 'moment';
import DisplayUtils from "../../../utils/DisplayUtils";
import ClassBiz from "../../../biz/ClassBiz";
import Config from "../../../Config";

export default class CourseInfo extends Component {


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(this.props.item);
        console.log(this.props.data);
        this.state = {
            name: '',
            question_count: 0,
            start_time: Date.parse(new Date()),
            duration: 0,
        };
        this._getdata();

    }


    onEnter() {
        if (ClassBiz.refresh) {
            this._getdata();
        }
    }

    _getdata(){

        HttpUtils.request(API.GetCourseInfo,{
            id: this.props.item.course_id
        }).then(res=>{
            console.log(res);
            this.setState(res);
        })
    }

    render() {
        return (
            <View style={{height: Dimensions.get('window').height - 35, backgroundColor: '#fff', paddingBottom:30,}}>
                <ScrollView style={styles.root} showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true}>
                    <View style={styles.title}>
                        <Text style={styles.name}>{this.state.name}</Text>
                        <Text style={styles.time}>{moment(this.state.start_time*1000).format('MM月DD日 HH:mm')}  {this.state.duration/3600}小时</Text>
                    </View>
                    <View style={styles.desc}>
                        <Text style={styles.descText}>
                            {this.state.intro}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={()=> Actions.editCourse({info: this.state})}>
                        <Text style={styles.edit}>编辑课程详情</Text>
                    </TouchableOpacity>

                    <ListRow
                        title='准备教案'
                        icon={<Image source={require('../../../images/courseInfo1.png')} style={{width: 40, height: 40,marginRight: 10}}/>}
                        style={styles.listRow}
                        accessory='indicator'
                        bottomSeparator='none'
                        detail={'已选'+ this.state.question_count +'道题目'}
                        onPress={()=>Actions.courseTest({info: this.state})}
                    />
                    <ListRow
                        title='上课记录'
                        icon={<Image source={require('../../../images/courseInfo2.png')} style={{width: 40, height: 40,marginRight: 10}}/>}
                        style={styles.listRow}
                        accessory='indicator'
                        bottomSeparator='none'
                        detail={(this.state.record_student_count === 0)?'老师还未记录课堂情况':''}
                        onPress={()=>{
                            if(Actions.currentScene !== 'courseInfo'){
                                return;
                            }
                            if(this.state.student_count <= 0){
                                return Actions.errToast({msg: '暂无学生'});
                            }
                            Actions.courseRecord({info: this.state})
                        }}
                    />
                    <ListRow
                        title='课后反馈'
                        icon={<Image source={require('../../../images/courseInfo3.png')} style={{width: 40, height: 40,marginRight: 10}}/>}
                        style={styles.listRow}
                        accessory='indicator'
                        bottomSeparator='none'
                        detail={(this.state.feedback_student_count === 0) ? '老师还没有对课堂表现进行评价' : ''}
                        onPress={()=>{
                            if(Actions.currentScene !== 'courseInfo'){
                                return;
                            }
                            if(this.state.student_count <= 0){
                                return Actions.errToast({msg: '暂无学生'});
                            }
                            Actions.courseFeedback({info: this.state})
                        }}
                    />

                    <View style={{width: Dimensions.get('window').width,height: 30,}}>

                    </View>
                </ScrollView>
                <TouchableOpacity onPress={()=>{
                    if(this.state.status !== 3){
                        return Actions.errToast({msg: '请全部反馈后分享'});
                    }
                    let url;
                    if(Config.evn){
                        url = Config.shareUrl + 'course/' + this.props.item.course_id;
                    }else{
                        url = Config.shareTestUrl + 'course/' + this.props.item.course_id;
                    }
                    Actions.shareBoard({
                        shareInfo: {
                            title:  this.props.data.class_name + '的学习报告',
                            desc: this.state.name + ' | ' + global.userInfo.user_name,
                            url: url,
                            img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png'
                        }
                    });
                }}>
                    <View style={styles.share}>
                        <Text style={styles.shareText}>分享给家长</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    share: {
        width: Dimensions.get('window').width - 40,
        height: 55,
        backgroundColor: '#4791ff',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:20,
        marginLeft: 20,
        marginTop: 20,
    },
    shareText: {
        textAlign: 'center',
        color: '#fff',
    },
    root: {
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 150,
        padding: 20,
    },
    title: {
        flexDirection: 'row',
    },
    name: {
        flex: 1,
        fontSize: 16,
        color: '#4b4b4b',
    },
    time: {
        flex: 1,
        textAlign: 'right',
        color: '#797c87',
    },
    desc: {
        marginTop: 10,
    },
    descText: {
        color: '#797c87',
    },
    edit: {
        textAlign: 'center',
        marginTop: 20,
        color: '#4791ff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listRow: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 0,
        borderColor: '#edecec',
        borderBottomWidth: DisplayUtils.px2dp(1),
    }
});