/**
 * Created by heaton on 2017/12/18.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';

export default class Loading extends Component {
    static defaultProps = {
        msg: '数据加载中。。。'
    };

    render() {
        return (
            <View style={styles.loading}>
                <Image source={require('../../images/loading.gif')} style={styles.image}/>
                <Text style={styles.text}>{this.props.msg}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    loading: {
        width: 120,
        height: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius:10,
        borderColor:'#f0f0f0',
        borderWidth:DisplayUtils.px2dp(1)
    },
    image: {
        width: 60,
        height: 60
    },
    text: {
        fontSize: 12,
    }
});