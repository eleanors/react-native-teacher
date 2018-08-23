'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity, Dimensions,
    Switch,
} from 'react-native';
import DisplayUtils from "../../../utils/DisplayUtils";
import TextUtils from "../../../utils/TextUtils";
import {
    Actions,
} from 'react-native-router-flux';
import Touch from "../../public/Touch";
import {UltimateListView} from 'react-native-ultimate-listview';
import {API} from "../../../Config";
import HttpUtils from "../../../utils/HttpUtils";
import EmptyView, {EmptyType} from  '../../common/EmptyView';

export default class RankItem extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            list: [],
            onlyClass: false,
            student_count: 0
        };
        console.log(this.props);
    }

    _renderEmptyView() {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={() => this.listView.refresh()}/>
        );
    }


    _fetchData(page, startFetch, abortFetch) {
        console.log('this.props', this.props);
        if (!this.state.onlyClass) {
            HttpUtils.request(API.getLeagueClassRank, {
                class_id: this.props.classId,
                task_id: this.props.taskId,
                page: page,
                type: this.props.types,
                page_size: 10
            }).then(result => {
                console.log(333, result);
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });

                startFetch(result.student_list, 10);
                if (result.student_count) {
                    this.setState({
                        student_count: result.student_count
                    })
                }
            }).catch((err) => {
                console.log(err);
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
        } else {
            HttpUtils.request(API.getLeagueIsClass, {
                class_id: this.props.classId,
                task_id: this.props.taskId,
                page: page,
                type: this.props.types,
                page_size: 10,
                is_class: 1
            }).then(result => {
                console.log(333, result);
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });

                startFetch(result.student_list, 10);
            }).catch((err) => {
                console.log(err);
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
        }
    }

    _renderFlatItem(item, index) {
        console.log(123, item);
        let imgUri = TextUtils.isEmpty(item.img_url) ? require('../../../images/head_student.png') : {uri: item.img_url};
        let width = progressWidth * item.student_accuracy / 100;
        return (
            <View style={styles.li} key={index}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.liText}>{item.accuracy_index}</Text>
                    <View>
                        <Image source={imgUri} style={styles.headimg}/>
                    </View>
                </View>
                <View style={{marginLeft: 20}}>
                    <Text style={styles.name}>
                        {item.user_name} {(item.is_class === 1)
                        ? <Text style={styles.myClass}> 本班 </Text>
                        : null
                    }
                    </Text>
                    <View style={styles.progress}>
                        <View style={[styles.progressBar, {width: width}]}></View>
                        <Text>{item.student_accuracy}%</Text>
                    </View>
                </View>
            </View>
        );
    }

    _renderHeader() {
        if (this.props.types === 2) {
            return (
                <View style={styles.titles}>
                    <Text style={{fontSize: 16}}>只显示本班学生（全部<Text>{this.state.student_count}</Text>人）</Text>
                    <Switch
                        style={styles.switchBtn}
                        //动态改变value
                        value={this.state.onlyClass}
                        //当切换开关室回调此方法
                        onValueChange={(value) => {
                            this.setState({onlyClass: value});
                            setTimeout(() => {

                                this.listView.refresh();
                            }, 100);

                        }}
                    />
                </View>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <View style={{flex: 1, paddingTop: this.props.types == 2 ? 0 : 15}}>
                <UltimateListView
                    header={() => this._renderHeader()}
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderFlatItem(item, index)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    allLoadedText='已经是最后一页了'
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    numColumns={1}
                    style={{flex: 1,}}
                    emptyView={() => this._renderEmptyView()}
                    paginationFetchingView={() => {
                        return null
                    }}
                    showsVerticalScrollIndicator={false}/>
            </View>
        );
    }
}


const progressWidth = Dimensions.get('window').width - 180;

const styles = StyleSheet.create({
    switchBtn: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    titles: {
        padding: 15,
    },
    myClass: {
        color: '#fff',
        backgroundColor: '#ffa14e',
        paddingLeft: 2,
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
        flexDirection: 'row',
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
        backgroundColor: '#fff',
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15,
    },
    headimg: {
        width: 45,
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

        width: 50,
        height: 45,
        position: 'absolute',
        right: 0,
    }

});