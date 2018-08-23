/**
 * Created by mac on 2018/3/2.
 * Desription 已选题目
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    WebView,
    Animated,
    Platform,
    Dimensions, 
    PixelRatio,
    FlatList,
    DeviceEventEmitter,
} from 'react-native';
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from '../../../utils/HttpUtils';
import {API} from '../../../Config';
import DisplayUtils from '../../../utils/DisplayUtils';
import EmptyView, {EmptyType} from '../../../page/common/EmptyView';
import {Checkbox} from 'teaset';
import CourseSelectedWebView from './CourseSelectedWebView';
import {Actions} from 'react-native-router-flux';
import Toast from '../../../utils/Toast';
import TaskBiz from '../../../biz/TaskBiz';
import TestListBiz from '../../../biz/TestListBiz';

export default class CourseSelected extends Component {


    constructor(props) {
        super(props);
        this.state = {
            data: [],
            arr: [],
            listRefreshing: false,
            upCanUse: false,
            downCanUse: false,
            favorite_id: [],
            emptyType: EmptyType.NO_DATA
        };
        this.editPanel = true
    }

    componentDidMount() {
        this._fetchData();
    }

    onRight(...props) {
        console.log(props);
        if (this._beforeAction()) {
            return;
        }
        let checkedArr = this.state.arr.filter((item) => {
            return item.type != 'sectionTitle' && item.checked;
        });
        // console.log('已选中的题目', checkedArr);

        let meSeletedArr = [];

        for (var i = 0; i < checkedArr.length; i++) {
            var item = {
                cloud_subject_id: checkedArr[i].cloud_subject_id,
                cloud_test_id: checkedArr[i].cloud_test_id,
                test_type: checkedArr[i].test_type,
            }
            meSeletedArr.push(item)
        }

        Actions.myCollection({meSeletedArr: meSeletedArr});
    }


    _removeConfirmDialog() {
        if (this._beforeAction()) {
            return;
        }
        Actions.confirmDialog({
            title: '提示',
            buttons: ["确认", "取消"],
            message: '确定删除选中题目',
            onClick: (index) => {
                if (index === 0) {
                    this._removeChecked();
                } else {
                    console.log("取消删除");
                }

            }
        })
    }

    _beforeAction() {
        let checkedArr = this.state.arr.filter((item) => {
            return item.type != 'sectionTitle' && item.checked;
        });
        if (checkedArr.length == 0) {
            Toast.error('请先选题');
            return true;
        }
        return false;
    }

    _removeChecked() {
        console.log("已删除");
        let checkedArr = this.state.arr.filter((item) => {
            return item.type != 'sectionTitle' && item.checked;
        });


        //获取选中item的id
        for (var i = 0; i < checkedArr.length; i++) {
            this.state.favorite_id.push(checkedArr[i].id)
            console.log("选中数组id", checkedArr[i].id);
        }

        console.log('count', checkedArr.length);
        HttpUtils.request(API.delMultCourseFavorites, {data: JSON.stringify({favorite_id: this.state.favorite_id})})
            .then((data) => {

                this.state.favorite_id.splice(0, this.state.favorite_id.length);
                //start
                let tmpData = [];
                this.state.data.map((item) => {
                    let isInChecked = checkedArr.some((checkedItem) => {
                        return checkedItem.id == item.id;
                    });
                    if (!isInChecked) {
                        tmpData.push(item);
                    }
                });
                console.log(tmpData);

                let arr = this.initialDataIsSortedByType(tmpData, false);
                console.log(arr);
                this.setState({
                    data: tmpData,
                    arr: arr,
                    listRefreshing: false,
                });
                TaskBiz.reduce(checkedArr.length);
                TestListBiz.setMustRefresh(true);
            })
            .catch((err) => {

            });
    }

    //初始数据按类型排序
    initialDataIsSortedByType(data, defaultChecked = true) {
        if (!(data instanceof Array)) {
            return [];
        }
        let tmp = data.sort((item0, item1) => {
            if (item0.test_type == item1.test_type) {
                return item0.cloud_test_id - item1.cloud_test_id;
            } else {
                return item0.test_type - item1.test_type;
            }
        });

        let type1Arr = tmp.filter((item) => {
            return item.test_type == 1
        });
        let type2Arr = tmp.filter((item) => {
            return item.test_type == 2
        });
        let type3Arr = tmp.filter((item) => {
            return item.test_type == 3
        });

        let result = [];
        if (type1Arr.length > 0) {
            result.push({
                id: -101,
                test_type: 1,
                title: '单选题(' + type1Arr.length + ')',
                count: type1Arr.length,
                type: 'sectionTitle',
                start: 0,
                checked: defaultChecked,

            });
            let type1Index = result.length - 1;
            type1Arr.map((item, i) => {
                item.checked = defaultChecked;
                item.sectionIndex = type1Index;
                item.index = i;
                result.push(item);
            });
        }
        if (type2Arr.length > 0) {
            result.push({
                id: -102,
                test_type: 2,
                title: '多选题(' + type2Arr.length + ')',
                count: type2Arr.length,
                type: 'sectionTitle',
                start: result.length,
                checked: defaultChecked,
            });
            let type2Index = result.length - 1;
            type2Arr.map((item, i) => {
                item.checked = defaultChecked;
                item.sectionIndex = type2Index;
                item.index = type1Arr.length + i;
                result.push(item);
            });
        }

        if (type3Arr.length > 0) {
            result.push({
                id: -103,
                test_type: 3,
                title: '解答题(' + type3Arr.length + ')',
                count: type3Arr.length,
                type: 'sectionTitle',
                start: result.length,
                checked: defaultChecked,
            });
            let type3Index = result.length - 1;
            type3Arr.map((item, i) => {
                item.checked = defaultChecked;
                item.sectionIndex = type3Index;
                item.index = type1Arr.length + type2Arr.length + i;
                result.push(item);
            });
        }
        console.log('重组数据 -- ', result);
        return result;
    }

    _fetchData = () => {
        this.setState({listRefreshing: true});
        HttpUtils.request(API.getCourseFavorites, {})
            .then((data) => {
                let arr = this.initialDataIsSortedByType(data);
                this.setState({
                    data: data,
                    arr: arr,
                    upCanUse: false,
                    downCanUse: false,
                    listRefreshing: false,
                    emptyType: EmptyType.NO_DATA
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    listRefreshing: false,
                    emptyType: EmptyType.REQUEST_ERROR
                });
            });
    };

    _itemCheckChanged(checked, index) {
        let tmp = Array.from(this.state.arr);
        let item = tmp[index];
        if (item.type == 'sectionTitle') {
            for (let i = item.start; i <= item.start + item.count; i++) {
                tmp[i].checked = checked;
            }
        } else {
            tmp[index].checked = checked;
            let unCheckedArr = tmp.filter((v) => {
                return v.test_type == item.test_type && v.type != 'sectionTitle' && !v.checked
            });
            let sectionItem = tmp[item.sectionIndex];
            sectionItem.checked = unCheckedArr.length <= 0;
        }
        this.setState({
            arr: tmp
        });

        let checkedArr = tmp.filter((v) => {
            return v.checked;
        });
        if (checkedArr.length == 1) {
            //当前只选中了1个
            let upCanUse = true;
            let downCanUse = true;

            let checkedItem = checkedArr[0];
            let sectionItem = tmp[checkedItem.sectionIndex];
            let checkedIndex = tmp.indexOf(checkedItem);
            console.log('设置移动状态', index, sectionItem);
            if (checkedIndex == sectionItem.start + 1) {
                upCanUse = false;
            }
            if (checkedIndex == sectionItem.start + sectionItem.count) {
                downCanUse = false;
            }
            console.log(upCanUse, downCanUse);
            this.setState({
                upCanUse: upCanUse,
                downCanUse: downCanUse,
            })
        } else {
            this.setState({
                upCanUse: false,
                downCanUse: false,
            })
        }
    }

    _moveUp() {
        if (this._beforeAction()) {
            return;
        }

        let arrNum = this.state.arr.filter((item) => {
            return item.type != 'sectionTitle' && item.checked;
        });

        if (arrNum.length > 1) {
            Toast.error('只可选中一道题');
        }


        if (!this.state.upCanUse) {
            return;
        }
        let tmp = Array.from(this.state.arr);
        let checkedArr = tmp.filter((v) => {
            return v.checked;
        });
        let checkedItem = checkedArr[0];
        let index = tmp.indexOf(checkedItem);
        //move up
        let prevItem = tmp[index - 1];

        let tmpCheckedIndex = checkedItem.index;
        checkedItem.index = prevItem.index;
        prevItem.index = tmpCheckedIndex;

        tmp.splice(index - 1, 2, checkedItem, prevItem);
        console.log(tmp);
        this.setState({
            arr: tmp
        });

        let upCanUse = true;
        let downCanUse = true;

        let sectionItem = tmp[checkedItem.sectionIndex];
        console.log('设置移动状态', index, sectionItem);
        if (index - 1 == sectionItem.start + 1) {
            upCanUse = false;
        }
        if (index - 1 == sectionItem.start + sectionItem.count) {
            downCanUse = false;
        }
        console.log(upCanUse, downCanUse);
        this.setState({
            upCanUse: upCanUse,
            downCanUse: downCanUse,
        });
        let sortedArr = tmp.filter((item) => {
            return item.type != 'sectionTitle';
        });

        let moveUpData = [];

        for (var a = 0; a < sortedArr.length; a++) {
            var item = {
                favorite_id: sortedArr[a].id,
                test_number: a + 1,
            }
            moveUpData.push(item)
        }

        // console.log('排序数组', JSON.stringify({data: moveUpData}));

        HttpUtils.request(API.selectedCourseListSort, {data: JSON.stringify(moveUpData)})
            .then((data) => {
                moveUpData.splice(0, moveUpData.length);
                console.log('排序成功');
            }).catch((err) => {
            console.log('排序失败');
        });

    }

    _moveDown() {
        if (this._beforeAction()) {
            return;
        }
        let arrNum = this.state.arr.filter((item) => {
            return item.type != 'sectionTitle' && item.checked;
        });

        if (arrNum.length > 1) {
            Toast.error('只可选中一道题');
        }

        if (!this.state.downCanUse) {
            return;
        }
        let tmp = Array.from(this.state.arr);
        let checkedArr = tmp.filter((v) => {
            return v.checked;
        });
        let checkedItem = checkedArr[0];
        let index = tmp.indexOf(checkedItem);
        //move down
        let nextItem = tmp[index + 1];

        let tmpCheckedIndex = checkedItem.index;
        checkedItem.index = nextItem.index;
        nextItem.index = tmpCheckedIndex;

        tmp.splice(index, 2, nextItem, checkedItem);
        console.log(tmp);
        this.setState({
            arr: tmp
        });

        let upCanUse = true;
        let downCanUse = true;

        let sectionItem = tmp[checkedItem.sectionIndex];
        console.log('设置移动状态', index, sectionItem);
        if (index + 1 == sectionItem.start + 1) {
            upCanUse = false;
        }
        if (index + 1 == sectionItem.start + sectionItem.count) {
            downCanUse = false;
        }
        console.log(upCanUse, downCanUse);
        this.setState({
            upCanUse: upCanUse,
            downCanUse: downCanUse,
        });
        let sortedArr = tmp.filter((item) => {
            return item.type != 'sectionTitle';
        });

        let moveUpData = [];

        //获取选中item的id
        for (let a = 0; a < sortedArr.length; a++) {
            let item = {
                favorite_id: sortedArr[a].id,
                test_number: a + 1,
            };
            moveUpData.push(item)
        }

        // console.log('排序数组', JSON.stringify({data: moveUpData}));

        HttpUtils.request(API.selectedCourseListSort, {data: JSON.stringify(moveUpData)})
            .then((data) => {
                moveUpData.splice(0, moveUpData.length);
                console.log('排序成功');
            }).catch((err) => {
            console.log('排序失败');
        });
    }

    _goPublishTask() {
        if (this._beforeAction()) {
            return;
        }
        let checkedArr = [];
        this.state.arr.map((item) => {
            if (item.type != 'sectionTitle' && item.checked) {
                checkedArr.push({
                    cloud_test_id: item.cloud_test_id,
                    cloud_subject_id: item.cloud_subject_id,
                    test_type: item.test_type,
                });
            }
        });
        console.log('已选中的题目', checkedArr);
        Actions.publishTask({arr: checkedArr});
    }

    _goCourseAddTeaching() {
        if (this._beforeAction()) {
            return;
        }
        let checkedArr = [];
        this.state.arr.map((item) => {
            if (item.type != 'sectionTitle' && item.checked) {
                checkedArr.push({
                    cloud_test_id: item.cloud_test_id,
                    cloud_subject_id: item.cloud_subject_id,
                    test_type: item.test_type,
                });
            }
        });
        console.log('已选中的题目', checkedArr);
        Actions.courseAddTeaching({arr: checkedArr});
    }

    _renderFlatItem = ({item, index}) => {
        // console.log("item:",JSON.stringify(item));
        return (
            <CourseSelectedWebView
                item={item}
                index={index}
                prevItem={this.state.arr[index - 1]}
                checkChange={(checked, index) => this._itemCheckChanged(checked, index)}
            />
        );
    }

    _renderEmptyView() {
        if (this.state.listRefreshing) {
            return (<View/>);
        } else {
            return (
                <EmptyView
                    emptyType={this.state.emptyType}
                    onClick={() => this._fetchData()}/>
            );
        }
    }

    render() {
        return (
            <View style={styles.bg}>
                <View style={{flex: 1}}>
                    <FlatList
                        ref={ref => this.listView = ref}
                        data={this.state.arr}
                        extraData={true}
                        keyExtractor={(item) => item.id}
                        renderItem={this._renderFlatItem}
                        ListEmptyComponent={() => this._renderEmptyView()}
                        onRefresh={this._fetchData}
                        refreshing={this.state.listRefreshing}
                    />
                    {/*
                     <UltimateListView
                     ref={ref => this.listView = ref}
                     item={this.renderFlatItem}
                     keyExtractor={(item, index) => {
                     return "key_" + index;
                     }}
                     refreshableMode='basic'
                     onFetch={this._fetchData.bind(this)}
                     numColumns={1}
                     emptyView={this.renderEmptyView}
                     showsVerticalScrollIndicator={false}
                     style={{flex: 1}}
                     pagination={false}
                     refreshable={true}/>
                     */}
                </View>

                <EditPanel 
                    upCanUse={this.state.upCanUse}
                    downCanUse={this.state.downCanUse}
                    delete={this._removeConfirmDialog.bind(this)}
                    moveUp={this._moveUp.bind(this)}
                    moveDown={this._moveDown.bind(this)}
                    publishTask={this._goPublishTask.bind(this)}
                    addTeaching={this._goCourseAddTeaching.bind(this)}
                    ></EditPanel>
            </View>
        );
    }
}

