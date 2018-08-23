/**带批改列表
 * Created by mac on 2018/5/4.
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

import {observer} from 'mobx-react';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from '../../utils/HttpUtils';
import {API} from '../../Config';
import DisplayUtils from '../../utils/DisplayUtils';
import Toast from '../../utils/Toast';
import EmptyView, {EmptyType} from  '../common/EmptyView';
import CorrectionsListBiz from '../../biz/CorrectionsListBiz';

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
        let deadText =
            <View style={[styles.numberRatio, {flexDirection: 'row'}]}>
                <Text style={{
                    color: '#c2c3c4',
                    fontSize: 15
                }}>{taskItem.task_test_count}题</Text>
                <Image style={{height: 14, width: 11, marginTop: 2, marginLeft: 3}}
                       source={require('../../images/item_go.png')}/>
            </View>

        let monthHeader = null;
        if (!prevItem || taskItem.create_month_time !== prevItem.create_month_time) {
            monthHeader = (
                <Text style={styles.headText}>{taskItem.create_month_time}</Text>
            );
        }

        let type = taskItem.task_type === 3 ? '试卷' : '作业';

        let typeColor = taskItem.task_type === 3 ? '#3979FF' : '#32C392';

        let contentHeight = 81 + (monthHeader ? 40 : 0);
        return (
            <View style={{
                height: contentHeight,
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                marginBottom: 10
            }}>
                {monthHeader}
                <TouchableOpacity
                    style={{flex: 1, borderRadius: 10}}
                    onPress={() => this.props.itemClick(taskItem)}
                    activeOpacity={0.3}>
                    <View style={[{
                        paddingLeft: 15,
                        paddingRight: 15,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        flex: 1,
                        borderRadius: 10,
                        borderColor: '#F1F0F0',
                        borderWidth: MinLineWidth,
                    }]}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.LeftText}>{taskItem.task_name}</Text>
                            <View
                                style={[styles.typeView, {backgroundColor: typeColor}]}>
                                <Text style={[styles.countText]}>{type}</Text>
                            </View>
                        </View>
                        <Text style={styles.classText}>{taskItem.class_name}</Text>
                        {deadText}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

@observer
export default class ToBeCorrectedList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
        };
    }

    _onEnter() {
        console.log('onEnter');
        if (CorrectionsListBiz.refresh) {
            this.listView.refresh();
        }
    }


    _requestData(page, startFetch, abortFetch) {

        HttpUtils.request(API.GetToBeCorrected)
            .then((data) => {
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });

                startFetch(data, 10);
            })
            .catch((err) => {
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
                itemClick={(taskItem)=> {
                    Actions.taskDetail({
                        taskId: taskItem.id,
                        title: taskItem.task_name,
                        onDelete: ()=> {
                            if (this.listView) {
                                this.listView.refresh();
                            }
                        }
                    });
                }}/>
        );
    }


    render() {
        return (
            <View style={{
                flex: 1,
                paddingRight: 15,
                paddingLeft: 15,
            }}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    keyExtractor={item => item.id}
                    onFetch={this._requestData.bind(this)}
                    refreshableMode='basic'
                    numColumns={1}
                    pagination={false}
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
        backgroundColor: '#f5f5f5',
        height: 40,
        paddingLeft: 0,
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
        fontSize: 14,
        color: 'white',
    },
    numberRatio: {
        position: 'absolute',
        right: 15,
    },
    orange: {
        color: '#ffa96f',
        fontSize: 15,
    },
    classText: {
        fontSize: 14,
        color: '#B9B9B9',
        marginTop: 5,

    },
    typeView: {
        alignItems: 'center',
        width: 40,
        borderRadius: 3,
        justifyContent: 'center'
    }
});