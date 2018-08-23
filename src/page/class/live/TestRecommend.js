/**
 * 电子试题
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    WebView,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    DeviceEventEmitter
} from 'react-native';
import TestListBiz from "../../../biz/TestListBiz";

import {Actions} from 'react-native-router-flux';
import Touch from "../../public/Touch";
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from '../../../Config';
import EmptyView, {EmptyType} from  '../../common/EmptyView';
import ExaminationItem from "../../task/ExaminationItem";
import Toast from '../../../utils/Toast';
import TaskBiz from '../../../biz/TaskBiz';
import SelectList from "../../common/SelectList";
import DisplayUtils from "../../../utils/DisplayUtils";


export default class SectionTest extends Component {

    // 构造
    constructor(props) {
        super(props);
        if(this.props.title){
            Actions.refresh({title:this.props.title});
        }
        let arr = [];
        let paperId = '';


        this.state = {
            emptyType: EmptyType.NO_DATA,
            count: 0,
            topic_list: arr,
            subject_list: [],
            paperId: paperId,
            countFavorite: 0,
            selectArr: [],
            disable: 1,
            selectNumber: 0,
            showSelect: false,
            difficulty_id: 0,
            arrowUp: require('../../../images/nav-arrow-up.png'),
            arrowDown: require('../../../images/nav-arrow-down.png'),
            isopt: 0,
            typeList: [
                '全部题型',
                '单选题',
                '多选题',
                '解答题',
            ],

            checkOpt: false,
            checkDiff: false,
            defaultSelect: 0,
            difficultyList: [
                '全部难度',
                '简单',
                '较易',
                '中等',
                '较难',
                '困难',
            ],
            selectList: [],
        };
    }

    _onEnter() {
        if (TestListBiz.mustRefresh) {
            setTimeout(() => this.listView.refresh(), 200);
            TestListBiz.setMustRefresh(false);
        }
    }



    _fetchData(page, startFetch, abortFetch) {
        if (this.props.paper_id) {

            //获取试题
            HttpUtils.request(API.getBookQuestionList, {
                id: this.props.paper_id,
            }).then(result=>{
                let list = result.list;
                let last_list = [];
                for(let i in list){
                    console.log('list[i].isopt',list[i].isopt);
                    console.log('list[i].difficulty_value',list[i].difficulty_value);
                    console.log('list[i]',list[i]);
                    console.log('(this.state.difficulty_id !== 0 && this.state.difficulty_id !== list[i].difficulty_value)',(this.state.difficulty_id !== 0 && this.state.difficulty_id !== list[i].difficulty_value));
                    if(this.state.isopt !== 0 && this.state.isopt !== list[i].isopt){

                    }else if(this.state.difficulty_id !== 0 && this.state.difficulty_id !== list[i].difficulty_value){

                    }else{

                        last_list.push(list[i]);
                    }

                }
                console.log(last_list);
                this.setState({
                    count: last_list.length,
                    subject_list: last_list,
                    countFavorite: result.count_favorite,
                });

                this._btnDisable(last_list);
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });
                startFetch(last_list, 10);
            }, err => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
        } else {
            startFetch([], 10);
        }

    }

    //判断初次进入是否已全部选中
    _btnDisable(list) {

        this.state.selectNumber = 0;

        list.map((item) => {
            if (item.status == 1) {
                this.state.selectNumber++;
            }
        });


        if (this.state.selectNumber == this.state.count) {
            this.setState({
                disable: 0,
            });
        } else {
            this.setState({
                disable: 1,
            });
        }

    }


    _renderFlatItem(item, index) {
        return (
                    <ExaminationItem
                        item={item}
                        index={index}
                        itemType='WebView'
                        type={1}
                        onStatusChange={(isAdd) => {
                            item.status = isAdd ? 1 : 0;
                            let isAllSelected = this.state.subject_list.every((listItem) => {
                                return listItem.status == 1;
                            });
                            this.setState({disable: !isAllSelected});

                        }}
                        itemPress={() => {
                            Actions.subjectItem({
                                cloudSubjectId: item.cloud_subject_id,
                                cloudTestId: item.cloud_test_id,
                                types: 2,
                                keys: index + 1,
                                counts: this.state.count,
                            });
                        }}
                    />
        );
    }


    _renderEmptyView() {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    }


    _renderHeader() {
        let color;
        if (this.state.disable == 1) {
            color = "#4791ff";
        } else {
            color = "#b5b5b5";
        }
        return (
            <View style={styles.listTitle}>
                <Text style={styles.textLeft}>全部题目（{this.state.count}）</Text>
                <Touch
                    onPress={() => {

                        if (this.state.disable == 1) {
                            let data = [];
                            this.state.subject_list.map((item) => {



                                    if (item.status == 0) {
                                        data.push({
                                            cloud_test_id: item.cloud_test_id,
                                            cloud_subject_id: item.cloud_subject_id,
                                            test_type: item.isopt,
                                        });
                                    }
                            });
                            let number = data.length + this.state.countFavorite;
                            if (number > 30) {
                                Toast.error('添加题目过多，请单个添加');
                                return;
                            }

                            let addedCount = data.length;
                            data = JSON.stringify(data);
                            HttpUtils.request(API.AddFavorites, {
                                data: data
                            }).then(res => {
                                TaskBiz.add(addedCount);
                                let arr = [];
                                this.state.subject_list.map((item) => {
                                    item.status = 1;
                                    arr.push(item);
                                });

                                this.setState({
                                    disable: 0,
                                });

                                this.listView.refresh();
                                //todo 数字增加

                            })

                        } else {

                            console.log("不可点击");
                        }

                    }}
                >
                    <Text style={[styles.textRight, {color: color,}]}>全部选入</Text>
                </Touch>
            </View>

        );
    }

    render() {

        return (
            <View style={{flex: 1}}>

                <View style={styles.nav}>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            let showSelect;
                            if (this.state.showSelect && this.state.checkOpt) {
                                showSelect = false;
                            } else {
                                showSelect = true;
                            }
                            this.setState({
                                showSelect: showSelect,
                                selectList: this.state.typeList,
                                checkOpt: (this.state.checkOpt) ? false : true,
                                checkDiff: false,
                                defaultSelect: this.state.isopt,
                            });
                        }}>
                        <View style={styles.navTextView}>
                            <Text style={styles.navText}>{this.state.typeList[this.state.isopt]}</Text>
                            <Image source={(this.state.checkOpt) ? this.state.arrowUp : this.state.arrowDown}
                                   style={styles.arrow}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            let showSelect;
                            if (this.state.showSelect && this.state.checkDiff) {
                                showSelect = false;
                            } else {
                                showSelect = true;
                            }
                            this.setState({
                                showSelect: showSelect,
                                selectList: this.state.difficultyList,
                                checkOpt: false,
                                checkDiff: (this.state.checkDiff) ? false : true,
                                defaultSelect: this.state.difficulty_id,
                            });
                        }}
                    >
                        <View style={styles.navTextView}>

                            <Text style={styles.navText}>{this.state.difficultyList[this.state.difficulty_id]}</Text>

                            <Image source={(this.state.checkDiff) ? this.state.arrowUp : this.state.arrowDown}
                                   style={styles.arrow}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1,}}>
                    <UltimateListView
                        header={() => this._renderHeader()}
                        ref={ref => this.listView = ref}
                        item={(item, index) => this._renderFlatItem(item, index)}
                        keyExtractor={(item, index) => {
                            return "key_" + index;
                        }}
                        allLoadedText='已经是最后一页了'
                        waitingSpinnerText=''
                        refreshableMode='basic'
                        onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                        numColumns={1}
                        style={{flex: 1}}
                        emptyView={() => this._renderEmptyView()}
                        pagination={false}
                        paginationFetchingView={() => {
                            return null
                        }}
                        showsVerticalScrollIndicator={false}/>
                </View>
                <SelectList
                    top={60}
                    show={this.state.showSelect}
                    list={this.state.selectList}
                    defaultSelect={this.state.defaultSelect}
                    close={() => {
                        this.setState({
                            showSelect: false,
                            checkOpt: false,
                            checkDiff: false,
                        })
                    }}
                    selected={(res) => {
                        //选择
                        if (this.state.checkOpt) {
                            this.setState({
                                showSelect: false,
                                selectList: [],
                                checkOpt: false,
                                checkDiff: false,
                                isopt: res,
                            });
                        } else {
                            this.setState({
                                showSelect: false,
                                selectList: [],
                                checkOpt: false,
                                checkDiff: false,
                                difficulty_id: res,
                            });
                        }
                        setTimeout(() => this.listView.refresh(), 200);
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    nav: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    navTextView: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    navText: {
        lineHeight: (Platform.OS === 'android') ? 40 : 55,
    },
    arrow: {
        marginTop: 28,
        width: 13,
        height: 6,
        marginLeft: 3,
    },
    listTitle: {
        backgroundColor: '#fff',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        flexDirection: 'row',
    },
    textLeft: {
        color: '#b5b5b5',
        textAlign: 'left',
        width: (Dimensions.get('window').width - 30) / 2,
    },
    textRight: {
        textAlign: 'right',
        width: (Dimensions.get('window').width - 30) / 2,
        color: '#4791ff',
        fontWeight: 'bold'
    },
    scrollView: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    }
});