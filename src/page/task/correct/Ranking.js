
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

const ScrollableTabView = require('./TabBar/tabbar');
import DisplayUtils from "../../../utils/DisplayUtils";
import RankItem from "./RankItem";

export default class Ranking extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    style={{flex:1}}
                    initialPage={0}
                    tabBarActiveTextColor='#4791ff'
                    tabBarInactiveTextColor='#6E6E6E'
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarTextStyle={{marginTop: 5, fontSize: 15}}
                    tabBarUnderlineStyle={styles.slider}
                >
                    {/*
                    <View tabLabel='班级排名1'>
                        <Text>Hello</Text>
                    </View>
                    <View tabLabel='班级排名2'>
                        <Text>Hello</Text>
                    </View>
                     */}
                    <RankItem
                        classId={this.props.classId}
                        taskId={this.props.taskId}
                        tabLabel='班级排名'
                        types={1}
                    />
                    <RankItem
                        classId={this.props.classId}
                        taskId={this.props.taskId}
                        tabLabel='综合排名'
                        types={2}
                    />

                </ScrollableTabView>
            </View>

        );
    }
}



const styles = StyleSheet.create({
    myClass: {
        color: '#fff',
        backgroundColor: '#ffa14e',
        paddingLeft:2,
        paddingRight: 2,
        marginLeft: 20,
    },
    liText: {
        fontSize: 20,
        marginRight: 20,
        marginTop: 9,
        color: '#ffa96f',
    },
    name: {
        marginTop: 5,
    },
    progress: {
        flexDirection:'row',
    },
    progressBar: {
        backgroundColor: '#4791ff',
        marginRight: 10,
        borderRadius: 10,
        height: 10,
        marginTop: 5,
    },
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 4 - 10,
        backgroundColor: '#4791ff',
        borderRadius: 2,
        borderWidth: 0,
    },
    scrollView: {
        minHeight: Dimensions.get('window').height - 135,
        backgroundColor: "#fff"
    },
    li: {
        backgroundColor:'#fff',
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection:'row',
        paddingBottom: 15,
        paddingTop: 15,
    },
    headimg: {
        width:45,
        height: 45,
        borderRadius: 22.5,
    },
    studentName: {
        height: 45,
        marginTop: 13,
        marginLeft: 20,
        color: '#4b4b4b',
    },
    phone: {

        width: 14,
        height: 16,
        marginTop: 14,

    },
    phoneView: {

        width:50,
        height: 45,
        position: 'absolute',
        right: 0,
    }
});