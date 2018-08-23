/**
 * Created by mac on 2018/4/13.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DisplayUtils from '../../utils/DisplayUtils';

const width = DisplayUtils.SCREEN.width - 80;
export default class PopupStudent extends Component {
    static defaultProps = {};

    onClick() {
        Actions.pop();
    }

    _renderFinishListItem(list) {

        if (list){
            return list.map((item,k) => {
                console.log(item.student_name);
                return (
                    <Text key={k} style={{
                        fontSize: 16,
                        color: '#626366',
                        padding: 3
                    }}>
                        {item.student_name}
                    </Text>
                );
            });
        }

    }


    render() {

        console.log("option", this.props.option);
        console.log("option_percent", this.props.option_percent);
        console.log("option_selected_count", this.props.option_selected_count);
        console.log("student_list", this.props.student_list);

        return (
            <View style={styles.root}>
                <View style={styles.view}>
                    <View style={{
                        flexDirection: 'row',
                        padding: 13,
                        borderBottomWidth: DisplayUtils.px2dp(1),
                        borderColor: '#edecec'
                    }}>
                        <View style={{
                            backgroundColor: '#EBEAEB',
                            borderRadius: 10,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                backgroundColor: 'transparent',
                                color: '#65686F',
                                fontSize: 13,
                                paddingBottom: 4,
                                paddingTop: 4,
                                paddingLeft: 8,
                                paddingRight: 8,

                            }}>选项{this.props.option}</Text>
                        </View>
                        <Text style={{
                            color: '#0D65FF',
                            fontSize: 16,
                            marginLeft: 10
                        }}>{this.props.option_selected_count}人 {this.props.option_percent}%</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={true}>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingTop: 7,
                            paddingBottom: 7,
                            paddingLeft: 12,
                            paddingRight: 12
                        }}>
                            {this._renderFinishListItem(this.props.student_list)}
                        </View>
                    </ScrollView>
                    <View style={{
                        margin: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={this.onClick.bind(this)} style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#2FC985',
                            height: 50,
                            width: 120,
                            borderRadius: 25,
                        }}>
                            <Text style={[styles.buttonText, {color: 'white'}]}>确定</Text>

                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        backgroundColor: "rgba(0,0,0,0.5)",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        flex: 1,
        width: width,
        maxHeight: 200,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginTop: -100,
    },
});