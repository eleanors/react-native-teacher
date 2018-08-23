/**
 * Created by mac on 2018/1/4.
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
} from 'react-native';
import Touch from '../../component/Touch';
import {Actions} from "react-native-router-flux";
import DisplayUtils from '../../utils/DisplayUtils';

export default class Mask extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.shareBoard}>
                    <Touch style={styles.action} onPress={() => {
                        Actions.pop()
                    }}>
                        <Text style={styles.title}>取消</Text>
                    </Touch>
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({

    root: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    shareBoard: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        height: DisplayUtils.SCREEN.height * 0.3,
        width: DisplayUtils.SCREEN.width * 0.7,
        top: DisplayUtils.SCREEN.height * 0.2,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        padding: 5
    },
    action: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});