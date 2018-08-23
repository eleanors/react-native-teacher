/**学生作业情况
 * Created by mac on 2018/2/27.
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
    ImageBackground,
    Platform
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from '../../utils/HttpUtils';
import {API} from '../../Config';
import DisplayUtils from '../../utils/DisplayUtils';
import {CachedImage} from 'react-native-cached-image';
import Touch from '../public/Touch';
let moment = require('moment');
import ClassBiz from '../../biz/ClassBiz';
import {Linking} from 'react-native';
import EmptyView,{EmptyType} from  '../common/EmptyView';
import Toast from '../../utils/Toast';
import TextUtils from "../../utils/TextUtils";

moment.locale('zh-cn', {
    relativeTime: {
        future: "%s后",
        past: "%s前",
        s: "%d秒",
        m: "一分钟",
        mm: "%d分钟",
        h: "一小时",
        hh: "%d小时",
        d: "一天",
        dd: "%d天",
        M: "一个月",
        MM: "%d个月",
        y: "一年",
        yy: "%d年"
    }
});
export default class StudentTaskSituation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            class_accuracy: 0,
            class_completed: 0,
            class_test_count: 0,
            student_name: '',
            mobile: 0,
            img_url: '',
            task_list: [],
        };
    }

    /*时间戳转换*/
    getLocalTime(nS, format) {

        console.log(moment(nS * 1000).format('YYYY-MM-DD HH:mm:ss'));
        let s = moment(nS * 1000).fromNow();
        console.log('s --- ', s)
        return moment(nS * 1000).fromNow();
    }


    jumpHomePage() {
        Actions.confirmDialog({
            title: '提示',
            buttons: ["确认", "取消"],
            message: '确认踢出该学生？',
            onClick: (index) => {
                if (index === 0) {
                    this.removeStudent();
                } else {
                    console.log("取消");
                }

            }
        })
    }


    //删除学生
    removeStudent() {

        HttpUtils.request(API.removeStudent, {
            class_number: this.props.classNumber,
            student_id: this.props.studentId,
        }).then((data) => {
            ClassBiz.mustRefresh();
            Actions.pop();
        }).catch((err) => {

        });
    }

    Dialing() {

        console.log('拨打电话', this.state.mobile);
        return Linking.openURL('tel:' + this.state.mobile);

    }


    _fetchData(page, startFetch, abortFetch) {
        console.log('fetch class list data');
        console.log('fetch class list data' + this.props.class_number);
        HttpUtils.request(API.StudentTaskList, {
            class_number: this.props.classNumber,
            student_id: this.props.studentId,
            page: page
        }).then((data) => {

            if (page == 1) {

                if (data.class_accuracy){
                    this.setState({
                        class_accuracy: data.class_accuracy,
                    });
                }

                if (data.class_completed){
                    this.setState({
                        class_completed: data.class_completed,
                    });
                }

                if (data.class_test_count){
                    this.setState({
                        class_test_count: data.class_test_count,
                    });
                }

                this.setState({
                    student_name: data.student_name,
                    mobile: data.mobile,
                    img_url: data.img_url,
                    task_list: data.task_list,
                });
            } else {
                this.setState({
                    task_list: data.task_list
                });
            }
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });

            startFetch(this.state.task_list, 10);
        }).catch((err) => {
            this.setState({
                emptyType: EmptyType.REQUEST_ERROR,
            });
            abortFetch();
        });
    }

    //列表选
    itemSelected(item) {
        console.log("列表项:" + JSON.stringify(item));
        if (item.task_status == 2 || item.task_status == 3) {
            //跳转
            Actions.studentSubmit({
                student: {
                    student_id: this.props.studentId,
                    user_name: this.state.student_name,
                    task_name: item.task_name,
                }, taskId: item.task_id,
                title: item.task_name
            })
        } else {
            //弹出
            Toast.error('该学生未提交本次作业');
            return;
        }
        // Actions.studentTaskSituation({studentId: item.student_id,classNumber: this.props.class_number});
    }


    renderFlatItem = (item, index) => {
        let itemIndex = index + 1;
        let rightItem = <View><Text></Text></View>;
        if (item.task_status == 0 || item.task_status == 1) {
            let str = this.getLocalTime(item.deadline_time, "yyyy-MM-dd hh:mm");
            rightItem = <View style={[styles.statsImage, {borderRadius: 2, backgroundColor: '#4660A6'}]}>
                <Text style={[styles.white, styles.f13,]}>{str}截止</Text>
            </View>

        } else if (item.task_status == 2) {
            rightItem = <View style={[styles.statsImage, {borderRadius: 2, backgroundColor: '#808080'}]}>
                <Text style={[styles.white, styles.f13,]}>待批阅</Text>
            </View>;

        } else if (item.task_status == 3) {
            rightItem = <View style={[styles.statsImage, {borderRadius: 2, backgroundColor: '#2DD5D3'}]}>
                <Text
                    style={[styles.white, styles.f13]}>{item.task_accuracy}%正确</Text>
            </View>

        } else {
            rightItem = <View style={[styles.statsImage, {borderRadius: 2, backgroundColor: '#FFAE66'}]}>
                <Text style={[styles.white, styles.f13]}>逾期未交</Text>
            </View>

        }


        let type = item.task_type === 3 ? '试卷' : '作业';

        let borderTopRightRadius;
        let borderTopLeftRadius;

        borderTopRightRadius = index == 0 ? 15 : 0;
        borderTopLeftRadius = index == 0 ? 15 : 0;

        return (
            <View style={{
                borderTopRightRadius: borderTopRightRadius,
                borderTopLeftRadius: borderTopLeftRadius,
            }}>
                <TouchableOpacity onPress={this.itemSelected.bind(this, item)}>
                    <View style={[styles.listItem,{
                        borderTopRightRadius: borderTopRightRadius,
                        borderTopLeftRadius: borderTopLeftRadius,
                    }]}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.f16, styles.ml10, {
                                color: '#ECEEFE',
                                backgroundColor: 'transparent',


                            }]}>{item.task_name}</Text>
                            <Text
                                style={[styles.f14, styles.ml10, styles.mt3, {
                                    color: '#A9BFFF',
                                    backgroundColor: 'transparent'
                                }]}>共{item.task_test_count}题
                                | {type} </Text>
                        </View>
                        {rightItem}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    renderEmptyView = () => {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    };


    render() {
        console.log(this.props.studentId, this.props.classNumber);
        return (
            <View style={styles.bg}>
                <View style={styles.backView}>
                    <Image
                        source={require('../../images/pic_circle_right.png')}
                        style={{width: 130, height: 130, position: 'absolute', top: -20, right: -40,}}/>
                    <Image
                        source={require('../../images/pic_circle_left.png')}
                        style={{width: 130, height: 130, position: 'absolute', top: 70, left: -50,}}/>
                    <View style={{
                        flexDirection: 'row',
                        height: 44,
                        width: DisplayUtils.SCREEN.width,
                        marginTop: 10,
                    }}>

                        <TouchableOpacity onPress={() => {
                            Actions.pop()
                        }}>
                            <View style={styles.iconView}>
                                <Image
                                    source={require('../../images/class_nav_back_normal.png')}
                                    style={{width: 30, height: 30, marginTop: (TextUtils.isIphoneX()) ? 17 : 7,}}/>
                            </View>
                        </TouchableOpacity>


                        <View style={{
                            flex: 1,
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}>

                            <Touch
                                disabled={this.state.isDisable}
                                onPress={this.Dialing.bind(this)}>
                                <View style={styles.iconView}>
                                    <Image
                                        source={require('../../images/class_details_phone.png')}
                                        style={{width: 30, height: 30, marginTop: (TextUtils.isIphoneX()) ? 17 : 7, marginLeft: 10}}/>
                                </View>
                            </Touch>

                            <Touch onPress={this.jumpHomePage.bind(this)}>
                                <View style={styles.iconView}>
                                    <Image
                                        source={require('../../images/class_details_remove.png')}
                                        style={{width: 30, height: 30, marginTop: (TextUtils.isIphoneX()) ? 17 : 7, marginLeft: 10}}/>
                                </View>
                            </Touch>

                        </View>

                        <View style={{
                            position: 'absolute',
                            left: 100,
                            width: DisplayUtils.SCREEN.width - 200,
                            height: (TextUtils.isIphoneX()) ? 54 : 44,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={[styles.f18, styles.white, {
                                backgroundColor: 'transparent',
                            }]}>
                                学生作业情况
                            </Text>
                        </View>

                    </View>
                    <CachedImage
                        style={styles.image}
                        source={{uri: this.state.img_url}}
                        defaultSource={require('../../images/head_student.png')}
                        fallbackSource={require('../../images/head_student.png')}/>

                    <View style={styles.card}>
                        <Text style={[styles.f20, styles.text, styles.mt50]}>{this.state.student_name}</Text>
                        <View style={styles.row}>
                            <View style={styles.rowView}>
                                <Text
                                    style={[styles.text, styles.f25]}>{this.state.class_test_count}</Text>
                                <Text style={[styles.text2, styles.f14, styles.mt5]}>做题数量</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text
                                    style={[styles.text, styles.f25]}>{this.state.class_completed}%</Text>
                                <Text style={[styles.text2, styles.f14, styles.mt5]}>作业提交率</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text
                                    style={[styles.text, styles.f25]}>{this.state.class_accuracy}%</Text>
                                <Text style={[styles.text2, styles.f14, styles.mt5]}>作业正确率</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1, marginTop: 10,}}>
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
                            paginationFetchingView={()=>{return null}}
                            allLoadedText="没有更多数据了"/>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    bg: {
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.SCREEN.height,
    },
    backView: {
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.SCREEN.height,
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4277ff',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        zIndex: 10
    },
    card: {
        width: DisplayUtils.SCREEN.width - 20,
        height: 180,
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: -40,
        alignItems: 'center',
    },
    f20: {
        fontSize: 20,
    },
    f14: {
        fontSize: 14,
    },
    f16: {
        fontSize: 16,
    },
    f18: {
        fontSize: 18,
    },
    text: {
        color: 'black',
    },
    text2: {
        color: '#BEBEBE'
    },
    mt50: {
        marginTop: 50,
    },
    mt10: {
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        height: 100,
        marginTop: 10,
    },
    rowView: {
        flex: 1,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsImage: {
        marginRight: 10,
        width: 90,
        paddingTop: 2,
        paddingBottom: 2,
        alignItems: 'center'
    },
    ml10: {
        marginLeft: 10,
    },
    white: {
        color: 'white',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        width: DisplayUtils.SCREEN.width - 20,
        backgroundColor: '#5786FF',
        marginLeft: 10,
    },
    iconView: {
        width: 44,
        height: 44
    },
    f13: {
        fontSize: 13,
    },
    f25: {
        fontSize: 25,
    },
    mt5: {
        marginTop: 5,
    },
    mt3: {
        marginTop: 3,
    }
});