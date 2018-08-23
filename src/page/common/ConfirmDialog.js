/**
 * Created by heaton on 2017/12/18.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Dimensions,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DisplayUtils from '../../utils/DisplayUtils';

const width = DisplayUtils.SCREEN.width - 80;
export default class ConfirmDialog extends Component {
    static defaultProps = {
        title: '是否确认',
        buttons: ["取消", "确认"],
        message: '',
        onClick: () => {
        }
    };

    onClick(index) {
        console.log('index --- ' + index);
        Actions.pop();
        this.props.onClick(index);
    }

    render() {

        let buttonViews = this.props.buttons.map((item, index) => {
            let textColor = index == 0 ? '#ff5b5b' : '#ccc';
            let borderRightWidth = index == this.props.buttons.length - 1 ? 0 : DisplayUtils.px2dp(1);
            return (
                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={this.onClick.bind(this, index)}
                    key={item}>
                    <View style={[styles.button, {
                        borderRightWidth: borderRightWidth,
                        borderRightColor: '#ccc',
                        margin: 1
                    }]}>
                        <Text style={[styles.buttonText, {color: textColor}]}>{item}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
        return (

            <View style={styles.root}>
                <View style={styles.view}>
                    <View style={styles.textView}>
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.message}>{this.props.message}</Text>
                    </View>
                    <View style={styles.buttonRoot}>
                        {buttonViews}
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    textView: {
        width:width,
        alignItems: 'center',
    },
    root: {
        backgroundColor: "rgba(0,0,0,0.3)",
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
        // maxHeight: 170,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: -100,
    },
    title: {
        padding: 10,
        fontSize: 20,
        color: '#4791ff',
        paddingTop: 20,
    },
    message: {
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    buttonRoot: {
        width: width,
        flexDirection: 'row',
        borderTopWidth: DisplayUtils.px2dp(1),
        borderTopColor: '#ccc',
        marginTop: 3
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    buttonText: {
        fontSize: 18,
        color: '#ccc',
    }
});