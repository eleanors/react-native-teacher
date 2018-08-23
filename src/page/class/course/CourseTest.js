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
import HttpUtils from "../../../utils/HttpUtils";
import {API} from '../../../Config';
import ExaminationItem from "../../task/ExaminationItem";
import EmptyView, {EmptyType} from '../../common/EmptyView';
import Touch from "../../public/Touch";
import ClassBiz from "../../../biz/ClassBiz";
import DisplayUtils from "../../../utils/DisplayUtils";

export default class CourseTest extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            list: [],
            num: 0,
            share: {
                share_title: '',
                share_desc: '',
                pdf_url: '',
            }
        };
    }

    refreshList() {
        this.listView.refresh();
        if (this.listView.getRows().length > 0) {
            this.listView.scrollToOffset({y:0});
        }
    }

    _fetchData(page, startFetch, abortFetch) {
        if(page === 2){
            return startFetch([]);
        }
        HttpUtils.request(API.GetCourseTestList, {
            id: this.props.info.id,
            page: 1,
        }).then(result => {
            console.log(result);
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });
            startFetch(result.questions, 10);
            this.setState({
                num: result.questions.length,
                share: result.share
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
                types={2}
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
                delTest={(id)=>{
                    console.log(123);
                    HttpUtils.request(API.DelCourseTest,{
                        id: id
                    }).then(res=>{
                        console.log(res);
                        this.listView.refresh();
                        ClassBiz.mustRefresh();
                    })
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

    _coursePrint(){
        Actions.shareBoard({
            shareInfo: {
                title: this.state.share.share_title,
                desc: this.state.share.share_desc,
                url: this.state.share.pdf_url,
                img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png'
            }
        });
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
                    allLoadedText=''
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    numColumns={1}
                    style={{flex: 1, backgroundColor: '#fff',marginTop: 10,}}
                    emptyView={() => this._renderEmptyView()}
                    paginationFetchingView={() => {
                        return null
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshableTitleRefreshing=''
                />
                <View style={styles.btnView}>
                    <View style={styles.btnView2}>
                        <Touch onPress={()=>{
                            // Todo
                            console.log('打印');
                            this._coursePrint();
                        }}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText}>打印</Text>
                            </View>
                        </Touch>
                    </View>
                    <View style={styles.btnView2}>
                        <Touch onPress={()=>{
                            Actions.reset('main');
                            setTimeout(() => {
                                Actions.jump('task');
                            }, 200);

                        }}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText}>去选题</Text>
                            </View>
                        </Touch>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#4791ff',
        width: 150,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btnView: {
        height: 70,
        width: Dimensions.get('window').width,
        position: 'absolute',
        backgroundColor: '#f5f5f5',
        bottom: 0,
        flexDirection: 'row',
        padding: 20,
    },
    btnView2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        backgroundColor: '#fff',
    },
    listTitle: {
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