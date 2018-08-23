/**
 * Created by heaton on 2018/4/9.
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
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
import {Actions} from 'react-native-router-flux';
import zhCn from '../../../node_modules/rmc-date-picker/lib/locale/zh_CN';
import DatePicker from 'rmc-date-picker';
import moment from 'moment';
export default class DatePickerDialog extends Component {

    static defaultProps = {
        title: '请选择日期',
        mode: 'date',
        selectedDate: moment().toDate(),
        minDate: moment('1960-01-01').toDate(),
        maxDate: moment('2050-01-01').toDate(),
        minuteStep: 1,
        onConfirm:()=>{}
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currDate:this.props.selectedDate,
        };
    }

    render() {
        const {title, selectedDate, minDate, maxDate, minuteStep, mode,onConfirm} = this.props;
        return (
            <View style={styles.root}>
                <TouchableOpacity style={{
                    width: DisplayUtils.SCREEN.width,
                    height: DisplayUtils.SCREEN.height - 250
                }} onPress={() => {
                    Actions.pop()
                }}>
                </TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={()=>Actions.pop()}>
                            <View style={styles.cancelView} >
                                <Text style={styles.cancelText}>取消</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>{title}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>{
                            onConfirm(this.datePicker.getDate());
                            Actions.pop();
                        }}>
                            <View style={styles.confirmView}>
                                <Text style={styles.confirmText}>确认</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <DatePicker
                        ref={ref=>this.datePicker = ref}
                        defaultDate={selectedDate}
                        date={this.state.currDate}
                        locale={zhCn}
                        minDate={minDate}
                        maxDate={maxDate}
                        minuteStep={minuteStep}
                        mode={mode}
                        onDateChange={(date)=>this.setState({currDate:date})}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    container: {
        width: DisplayUtils.SCREEN.width,
        height: 250,
        backgroundColor: '#ccc'
    },
    header: {
        height: 50,
        backgroundColor: '#ffffff',
        flexDirection: 'row'
    },
    cancelView: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelText: {
        color: '#2c2c2c',
        fontSize: 16,
    },
    titleView: {
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: '#0c0c0c',
        fontSize: 16
    },
    confirmView: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmText: {
        color: 'blue',
        fontSize: 16,
    }
});