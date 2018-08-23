/**
 * 添加课程
 */


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity, Dimensions,
} from 'react-native';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import Toast from '../../../utils/Toast';
import ClassBiz from '../../../biz/ClassBiz';
import TextUtils from '../../../utils/TextUtils';
import {
    ListRow,
    Label
} from 'teaset';
import moment from 'moment';
import Touch from "../../public/Touch";
import DisplayUtils from "../../../utils/DisplayUtils";

export default class CourseTEMP extends Component {

    static onExit() {
        // Picker.isPickerShow((state)=>{});
        Picker.hide();
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(this.props);
        let info = this.props.info;
        this.state = {
            courseName: (info && info.name) ? info.name : '请输入课程名称',
            courseDetail: (info && info.intro) ? info.intro : '请输入详细课程介绍',
            courseStartTime: (info && info.start_time) ? (moment(info.start_time * 1000).format('YYYY-MM-DD HH:mm')) : moment().format('YYYY-MM-DD HH:mm'),
            courseTime: (info && info.duration) ? (info.duration/3600 + '小时') : '请选择课程时长',
            courseTimes: (info && info.duration) ? (info.duration/3600) : '',
            startTime:  (info && info.start_time) ? info.start_time : Date.parse(new Date())/1000,

        };
        console.log(Date.parse(new Date())/1000)
    }


    _courseName(){
        if(Actions.currentScene != 'addCourse' && Actions.currentScene != 'editCourse'){
            return;
        }
        Actions.inputDialog({
            title: '请输入课程名称',
            placeholderText: '最多20个字符',
            maxLength: 20,
            value: this.state.courseName === '请输入课程名称' ? '' : this.state.courseName,
            onConfirm: (text) => {
                let name = TextUtils.removeTheSpace(text);
                if (name.length == 0) {
                    // Toast.error('班级名称不能为空');
                    this.setState({courseName: '请输入课程名称'})
                    // return;
                } else {
                    if (!TextUtils.checkSpecialCharacter(name)) {
                        return;
                    }
                    console.log(22222222,name);
                    this.setState({courseName: name})
                }
            }
        });
    }

    _showDatePicker() {
        let date = new Date;
        console.log('date.getFullYear',date.getFullYear()+1);
        Actions.datePickerDialog({
            title: '请选择开课时间',
            selectedDate: moment(this.state.courseStartTime).toDate(),
            maxDate:moment((date.getFullYear()+1) + '-12-31 23:59').toDate(),
            minDate:moment().toDate(),
            mode: 'datetime',
            onConfirm: (date) => {
                console.log('birthday date -- ',date);
                let timestamp = parseInt(date.getTime() / 1000);

                this.setState({
                    courseStartTime: moment(date).format('YYYY-MM-DD HH:mm'),
                    startTime: timestamp
                })
            }
        });
    }

