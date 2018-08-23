
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet, Dimensions,Platform
} from 'react-native';
import {
    Actions,
} from 'react-native-router-flux';
import DisplayUtils from "../../../utils/DisplayUtils";
const ScrollableTabView = require('../correct/TabBar/tabbar');
import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";

export default class TaskResult extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            info: this.props.info,
            answer_info: {
                student_accuracy: 0,
                task_accuracy: 0,
            },
            radio: [],
            checkbox: [],
            content: [],
        };
        HttpUtils.request(API.getStudentAnswerList,{
            task_id: this.props.taskId,
            student_id: this.props.info.student_id
        }).then(res=>{
            let test_list = res.test_list;
            let radio = [];
            let checkbox = [];
            let content = [];
            test_list.map((item)=>{
                switch (item.test_type){
                    case 1:
                        radio.push(item);
                        break;
                    case 2:
                        checkbox.push(item);
                        break;
                    case 3:
                        content.push(item);
                        break;
                    default:
                        content.push(item);
                        break;
                }
            });
            this.setState({
                radio: radio,
                checkbox: checkbox,
                content: content,
                answer_info: res
            })
        })
    }

    _item(list){
        return list.map((item,k)=>{
            let style,textStyle;
            switch (item.answer_type){
                case 0:
                    style = styles.wait;
                    break;
                case 1:
                    style = styles.right;
                    break;
                case 2:
                    style = styles.error;
                    break;
                default:
                    style = styles.half;
                    break
            }
            if(item.is_answered === 0){
                style = styles.noanswer;
            }

            if(item.is_answered === 0){
                textStyle = styles.liTextWait;
            }
            return (
                <View style={[styles.li,style]} key={k}>
                    <Text style={[styles.liText,textStyle]}>{item.test_number}</Text>
                </View>
            );
        })
    }


    render() {

        return (
            <View>
                <View>
                    <Text style={styles.title}>{this.state.info.user_name}第<Text style={styles.titleNum}>{this.state.answer_info.commit_index}</Text>名提交作业</Text>
                </View>
                <View style={styles.pic}>
                    <AnimatedGaugeProgress
                        size={200}
                        width={10}
                        fill={this.state.answer_info.student_accuracy}
                        rotation={90}
                        cropDegree={180}
                        tintColor="#4791ff"
                        backgroundColor="#f6f8fa"
                        stroke={[2, 2]} //For a equaly dashed line
                        strokeCap="circle"
                        style={styles.yuan}
                    />
                    <AnimatedGaugeProgress
                        size={180}
                        width={10}
                        fill={this.state.answer_info.task_accuracy}
                        rotation={90}
                        cropDegree={180}
                        tintColor="#ffc96a"
                        backgroundColor="#f2f4f6"
                        stroke={[2, 2]} //For a equaly dashed line
                        strokeCap="circle"
                        style={styles.yuan2}
                    />
                    <Text style={styles.result}>
                        正确率
                    </Text>
                    <Text style={styles.resultNum}>
                        {this.state.answer_info.student_accuracy}%
                    </Text>
                    <Text style={styles.rightResult}>
                        平均正确率{this.state.answer_info.task_accuracy}%
                    </Text>
                </View>
                {(this.state.radio.length > 0) ?
                    <View>
                        <View style={styles.task}>
                            <Text style={styles.taskTitle}>单选题</Text>
                            <View style={styles.line}></View>
                        </View>
                        <View style={styles.taskList}>
                            {this._item(this.state.radio)}
                        </View>
                    </View>
                    :
                    null
                }
                {(this.state.checkbox.length > 0) ?
                    <View>
                        <View style={styles.task}>
                            <Text style={styles.taskTitle}>多选题</Text>
                            <View style={styles.line}></View>
                        </View>
                        <View style={styles.taskList}>
                            {this._item(this.state.checkbox)}
                        </View>
                    </View>
                    :
                    null
                }
                {(this.state.radio.length > 0) ?
                    <View>
                        <View style={styles.task}>
                            <Text style={styles.taskTitle}>解答题</Text>
                            <View style={styles.line}></View>
                        </View>
                        <View style={styles.taskList}>
                            {this._item(this.state.content)}
                        </View>
                    </View>
                    :
                    null
                }


                <View style={styles.info}>
                    <View style={[styles.infoLi,styles.right]}></View>
                    <Text>正确</Text>
                    <View style={[styles.infoLi,styles.error]}></View>
                    <Text>错误</Text>
                    <View style={[styles.infoLi,styles.half]}></View>
                    <Text>半对</Text>
                    <View style={[styles.infoLi,styles.noanswer]}></View>
                    <Text>未答</Text>
                    <View style={[styles.infoLi,styles.wait]}></View>
                    <Text>待批</Text>
                </View>

                <View style={{marginTop: 20}}>
                </View>
            </View>
        );
    }
}

const liWidth = (Dimensions.get('window').width - 140)/5;

const styles = StyleSheet.create({
    info: {
        padding: 20,
        paddingLeft: 10,
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    infoLi: {
        backgroundColor: '#000',
        width: 15,
        height: 15,
        borderRadius: 7.5,
        marginTop: (Platform.OS === 'android')?2.5:0,
        marginRight: 5,
        marginLeft: 10,
    },
    right: {
        backgroundColor: '#4791ff',
    },
    error: {
        backgroundColor: '#ff7e60',
    },
    half: {
        backgroundColor: '#ffc63e',
    },
    noanswer: {

        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#4791ff',
    },
    wait: {
        backgroundColor: '#c7ccd3',
    },
    liText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: 'transparent'
    },
    liTextWait: {
        color: '#4791ff',
    },
    task: {
        padding: 20,
        paddingBottom: 1,
        flexDirection:'row',
    },
    taskTitle: {
        color: '#b5b5b5',
        marginRight: 10,
    },
    line: {
        borderTopWidth: 0.5,
        borderColor: '#edecec',
        width: Dimensions.get('window').width - 90,
        marginTop: 10,
    },
    taskList: {
        marginTop: 10,
        marginLeft: 20,
        flexDirection:'row',
        flexWrap: 'wrap',
        width: Dimensions.get('window').width,
    },
    li: {
        width: liWidth,
        height: liWidth,
        marginRight: 25,
        marginBottom: 20,
        borderRadius: liWidth,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 10,
        backgroundColor: 'transparent'
    },
    titleNum: {
        color: "#4791ff",
        fontSize: 20,
    },
    pic: {
        marginTop: 20,
        height: 120,
        overflow: 'hidden',
    },
    yuan: {
        position: 'absolute',
        left: Dimensions.get('window').width/2 - 100,
        backgroundColor: 'transparent'
    },
    yuan2: {
        position: 'absolute',
        left: Dimensions.get('window').width/2 - 90,
        top: 10,
        backgroundColor: 'transparent'
    },
    result: {
        textAlign: 'center',
        color: '#b5b5b5',
        marginTop: 30,
        backgroundColor: 'transparent'
    },
    resultNum: {
        textAlign: 'center',
        color: '#4791ff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 3,
        backgroundColor: 'transparent'
    },
    rightResult: {
        textAlign: 'center',
        color: '#b5b5b5',
        marginTop: 3,
        backgroundColor: 'transparent'
    },
});