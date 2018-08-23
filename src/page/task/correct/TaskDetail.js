/**作业概览
 * Created by heaton on 2018/1/18.
 * Desription :
 */


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Touch from "../../public/Touch";
import {
    ListRow
} from 'teaset';
import HttpUtils from "../../../utils/HttpUtils";
import {API, EventName} from "../../../Config";
import moment from 'moment';
import Toast from "../../../utils/Toast";
import ClassBiz from "../../../biz/ClassBiz";
import Picker from "react-native-picker/index";
import AnswerCard from "../Subject/AnswerCard";
import TaskBiz from '../../../biz/TaskBiz';
import TextUtils from '../../../utils/TextUtils';
import DisplayUtils from "../../../utils/DisplayUtils";

export default class TaskDetail extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            info: {
                completed: {
                    percent: 0,
                    finish_number: 0
                },
                choice_list: [],
                multi_choice_list: [],
                solve_list: [],
                task_cloud_info: [],
            },
            excelUrl: '',
            shareDesc: '',
            shareImg: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png',
            shareTitle: '',
            task_name: '',
        };
    }

    _fetchData(){
        HttpUtils.request(API.getTaskProfile, {task_id: this.props.taskId}).then((res)=> {

            this.setState({
                excelUrl: res.pdf_url,
                shareDesc: res.class_name + ' ' + res.teacher_name,
                shareTitle: res.pdf_name,
                task_name: res.task_name,
            });

            let info = res;
            info.deadline_time_stamp = moment.unix(info.deadline_time).format("MM月DD日 HH:mm");
            let key = 0;
            for (let i in info.choice_list) {
                info.choice_list[i].key = key;
                key++;
            }
            for (let i in info.multi_choice_list) {
                info.multi_choice_list[i].key = key;
                key++;
            }
            for (let i in info.solve_list) {
                info.solve_list[i].key = key;
                key++;
            }
            this.setState({
                info: info
            });
            // if(Actions.refs.subjectList){
            //     Actions.refs.subjectList.updateInfo(info);
            // }

        });
    }

    componentDidMount() {
        this._fetchData();
        this.listener = DeviceEventEmitter.addListener(EventName.OnTestStatusChange,()=>{
            console.log('DeviceEventEmitter --- OnTestStatusChange');
            this._fetchData();
        });
    }

    componentWillUnMount() {
        this.listener.remove();
    }


    static onExit() {
        Picker.hide();
    }

    Print() {
        Actions.shareBoard({
            shareInfo: {
                title: this.state.shareTitle,
                desc: this.state.shareDesc,
                url: this.state.excelUrl,
                img: this.state.shareImg
            }
        });
    }

    addCollection() {
        console.log("添加收藏");
        let meSeletedArr = this.state.info.task_cloud_info;
        Actions.myCollection({meSeletedArr: meSeletedArr});

    }


    _onPress() {
        Actions.popTo('classDetail');
    }

    _editName() {
        Picker.hide();
        Actions.inputDialog({
            title: '修改作业名称',
            placeholderText: '最多10个字符',
            value: this.state.className === '请输入' ? '' : this.state.info.task_name,
            onConfirm: (text) => {
                let name = TextUtils.removeTheSpace(text);
                if (name.length == 0) {
                    Toast.error('作业名称不能为空');
                    return;
                } else {
                    if (!TextUtils.checkSpecialCharacter(name)) {
                        return;
                    }
                }

                this._editTaskName(name);
            }
        });

    }

    _editTaskName(text) {
        if (!text || text === '') {
            return Toast.error('用户名错误');
        }

        HttpUtils.request(API.editTaskSetTask, {
            task_id: this.props.taskId,
            field: 'task_name',
            changed: text
        }).then(res=> {

            this.state.info.task_name = text;
            this.setState({
                info: this.state.info
            });
            ClassBiz.mustRefresh();
        })
    }


    _showDatePicker() {
        Actions.datePickerDialog({
            title: '请选择截止时间',
            minDate: moment(this.state.info.create_time*1000).toDate(),
            maxDate: moment().add(2, 'Y').toDate(),
            minuteStep: 1,
            selectedDate: moment(this.state.info.deadline_time * 1000).toDate(),
            mode: 'datetime',
            onConfirm: (date)=> {
                console.log(moment(date).format('YYYY-MM-DD HH:mm'));
                HttpUtils.request(API.editTaskSetTask, {
                    task_id: this.props.taskId,
                    field: 'deadline_time',
                    changed: moment(date).format('YYYY-MM-DD HH:mm')
                }).then(res => {
                    this.state.info.deadline_time_stamp = moment(date).format("MM月DD日 HH:mm");
                    this.state.info.deadline_time = moment(date).unix();
                    this.setState({
                        info: this.state.info
                    });
                    ClassBiz.mustRefresh();
                });
            }
        });
    }


    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true}>
                <View style={styles.content}>

                    <ListRow
                        title='作业名称'
                        style={styles.listrow}
                        detail={this.state.info.task_name}
                        accessory='indicator'
                        onPress={() => this._editName()}
                        bottomSeparator='none'
                    />

                    <ListRow
                        title='截止时间'
                        style={styles.listrow}
                        detail={this.state.info.deadline_time_stamp}
                        accessory='indicator'
                        onPress={() => this._showDatePicker()}
                        bottomSeparator='none'
                    />

                    <ListRow
                        title={
                            <View>
                                <Text style={{fontSize: 15, color: '#000'}}>
                                    提交率
                                    <Text style={{color: '#b5b5b5', fontSize: 14,}}>
                                        (提交{this.state.info.completed.finish_number}/{this.state.info.completed.total_number})</Text>
                                </Text>
                            </View>
                        }
                        style={styles.listrow}
                        detail={this.state.info.completed.percent + '%'}
                        accessory='indicator'
                        onPress={() => Actions.submitList({
                            taskId: this.props.taskId,
                            task_name: this.state.task_name,
                        })}
                        bottomSeparator='none'
                    />

                    <ListRow
                        title='正确率'
                        style={styles.listrow}
                        // bottomSeparator={this.state.info.task_type === 3?'indent':'none'}
                        detail={
                            <Text style={{color: '#989898', marginRight: 17}}>{this.state.info.accuracy}%</Text>
                        }
                        bottomSeparator='none'
                        // accessory='indicator'
                        // onPress={() => this._editName()}
                    />
                    {(this.state.info.task_type === 3 || this.state.info.task_type === 5) ?
                        <ListRow
                            title='排行榜'
                            style={styles.listrow}
                            bottomSeparator='none'
                            accessory='indicator'
                            onPress={() => Actions.ranking({
                                taskId: this.props.taskId,
                                classId: this.state.info.class_id
                            })}
                        />
                        :
                        null
                    }


                </View>

                <View style={styles.content2}>
                    <View style={styles.listTitle}>
                        <Text style={styles.textLeft}>答题卡（共{this.state.info.task_test_count}题）</Text>
                        <Touch
                            onPress={()=> {
                                // TaskBiz
                                // console.log()
                                if ((this.state.info.task_test_count + TaskBiz.testCount) > 30) {
                                    Toast.error('已选题目已满，请删除部分题目');
                                } else {

                                    let data = JSON.stringify(this.state.info.task_cloud_info);
                                    HttpUtils.request(API.AddFavorites, {
                                        data: data
                                    }).then(res => {

                                        if (res && res.favorite_id) {

                                            TaskBiz.add(res.favorite_id.length);
                                        }

                                        Actions.courseSelected();
                                        //todo 数字增加
                                    })
                                }
                            }}
                        >
                            <Text style={styles.textRight}>复用本次题目</Text>
                        </Touch>
                    </View>

                    <AnswerCard
                        info={this.state.info}
                        types={1}
                    />
                    <Touch
                        opacity={0.8}
                        onPress={()=> {
                            console.log(123);
                            Actions.confirmDialog({
                                title: '提示',
                                buttons: ["确认", "取消"],
                                message: '确定撤回作业',
                                onClick: (index) => {
                                    if (index === 0) {
                                        HttpUtils.request(API.TaskRepealTask, {
                                            task_id: this.props.taskId
                                        }).then(res=> {
                                            console.log(res);
                                            ClassBiz.mustRefresh();
                                            if(this.props.onDelete){
                                                this.props.onDelete();
                                            }
                                            Actions.pop();
                                        })
                                    } else {
                                        console.log("取消撤回");
                                    }

                                }
                            })
                        }}
                    >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>撤回作业</Text>
                        </View>
                    </Touch>
                </View>
            </ScrollView>

        );
    }
}


const styles = StyleSheet.create({
    waitText: {
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: '#cdcdcd',
        color: '#fff',
        borderRadius: 15,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#ff4c54',
        height: 44,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16
    },
    content: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
    },
    content2: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingLeft: 25,
        paddingRight: 25,
    },
    listrow: {
        height: 50,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
    },
    listTitle: {
        backgroundColor: '#fff',
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
    },
    textLeft: {
        color: '#b5b5b5',
        textAlign: 'left',
        width: (Dimensions.get('window').width - 50) / 2,
    },
    textRight: {
        textAlign: 'right',
        width: (Dimensions.get('window').width - 50) / 2,
        color: '#4791ff',
        fontWeight: 'bold'
    },
});