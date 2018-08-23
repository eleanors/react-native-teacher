//查看原题
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import AHWebView from "../../common/AHWebView";
import Touch from "../../public/Touch";
import {Actions} from "react-native-router-flux";
import ShareBoard from "../../common/ShareBoard";
import SubjectItem from '../Subject/SubjectItem';
import DisplayUtils from '../../../utils/DisplayUtils';


export default class OriginalTest extends Component {
    // 构造
    constructor(props) {
        super(props);
    }


    _onRight(){
        Actions.pop();
    }

    render() {
        console.log("查看原题？");
        return (
            <View style={{flex:1}}>
                <SubjectItem
                    style={{height:DisplayUtils.SCREEN.height}}
                    taskId={this.props.taskId}
                    test_number={this.props.testNumber}
                    markValue = {1}
                    fullScreen={status=>{
                        Actions.refresh({
                            hideNavBar : status
                        });
                        this.setState({
                            locked: status
                        });
                    }}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    close: {
        marginTop: 40,
        alignItems: 'flex-end',
        paddingRight: 20,
    },
    closeImg: {
        width: 16,
        height: 16,
    },
    success: {
        marginTop: 60,
        alignItems: 'center',
    },
    successImg: {
        width: 135,
        height: 220,
    },
    successTextView: {
        marginTop: 20,
    },
    successText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    successDesc: {
        marginTop: 10,
        textAlign: 'center'
    },
    successDescSpan: {
        color: '#ff8a2b'
    },
    buttonView: {
        width: 180,
        height: 70,
        backgroundColor: '#1cd99d',
        marginTop: 60,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
});