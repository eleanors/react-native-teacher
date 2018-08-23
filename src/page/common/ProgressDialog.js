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
    TouchableOpacity,
    Alert,
    ProgressBarAndroid,
    ProgressViewIOS,
    Platform
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
const width = DisplayUtils.SCREEN.width - 80;
export default class Loading extends Component {
    static defaultProps = {
        received: 0,
        total: 1
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
    }

    render() {
        let receivedMB = (this.props.received/1024/1024).toFixed(2);
        let totalMB = (this.props.total/1024/1024).toFixed(2);
        return (
            <View style={styles.root}>
                <View style={styles.view}>
                    <Text style={styles.title}>更新中，请勿关闭应用</Text>
                    <View style={styles.progress}>
                        {
                            Platform.select({
                                android: <ProgressBarAndroid
                                    styleAttr="Horizontal"
                                    progress={this.props.received/this.props.total}
                                    indeterminate={false}
                                    style={{flex:1}}/>,
                                ios: <ProgressViewIOS
                                    progress={this.props.received/this.props.total}
                                    style={{flex:1}}/>
                            })
                        }
                    </View>
                    <Text style={styles.info}>已下载：{receivedMB}MB，共{totalMB}MB</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        backgroundColor: "rgba(50,52,52,0.3)",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        width: width,
        height: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    progress:{
        flex:1,
        flexDirection:'row'
    },
    title: {
        fontSize: 20,
    },
    info:{
        fontSize: 14,
    }
});