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
import {Actions} from 'react-native-router-flux';
import DisplayUtils from "../../../utils/DisplayUtils";


export default class Radio extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log('props', this.props);
    }

    static defaultProps = {
        noPercent: false
    };


    _radioOptions(options_html, options_percent, options, answer, taskId, test_number) {

        if (!options_html) {
            return null;
        }
        let answerRight = false;
        if (options === answer || answer.indexOf(options) >= 0) {
            answerRight = true;
        }
        return (

            < View style={[styles.radio, answerRight ? styles.rightRadio : null]}>
                <View style={{width: 20}}>
                    <Text style={styles.radioText}>{options}.</Text>
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
                    <View
                        style={[styles.answerPercent, answerRight ? styles.rightAnswerPercent : null]}>
                        <TouchableOpacity onPress={() => {

                            if (!taskId && !test_number) {
                                return;
                            } else {
                                HttpUtils.request(API.GetOptionStudentList, {
                                    task_id: taskId,
                                    test_number: test_number,
                                    option: options,
                                })
                                    .then((data) => {

                                        console.log(data)
                                        //显示弹出视图

                                        Actions.popupStudent({
                                            option: data.option,
                                            option_percent: data.option_percent,
                                            option_selected_count: data.option_selected_count,
                                            student_list: data.student_list,
                                        })

                                    })
                                    .catch((err) => {

                                    });
                            }
                        }}>
                            <Text
                                style={[styles.answerPercentText, answerRight ? styles.rightAnswerPercentText : null]}>{options_percent}%</Text>
                        </TouchableOpacity>
                    </View> : null
                }
            </View>

        );
    }


    render() {
        return (
            <View style={styles.answer}>
                {this._radioOptions(this.props.info.options_a, this.props.info.options_a_percent, 'A', this.props.info.answer, this.props.taskId, this.props.test_number)}
                {this._radioOptions(this.props.info.options_b, this.props.info.options_b_percent, 'B', this.props.info.answer, this.props.taskId, this.props.test_number)}
                {this._radioOptions(this.props.info.options_c, this.props.info.options_c_percent, 'C', this.props.info.answer, this.props.taskId, this.props.test_number)}
                {this._radioOptions(this.props.info.options_d, this.props.info.options_d_percent, 'D', this.props.info.answer, this.props.taskId, this.props.test_number)}
                {this._radioOptions(this.props.info.options_e, this.props.info.options_e_percent, 'E', this.props.info.answer, this.props.taskId, this.props.test_number)}
                {this._radioOptions(this.props.info.options_f, this.props.info.options_f_percent, 'F', this.props.info.answer, this.props.taskId, this.props.test_number)}
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
        backgroundColor: '#dae9ff',
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
        backgroundColor: 'transparent',
    },
    rightAnswerPercentText: {
        color: '#fff',
        backgroundColor: 'transparent',
    },
});