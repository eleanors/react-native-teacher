'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AHWebView from "../../common/AHWebView";
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import {Actions} from 'react-native-router-flux'
import DisplayUtils from "../../../utils/DisplayUtils";


export default class Checkbox extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log('props', this.props);
    }

    static defaultProps = {
        noPercent: false
    };

    _showOptionStudents(options, taskId, test_number) {
        if (!taskId && !test_number) {
            return;
        } else {
            HttpUtils.request(API.GetOptionStudentList, {
                task_id: taskId,
                test_number: test_number,
                option: options,
            }).then((data) => {
                console.log(data)
                Actions.popupStudent({
                    option: data.option === 'CORRECT' ? this.props.info.answer : data.option,
                    option_percent: data.option_percent,
                    option_selected_count: data.option_selected_count,
                    student_list: data.student_list,
                })
            }).catch((err) => {
            });
        }
    }

    _options(options_html, options_percent, options, answer, taskId, test_number) {
        if (!options_html) {
            return null;
        }
        let answerRight = false;
        if (options === answer || answer.indexOf(options) >= 0) {
            answerRight = true;
        }

        return (
            <View style={styles.radio}>
                <View style={{width: 20}}>
                    {/*<Text style={[styles.radioText, answerRight ? styles.rightOptionsText : null]}>{options}.</Text>*/}
                    <Text style={[styles.radioText]}>{options}.</Text>
                </View>
                <View>
                    <AHWebView
                        html={options_html}
                        viewStyle={[{marginLeft: 5}, (options_percent || options_percent === 0) ? styles.optionsWidth2 : styles.optionsWidth]}
                        webStyle={[answerRight ? styles.rightRadio : null, (options_percent || options_percent === 0) ? styles.optionsWidth2 : styles.optionsWidth]}
                    />
                </View>

                {/*批改作业选项*/}
                {((options_percent || options_percent === 0) && this.props.noPercent === false) ?
                    <View style={[styles.answerPercent, answerRight ? styles.rightAnswerPercent : null]}>
                        < TouchableOpacity onPress={()=> {
                            console.log('弹出视图');
                            this._showOptionStudents(options, taskId, test_number);
                        }}>
                            <Text
                                style={[styles.answerPercentText, answerRight ? styles.rightAnswerPercentText : null]}>{options_percent}%</Text>
                        </TouchableOpacity>
                    </View> : null
                }
            </View>
        );
    }

    _rightAnswer(answer) {
        answer = answer.replace(/,/g, ' ');
        console.log(answer);
        return answer;
    }

    render() {

        let rightView = typeof(this.props.info.answer_accuracy) != "undefined" ?
            <View style={styles.rightAnswerRight}>
                <TouchableOpacity onPress={()=> {
                    this._showOptionStudents('correct', this.props.taskId, this.props.test_number);
                }}>
                    <Text style={{
                        textAlign: 'center',
                        backgroundColor: 'transparent'
                    }}>{this.props.info.answer_accuracy}%</Text>
                </TouchableOpacity>
            </View> : null;

        let v = <View style={styles.rightAnswer}>
            <Text style={{color: '#fff', fontSize: 16,}}>
                正确答案：<Text style={{fontSize: 18}}>{this._rightAnswer(this.props.info.answer)}</Text>
            </Text>
            {rightView}
        </View>


        return (
            <View>
                <View style={styles.answer}>
                    {this._options(this.props.info.options_a, this.props.info.options_a_percent, 'A', this.props.info.answer, this.props.taskId, this.props.test_number)}
                    {this._options(this.props.info.options_b, this.props.info.options_b_percent, 'B', this.props.info.answer, this.props.taskId, this.props.test_number)}
                    {this._options(this.props.info.options_c, this.props.info.options_c_percent, 'C', this.props.info.answer, this.props.taskId, this.props.test_number)}
                    {this._options(this.props.info.options_d, this.props.info.options_d_percent, 'D', this.props.info.answer, this.props.taskId, this.props.test_number)}
                    {this._options(this.props.info.options_e, this.props.info.options_e_percent, 'E', this.props.info.answer, this.props.taskId, this.props.test_number)}
                    {this._options(this.props.info.options_f, this.props.info.options_f_percent, 'F', this.props.info.answer, this.props.taskId, this.props.test_number)}
                </View>
                {v}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    optionsWidth: {
        width: Dimensions.get('window').width - 40,
    },
    optionsWidth2: {
        width: Dimensions.get('window').width - 140,
    },
    rightAnswer: {
        backgroundColor: '#1cd99d',
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',

    },
    rightOptionsText: {
        color: '#4791ff'
    },
    rightAnswerRight: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 60,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        borderColor: '#ccff8a',
        backgroundColor: '#ccff8a',
        borderWidth: 1
    },
    line: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
    },
    answer: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    radio: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 15,
        paddingTop: 20,
        paddingBottom: 20,
    },
    rightRadio: {
        backgroundColor: '#fff',
    },
    radioText: {
        fontSize: 18,
    },
    answerPercent: {
        position: 'absolute',
        right: 15,
        top: 20,
        width: 60,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        borderColor: '#4b4b4b',
        borderWidth: 1
    },
    rightAnswerPercent: {
        backgroundColor: '#4791ff',
        borderColor: '#4791ff',
    },
    answerPercentText: {
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    rightAnswerPercentText: {
        color: '#fff',
        backgroundColor: 'transparent'
    },
});