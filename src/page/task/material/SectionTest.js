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
import ExaminationItem from "../ExaminationItem";
import Toast from '../../../utils/Toast';
import TaskBiz from '../../../biz/TaskBiz';
import DisplayUtils from "../../../utils/DisplayUtils";


class ScrollViewItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};

        console.log("index1:",this.props.index)
    }

    onClick() {
        this.props.onClick();
    }

    render() {

        let color;
        let sliderColor;
        //type为1时为选中状态
        if (this.props.item.type == 1) {
            color = "#1B6FFF";
            sliderColor = "#1B6FFF";
        } else {
            color = "#3A3A3A";
            sliderColor = "#fff";
        }


        return (
            <View>
                <TouchableOpacity onPress={() => {
                    this.onClick();
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 16, padding: 15, color: color}}>{(this.props.item.name)?this.props.item.name:this.props.item.names}</Text>
                        <View style={{width: 18, height: 4, backgroundColor: sliderColor, borderRadius: 2,}}></View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class SectionTest extends Component {

    // 构造
    constructor(props) {
        super(props);
        if(this.props.name){
            console.log('this.props.name',this.props.title);
            Actions.refresh({title:this.props.title});
        }
        let arr = [];
        let paperId = '';
        if(!this.props.item.course_paper){
            console.log(232323,this.props.item);
            HttpUtils.request(API.GetTutorPaperList, {
                id: this.props.item.id,
            }).then(result=>{
                console.log('result',result);
                if(result.length > 0){
                    paperId = result[0].id;
                    result[0].type = 1;
                }
                this.setState({
                    topic_list: result,
                    paperId: paperId
                });
                this.listView.refresh();

            });


        }else{

            let list = this.props.item.course_paper;
            paperId = list[0].paper_id;
            arr = list.map((item, index) => {
                if (index == 0) {
                    item.type = 1;
                } else {
                    item.type = 0;
                }
                return item;
            });

        }


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
        };
    }

    _onEnter() {
        if (TestListBiz.mustRefresh) {
            setTimeout(() => this.listView.refresh(), 200);
            TestListBiz.setMustRefresh(false);
        }
    }

    componentDidMount() {

    }


    _fetchData(page, startFetch, abortFetch) {

        if (this.state.paperId) {

            //获取试题
            HttpUtils.request(API.getBookQuestionList, {
                id: this.state.paperId,
            }).then(result=>{
                console.log(123,result);
                this.setState({
                    count: result.list.length,
                    subject_list: result.list,
                    countFavorite: result.count_favorite,
                });

                this._btnDisable(result.list);
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });
                startFetch(result.list, 10);
            }, err => {
                console.log(err);
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

        console.log("this.state.selectNumber:", list);
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
                    console.log('isAllSelected', isAllSelected);
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

    renderExpenseItem(item, index) {
        console.log("index0:",index);
        console.log('123123123123');
        return <ScrollViewItem index={index} key={index} item={item} onClick={() => this.onClick(index)}/>;
    }

    //返回index
    onClick(index) {

        console.log("index2:",index);
        let paperId = (this.state.topic_list[index].paper_id)?this.state.topic_list[index].paper_id:this.state.topic_list[index].id
        this.setState({
            paperId: paperId,
        });

        this.state.topic_list.map((item, index1) => {

            if (index == index1) {
                item.type = 1;
            } else {
                item.type = 0;
            }
        });

        HttpUtils.request(API.getBookQuestionList, {
            id: paperId,
        }).then(result=>{

            this.setState({
                count: result.list.length,
                subject_list: result.list,
                countFavorite: result.count_favorite,
            });

            this._btnDisable(result.list);
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });

            if(this.listView){
                this.listView.refresh();
                if (this.listView.getRows().length > 0) {
                    this.listView.scrollToOffset({y: 0});
                }
            }



        }, err => {
            console.log(err);
            this.setState({
                emptyType: EmptyType.REQUEST_ERROR,
            });

        });



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
                                console.log('全部选入', res);
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
                <View style={{backgroundColor: 'white'}}>
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        scrollEventThrottle={0}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollView}>
                        {
                            this.state.topic_list.map((item, index) => this.renderExpenseItem(item, index))
                        }
                    </ScrollView>
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
            </View>
        );
    }
}
const styles = StyleSheet.create({
    listTitle: {
        backgroundColor: '#fff',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        marginTop: 15,
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
        fontWeight: 'bold'
    },
    scrollView: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    }
});