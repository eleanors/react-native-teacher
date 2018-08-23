
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    ScrollView,
    ToastAndroid, Dimensions, PixelRatio
} from 'react-native';
import {Actions} from "react-native-router-flux";
import Touch from "../../public/Touch";
import HttpUtils from "../../../utils/HttpUtils";
import moment from "moment/moment";
import {API} from "../../../Config";
import SubjectItem from "./SubjectItem";
const ScrollableTabView = require('../correct/TabBar/tabbar');
import {Overlay} from 'teaset';
import AnswerCard from "./AnswerCard";
import AudioPlayUtils from "../../../utils/AudioPlayUtils";
import Http from "../../../utils/HttpUtils";

export default class SubjectList extends Component {
    itemRefs = [];

    // 构造
    constructor(props) {
        super(props);
        let info = this.props.info;
        let list = [];
        list = list.concat(info.choice_list,info.multi_choice_list,info.solve_list);
        this.state = {
            info: info,
            list: list,
            test_info: this.props.test_info,
            activeTab: this.props.test_info.key+1,
            locked: false,
        };
    }



    //本函数在测试过程中发现有问题，暂时关闭调用-------张佳迪2018年5月16日
    updateInfo(info){
        console.log('subjectList -- updateInfo',info);
        this.setState({
            info:info
        })
    }

    static ref;

    onRightError(){
        Actions.subjectError({info: this.state.test_show});
    }

    onRightCollect(){
        let data = [
            {
                cloud_subject_id: this.state.test_show.cloud_data.cloud_subject_id,
                cloud_test_id: this.state.test_show.cloud_data.cloud_test_id,
                test_type: this.state.test_show.test_type,
            }
        ];
        Actions.myCollection({meSeletedArr: data});
    }

    _testType(type){
        switch (type){
            case 1:
                return '单选题';
            case 2:
                return '多选题';
            case 3:
                return '解答题';
            default:
                return '';
        }
    }



    _renderList(list){
        return list.map((item,k)=>{
            return (
                <View tabLabel={k} key={k} style={{flex:1}}>
                    <SubjectItem
                        ref={ref=>this.itemRefs[k]=ref}
                        taskId={this.state.info.task_id}
                        test_number={item.test_number}
                        cb={(res)=>{
                            let list = this.state.list;
                            list[k].test_type = res.test_type;
                            this.setState({
                                list: list,
                                test_show: res
                            });
                        }}
                        types={1}
                        fullScreen={status=>{
                            Actions.refresh({
                                hideNavBar : status
                            });
                            this.setState({
                                locked: status
                            });
                        }}
                        closeAll={(res)=>{
                            this._itemThis = res;
                        }}
                    />
                </View>
            );
        });
    }

    //答题卡
    _showCard(){
        console.log('_showCard',this.state.info);
        Actions.answerCard({
            info: this.state.info,
            types: 2,
            replace: (res)=>{
                this.ref.goToPage(res);
            }
        });
    }



    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    initialPage={this.state.test_info.key}
                    tabBarActiveTextColor='#4791ff'
                    tabBarInactiveTextColor='#6E6E6E'
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarTextStyle={{display: 'none'}}
                    tabBarUnderlineStyle={{display: 'none'}}
                    style={{backgroundColor: '#fff',}}
                    locked={this.state.locked}
                    renderTabBar={(val)=>{
                        this.ref = val;
                        return (
                            (!this.state.locked ?
                                <View style={styles.title}>
                                    <Text style={styles.titleNum}>{this.state.activeTab}</Text>
                                    <Text style={styles.titleNum2}>/{this.state.info.task_test_count}</Text>
                                    <Text style={styles.titleType}>  {this._testType(this.state.list[val.activeTab].test_type)}</Text>
                                    <Touch style={styles.answerCardView} onPress={()=>{
                                        this._showCard();
                                    }}>
                                        <Text style={styles.answerCard}>答题卡</Text>
                                    </Touch>
                                </View>
                                : <View></View>
                            )
                        );
                    }}
                    onChangeTab={(f)=>{
                        AudioPlayUtils.stop();
                        this.setState({
                            activeTab: f.i+1
                        });
                        if(this.itemRefs[f.from]){
                            this.itemRefs[f.from].stopPlayVideo();
                        }
                        if(this._itemThis && this._itemThis.state.voice_list && this._itemThis.state.voice_list.voice){
                            let list = this._itemThis.state.voice_list.voice;
                            for(let i in list){
                                list[i].play = false;
                            }
                            this._itemThis.setState({
                                voice_list: this._itemThis.state.voice_list
                            });
                        }
                    }}
                >
                    {this._renderList(this.state.list)}
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    overlayView: {
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#fff'
    },
    title: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 20,
        width: Dimensions.get('window').width,
    },
    titleNum: {
        color: '#4791ff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    titleNum2: {
        color: '#b5b5b5',
        marginTop: 10,
    },
    titleType: {
        marginTop: 8,
        color: '#4791ff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    answerCardView: {

        position: 'absolute',
        right: 15,
        top: 0,
    },
    answerCard: {
        color: '#4791ff',
        fontSize: 16,
        fontWeight: 'bold',
        width: 80,
        height: 50,
        textAlign: 'right',
        paddingTop: 16,
    },
});