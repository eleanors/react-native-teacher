/**
 * Created by heaton on 2017/12/19.
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
    Platform,
    Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import FavoriteList from '../task/arrangement/FavoriteList';
import KnowledgePointList from '../task/arrangement/KnowledgePointList';
import TeachingMaterialList from '../task/arrangement/TeachingMaterialList';
import {Overlay} from 'teaset';
import HttpUtils from '../../utils/HttpUtils';
import {API, StorageKeys} from '../../Config';
import DisplayUtils from '../../utils/DisplayUtils';
import ClickSubject from "../account/ClickSubject";
import TaskBiz from '../../biz/TaskBiz';
import FavoriteBiz from "../../biz/FavoriteBiz";
import GlobalFloatUtils from "../../utils/GlobalFloatUtils";
import ScrollableTabView from '../task/correct/TabBar/tabbar';
import {observer} from 'mobx-react';
import TutorList from "../task/Tutor/TutorList";

@observer
export default class Task extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        TaskBiz.syncServer();
        console.log('task constructor', this.props);
        this.state = {
            subjectAndGradeData: [],
            gradeType: global.subjectAndGrade.gradeType,
            subjectId: global.subjectAndGrade.subjectId
        };
    }

    _onEnter() {
        console.log('task _onEnter');
        Actions.refresh({title:global.subjectAndGrade.name});
        if (FavoriteBiz.mustRefresh) {
            this.favoriteList.refreshList();
        }
    }

    _showPopover() {
        /**
         * 显示学段科目选择框
         */
        GlobalFloatUtils.dismissFloat();
        console.log(1, this.state.subjectAndGradeData);
        this.overlayView = (
            <Overlay.PullView
                side='bottom'
                modal={false}
                onDisappearCompleted={() => GlobalFloatUtils.showFloat({num: TaskBiz.testCount})}>
                <ClickSubject
                    callbackParent={(subject_name, subject_id, grade_type) => {
                        console.log(subject_name, subject_id, grade_type);
                        Overlay.hide(this.state.key);

                        Actions.refresh({title: subject_name});
                        this.setState({
                            gradeType: grade_type,
                            subjectId: subject_id
                        });
                        global.subjectAndGrade = {
                            gradeType: grade_type,
                            subjectId: subject_id,
                            name:subject_name,
                        };
                        storage.save({
                            key:StorageKeys.DefaultSubjectAndGradeKey,
                            data:{
                                gradeType: grade_type,
                                subjectId: subject_id,
                                name:subject_name,
                            }
                        });

                        GlobalFloatUtils.showFloat({num: TaskBiz.testCount});
                    }}
                    list={this.state.subjectAndGradeData}
                    grade_type={this.state.gradeType}
                    subject_id={this.state.subjectId}
                />
            </Overlay.PullView>
        );

        let key = Overlay.show(this.overlayView);

        this.setState({
            key: key
        });

    }

    componentDidMount() {
        /**
         * 获取学段科目数据,并依据 userInfo 设置默认选中的学段及科目
         */
        this._fetchSubjectAndGradeData();
    }

    _fetchSubjectAndGradeData() {
        HttpUtils.request(API.getSubject)
            .then((data) => {
                this.setState({
                    subjectAndGradeData: data
                });
            })
            .catch((err) => {
                console.log('err', err);
            });
    }

    render() {
        console.log('Task render ', this.state);
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    initialPage={0}
                    tabBarActiveTextColor='#0E67FF'
                    tabBarInactiveTextColor='#6E6E6E'
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarTextStyle={{marginTop: 5, fontSize: 15}}
                    tabBarUnderlineStyle={styles.slider}>
                    <KnowledgePointList
                        tabLabel="知识点"
                        gradeType={this.state.gradeType}
                        subjectId={this.state.subjectId}/>
                    <TutorList
                        tabLabel="教辅"
                        gradeType={this.state.gradeType}
                        subjectId={this.state.subjectId}/>
                    <TeachingMaterialList
                        tabLabel="教材"
                        gradeType={this.state.gradeType}
                        subjectId={this.state.subjectId}/>
                    <FavoriteList
                        tabLabel="收藏"
                        gradeType={this.state.gradeType}
                        subjectId={this.state.subjectId}
                        ref={ref => this.favoriteList = ref}/>
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 8 - 10,
        backgroundColor: '#0E67FF',
        borderRadius: 2,
    }
});