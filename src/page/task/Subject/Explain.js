
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


export default class Explain extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log('props',this.props);
    }


    render() {

        let answer = '';
        if(this.props.info.material_from && this.props.info.material_from.length > 0) {
            for (let i in this.props.info.material_from) {
                let num = parseInt(i) + 1;
                answer += '<div style="margin-bottom: 10px;overflow: hidden"><div style="width: 10%;float: left">('+ num +')</div><div style="width: 90%;float:left;">' + this.props.info.material_from[i].answer + '</div></div><br/>';
            }
        }
        return (
            <View>
                {(this.props.info.answer || answer !== '') ?
                    <View>
                        <View style={[styles.line,{paddingBottom:20}]}>
                            <View style={styles.videoTitle}>
                                <View style={styles.AnaswerTitleLine}>
                                </View>
                                <Text style={[styles.videoTitleText,{marginTop: 3}]}>答案</Text>
                            </View>
                        </View>
                        <AHWebView
                            html={this.props.info.answer + answer}
                            viewStyle={{width: Dimensions.get('window').width-30,marginLeft:15,}}
                            webStyle={{width: Dimensions.get('window').width-30}}
                        />
                    </View>
                    :
                    null
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({

    videoTitle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10,
        paddingLeft: 15,
    },
    videoTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    AnaswerTitleLine: {
        width: 3,
        height: 15,
        backgroundColor: '#4791ff',
        marginTop: 4,
        borderRadius: 5,
        marginRight: 10,
    },

});