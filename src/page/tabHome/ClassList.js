/**
 * Created by heaton on 2017/12/22.
 * Desription :
 */

'use strict';

import React, {Component, PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import {observer} from 'mobx-react';
import {UltimateListView} from 'react-native-ultimate-listview';
import {Actions} from 'react-native-router-flux';
import HttpUtils from '../../utils/HttpUtils';
import {API} from '../../Config';
import ClassItemView from '../common/ClassItemView';
import ClassBiz from '../../biz/ClassBiz';
import DisplayUtils from "../../utils/DisplayUtils";
import SplashScreen from 'react-native-splash-screen';
import EmptyView, {EmptyType} from '../common/EmptyView'
@observer
export default class ClassList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            emptyType: EmptyType.NO_DATA,
            dataList: [],
        };
        StatusBar.setBarStyle('dark-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        }
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    onRight(...props) {
        console.log(props);
        Actions.createClass();
    }

    _classItemPress(classItem) {
        console.log(classItem);
        let class_number = classItem.class_number;
        ClassBiz.setClassName(classItem.class_name);
        let parameter = {
            class_number: class_number,
        };
        Actions.classDetail(parameter);
    }

    _taskItemPress(taskItem) {
        Actions.taskDetail({taskId: taskItem.task_id, title: taskItem.task_name});
    }

    _taskLoadMorePress(classItem) {
        console.log('loadMoreTask', classItem);
        Actions.classTaskList({classNum: classItem.class_number, title: '班级作业'});
    }


    _toCorrectTheJump() {
        console.log("未批改跳转")
        Actions.toBeCorrectedList({});
    }

    //获取待批改作业列表数据
    _getToBeorrectedList() {

        HttpUtils.request(API.GetToBeCorrected)
            .then((data) => {
                this.setState({
                    dataList: data
                });
            })
            .catch((err) => {

            });
    }


    renderFlatItem = (item, index) => {

        console.log("item:", item);

        let remindView = this.state.dataList.length > 0 && index == 0 ?
            <TouchableOpacity onPress={()=>this._toCorrectTheJump()}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    backgroundColor: '#232427',
                    marginLeft: 60,
                    marginRight: 60,
                    height: 50,
                    borderRadius: 25
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 15,
                        textAlign: 'center',
                        justifyContent: 'center',
                    }}>你有待批改作业请尽快处理</Text>
                    <Image source={require('../../images/go.png')}
                           style={{width: 18, height: 18, marginLeft: 5}}
                           resizeMode='contain'/>
                </View>
            </TouchableOpacity> : null;

        return (
            <View>
                {remindView}
                <ClassItemView
                    item={item}
                    classItemPress={(classItem)=>this._classItemPress(classItem)}
                    taskItemPress={(taskItem)=>this._taskItemPress(taskItem)}
                    taskLoadMorePress={(classItem)=>this._taskLoadMorePress(classItem)}/>
            </View>
        );
    };
    /**
     renderPaginationFetchingView = () => (
     <View style={{
            flex: 1, backgroundColor: '#3d3d3d', justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column'
        }}>
     <Text style={{fontSize: 20, color: 'white'}}>初始化列表页面。。。。</Text>
     </View>
     );
     renderPaginationAllLoadedView = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text>已加载到最后一页</Text>
            </View>
        );
    };
     renderPaginationWaitingView = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text>分页加载等待</Text>
            </View>
        );
    };
     */
    renderEmptyView = () => {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={()=> {
                    this.listView.refresh()
                }}
                noDataStr="还没有创建班级，点击右上角建班"
            />
        );
    };


    _fetchData(page = 1, startFetch, abortFetch) {
        console.log('fetch class list data');
        HttpUtils.request(API.GetClassList)
            .then((data) => {
                this.setState({
                    emptyType: EmptyType.NO_DATA
                });
                startFetch(data, 10);
                this._getToBeorrectedList();
            })
            .catch((err) => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR
                });
                abortFetch();
            });
    }

    onEnter() {
        console.log('onEnter');
        setTimeout(() => this.listView && this.listView.refresh(), 200);
        ClassBiz.refreshComplete();
        // if (ClassBiz.refresh) {
        //     setTimeout(() => this.listView.refresh(), 200);
        //     ClassBiz.refreshComplete();
        // }
    }

//     paginationFetchingView={this.renderPaginationFetchingView}
//     paginationAllLoadedView={this.renderPaginationAllLoadedView}
//     paginationWaitingView={this.renderPaginationWaitingView}
//     waitingSpinnerText="数据加载中。。。"
//     refreshableTitlePull="下拉刷新"
//     refreshableTitleRefreshing="数据加载中"
//     refreshableTitleRelease="释放立即刷新"
//     allLoadedText="已加载至最后一页"
//     Platform.OS==='ios'?'advanced':'basic'
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#f6f6f6'}}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    item={this.renderFlatItem}
                    keyExtractor={(item, index) => {
                        return "key_" + item.class_number;
                    }}
                    refreshableMode='basic'
                    onFetch={(page, start, abort)=>this._fetchData(page, start, abort)}
                    numColumns={1}
                    emptyView={this.renderEmptyView}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1}}
                    paginationFetchingView={()=> {
                        return null
                    }}
                    pagination={false}/>
            </View>

        );
    }
}
const styles = StyleSheet.create({});