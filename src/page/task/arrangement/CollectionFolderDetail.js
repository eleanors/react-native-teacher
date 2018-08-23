/**
 * Created by mac on 2018/3/12.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    WebView,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Touch from "../../public/Touch";
import {UltimateListView} from 'react-native-ultimate-listview';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from '../../../Config';
import DisplayUtils from "../../../utils/DisplayUtils";
import AutoHeightWebView from "react-native-autoheight-webview";
import TaskBiz from '../../../biz/TaskBiz';
import EmptyView,{EmptyType} from  '../../common/EmptyView';
import ExaminationItem from "./../ExaminationItem";
import ClassBiz from '../../../biz/ClassBiz';
import TextUtils from '../../../utils/TextUtils';
import Toast from '../../../utils/Toast';
import TestListBiz from "../../../biz/TestListBiz";

export default class CollectionFolderDetail extends Component {

    // 构造
    constructor(props) {
        super(props);
        console.log(this.props);
        if (this.props.index == 0) {
            Actions.refresh({
                rightButton: ()=> {
                    return null;
                }
            });
        }

        this.state = {
            emptyType:EmptyType.NO_DATA,
            list: [],
            show: false,
            StoreName: this.props.title,
        };
    }

    _onEnter(){
        if(TestListBiz.mustRefresh){
            setTimeout(()=>this.listView.refresh(),200);
            TestListBiz.setMustRefresh(false);
        }
    }

    onRight(...props) {
        console.log(props);
        this.setState((previousState) => {
            return ({
                show: !previousState.show,
            });
        });

    }


    _showStoreNameInputDialog() {
        Actions.inputDialog({
            title: '请输入收藏夹名称',
            placeholderText: '最多10个字符',
            value: this.state.StoreName === '请输入' ? '' : this.state.StoreName,
            onConfirm: (text) => {
                this._setStoreName(text, (value)=>ClassBiz.setClassName(value));
            }
        });
    }


    _setStoreName(text) {

        let name = TextUtils.removeTheSpace(text); //删除所有空格;
        if (name.length == 0) {
            Toast.error('输入字符不能为空');
            return;
        } else {
            if (!TextUtils.checkSpecialCharacter(name)) {
                return;
            }
        }
        if (name.length < 2) {
            Toast.error('题组命名最少为2字符');
            return;
        }

        HttpUtils.request(API.ModifyCollectionFolderName, {
            store_name: name,
            store_id: this.props.storeId
        }).then((data) => {
                this.setState({
                    StoreName: name,
                });
                Actions.refresh({title: name});
                this.setState((previousState) => {
                    return ({
                        show: !previousState.show,
                    });
                });
                this.props.refreshCallBack();
            }
        ).catch((err) => {

        });
    }


    _deleteQuestionGroup() {
        Actions.confirmDialog({
            title: '提示',
            buttons: ["确认", "取消"],
            message: '请问您确认删除 "' + this.state.StoreName + '"整个题组吗？题组内存储的题目也将丢失',
            onClick: (index) => {
                if (index === 0) {
                    HttpUtils.request(API.DeleteCollectionFolder, {
                        store_id: this.props.storeId
                    }).then((data) => {
                            this.props.refreshCallBack();
                            Actions.pop();
                        }
                    ).catch((err) => {

                    });
                } else {
                    console.log("取消解散");
                }
            }
        })
    }


    _fetchData(page, startFetch, abortFetch) {
        HttpUtils.request(API.GetCollectionFolderDetail, {
            store_id: this.props.storeId,
            page: page,
            page_size: 10
        }).then(result=> {
            console.log(result);
            this.setState({
                emptyType:EmptyType.NO_DATA,
            });
            startFetch(result.list, 10);
        }, err=> {
            console.log(err);
            this.setState({
                emptyType:EmptyType.REQUEST_ERROR,
            });
            abortFetch();
        });
    }


    _renderFlatItem(item, index) {

        return (
            <ExaminationItem
                item={item}
                index={index}
                type={1}
                itemPress={()=>{
                    Actions.subjectItem({
                        cloudSubjectId: item.cloud_subject_id,
                        cloudTestId: item.cloud_test_id,
                        types: 2,
                        keys: index+1,
                        counts: this.props.number,
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
                <Text style={styles.textLeft}>全部题目（{this.props.number}）</Text>
                <Touch
                    onPress={()=> {
                        console.log(123);
                    }}
                >
                    {/*<Text style={styles.textRight}>全部选入</Text>*/}
                </Touch>
            </View>
        );
    }

    render() {

        let v = this.state.show ? <View style={styles.blackStyle}>
            <Image source={require('../../../images/class_details_pop_bg.png')}
                   style={styles.blackImage}
                   resizeMode='contain'/>

            <TouchableOpacity style={styles.switchBtn}
                              onPress={()=> this._showStoreNameInputDialog()
                              }
            >
                <Image source={require('../../../images/pop_revise.png')}
                       style={[styles.triangleImage, {marginTop: 5}]}
                       resizeMode='contain'/>
                <Text style={[styles.f16, styles.white, {paddingTop: 5, marginLeft: 5}]}>修改题组名称</Text>

            </TouchableOpacity>
            <View style={styles.centerLine}></View>
            <TouchableOpacity style={styles.switchBtn}
                              onPress={()=> this._deleteQuestionGroup()}
            >
                <Image source={require('../../../images/pop_delete.png')}
                       style={[styles.triangleImage]}
                       resizeMode='contain'/>
                <Text style={[styles.f16, styles.white, {marginLeft: 5}]}>删除题组</Text>

            </TouchableOpacity>

        </View> : null;

        return (
            <View style={{flex: 1}}>
                {v}
                <View style={{flex: 1}}>
                    <UltimateListView
                        header={()=>this._renderHeader()}
                        ref={ref => this.listView = ref}
                        item={(item, index)=>this._renderFlatItem(item, index)}
                        keyExtractor={(item, index) => {
                            return "key_" + index;
                        }}
                        allLoadedText='已经是最后一页了'
                        waitingSpinnerText=''
                        refreshableMode='basic'
                        onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                        numColumns={1}
                        style={{flex: 1}}
                        paginationFetchingView={()=>{return null}}
                        emptyView={()=>this._renderEmptyView()}
                        showsVerticalScrollIndicator={false}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
    textRight: {
        textAlign: 'right',
        width: (Dimensions.get('window').width - 30) / 2,
        color: '#4791ff',
        fontWeight: 'bold'
    },
    blackStyle: {
        position: 'absolute',
        right: 7,
        top: 2,
        width: 150,
        height: 130,
        zIndex: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blackImage: {
        position: 'absolute',
        width: 150,
        height: 130,

    },
    switchBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 140,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
    },
    triangleImage: {
        width: 25,
        height: 25,
    },
    centerLine: {
        width: 140,
        height: 0.5,
        backgroundColor: '#696969',
        marginLeft: 5,
        marginRight: 5
    },
    f16: {
        fontSize: 16,
    },
    white: {
        color: 'white',
    }
});