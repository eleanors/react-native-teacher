/**
 * Created by heaton on 2018/1/22.
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
import {Actions} from 'react-native-router-flux';
import DisplayUtils from '../../utils/DisplayUtils';
const SCREEN = DisplayUtils.SCREEN;
export const EmptyType = {
    NO_DATA: 1,
    REQUEST_ERROR: 2
};
export default class EmptyView extends Component {

    static defaultProps = {
        clickText: '重新加载',
        onClick: () => {
        },
        emptyType: EmptyType.REQUEST_ERROR,
        requestErrorStr:'加载失败，点击重新加载',
        noDataStr:'暂无数据',
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {noDataStr, clickText, onClick, emptyType, requestErrorStr} = this.props;
        let imageSource = emptyType == EmptyType.NO_DATA
            ? require('../../images/no_data.png')
            : require('../../images/request_error.png');
        return (
            <View style={styles.root}>
                <Image source={imageSource} style={{width: 150, height: 150, backgroundColor: 'transparent'}}/>
                <View style={styles.descRoot}>
                    <Text style={styles.desc}>
                        {emptyType == EmptyType.NO_DATA ? noDataStr : requestErrorStr}
                    </Text>
                </View>
                {
                    emptyType == EmptyType.NO_DATA ? (
                        null
                    ) : (
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 50,
                            width: 100,
                            backgroundColor: '#3979FF',
                            borderRadius: 8
                        }} onPress={onClick}>
                            <Text style={styles.clickText}>{clickText}</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'transparent'
    },
    descRoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'transparent'
    },
    desc: {
        fontSize: 16,
        color: '#B9BABA',
        marginTop: 15,
    },
    clickText: {
        color: 'white',
        fontSize: 16,
    }
});