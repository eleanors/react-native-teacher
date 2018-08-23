//学生单次作业情况
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {
    Actions,
} from 'react-native-router-flux';
import DisplayUtils from "../../../utils/DisplayUtils";
const ScrollableTabView = require('../correct/TabBar/tabbar');
import TaskResult from './TaskResult';
import RankingList from "./RankingList";
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import Config from "../../../Config";

export default class StudentSubmit extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            finish_list: []
        };
        // Actions.refresh({
        //     title: this.props.student.user_name + '的作业'
        // });

        HttpUtils.request(API.getTaskStudentList, {
            task_id: this.props.taskId
        }).then(res=> {
            console.log(res);
            this.setState({
                finish_list: res.finish_list,
                un_finish_list: res.un_finish_list,
            });
        });

    }

    onRight() {


        let url;
        if(Config.evn){
            url = Config.shareUrl + 'task/' + this.props.taskId;
        }else{
            url = Config.shareTestUrl + 'task/' + this.props.taskId;
        }
        console.log("分享链接：", url);

        Actions.shareBoard({
            shareInfo: {
                title: this.props.student.task_name?this.props.student.task_name:this.props.title,
                desc: this.props.student.user_name + '学生的作业情况',
                url: url,
                img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png'
            }

        });
    }


    render() {

        return (<View style={{flex: 1}}>
                <ScrollableTabView
                    initialPage={0}
                    tabBarActiveTextColor='#4791ff'
                    tabBarInactiveTextColor='#6E6E6E'
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarTextStyle={{marginTop: 5, fontSize: 15}}
                    tabBarUnderlineStyle={styles.slider}
                >
                    <ScrollView style={styles.scrollView} tabLabel='作业结果' showsVerticalScrollIndicator={false}
                                rticalScrollIndicator={false} alwaysBounceVertical={true}>
                        <TaskResult
                            info={this.props.student}
                            taskId={this.props.taskId}
                        />
                    </ScrollView>

                    <ScrollView style={styles.scrollView} tabLabel='排行榜' showsVerticalScrollIndicator={false}
                                rticalScrollIndicator={false} alwaysBounceVertical={true}>


                        <RankingList list={this.state.finish_list}/>

                    </ScrollView>
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 4 - 15,
        backgroundColor: '#4791ff',
        borderRadius: 2,
        borderWidth: 0,
    },
    scrollView: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
    },
});