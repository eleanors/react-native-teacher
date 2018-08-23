/** 加入教案 */

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

        let checkBoxView = <Checkbox
            checked={this.state.checked}
            size='lg'
            style={{height: 50, width:50, justifyContent: 'flex-end',}}
            checkedIcon={<Image style={{width: 25, height: 25,}}
                                source={require('../../../images/btn_selected.png')}/>}
            uncheckedIcon={<Image style={{width: 25, height: 25,}}
                                  source={require('../../../images/btn_unselected.png')}/>}
            onChange={(checked) => {
                let num = checked ? checkedNum + 1 : checkedNum - 1;
                console.log(checkedNum, num)
                if (num > MAX_SELECTED_CLASS) {
                    setTimeout(() => this.setState({checked: false}), 200)
                    Toast.message('最多可选' + MAX_SELECTED_CLASS + '个课程');
                } else {
                    onCheckChanged(checked, num);
                    this.setState({checked: checked});
                }
            }}/>;


        return (
            <TouchableOpacity
                onPress={() => {
                    onItemClick();
                }}>
                <View style={{
                    padding: 15,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
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
                        <View style={{marginBottom: 5}}>
                            <Text style={{
                                color: '#4b4b4b',
                                paddingVertical: 2,
                                fontSize: 18,
                            }} numberOfLines ={1}>{item.course_name}</Text>
                            <Text style={{
                                color: '#b5b5b5',
                                paddingVertical: 2,
                                fontSize: 14,
                            }} numberOfLines ={1}>{item.class_name}</Text>
                            {repeatTestNum > 0 ? (<Text style={{color: '#ff4c54'}}>{repeatTestNum}题已加入过</Text>) : null}
                        </View>
                    </View>

                    <View style={{marginRight: -20}}>
                        <Text style={{color: '#b5b5b5'}}>{moment(item.start_time*1e3).format('YYYY.MM.DD h:mm')}</Text>
                    </View>
                    {checkBoxView}
                </View>
                <View style={styles.divideLine}/>
            </TouchableOpacity>
        );
    }
}


export default class CourseAddTeaching extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log(this.props.arr);
        this.state = {
            emptyType: EmptyType.NO_DATA,
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
                        title: '加入教案',
                        teaching: true,
                        callBack: (classIndex, testArr) => {
                            let arr = Array.from(this.listView.getRows());
                            arr[classIndex].testArr = testArr;
                            console.log('callBack', classIndex, arr);
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
        HttpUtils.request(API.GetCourseList, params)
            .then((data) => {
                console.log(data);
                let arr = Array.from(data.class_list, (classItem) => {
                    let testArr = [];
                    this.props.arr.map((testItem) => {
                        let isRepeat = classItem.exist_course_list.some((repeatItem) => {
                            return repeatItem.cloud_test_id == testItem.cloud_test_id
                                && repeatItem.cloud_subject_id == testItem.cloud_subject_id;
                        });
                        let item = {
                            checked: true,
                            isRepeat: isRepeat,
                            cloud_subject_id: testItem.cloud_subject_id,
                            cloud_test_id: testItem.cloud_test_id,
                            test_type: testItem.test_type,
                            teaching: true,
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
                <Text style={{padding: 15,marginTop: 10, backgroundColor: '#fff', color: '#BABABA'}}>选择课程(最多同时选10个课程)</Text>
                <View style={styles.divideLine}/>
            </View>
        );
    }

    _addTeaching(){
        let checkedCourse = [];
        let courseList = [];
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
                    course_id: item.course_id,
                    test_list: testList
                };
                checkedCourse.push(classItem);
                courseList.push(item);
            }
        });
        if (checkedCourse.length < 1) {
            return Toast.error("请选择课程");
        }
        console.log('course', checkedCourse);
        let params = {
            json_data: JSON.stringify(checkedCourse)
        };
        console.log('course', params);
        HttpUtils.request(API.AddTeaching, params)
            .then((data) => {
                // TaskBiz.clear();
                this._getFavoriteCount();
                // setTimeout(() => Actions.popTo('_task'), 1000);
                setTimeout(() => Actions.publishSuccess({classList: courseList, data: data, teaching: true}), 1000);
            })
            .catch((err) => {
                Toast.error("加入教案失败");
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
                    refreshable={false}
                    refreshableMode='basic'
                    onFetch={(page, startFetch, endFetch) => this._fetchData(page, startFetch, endFetch)}
                    numColumns={1}
                    emptyView={() => this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1}}
                    pagination={true}
                    allLoadedText="没有更多数据了"
                />
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        onPress={() => this._addTeaching()}>
                        <View style={[styles.arrangementBtn, {opacity: bottomOpacity}]}>
                            <Text style={styles.f16}>立即加入教案</Text>
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