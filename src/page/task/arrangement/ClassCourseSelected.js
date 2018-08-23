/**
 * Created by heaton on 2018/3/10.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import CourseSelectedWebView from './CourseSelectedWebView';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import DisplayUtils from '../../../utils/DisplayUtils';
import EmptyView, {EmptyType} from '../../common/EmptyView';
import Toast from "../../../utils/Toast";

export default class ClassCourseSelected extends Component {
    checkedList = [];
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyView.NO_DATA,
        };
        this.checkedList = Array.from(this.props.testArr);
        console.log(this.props.testArr)
    }

    componentDidMount(){
        if(this.props.teaching){
            Actions.refresh({title: this.props.title})
        }
    }

    _renderEmptyView() {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={() => {
                    this.listView.refresh()
                }}/>
        );
    }

    _initialDataIsSortedByType(defaultData, defaultList) {
        let data = Array.from(defaultData, (item, index) => {
            item.checked = defaultList[index].checked;
            item.isRepeat = defaultList[index].isRepeat;
            item.isTeaching = defaultList[index].teaching;
            return item;
        });
        console.log(data);

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
            let isAllChecked = type1Arr.every((item) => {
                return item.checked;
            });
            result.push({
                id: -101,
                test_type: 1,
                title: '单选题(' + type1Arr.length + ')',
                count: type1Arr.length,
                type: 'sectionTitle',
                start: 0,
                checked: isAllChecked,
            });
            let type1Index = result.length - 1;
            type1Arr.map((item, i) => {
                item.sectionIndex = type1Index;
                item.index = i;
                result.push(item);
            });
        }
        if (type2Arr.length > 0) {
            let isAllChecked = type2Arr.every((item) => {
                return item.checked;
            });
            result.push({
                id: -102,
                test_type: 2,
                title: '多选题(' + type2Arr.length + ')',
                count: type2Arr.length,
                type: 'sectionTitle',
                start: result.length,
                checked: isAllChecked,
            });
            let type2Index = result.length - 1;
            type2Arr.map((item, i) => {
                item.sectionIndex = type2Index;
                item.index = type1Arr.length + i;
                result.push(item);
            });
        }

        if (type3Arr.length > 0) {
            let isAllChecked = type3Arr.every((item) => {
                return item.checked;
            });
            result.push({
                id: -103,
                test_type: 3,
                title: '解答题(' + type3Arr.length + ')',
                count: type3Arr.length,
                type: 'sectionTitle',
                start: result.length,
                checked: isAllChecked,
            });
            let type3Index = result.length - 1;
            type3Arr.map((item, i) => {
                item.sectionIndex = type3Index;
                item.index = type1Arr.length + type2Arr.length + i;
                result.push(item);
            });
        }
        console.log('重组数据 -- ', result);
        return result;
    }

    _fetchData(page, start, abort) {
        if(this.props.teaching){ // 获取已添加教案
            HttpUtils.request(API.GetTeachingTestList, {json_data: JSON.stringify(this.props.testArr)})
                .then((data) => {
                    let arr = this._initialDataIsSortedByType(data, this.props.testArr);
                    console.log(arr);
                    start(arr);
                })
                .catch((err) => {
                    abort();
                    this.setState({
                        emptyType: EmptyType.REQUEST_ERROR
                    });
                })
        }else{ // 获取已布置作业
            HttpUtils.request(API.GetTestListByClass, {json_data: JSON.stringify(this.props.testArr)})
                .then((data) => {
                    let arr = this._initialDataIsSortedByType(data, this.props.testArr);
                    console.log(arr);
                    start(arr);
                })
                .catch((err) => {
                    abort();
                    this.setState({
                        emptyType: EmptyType.REQUEST_ERROR
                    });
                })
        }
    }

    _itemCheckChanged(checked, index) {
        let arr = this.listView.getRows();
        console.log(arr);
        let item = arr[index];
        if (item.type == 'sectionTitle') {
            for (let i = item.start; i <= item.start + item.count; i++) {
                arr[i].checked = checked;
            }
        } else {
            item.checked = checked;
            let unCheckedArr = arr.filter((v) => {
                return v.test_type == item.test_type && v.type != 'sectionTitle' && !v.checked
            });
            let sectionItem = arr[item.sectionIndex];
            sectionItem.checked = unCheckedArr.length <= 0;
        }
        this.listView.updateDataSource(arr);

    }

    _renderItem(item, index) {
        return (
            <CourseSelectedWebView
                item={item}
                index={index}
                isTeaching={item.isTeaching ? item.isTeaching : false}
                isRepeat={item.isRepeat ? item.isRepeat : false}
                checkChange={(checked, index) => this._itemCheckChanged(checked, index)}
            />
        );
    }

    _complete() {
        let arr = [];
        let checkedCount = 0;
        this.listView.getRows().map((item) => {
            if (item.type != 'sectionTitle') {
                if (item.checked) {
                    checkedCount++;
                }
                arr.push({
                    checked: item.checked,
                    cloud_subject_id: item.cloud_subject_id,
                    cloud_test_id: item.cloud_test_id,
                    isRepeat: item.isRepeat,
                    test_type: item.test_type,
                });
            }
        });
        console.log('arr.length', arr.length);
        if (checkedCount < 1) {
            Toast.error("请至少选择1道题");
            return;
        }
        this.props.callBack(this.props.classIndex, arr);
        Actions.pop();
    }

    render() {
        return (
            <View style={{flex: 1,}}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderItem(item, index)}
                    onFetch={(page, start, abort) => this._fetchData(page, start, abort)}
                    refreshableMode='basic'
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    numColumns={1}
                    emptyView={() => this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1}}
                    pagination={false}
                    paginationFetchingView={() => {
                        return null
                    }}
                />

                <View style={styles.bottomView}>
                    <TouchableOpacity
                        style={styles.arrangementBtn}
                        onPress={() => this._complete()}>
                        <Text style={styles.f16}>确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    bottomView: {
        width: DisplayUtils.SCREEN.width,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: DisplayUtils.MIN_LINE_HEIGHT,
        borderTopColor: '#F1F0F0',
        backgroundColor: '#fff'
    },
    arrangementBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4791FF',
        height: 40,
        borderRadius: 20,
        width: 200

    },
    f16: {
        fontSize: 16,
        color: 'white',
    }
});