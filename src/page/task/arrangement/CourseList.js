/**
 * Created by mac on 2018/3/20.
 * Desription :教材详情
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView, {EmptyType} from '../../../page/common/EmptyView';
import HttpUtils from '../../../utils/HttpUtils';
import DisplayUtils from '../../../utils/DisplayUtils';
import {API} from '../../../Config';


export default class CourseList extends Component {

    // 构造
    constructor(props) {
        super(props);
        console.log("lectureId:", this.props.lectureId);
        this.state = {
            emptyType: EmptyType.NO_DATA
        };
    }

    _fetchData(page, startFetch, abortFetch) {
        console.log(this.props);
        HttpUtils.request(API.GetLessonList, {
            lecture_id: this.props.lectureId,
        }).then((data) => {
            console.log(data);
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });
            startFetch(data.lesson_list, 10);
        }).catch((err) => {
            console.log(err);
            this.setState({
                emptyType: EmptyType.REQUEST_ERROR,
            });
            abortFetch();
        })
    }

    _renderEmptyView() {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    }

    _renderFlatItem(item, index) {
        let number = index + 1;
        return (
            <TouchableOpacity onPress={() => {
                {/*console.log("item", item);*/
                }
                Actions.selectSubject({
                    lectureId: this.props.lectureId,
                    lectureName: this.props.lectureName,
                    lessonId: item.lesson_id,
                    lessonName: item.lesson_name,
                });

            }}>
                <View style={{
                    padding: 10,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <Text style={{color: '#272727', fontSize: 16, marginLeft: 10}}>{number}.</Text>
                    <Text style={{color: '#272727', fontSize: 16, padding: 10, flex: 1, paddingLeft: 5}}>
                        {item.lesson_name}
                    </Text>
                    <Image
                        source={require('../../../images/item_go.png')}
                        style={{width: 20, height: 20}}
                        resizeMode='contain'/>
                </View>
            </TouchableOpacity>
        );
    }


    _renderListHeader() {
        return (
            <View>
                <View style={{
                    backgroundColor: '#fff',
                }}>
                    <Text style={{
                        padding: 15,
                        backgroundColor: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>{this.props.lectureName}</Text>
                </View>
                <View style={styles.divideLine}/>
            </View>
        );
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F8F8FD'}}>
                <UltimateListView
                    header={() => this._renderListHeader()}
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderFlatItem(item, index)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    numColumns={1}
                    emptyView={()=>this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1}}
                    pagination={false}
                    paginationFetchingView={()=>{return null}}
                    separator={() => {
                        return (
                            <View style={{
                                marginLeft: 10,
                                height: DisplayUtils.MIN_LINE_HEIGHT,
                                backgroundColor: '#F1F0F0',
                            }}/>
                        );
                    }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
    },
});