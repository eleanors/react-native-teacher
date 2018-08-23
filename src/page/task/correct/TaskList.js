/**
 * Created by heaton on 2018/1/17.
 * Desription :
 */

'use strict';

import React, {Component, PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from '../../../utils/HttpUtils';
import {API} from '../../../Config';
import DisplayUtils from '../../../utils/DisplayUtils';
import Toast from '../../../utils/Toast';
import EmptyView, {EmptyType} from  '../../common/EmptyView';

const MinLineWidth = DisplayUtils.px2dp(1);

class TaskItem extends PureComponent {
    static defaultProps = {
        taskItem: {},
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {taskItem, prevItem} = this.props;
        let deadText = taskItem.is_dead == 1 ? (<Text style={styles.rightText}>已截止</Text>) : (
            <View style={[styles.numberRatio, {flexDirection: 'row'}]}>
                <Text style={styles.orange}>{taskItem.finish_student_count}</Text>
                <Text style={{color: '#c2c3c4', fontSize: 15,}}>/{taskItem.class_student_count}</Text>
            </View>
        );
        let monthHeader = null;
        if (!prevItem || taskItem.create_month_time !== prevItem.create_month_time) {
            monthHeader = (
                <Text style={styles.headText}>{taskItem.create_month_time}</Text>
            );
        }

        let type = taskItem.task_type === 3 ? '试卷' : '作业';
        let contentHeight = 51+(monthHeader?40:0);
        return (
            <View style={{
                height:contentHeight,
                borderBottomColor:'#F1F0F0',
                borderBottomWidth:MinLineWidth,
                justifyContent:'center',
                backgroundColor:'#ffffff',
            }}>
                {monthHeader}
                <TouchableOpacity
                    style={{flex:1}}
                    onPress={() => this.props.itemClick(taskItem)}
                    activeOpacity={0.3}>
                    <View style={[{
                        paddingLeft:15,
                        paddingRight:15,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        flex:1
                    }]}>
                        <Text style={styles.LeftText}>{taskItem.task_name}</Text>
                        <Text style={styles.countText}>{taskItem.task_test_count}题 {type}</Text>
                        {deadText}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class TaskList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
        };
    }

    _requestData(page, startFetch, abortFetch) {
        HttpUtils.request(API.GetClassTasks, {class_number: this.props.classNum, page: page})
            .then((data) => {
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });
                startFetch(data.task_list, 10);
            })
            .catch(() => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
    }

    _renderEmptyView() {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    }

    _renderFlatItem(item, index) {
        let prev = this.listView.getRows()[index - 1];
        console.log(prev);
        return (
            <TaskItem
                taskItem={item}
                prevItem={prev}
                itemClick={(taskItem)=>{
                    Actions.taskDetail({
                        taskId: taskItem.task_id,
                        title: taskItem.task_name,
                        onDelete:()=>{
                            if(this.listView){
                                this.listView.refresh();
                            }
                        }
                    });
                }}/>
        );
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    keyExtractor={item => item.task_id}
                    onFetch={this._requestData.bind(this)}
                    refreshableMode='basic'
                    numColumns={1}
                    item={this._renderFlatItem.bind(this)}
                    emptyView={() => this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    paginationFetchingView={() => {
                        return null
                    }}
                    allLoadedText="没有更多作业了"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headText: {
        padding: 10,
        opacity: 0.6,
        fontSize: 14,
        color: 'black',
        // textAlign:'center',
        backgroundColor:'#f5f5f5',
        height:40
    },
    LeftText: {
        color: '#3E3E3E',
        fontSize: 16,
    },
    rightText: {
        position: 'absolute',
        color: '#000',
        fontSize: 14,
        opacity: 0.8,
        right: 15,
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
        marginLeft: 10,
    },
    countText: {
        fontSize: 15,
        opacity: 0.6,
        marginLeft: 10,
    },
    numberRatio: {
        position: 'absolute',
        right: 15,
    },
    orange: {
        color: '#ffa96f',
        fontSize: 15,
    },

});