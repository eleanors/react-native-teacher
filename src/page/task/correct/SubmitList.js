//提交情况
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Dimensions,
} from 'react-native';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import DisplayUtils from "../../../utils/DisplayUtils";
import TextUtils from "../../../utils/TextUtils";
import {
    Actions,
} from 'react-native-router-flux';
import Touch from "../../public/Touch";
import Toast from "../../../utils/Toast";
const ScrollableTabView = require('./TabBar/tabbar');

const progressWidth = Dimensions.get('window').width - 180;
export default class SubmitList extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            finish_list: [],
            un_finish_list: [],
        };
    }

    componentDidMount() {
        HttpUtils.request(API.getTaskStudentList, {
            task_id: this.props.taskId
        }).then(res => {
            this.setState({
                finish_list: res.finish_list,
                un_finish_list: res.un_finish_list,
            });
        });
    }

    _renderRight() {
        return (
            <Text style={{color: '#4b4b4b', fontSize: 14, paddingLeft: 10}}> 批量提醒</Text>
        )
    }


    onRight() {
        if (!this.state.un_finish_list || this.state.un_finish_list.length < 1) {
            Toast.error('没有未提交的学生');
            return;
        }
        HttpUtils.request(API.SendTaskNotice, {
            task_id: this.props.taskId
        }).then((res) => {
            console.log(res);
            return Toast.success('批量提醒成功');
        }, (err) => {
            // return Toast.error(err.err_msg);
        })
    }

    _renderFinishListItem(list) {
        return list.map((item, k) => {
            console.log('_renderFinishListItem',item);
            let imgUri = TextUtils.isEmpty(item.img_url) ? require('../../../images/head_student.png') : {uri: item.img_url};
            let width = progressWidth * item.student_accuracy / 100;
            let indexTextColor = k > 2 ? '#4f5050' : '#ffa462';
            return (
                <TouchableOpacity key={k} onPress={()=>Actions.studentSubmit({
                    student: item,
                    taskId: this.props.taskId,
                    title: this.props.task_name
                })}>
                    <View style={styles.li}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.liText, {color: indexTextColor}]}>{k + 1}</Text>
                            <View>
                                <Image source={imgUri} style={styles.headimg}/>
                            </View>
                        </View>
                        <View style={{marginLeft: 20}}>
                            <Text style={styles.name}>
                                {item.user_name}
                            </Text>
                            <View style={styles.progress}>
                                <View style={[styles.progressBar, {width: width}]}></View>
                                <Text>{item.student_accuracy}%</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    }

    _renderUnFinishListItem(list) {
        return list.map((item, k) => {
            console.log(item);
            let imgUri = TextUtils.isEmpty(item.img_url) ? require('../../../images/head_student.png') : {uri: item.img_url};
            return (
                <View style={styles.item} key={k}>
                    <Image source={imgUri} style={styles.headimg}/>
                    <Text style={styles.studentName}>{item.user_name}</Text>
                    <TouchableOpacity style={styles.phoneView} onPress={() => {
                        let url = 'tel: ' + item.mobile;
                        Linking.canOpenURL(url).then(supported => {
                            if (!supported) {
                                console.log('不能拨打电话: ' + url);
                            } else {
                                return Linking.openURL(url);
                            }
                        }).catch(err => console.error('错误', err));
                    }}>
                        <Image source={require('../../../images/phone.png')} style={styles.phone}/>
                    </TouchableOpacity>
                </View>
            );
        });
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    initialPage={0}
                    tabBarActiveTextColor='#4791ff'
                    tabBarInactiveTextColor='#6E6E6E'
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarTextStyle={{marginTop: 5, fontSize: 15}}
                    tabBarUnderlineStyle={styles.slider}
                    onChangeTab={(val) => {
                        if (val.i === 1) {
                            Actions.refresh({
                                rightTitle: this._renderRight()
                            })
                        } else {
                            Actions.refresh({
                                rightTitle: ''
                            })
                        }
                    }}
                >
                    <ScrollView style={styles.scrollView} tabLabel={'已提交（' + this.state.finish_list.length + '）'}
                                showsVerticalScrollIndicator={false} rticalScrollIndicator={false}
                                alwaysBounceVertical={true}>
                        {this._renderFinishListItem(this.state.finish_list)}
                        <View>
                            <Text style={{height: 30, width: 100}}></Text>
                        </View>
                    </ScrollView>
                    <ScrollView style={styles.scrollView} tabLabel={'未提交（' + this.state.un_finish_list.length + '）'}
                                showsVerticalScrollIndicator={false} rticalScrollIndicator={false}
                                alwaysBounceVertical={true}>
                        {this._renderUnFinishListItem(this.state.un_finish_list)}
                        <View>
                            <Text style={{height: 30, width: 100}}></Text>
                        </View>
                    </ScrollView>
                </ScrollableTabView>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 4 - 15,
        backgroundColor: '#4791ff',
        borderRadius: 2,
        borderWidth: 0,
    },
    scrollView: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        height: 45,
        marginBottom: 20,
    },
    headimg: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        overflow: 'hidden',
    },
    studentName: {
        height: 45,
        marginTop: 13,
        marginLeft: 20,
        color: '#4b4b4b',
    },
    phone: {

        width: 14,
        height: 16,
        marginTop: 14,

    },
    phoneView: {

        width: 50,
        height: 45,
        position: 'absolute',
        right: 0,
    },
    li: {
        backgroundColor: '#fff',
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15,
    },
    liText: {
        fontSize: 20,
        marginRight: 20,
        marginTop: 9,
        color: '#ffa96f',
    },
    name: {
        marginTop: 5,
    },
    progress: {
        flexDirection: 'row',
    },
    progressBar: {
        backgroundColor: '#4791ff',
        marginRight: 10,
        borderRadius: 10,
        height: 10,
        marginTop: 5,
    },

});