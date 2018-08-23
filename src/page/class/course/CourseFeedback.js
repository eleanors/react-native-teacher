/**
 * 课程记录
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Keyboard,
    NativeEventEmitter,
    DeviceEventEmitter,
    Platform,
    NativeModules,
    KeyboardAvoidingView
} from 'react-native';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import {
    ListRow,
    Label,
} from 'teaset';
import moment from 'moment';
import DisplayUtils from "../../../utils/DisplayUtils";
import {UltimateListView} from 'react-native-ultimate-listview';
import Orientation from 'react-native-orientation';
import CourseRecordImgs from "./CourseRecordImgs";
import ClassBiz from "../../../biz/ClassBiz";
import Toast from "../../../utils/Toast";
import SpeechConversionText from '../../../utils/VoiceToTextUtil';
import TextUtils from '../../../utils/TextUtils';

let number = 200;
export default class CourseFeedback extends Component {


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(this.props.info);
        this.state = {
            list: [],
            active: {
                feedback: {
                    classroom_score: 0,
                    task_score: 0,
                    study_score: 0,
                    comment: '',
                },
            },
            btnText: '按住说话',
            show: false,
            voiceText: '',
            typeText: '启动中...',
            transferText: '',
            canClick: false,//避免按钮重复点击
            btnShow: true,
        };

        console.log(12345678);
    }

    _onRight() {
        console.log('点击右上角按钮处理');
        let feedback = this.state.active.feedback;
        console.log(feedback);
        console.log((!feedback.classroom_score || !feedback.task_score || !feedback.study_score || !feedback.comment));
        if (!feedback.classroom_score || !feedback.task_score || !feedback.study_score) {
            return Actions.errToast({msg: '请反馈后保存'});
        }
        if (!feedback.comment) {
            return Actions.errToast({msg: '请输入综合点评'});
        }
        let list = this.state.list;

        HttpUtils.request(API.AddCourseFeedback, {
            course_id: this.props.info.id,
            student_id: this.state.active.student_id,
            classroom_score: feedback.classroom_score,
            task_score: feedback.task_score,
            study_score: feedback.study_score,
            comment: feedback.comment,
        }).then(res=> {
            console.log(res);
            let active = this.state.active;
            active.feedback.id = res.id;
            active.feedbacked = true;
            this.setState({
                active: active
            });

            Toast.success('已生成评价！');
            ClassBiz.mustRefresh();
        });
    }

    _fetchData(page, startFetch, abortFetch) {
        console.log('page::::', page);
        if (page === 2) {
            return startFetch([], 10);
        }
        HttpUtils.request(API.GetFeedbackList, {
            course_id: this.props.info.id,
        }).then(res=> {
            for (let i in res) {
                if (res[i].feedback.id) {
                    res[i].feedbacked = true;
                }
            }
            console.log(res);

            this.setState({
                list: res,
            });
            if (res.length > 0) {
                this._click(0);
            }
            startFetch(res, 10);
        }, err=> {
            console.log(err);
            abortFetch();
        })
    }

    _click(index) {
        let list = this.state.list;
        for (let i in list) {
            list[i].active = false;
        }
        list[index].active = true;
        this.setState({
            list: list,
            active: list[index]
        });
    }

    _renderFlatItem(item, index) {
        // console.log(item);
        let img = (item.avatar) ? {uri: item.avatar} : require('../../../images/head_teacher.png');
        return (
            <View>
                <TouchableOpacity
                    onPress={()=>this._click(index)}
                >
                    <View style={styles.avatar}>
                        {
                            (item.feedbacked)
                                ?
                                <Image source={require('../../../images/recordRight.png')} style={styles.recordRight}/>
                                :
                                null
                        }
                        <Image source={img} style={(item.active) ? styles.activeImg : styles.img}/>
                        <Label
                            style={[styles.username, (item.active) ? styles.activeUsername : null]}>{item.user_name}</Label>
                        {
                            (item.active)
                                ?

                                <View style={{
                                    position: 'absolute',
                                    right: 0,
                                    width: 2,
                                    height: 30,
                                    top: 27.5,
                                    backgroundColor: '#4791ff'
                                }}>

                                </View>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    _checkHas(item) {
        if (item.id) {
            return true;
        }
        return false;
    }

    _clickStar(type, num) {
        let active = this.state.active;
        switch (type) {
            case 1:
                active.feedback.classroom_score = num;
                break;
            case 2:
                active.feedback.task_score = num;
                break;
            case 3:
                active.feedback.study_score = num;
                break;
        }
        this.setState({
            active: active
        });
    }

    _star(info, num, type) {
        let unstar = <Image source={require('../../../images/feedbackUnStar.png')} style={styles.star}/>;
        let star = <Image source={require('../../../images/feedbackStar.png')} style={styles.star}/>;
        return (
            <TouchableOpacity onPress={()=>this._clickStar(type, num)} style={{flex: 1, alignItems: 'center',}}>
                {(info && info >= num) ? star : unstar}
            </TouchableOpacity>
        );
    }


    componentWillUnmount() {
        console.log('this.subScription.remove');
        this.subScription.remove();
        if (Platform.OS == 'android') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    componentWillMount() {

        let that = this;
        /**
         * 用于JS注册的监听
         */
        if (Platform.OS === 'ios') {
            let SpeechConversionText = NativeModules.SpeechConversionText;
            SpeechConversionText.startObserving();
            let emitter = new NativeEventEmitter(SpeechConversionText);
            //用获取的模块创建监听器
            that.subScription = emitter.addListener("EventVoiceToText", (parameter)=>this._voiceText(parameter, this));

        } else {
            this.subScription = DeviceEventEmitter.addListener('txaai', (parameter)=>this._voiceText(parameter, this));
        }

        if (Platform.OS == 'android') {

            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
                console.log('keyboardDidShow');

                this._btnHide()
            });
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                console.log('keyboardDidHide');

                this._btnShow()
            });
        }
    }


    _VoiceToText() {

        this.state.transferText = (this.state.active.feedback.comment) ? this.state.active.feedback.comment : '';
        if (this.state.active.feedback.comment && this.state.active.feedback.comment.length >= number) {

            Toast.error('已超出' + number + '字');
            return;
        }

        this.setState({
            btnText: '松开结束',
            voiceText: '',
            show: true,
        });

        if (Platform.OS == 'ios') {
            return SpeechConversionText.VoiceToText({});
        } else {

            let aai = NativeModules.aai;
            aai.start();
        }

    }

    _stopVoiceToText() {

        let oldStr = this.state.transferText;
        let newStr = this.state.voiceText;

        if (newStr) {

            let voiveString;
            if (Platform.OS == 'ios') {
                if (oldStr) {
                    voiveString = oldStr + '\n' + newStr + '。';
                } else {
                    voiveString = newStr + '。';
                }

            } else {
                voiveString = oldStr + newStr;
            }

            if (voiveString.length > number) {
                this.state.active.feedback.comment = voiveString.substring(0, number);
            } else {
                this.state.active.feedback.comment = voiveString;
            }
        }


        this.setState({
            btnText: '按住说话',
            typeText: '',
            show: false,
        });

        if (Platform.OS == 'ios') {
            return SpeechConversionText.CloseRecognition({});
        } else {
            let aai = NativeModules.aai;
            aai.stop();
        }

    }

    _voiceText(parameter, that) {
        if (parameter.type === 1) {
            this.setState({
                typeText: '语音转文字中...',
            });
        } else if (parameter.type === 2) {

            if (this.state.active.feedback.comment) {

                if ((parameter.text.length + this.state.active.feedback.comment.length) > number) {
                    this._stopVoiceToText();
                }
            } else {
                if ((parameter.text.length) > number) {
                    this._stopVoiceToText();
                }
            }

            this.setState({
                voiceText: parameter.text,
                typeText: '语音转文字中...',
            });

        } else {
            console.log("parameter:", parameter)
            // Toast.error('识别失败');
            this._stopVoiceToText();
        }
    }

    _btnHide() {

        this.setState({
            btnShow: false,
        });
    }

    _btnShow() {

        Keyboard.dismiss;

        this.setState({
            btnShow: true,
        });
    }


    render() {

        let v = this.state.show ? <View style={styles.blackStyle}>
            <Text style={{color: '#D5D5D5', fontSize: 14}}>{this.state.voiceText}</Text>
            <Text style={{color: '#878686', position: 'absolute', left: 15, bottom: 50}}>{this.state.typeText}</Text>
        </View> : null;

        let btn = this.state.btnShow ? <View style={{
            position: 'absolute',
            top: 400,
            zIndex: 20,
            right: DisplayUtils.SCREEN.width / 4 * 3 / 2,
            marginRight: -20
        }}>
            <TouchableOpacity onPressIn={() => this._VoiceToText()}
                              onPressOut={()=> this._stopVoiceToText(2)}
                              style={{zIndex: 20}}
                              disabled={this.state.canClick}>
                <View style={styles.btn}>
                    <Image
                        source={require('../../../images/btn_voice_normal.png')}
                        style={{
                            height: 40,
                            width: 40,
                            zIndex: 20
                        }}/>
                </View>
            </TouchableOpacity>
        </View> : null;
        console.log('Dimensions.get(\'window\').height*0.7',Dimensions.get('window').height*0.23);
        return (
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-Dimensions.get('window').height * 0.22}>
                <View style={styles.root}>
                    <View style={styles.left}>
                        <UltimateListView
                            ref={ref => this.listView = ref}
                            item={(item, index) => this._renderFlatItem(item, index)}
                            keyExtractor={(item, index) => {
                                return "key_" + index;
                            }}
                            allLoadedText=''
                            refreshableMode='basic'
                            onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                            numColumns={1}
                            style={{flex: 1, backgroundColor: '#fff',}}
                            // emptyView={() => this._renderEmptyView()}
                            paginationFetchingView={() => {
                                return null
                            }}
                            showsVerticalScrollIndicator={false}/>
                    </View>
                    <View style={styles.right}>
                        {v}
                        <View style={styles.listView}>
                            <View style={{flex: 1,}}>
                                <Text style={styles.listViewText}>课堂表现</Text>
                            </View>
                            <View style={{flexDirection: 'row', flex: 3,}}>
                                <View style={{flex: 0.2}}></View>
                                {this._star(this.state.active.feedback.classroom_score, 1, 1)}
                                {this._star(this.state.active.feedback.classroom_score, 2, 1)}
                                {this._star(this.state.active.feedback.classroom_score, 3, 1)}
                                {this._star(this.state.active.feedback.classroom_score, 4, 1)}
                                {this._star(this.state.active.feedback.classroom_score, 5, 1)}
                                <View style={{flex: 0.4}}></View>
                            </View>
                        </View>
                        <View style={styles.listView}>
                            <View style={{flex: 1,}}>
                                <Text style={styles.listViewText}>上次作业</Text>
                            </View>
                            <View style={{flexDirection: 'row', flex: 3,}}>
                                <View style={{flex: 0.2}}></View>
                                {this._star(this.state.active.feedback.task_score, 1, 2)}
                                {this._star(this.state.active.feedback.task_score, 2, 2)}
                                {this._star(this.state.active.feedback.task_score, 3, 2)}
                                {this._star(this.state.active.feedback.task_score, 4, 2)}
                                {this._star(this.state.active.feedback.task_score, 5, 2)}
                                <View style={{flex: 0.4}}></View>
                            </View>
                        </View>
                        <View style={styles.listView}>
                            <View style={{flex: 1,}}>
                                <Text style={styles.listViewText}>接受程度</Text>
                            </View>
                            <View style={{flexDirection: 'row', flex: 3,}}>
                                <View style={{flex: 0.2}}></View>
                                {this._star(this.state.active.feedback.study_score, 1, 3)}
                                {this._star(this.state.active.feedback.study_score, 2, 3)}
                                {this._star(this.state.active.feedback.study_score, 3, 3)}
                                {this._star(this.state.active.feedback.study_score, 4, 3)}
                                {this._star(this.state.active.feedback.study_score, 5, 3)}
                                <View style={{flex: 0.4}}></View>
                            </View>
                        </View>
                        <View style={styles.listView2 }>
                            <TextInput
                                style={styles.input}
                                placeholder='学生作业情况、配合度、薄弱环节、解决方案等，不超过200字。'
                                multiline={true}
                                onChangeText={text => {
                                    let active = this.state.active;
                                    active.feedback.comment = text;
                                    this.setState({
                                        active: active
                                    });
                                }}
                                onBlur={() => {
                                    if (Platform.OS === 'ios') {
                                        this._btnShow();
                                    }
                                }}
                                onFocus={() => {
                                    if (Platform.OS === 'ios') {
                                        this._btnHide();
                                    }
                                }}
                                value={(this.state.active.feedback.comment) ? this.state.active.feedback.comment.toString() : ''}
                                maxLength={number}
                                returnKeyType="done"
                                underlineColorAndroid='transparent'
                                onEndEditing={Keyboard.dismiss}
                                blurOnSubmit={true}
                            />
                        </View>
                        {btn}
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    btn: {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    input: {
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: '#e2e2e2',
        justifyContent: 'space-between',
        textAlign: 'left',
        textAlignVertical: 'top',
        borderRadius: 6,
        padding: 10,
        paddingRight: 10,
        height: 290,
        backgroundColor: '#F5F5F5',
    },
    star: {
        width: 28,
        height: 28,
    },
    listView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 20,
        // marginRight: 30
    },
    listView2: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    listViewText: {
        fontSize: 16,
        color: '#747474',
        marginRight: 5,
        width: 70,
    },
    recordRight: {
        position: 'absolute',
        right: 20,
        top: 10,
        width: 20,
        height: 20,
        zIndex: 100,
    },
    activeImg: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 25,
        opacity: 0.5
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        padding: 10,
    },
    username: {
        color: '#434343',
        marginTop: 10,
    },
    activeUsername: {
        fontWeight: 'bold',
    },
    root: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    left: {
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#3e4749',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.3,
        shadowRadius: 7,
        borderTopWidth: 0.5,
        borderColor: '#f5f5f5',
    },
    right: {
        flex: 3,
        padding: 20,
        paddingTop: 15,
        paddingRight: 0,
        paddingLeft: 10,
        borderTopWidth: 0.5,
        borderColor: '#f5f5f5',
    },
    scrollView: {
        backgroundColor: '#fff',
        height: 200,
    },
    blackStyle: {
        position: 'absolute',
        flex: 3,
        padding: 10,
        top: 160,
        height: 290,
        zIndex: 10,
        backgroundColor: 'black',
        borderRadius: 6,
        left: 10,
        right: 10,
        paddingTop: 15,
        opacity: 0.9
    },
});