/**
 * Created by mac on 2018/1/9.
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
    Alert,
    DeviceEventEmitter,//引入监听事件
} from 'react-native';
import {observer} from 'mobx-react';
import HttpUtils from "../../utils/HttpUtils";
import {UltimateListView} from 'react-native-ultimate-listview';
import DisplayUtils from '../../utils/DisplayUtils';
import {Actions} from "react-native-router-flux";
import {API} from "../../Config";
import {CachedImage} from 'react-native-cached-image';
import EmptyView, {EmptyType} from  '../common/EmptyView';
import ClassBiz from '../../biz/ClassBiz';
@observer
export default class ClassDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            data: {
                class_accuracy: 0,
                class_completed: 0,
                class_name: '',
                class_number: 0,
                class_student_count: 0,
                student_list: [],
            },
            assembleList: [],
            show: false,
            orderType: 'actual',//類型
            actualOrderState: 'down',//正確率默認狀態
            submitOrderState: 'none', //提交率默認狀態
            excelUrl: '',
            shareDesc: '',
            shareImg: '',
            shareTitle: '',
        };
    }

    _onEnter() {
        console.log('onEnter');
        if (ClassBiz.refresh) {
            // Actions.refresh({title: ClassBiz.className});
            this.listView.refresh();
            // ClassBiz.refreshComplete();
        }
    }

    _changeOrder(type) {
        console.log('排序类型:', type);
        console.log('排序方式：', this.state.actualOrderState, this.state.submitOrderState);

        if (this.state.orderType === type) {
            //切換正序或倒序排序
            if (type === 'actual') {
                let actualOrderState = this.state.actualOrderState === 'up' ? 'down' : 'up';
                if (actualOrderState === 'up') {
                    //按正確率升序排序
                    this.correctRateOfAscendingrder();
                } else {
                    //按正確率降序排序
                    this.correctRateDescending();
                }
                this.setState({
                    actualOrderState: actualOrderState
                });
            } else {
                let submitOrderState = this.state.submitOrderState === 'up' ? 'down' : 'up';
                if (submitOrderState === 'up') {
                    //按提交率升序排序
                    this.submissionRateOfAscendingrder();
                } else {
                    //按提交率降序排序
                    this.submissionRateDescending();
                }
                this.setState({
                    submitOrderState: submitOrderState
                });
            }
        } else {
            //切換排序類型
            if (type === 'actual') {
                //按正確率倒序排序
                this.correctRateDescending();
            } else {
                //按提交率倒序排序
                this.submissionRateDescending();
            }
            this.setState({
                orderType: type,
                actualOrderState: 'down',
                submitOrderState: 'down'
            });
        }
        console.log('排序方式：', this.state.actualOrderState, this.state.submitOrderState);
    }




    //正确率降序
    correctRateDescending() {


        this.state.data.assembleList = this.state.data.student_list.sort((item0, item1)=> {
            return item1.student_accuracy - item0.student_accuracy;
        });

        //刷新列表
        this.setState({
            data: this.state.data
        });
    }


    //正确率升序
    correctRateOfAscendingrder() {

        this.state.data.assembleList = this.state.data.student_list.sort((item0, item1)=> {
            return item0.student_accuracy - item1.student_accuracy;
        })
        //刷新列表
        this.setState({
            data: this.state.data
        })
    }

    //提教率降序
    submissionRateDescending() {

        this.state.data.assembleList = this.state.data.student_list.sort((item0, item1)=> {
            return item1.student_completed - item0.student_completed;
        });

        //刷新列表
        this.setState({
            data: this.state.data
        });
    }


    //提教率升序
    submissionRateOfAscendingrder() {

        this.state.data.assembleList = this.state.data.student_list.sort((item0, item1)=> {
            return item0.student_completed - item1.student_completed;
        });

        //刷新列表
        this.setState({
            data: this.state.data
        });
    }

    //列表选
    itemSelected(item) {

        Actions.studentTaskSituation({studentId: item.student_id, classNumber: this.props.class_number});
    }


    _fetchData(page = 1, startFetch, abortFetch) {
        console.log('fetch class list data');
        console.log('fetch class list data' + this.props.class_number);
        HttpUtils.request(API.GetClassesDetail, {class_number: this.props.class_number})
            .then((data) => {
                this.setState({
                    data: data
                });
                this.correctRateDescending();
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });
                startFetch(this.state.data.assembleList, 100);
                this.requestToExportData();
            })
            .catch((err) => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
    }


    render() {

        let actual;
        let submit;
        let actualUnderline;
        let submitUnderline;
        let on = <Image source={require('../../images/rankon.png')} style={styles.orderImg}/>;
        let none = <Image source={require('../../images/ranknone.png')} style={styles.orderImg}/>;
        let up = <Image source={require('../../images/rankup.png')} style={styles.orderImg}/>;
        if(this.state.orderType === 'actual' && this.state.actualOrderState === 'up'){
            actual = up;
        }
        if(this.state.orderType === 'actual' && this.state.actualOrderState === 'down'){
            actual = on;
        }
        if(this.state.orderType === 'submit'){
            actual = none;
        }
        if(this.state.orderType === 'submit' && this.state.submitOrderState === 'up'){
            submit = up;
        }
        if(this.state.orderType === 'submit' && this.state.submitOrderState === 'down'){
            submit = on;
        }
        if(this.state.orderType === 'actual'){
            submit = none;
        }
        if(this.state.orderType === 'actual'){
            actualUnderline = (<View style={styles.orderUnderLineView}>
                <View style={styles.orderUnderLine}>
                </View>
            </View>);
            submitUnderline = null;
        }
        console.log(this.state.submitOrderState,this.state.actualOrderState);
        if(this.state.orderType === 'submit'){
            submitUnderline = (<View style={styles.orderUnderLineView}>
                <View style={styles.orderUnderLine}>
                </View>
            </View>);
            actualUnderline = null;
        }
        return (
            <View style={styles.bg}>
                <View style={styles.orderTitle}>
                    <TouchableOpacity
                        onPress={()=>{
                            this._changeOrder('actual');
                        }}
                        style={styles.orderTitleView}
                    >
                        <Text style={[styles.orderTitleText, (this.state.orderType === 'actual')?styles.orderTextOn:null]}>按正确率排序</Text>
                        {actual}
                        {actualUnderline}


                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            this._changeOrder('submit');
                        }}
                        style={styles.orderTitleView}
                    >
                        <Text style={[styles.orderTitleText, (this.state.orderType === 'submit')?styles.orderTextOn:null]}>按提交率排序</Text>
                        {submit}
                        {submitUnderline}
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <UltimateListView
                        ref={ref => this.listView = ref}
                        item={this.renderFlatItem}
                        keyExtractor={(item, index) => {
                            return "key_" + index;
                        }}
                        refreshableMode='basic'
                        onFetch={this._fetchData.bind(this)}
                        numColumns={1}
                        emptyView={()=>this.renderEmptyView()}
                        showsVerticalScrollIndicator={false}
                        style={{flex: 1}}
                        pagination={false}
                        paginationFetchingView={()=> {
                            return null
                        }}
                        refreshable={false}/>
                </View>

            </View>
        );
    }


    renderFlatItem = (item, index) => {
        let itemIndex = index + 1;
        let rightItem = <View><Text></Text></View>;
        if (itemIndex == 1) {
            rightItem =
                <View style={[styles.numberImage, styles.backTransparent, {height: 30, width: 30, borderRadius: 15}]}>
                    <Image style={styles.numberOneImage} source={require('../../images/class_details_sort_no1.png')}/>
                    <Text style={[styles.white, styles.f14, {marginRight: 1, marginTop: 2}]}>{itemIndex}</Text>
                </View>
        } else if (itemIndex == 2) {
            rightItem = <View style={[styles.numberImage, styles.numberTwo]}>
                <Text style={[styles.white, styles.f14]}>{itemIndex}</Text>
            </View>
        } else if (itemIndex == 3) {
            rightItem = <View style={[styles.numberImage, styles.numberTwo]}>
                <Text style={[styles.white, styles.f14]}>{itemIndex}</Text>
            </View>
        } else {
            rightItem = <View style={[styles.numberImage]}>
                <Text style={styles.f14}>{itemIndex}</Text>
            </View>
        }


        return (
            <View>
                <TouchableOpacity onPress={this.itemSelected.bind(this, item)}>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 70}}>
                        <CachedImage
                            style={{width: 40, height: 40, borderRadius: 20}}
                            source={{uri: item.student_img_url}}
                            defaultSource={require('../../images/head_student.png')}
                            fallbackSource={require('../../images/head_student.png')}/>
                        <View>
                            <Text style={[styles.f16, styles.ml10, {color: '#282828'}]}>{item.student_name}</Text>
                            <Text
                                style={[styles.f14, styles.black, styles.ml10, styles.mt5]}>提交率{item.student_completed}%
                                | 正确率{item.student_accuracy}%</Text>
                        </View>
                        {rightItem}
                    </View>
                </TouchableOpacity>
                {/*<View style={styles.divideLine}/>*/}
            </View>
        );
    };

    renderEmptyView = () => {
        return (
            <EmptyView
                emptyType={EmptyType.NO_DATA}
                onClick={()=>this.listView.refresh()}
            />
        );
    };


}
const styles = StyleSheet.create({
    orderTitle: {
        flexDirection: 'row',
        height: 50,
    },
    orderTitleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    orderTextOn: {
        color: '#4791ff',
        fontWeight: 'bold',
    },
    orderUnderLineView: {

        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        height: 3,
    },
    orderUnderLine: {
        width: 14,
        height: 3,
        backgroundColor: '#4791ff',
        borderRadius: 3,
    },
    orderImg: {
        width: 6,
        height: 9,
        marginLeft: 5,
        marginTop: 3,
    },
    orderTitleText: {
        fontSize: 16,
    },
    bg: {
        backgroundColor: '#fff',
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.SCREEN.height,
        flex: 1,
        paddingTop: 10,
        paddingRight: 20,
        paddingLeft: 20,

    },
    card: {
        width: DisplayUtils.SCREEN.width - 40,
        height: 150,
        // backgroundColor: '#335CFF',
        borderRadius: 7,
        elevation: 4,
        shadowColor: '#7893FF',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 5,

    },
    topBg: {
        width: DisplayUtils.SCREEN.width - 40,
        height: 150,
        position: 'absolute',
        borderRadius: 7
    },
    leftText: {
        fontSize: 18,
        color: 'white',
        marginTop: 15,
        marginLeft: 7,
        backgroundColor: 'transparent'
    },
    rightText: {
        fontSize: 14,
        color: 'white',
        position: 'absolute',
        top: 17,
        right: 10,
        backgroundColor: 'transparent'
    },
    row: {
        flexDirection: 'row',
        height: 100,
        marginTop: 1,
    }
    ,
    rowView: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    white: {
        color: 'white',
    },
    f25: {
        fontSize: 25,
    },
    f14: {
        fontSize: 14,
    },
    f16: {
        fontSize: 16,
    },
    mt10: {
        marginTop: 10,
    },
    itemView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mt5: {
        marginTop: 5,
    },
    card2: {
        height: 70,
        flexDirection: 'row',
    },
    image: {
        width: 30,
        height: 30,
    },
    black: {
        color: '#AEAFAE'
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
    },
    ml10: {
        marginLeft: 10,
    },
    numberImage: {
        width: 26,
        height: 26,
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13
    },
    numberOneImage: {
        width: 30,
        height: 30,
        position: 'absolute',
    },
    numberOne: {
        backgroundColor: '#FF8840',
    },
    numberTwo: {
        backgroundColor: '#FDBD41',
    },
    backTransparent: {
        backgroundColor: 'transparent'
    },
    blackStyle: {
        position: 'absolute',
        right: 7,
        top: 2,
        width: 150,
        height: 130,
        zIndex: 999,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blackImage: {
        position: 'absolute',
        width: 150,
        height: 130,

    },
    switchBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 140,
        marginLeft: 5,
        marginRight: 5
    },
    triangleImage: {
        position: 'absolute',
        right: 8,
        width: 7,
        height: 7
    },
    centerLine: {
        width: 140,
        height: 0.5,
        backgroundColor: '#696969',
        marginLeft: 5,
        marginRight: 5
    }

});