    _showClassTime(){
        let list = [];
        for(let i = 0.5;i<=8;i=i+0.5){
            list.push(i + '小时');
        }
        Picker.init({
            pickerData: list,
            selectedValue: [(this.state.courseTime === '请选择课程时长') ? '0.5小时' : this.state.courseTime],
            pickerTitleText: '课程时长',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log(pickedValue);
                console.log(pickedIndex);
                let time = parseFloat(list[pickedIndex].replace(/小时/,''));
                console.log(time);
                this.setState({courseTime: list[pickedIndex], courseTimes: time});
            }
        });
        Picker.show();
    }

    _submit(){
        console.log(this.state);
        if(this.state.courseName === '' || this.state.courseName === "请输入课程名称"){
            return Actions.errToast({msg: '请输入课程名称'});
        }
        if(this.state.courseName.length < 2){
            return Actions.errToast({msg: '课程名称不能少于2个字'});
        }
        if(this.state.courseName.length > 20){
            return Actions.errToast({msg: '课程名称不能大于20个字'});
        }
        if(this.state.courseDetail === '' || this.state.courseDetail === "请输入详细课程介绍"){
            return Actions.errToast({msg: '请输入详细课程介绍'});
        }
        if(this.state.courseDetail.length < 2){
            return Actions.errToast({msg: '课程介绍不能少于2个字'});
        }
        if(this.state.courseTimes === ''){
            return Actions.errToast({msg: '请选择课程时长'});
        }

        if(this.props.info){
            console.log();

            HttpUtils.request(API.EditCourse,
                {
                    id: this.props.info.id,
                    name: this.state.courseName,
                    intro: this.state.courseDetail,
                    start_time: this.state.startTime,
                    duration: parseInt(this.state.courseTimes * 3600),
                })
                .then((data) => {
                    // Actions.errToast({msg: '请选择课程时长'});
                    ClassBiz.mustRefresh();
                    Toast.success('保存课程成功');
                    Actions.pop();
                })
                .catch((err) => {

                });
        }else{

            HttpUtils.request(API.AddCourse,
                {
                    class_number: this.props.class_number,
                    name: this.state.courseName,
                    intro: this.state.courseDetail,
                    start_time: this.state.startTime,
                    duration: parseInt(this.state.courseTimes * 3600),
                })
                .then((data) => {
                    // Actions.errToast({msg: '请选择课程时长'});
                    ClassBiz.mustRefresh();
                    Toast.success('添加课程成功');
                    Actions.pop();
                })
                .catch((err) => {

                });
        }
    }

    _del(){
        Actions.confirmDialog({
            title: '删除课程',
            buttons: ["删除", "取消"],
            message: '确认删除该课程？',
            onClick: (index) => {
                if (index === 0) {
                    //
                    HttpUtils.request(API.DelCourse,
                        {
                            id: this.props.info.id
                        })
                        .then((data) => {
                            ClassBiz.mustRefresh();
                            Toast.success('删除课程成功');
                            Actions.popTo('classDetail');
                        })
                        .catch((err) => {

                        });

                } else {
                    console.log("取消解散");
                }

            }
        })
    }

    render() {
        return (
            <View style={styles.root}>

                <ListRow
                    title='课程名称'
                    detail={<Label text={this.state.courseName} style={(this.state.courseName === '请输入课程名称')?styles.titleStyle:styles.detailStyle}/>}
                    style={styles.listrow}
                    bottomSeparator='none'
                    titleStyle={styles.titleStyle}
                    onPress={this._courseName.bind(this)}
                />
                <ListRow
                    title='课程介绍'
                    detail={<Label text={this.state.courseDetail} style={(this.state.courseDetail === '请输入详细课程介绍')?styles.titleStyle:styles.detailStyle}/>}
                    style={styles.listrow}
                    bottomSeparator='none'
                    titleStyle={styles.titleStyle}
                    onPress={()=>{
                        Actions.courseDesc({
                            detail: (this.state.courseDetail === '请输入详细课程介绍')?'':this.state.courseDetail,
                            callback: (res)=>{
                                console.log(res);
                                this.setState({courseDetail: res})
                            }
                        });
                    }}
                />
                <ListRow
                    title='开课时间'
                    detail={this.state.courseStartTime}
                    style={styles.listrow}
                    bottomSeparator='none'
                    titleStyle={styles.titleStyle}
                    detailStyle={styles.detailStyle}
                    onPress={()=>{
                        this._showDatePicker();
                    }}
                />
                <ListRow
                    title='课程时长'
                    detail={this.state.courseTime}
                    style={styles.listrow}
                    bottomSeparator='none'
                    titleStyle={styles.titleStyle}
                    detailStyle={(this.state.courseTime === '请选择课程时长')?styles.titleStyle:styles.detailStyle}
                    onPress={()=>{
                        this._showClassTime();
                    }}
                />

                {(this.props.info) ?
                    <View>

                        <Touch
                            activeOpacity={0.7}
                            onPress={()=>{
                                this._submit();
                                }}
                        >
                            <View style={styles.createBtnRoot}>
                                <Text style={styles.createBtn}>保存</Text>
                            </View>
                        </Touch>

                        <Touch
                            activeOpacity={0.7}
                            onPress={()=>{
                                this._del();
                            }}
                        >
                            <View>
                                <Text style={styles.del}>删除课程</Text>
                            </View>
                        </Touch>
                    </View>

                    :

                    <Touch
                        activeOpacity={0.7}
                        onPress={()=>{
                            this._submit();
                        }}
                    >
                        <View style={styles.createBtnRoot}>
                            <Text style={styles.createBtn}>添加课程</Text>
                        </View>
                    </Touch>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    del: {
        textAlign: 'center',
        color: '#b5b5b5',
        marginTop: 20,
        fontSize: 16,
    },
    detailStyle: {
        fontSize: 16,
        color: '#4b4b4b',
        width: Dimensions.get('window').width * 0.5,
        textAlign: 'right',
    },
    titleStyle: {
        fontSize: 16,
        color: '#818890'
    },
    listrow: {
        height: 65,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec'
    },
    root: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },


    createBtnRoot: {
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4791ff',
        padding: 10,
        height: 50,
        marginTop: 40,
    },
    createBtn: {
        color: '#fff',
        fontSize: 18,
    },
});