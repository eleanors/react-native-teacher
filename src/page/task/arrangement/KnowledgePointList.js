/**
 * Created by heaton on 2018/1/18.
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
    Platform,
} from 'react-native';
import {
    ListRow,
    Theme,
} from 'teaset';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView, {EmptyType} from '../../../page/common/EmptyView';
import HttpUtils from '../../../utils/HttpUtils';
import DisplayUtils from '../../../utils/DisplayUtils';
import {API} from '../../../Config';

export default class KnowledgePointList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
        };
        // Theme.set({rowSeparatorLineWidth: 1})
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps --- ');
        if (nextProps.gradeType != this.props.gradeType || nextProps.subjectId != this.props.subject_id) {
            this.listView.scrollToOffset({y:0});
            setTimeout(() => this.listView.refresh(), 500);
        }
    }

    _fetchData(page, startFetch, abortFetch) {
        console.log(this.props);
        HttpUtils.request(API.GetKnowledge, {
            grade_type: this.props.gradeType,
            subject_id: this.props.subjectId,
            parent_id: this.props.parentId || ''
        }).then((data) => {
            console.log(data);
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });
            startFetch(data, 10);
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
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={() => this.listView.refresh()}
            />
        );
    }

    _renderFlatItem(item) {

        let numberDiv = <Text></Text>;
        let number = item.questions_count;
        if (this.props.parentId != null && this.props.parentId != 'undefined') {
            numberDiv = <Text style={styles.numberText}>{number}</Text>
        }
        return (
            <ListRow
                title={item.names}
                style={styles.listRow}
                bottomSeparator='none'
                topSeparator='none'
                accessory='indicator'
                detail={numberDiv}
                onPress={() => {
                    console.log(this.props.parentId);
                    if (this.props.parentId != null && this.props.parentId != 'undefined') {
                        console.log('parentId 不为空，跳转至题目列表页面');
                        /**
                         * parentId 不为空，跳转至题目列表页面
                         */
                        console.log(2222, item);
                        Actions.testList({
                            gradeType: this.props.gradeType,
                            subjectId: this.props.subjectId,
                            loredsId: item.id,
                            title: item.names,
                        });
                    } else {
                        Actions.knowledgeList({
                            title: item.names,
                            gradeType: this.props.gradeType,
                            subjectId: this.props.subjectId,
                            parentId: item.id
                        });
                    }
                }}
            />
        );
        return (
            <TouchableOpacity onPress={() => {
                console.log(this.props.parentId);
                if (this.props.parentId != null && this.props.parentId != 'undefined') {
                    console.log('parentId 不为空，跳转至题目列表页面');
                    /**
                     * parentId 不为空，跳转至题目列表页面
                     */
                    console.log(2222, item);
                    Actions.testList({
                        gradeType: this.props.gradeType,
                        subjectId: this.props.subjectId,
                        loredsId: item.id,
                        title: item.names,
                    });
                } else {
                    Actions.knowledgeList({
                        title: item.names,
                        gradeType: this.props.gradeType,
                        subjectId: this.props.subjectId,
                        parentId: item.id
                    });
                }
            }}>
                <View style={{
                    padding: 10,
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    borderColor: '#edecec',
                    borderBottomWidth: DisplayUtils.px2dp(1),
                }}>
                    <Text style={{color: '#272727', fontSize: 16, padding: 10, flex: 1}}>
                        {item.names}
                    </Text>
                    {numberDiv}
                    <Image
                        source={require('../../../images/item_go.png')}
                        style={{width: 20, height: 20}}
                        resizeMode='contain'/>
                </View>
            </TouchableOpacity>
        );
    }

    render() {

        let mt5 = 0;
        if (this.props.parentId != null && this.props.parentId != 'undefined') {
            mt5 = 0
        } else {
            mt5 = 5
        }

        return (
            <View style={{flex: 1, paddingTop: mt5, backgroundColor: '#ffffff'}}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    item={(item) => this._renderFlatItem(item)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    numColumns={1}
                    emptyView={() => this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1}}
                    pagination={false}
                    paginationFetchingView={() => {
                        return null
                    }}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    numberText: {
        fontSize: 15,
        color: '#ABAAAB'
    },
    listRow: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        marginBottom: 0.5,
    },
});