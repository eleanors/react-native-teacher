/**发布作业
 * Created by heaton on 2018/3/9.
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
    FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ListRow from '../../common/ListRow';
import {UltimateListView} from 'react-native-ultimate-listview';
import DisplayUtils from '../../../utils/DisplayUtils';
import {Checkbox} from 'teaset';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import {CachedImage} from 'react-native-cached-image';
import Toast from '../../../utils/Toast';
import TaskBiz from '../../../biz/TaskBiz';
import EmptyView, {EmptyType} from '../../common/EmptyView';
let moment = require('moment');
import TextUtils from '../../../utils/TextUtils';

const MAX_SELECTED_CLASS = 10;
class ItemView extends React.Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            checked: this.props.item.checked
        };
    }

    render() {
        let {item, index, onItemClick, onCheckChanged, checkedNum} = this.props;

        let checkedTestNum = item.testArr.filter((item) => {
            return item.checked;
        }).length;
        let repeatTestNum = item.testArr.filter((testItem) => {
            return testItem.checked && testItem.isRepeat;
        }).length;
        console.log('itemRender', checkedTestNum, repeatTestNum);

        let numText;
        //班级学生数
        let hasStudent = item.student_count > 0;
        let disabled;

        if (item.student_count > 0) {
            numText = repeatTestNum > 0 ? (
                <Text style={{color: '#ff4c54'}}>{item.class_grade_subject}
                    已选{checkedTestNum}题，{repeatTestNum}道题布置过</Text>
            ) : (
                <Text style={{color: '#b5b5b5'}}>{item.class_grade_subject} 已选{checkedTestNum}题</Text>
            );
            disabled = false;
        } else {
            numText = <Text style={{color: 'gray'}}>该班级暂无学生</Text>
            disabled = true;
        }

        let checkBoxView = item.student_count > 0 ? <Checkbox
            checked={this.state.checked}
            size='lg'
            disabled={!hasStudent}
            checkedIcon={<Image style={{width: 25, height: 25,}}
                                source={require('../../../images/btn_selected.png')}/>}
            uncheckedIcon={<Image style={{width: 25, height: 25,}}
                                  source={require('../../../images/btn_unselected.png')}/>}
            onChange={(checked) => {
                let num = checked ? checkedNum + 1 : checkedNum - 1;
                console.log(checkedNum, num)
                if (num > MAX_SELECTED_CLASS) {
                    setTimeout(() => this.setState({checked: false}), 200)
                    Toast.message('最多可选' + MAX_SELECTED_CLASS + '个班级');
                } else if (item.student_count == 0) {
                    setTimeout(() => this.setState({checked: false}), 200)
                    Toast.message('该班级没有学生');
                } else {
                    onCheckChanged(checked, num);
                    this.setState({checked: checked});
                }
            }}/> : null;


        return (
            <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    if (hasStudent) {
                        onItemClick();
                    }
                }}>
                <View style={{
                    padding: 15,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: hasStudent ? 1 : 1,
                }}>
                    <CachedImage
                        style={{width: 40, height: 40, borderRadius: 20}}
                        source={{uri: item.class_img_url}}
                        defaultSource={require('../../../images/head_class.png')}
                        fallbackSource={require('../../../images/head_class.png')}/>
                    <View style={{
                        flex: 1,
                        marginLeft: 10,
                        marginRight: 10,
                    }}>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                            <Text style={{
                                color: '#4b4b4b',
                                padding: 2,
                                fontSize: 18,
                                marginRight: 5,
                            }}>{item.class_name}</Text>
                        </View>
                        {numText}
                    </View>
                    {checkBoxView}
                </View>
                <View style={styles.divideLine}/>
            </TouchableOpacity>
        );
    }
}


export default class PublishTask extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log(this.props.arr);
        let currMoment = moment();
        this.state = {
            emptyType: EmptyType.NO_DATA,
            taskName: currMoment.format('MM月DD日') + '作业',
            deadlineTime: currMoment.add(2, 'd').hours(22).minutes(0).unix() * 1000,
            checkedNum: 0,
        };
    }

    _renderListItem(item, index) {
        let checkedNum = this.state.checkedNum;
        return (
            <ItemView
                item={item}
                index={index}
                checkedNum={checkedNum}
                onCheckChanged={(checked, num) => {
                    console.log(checked, num);
                    item.checked = checked;
                    this.setState({
                        checkedNum: num,
                    });
                }}
                onItemClick={() => {
                    Actions.classCourseSelected({
                        classIndex: index,
                        testArr: item.testArr,
                        callBack: (classIndex, testArr) => {
                            let arr = Array.from(this.listView.getRows());
                            arr[classIndex].testArr = testArr;
                            console.log('callBack', arr);
                            setTimeout(()=>this.listView.updateDataSource(arr), 200);
                        }
                    });
                }}/>
        );
    }

    _fetchData(page = 1, startFetch, endFetch) {
        let params = {
            json_data: JSON.stringify(this.props.arr),
            page: page,
            page_size: 10
        };
        HttpUtils.request(API.GetClassListForPublishTask, params)
            .then((data) => {
                console.log(data);
                let arr = Array.from(data.class_list, (classItem) => {
                    let testArr = [];
                    this.props.arr.map((testItem) => {
                        let isRepeat = classItem.exist_test_list.some((repeatItem) => {
                            return repeatItem.cloud_test_id == testItem.cloud_test_id
                                && repeatItem.cloud_subject_id == testItem.cloud_subject_id;
                        });
                        let item = {
                            checked: true,
                            isRepeat: isRepeat,
                            cloud_subject_id: testItem.cloud_subject_id,
                            cloud_test_id: testItem.cloud_test_id,
                            test_type: testItem.test_type,
                        };
                        testArr.push(item);
                    });
                    classItem.checked = false;
                    classItem.testArr = testArr;
                    return classItem;
                });
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });
                startFetch(arr, params.page_size);
            })
            .catch((err) => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                endFetch();
            });
    }

    _renderEmptyView() {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    }

    _renderListHeader() {
        return (
            <View>
                <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                }}>
                    <ListRow
                        style={styles.listRow}
                        title="作业名称"
                        detail={this.state.taskName}
                        accessory='indicator'
                        onPress={() => this._changeTaskName()}/>
                    <ListRow
                        style={styles.listRow}
                        title="截止时间"
                        detail={moment(this.state.deadlineTime).format('MM月DD日 HH:mm')}
                        accessory='indicator'
                        onPress={() => this._changeDeadLineTime()}/>
                </View>
                <Text style={{padding: 15, backgroundColor: '#fff', color: '#BABABA'}}>选择班级(最多同时选10个班级)</Text>
                <View style={styles.divideLine}/>
            </View>
        );
    }

    _changeTaskName() {
        Actions.inputDialog({
            title: '修改作业名称',
            placeholderText: '最多10个字符',
            value: this.state.taskName,
            onConfirm: (taskName) => {


                let name = TextUtils.removeTheSpace(taskName);

                if (name.length == 0) {
                    Toast.error('作业名称不能为空');
                    return;
                } else {
                    if (!TextUtils.checkSpecialCharacter(name)) {
                        return;
                    }
                }

                this.setState({
                    taskName: name,
                })
            }
        });
    }

    _changeDeadLineTime() {
        Actions.datePickerDialog({
            title: '请选择截止时间',
            minDate: moment().toDate(),
            maxDate: moment().add(2, 'Y').toDate(),
            minuteStep: 1,
            selectedDate: moment(this.state.deadlineTime).toDate(),
            mode: 'datetime',
            onConfirm: (date)=> {
                if (moment(date).isBefore(moment())) {
                    Toast.error("截止时间不能早于当前时间");
                    return;
                }
                console.log(moment(date).format('YYYY-MM-DD HH:mm'));
                this.setState({deadlineTime: moment(date).unix() * 1000});
            }
        });
    }

    _publishTask() {
        let checkedClassArr = [];
        let classList = [];
        this.listView.getRows().map((item) => {
            if (item.checked) {
                let testList = item.testArr.filter((testItem) => {
                    return testItem.checked;
                });
                console.log('original arr', testList);
                testList.sort((item0, item1)=> {
                    return item0.test_type - item1.test_type;
                });
                console.log('sorted arr', testList);
                let classItem = {
                    class_number: item.class_number,
                    test_list: testList
                };
                checkedClassArr.push(classItem);
                classList.push(item);
            }
        });
        if (checkedClassArr.length < 1) {
            Toast.error("请选择班级");
            return;
        }
        console.log('publish', checkedClassArr);
        let params = {
            task_name: this.state.taskName,
            deadline_time: moment(this.state.deadlineTime).unix(),
            json_data: JSON.stringify(checkedClassArr)
        };
        HttpUtils.request(API.PublishTask, params)
            .then((data) => {
                // TaskBiz.clear();
                this._getFavoriteCount();
                // setTimeout(() => Actions.popTo('_task'), 1000);
                setTimeout(() => Actions.publishSuccess({classList: classList, data: data}), 1000);
            })
            .catch((err) => {
                console.log(err);
                Toast.error("布置作业失败");
            });
    }


    _getFavoriteCount() {
        HttpUtils.request(API.getCourseFavorites, {})
            .then((data) => {
                TaskBiz.clear();
                TaskBiz.add(data.length);
            })
            .catch((err) => {

            });
    }


    render() {
        let bottomOpacity = this.state.checkedNum > 0 ? 1 : 0.5;
        console.log('bottomOpacity', bottomOpacity);
        return (
            <View style={{flex: 1}}>
                <UltimateListView
                    paginationFetchingView={()=> {
                        return null
                    }}
                    header={() => this._renderListHeader()}
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderListItem(item, index)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    refreshableMode='basic'
                    onFetch={(page, startFetch, endFetch) => this._fetchData(page, startFetch, endFetch)}
                    numColumns={1}
                    emptyView={() => this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1}}
                    pagination={true}
                    refreshable={false}
                    allLoadedText="没有更多数据了"
                />
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        onPress={() => this._publishTask()}>
                        <View style={[styles.arrangementBtn, {opacity: bottomOpacity}]}>
                            <Text style={styles.f16}>发布作业,已选{this.state.checkedNum}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F5F5F5',
    },
    listRow: {
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
    },
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
        width: 200,
    },
    f16: {
        fontSize: 16,
        color: 'white',
    }
});