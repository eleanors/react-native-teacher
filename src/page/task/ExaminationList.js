'use strict';
// 知识点试题列表
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from "../../utils/HttpUtils";
import {API} from '../../Config';
import ExaminationItem from "./ExaminationItem";
import EmptyView, {EmptyType} from '../common/EmptyView';
import DisplayUtils from "../../utils/DisplayUtils";

export default class ExaminationList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            list: [],
            num: 0,
        };
    }

    refreshList() {
        this.listView.refresh();
        if (this.listView.getRows().length > 0) {
            this.listView.scrollToOffset({y:0});
        }
    }

    _fetchData(page, startFetch, abortFetch) {
        HttpUtils.request(API.getKnowledgeDetails, {
            loreds_id: this.props.loreds_id,
            subject_id: this.props.subject_id,
            difficulty_id: this.props.difficulty_id,
            grade_type: this.props.grade_type,
            isopt: this.props.isopt,
            page: page,
        }).then(result => {
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });
            startFetch(result.list, 10);
            if (result.count) {
                this.props.num(result.count);
            }
            this.setState({
                num: result.count
            })
        }).catch(err => {
            this.setState({
                emptyType: EmptyType.REQUEST_ERROR,
            });
            abortFetch();
        });
    }

    _renderFlatItem(item, index) {
        return (
            <ExaminationItem
                item={item}
                index={index}
                itemPress={() => {
                    Actions.subjectItem({
                        cloudSubjectId: item.cloud_subject_id,
                        cloudTestId: item.cloud_test_id,
                        types: 2,
                        keys: index + 1,
                        counts: this.state.num,
                    });
                }}
            />
        );
    }


    _renderEmptyView() {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    }
    _renderHeader(){
        return (
            <View style={styles.listTitle}>
                <Text style={styles.textLeft}>全部题目（{this.state.num}）</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/**/}
                <UltimateListView
                    header={()=>this._renderHeader()}
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderFlatItem(item, index)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    allLoadedText='已经是最后一页了'
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    numColumns={1}
                    style={{flex: 1, backgroundColor: '#f5f5f5',}}
                    emptyView={() => this._renderEmptyView()}
                    paginationFetchingView={() => {
                        return null
                    }}
                    showsVerticalScrollIndicator={false}/>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    item: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        backgroundColor: '#fff',
    },
    listTitle: {
        marginTop: 15,
        backgroundColor: '#fff',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        flexDirection: 'row',
    },
    textLeft: {
        color: '#b5b5b5',
        textAlign: 'left',
        width: (Dimensions.get('window').width - 30) / 2,
    },
});