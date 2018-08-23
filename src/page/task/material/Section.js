/**
 * 教材
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
    Platform,
    Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import FavoriteList from '../../task/arrangement/FavoriteList';
import KnowledgePointList from '../../task/arrangement/KnowledgePointList';
import TeachingMaterialList from '../../task/arrangement/TeachingMaterialList';
import {Overlay} from 'teaset';
import HttpUtils from '../../../utils/HttpUtils';
import {API, StorageKeys} from '../../../Config';
import DisplayUtils from '../../../utils/DisplayUtils';
import ClickSubject from "../../account/ClickSubject";
import TaskBiz from '../../../biz/TaskBiz';
import ScrollableTabView from '../../task/correct/TabBar/tabbar';
import {EmptyType} from "../../common/EmptyView";
import SectionRows from "./SectionRows";

export default class Section extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: {
                courses: []
            }
        };
        Actions.refresh({title:this.props.info.name});
        HttpUtils.request(API.GetBookCateList, {
            id: this.props.info.id,
            page: 1
        }).then((data) => {
            console.log('data:',data);
            // this.data = data;
            this.setState({
                data: data
            })
        }).catch((err) => {
            console.log(err);
        })
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    initialPage={0}
                    tabBarActiveTextColor='#0E67FF'
                    tabBarInactiveTextColor='#6E6E6E'
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarTextStyle={{marginTop: 5, fontSize: 15}}
                    tabBarUnderlineStyle={styles.slider}>
                    <SectionRows
                        tabLabel="电子试题"
                        data={this.state.data}
                        type={1}
                    />
                    <SectionRows
                        tabLabel="教材讲义"
                        data={this.state.data}
                        type={2}
                    />
                    <SectionRows
                        tabLabel="课堂实录"
                        data={this.state.data}
                        type={3}
                    />
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 6 - 10,
        backgroundColor: '#0E67FF',
        borderRadius: 2,
    }
});