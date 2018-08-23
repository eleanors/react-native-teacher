/**选择学生开始批阅
 * Created by heaton on 2018/1/18.
 * Desription :
 */


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity, Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Touch from "../../public/Touch";
import {
    ListRow
} from 'teaset';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import moment from 'moment';
import Toast from "../../../utils/Toast";
import ClassBiz from "../../../biz/ClassBiz";
import Picker from "react-native-picker/index";
import Time from "../../common/Time";
import TextUtils from "../../../utils/TextUtils";
import DisplayUtils from "../../../utils/DisplayUtils";

export default class CorrectList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            info: {
                correct_count: 0,
                mistake_count: 0,
                half_correct_count: 0,
                unread_count: 0,
                student_list: []
            }
        };
        console.log('info', this.props);
        this._getRequest();
    }

    _getRequest(){
        console.log(212121212,this.props);
        HttpUtils.request(API.ReadStudentList, {
            task_id: this.props.taskId,
            test_number: this.props.test_number,
        }).then((res) => {
            console.log('res:', res);
            this.setState({
                info: res
            })
        });
    }


    _studentItem(list) {
        return list.map((item, k) => {
            console.log(item);
            let imgUrl = item.img_url ? {uri: item.img_url} : require('../../../images/head_student.png');
            return (
                <View style={styles.li} key={k}>
                    <Touch onPress={() => {
                        //跳转批阅页面
                        Actions.correctStudent({
                            studentArr: list,
                            studentIndex: k,
                            taskId: this.props.taskId,
                            testNumber: this.props.test_number,
                            title: '第' + this.props.test_number + '题',
                            onAnswerTypeChange: (index, type) => {
                                {/*list[index].answer_type = type;*/}
                                {/*let info = Object.assign({}, this.state.info);*/}
                                {/*info.student_list = list;*/}
                                {/*info.correct_count = list.filter((item) => {*/}
                                    {/*return item.answer_type == 1;*/}
                                {/*}).length;*/}
                                {/*info.mistake_count = list.filter((item) => {*/}
                                    {/*return item.answer_type == 2;*/}
                                {/*}).length;*/}
                                {/*info.half_correct_count = list.filter((item) => {*/}
                                    {/*return item.answer_type > 2;*/}
                                {/*}).length;*/}
                                {/*info.unread_count = list.filter((item) => {*/}
                                    {/*return item.answer_type == 0;*/}
                                {/*}).length;*/}


                                console.log("刷新数据")
                                this._getRequest();
                                {/*this.setState({info: info});*/}
                            }
                        });

                    }}>
                        <Image source={imgUrl} style={styles.headImg}/>
                    </Touch>
                    {this._getStatusImg(item.answer_type)}
                    <Text style={styles.name}>{item.student_name}</Text>
                </View>
            );
        });
    }

    _getStatusImg(answer_type) {
        switch (answer_type) {
            case 0:
                return null;
            case 1:
                return <Image source={require('../../../images/correctRight.png')} style={styles.correctStatus}/>
            case 2:
                return <Image source={require('../../../images/correctError.png')} style={styles.correctStatus}/>
            default:
                return <Image source={require('../../../images/correctHalf.png')} style={styles.correctStatus}/>
        }
    }

    render() {
        return (
            <View style={{paddingTop: 30, backgroundColor: '#fff', height: Dimensions.get('window').height}}>
                <View>
                    <Text style={styles.title}>选择学生开始批阅</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} rticalScrollIndicator={false}
                            alwaysBounceVertical={true}>
                    <View style={{backgroundColor: '#fff', minHeight: Dimensions.get('window').height - 130,}}>
                        <View style={{flexDirection: 'row', marginTop: 10,}}>
                            <View style={styles.line}></View>
                            <Text style={styles.nameText}>第{this.props.test_number}题</Text>
                            <View style={styles.line}></View>
                        </View>

                        <View>
                            <Text style={styles.status}>
                                正确{this.state.info.correct_count} 错误{this.state.info.mistake_count} 半对{this.state.info.half_correct_count} 未批阅{this.state.info.unread_count}
                            </Text>
                        </View>
                        <View style={styles.ul}>
                            {this._studentItem(this.state.info.student_list)}
                        </View>
                    </View>
                </ScrollView>
                <View style={[styles.buttonView, {marginBottom: (TextUtils.isIphoneX()) ? 20 : 0}]}>
                    <Touch onPress={() => {
                        Actions.pop();
                    }}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>收起</Text>
                        </View>
                    </Touch>
                </View>

            </View>

        );
    }
}

let itemWidth = (Dimensions.get('window').width - 145) / 4;

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        padding: 10
    },
    buttonView: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 60,
    },
    button: {
        width: 180,
        height: 42,
        backgroundColor: '#5394ff',
        borderRadius: 40,
        justifyContent: 'center',
        marginTop: 8
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    correctStatus: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 21,
        height: 21,
    },
    line: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        height: 10,
        width: (Dimensions.get('window').width - 70) / 2,
    },
    nameText: {
        width: 70,
        textAlign: 'center',
        color: '#b5b5b5'
    },
    status: {
        textAlign: 'center',
        color: '#b5b5b5',
        marginTop: 10,
    },
    ul: {
        width: Dimensions.get('window').width + 15,
        paddingLeft: 20,
        paddingTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 60,
    },
    li: {
        width: itemWidth,
        marginRight: 35,
        marginBottom: 20,
    },
    headImg: {
        width: itemWidth,
        height: itemWidth,
        borderRadius: itemWidth / 2
    },
    name: {
        textAlign: 'center',
        marginTop: 10,
        overflow: 'hidden',
        width: itemWidth,
        height: 20,
    }
});