class EditPanel extends Component {
    constructor(props){
        super(props)
        this.state = {
            editPanel: true,
            upCanUse: false,
            downCanUse: false,
        }
    }

    componentWillReceiveProps(props){
        if(props.upCanUse != this.state.upCanUse){
            this.setState({
                upCanUse: props.upCanUse
            })
        }
        if(props.downCanUse != this.state.downCanUse){
            this.setState({
                downCanUse: props.downCanUse
            })
        }
    }

    _editState(){
        this.setState({
            editPanel: !this.state.editPanel
        })
    }

    render() {
        let moveUpImage = this.state.upCanUse ?
            require('../../../images/move_down_sele.png') :
            require('../../../images/move_down_normal.png');
        let moveDownImage = this.state.downCanUse ?
            require('../../../images/move_up_sele.png') :
            require('../../../images/move_up_normal.png');

        let editImage = require('../../../images/course-selected-edit.png');

        return (
            <View style={styles.bottomView}>
            {
                this.state.editPanel ?
                <Animated.View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.arrangementView]}>
                        <TouchableOpacity style={[styles.arrangementBtn, styles.editBtn]}
                                          onPress={() => this._editState()}>
                            <Image style={styles.editImage}
                                   source={editImage}/>
                            <Text style={[styles.f16, {color: '#4b4b4b'}]}>编辑题目</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.arrangementView]}>
                        <TouchableOpacity style={[styles.arrangementBtn, styles.borderRadius20]}
                                          onPress={() => this.props.publishTask()}>
                            <Text style={styles.f16}>布置作业</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.arrangementView]}>
                        <TouchableOpacity style={[styles.arrangementBtn, styles.borderRadius20]}
                                          onPress={() => this.props.addTeaching()}>
                            <Text style={styles.f16}>加入教案</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                : 
                <Animated.View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.arrangementView]}>
                        <TouchableOpacity style={[styles.backBtn, styles.borderRadius20]}
                                          onPress={() => this._editState()}>
                            <Text style={styles.f16}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.props.moveUp()}>
                        <View style={[styles.topBtn]}>
                            <Image style={styles.topImage}
                                   source={moveUpImage}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.moveDown()}>
                        <View style={[styles.topBtn]}>
                            <Image style={styles.topImage}
                                   source={moveDownImage}/>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.removeView]}>
                        <TouchableOpacity style={[styles.removeBtn, styles.borderRadius20]}
                                          onPress={() => this.props.delete()}>
                            <Text style={styles.f16}>删除</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            }
            </View>)
    }
}


const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F5F5F5',
    },
    bottomView: {
        width: DisplayUtils.SCREEN.width,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: DisplayUtils.MIN_LINE_HEIGHT,
        borderTopColor: '#F1F0F0',
        backgroundColor: '#FFF',
    },
    f16: {
        fontSize: 16,
        color: 'white',
    },
    borderRadius20: {
        borderRadius: 22,
    },
    removeView: {
        height: 44,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrangementView: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBtn: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topImage: {
        width: 18,
        height: 18,
    },
    editImage: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
    backBtn: {
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4791FF',
    },
    removeBtn: {
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF4C54',
    },
    arrangementBtn: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4791FF',
        height: 40,
    },
    editBtn: {
        flexDirection: 'row', 
        backgroundColor: 'transparent',
    },

});