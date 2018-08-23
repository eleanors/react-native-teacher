//入班审核
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    NativeModules
} from 'react-native';
import ImagePicker from 'react-native-syan-image-picker';
import HttpUtils from '../../utils/HttpUtils';
import DisplayUtils from '../../utils/DisplayUtils';
import {API, ClassTypes} from '../../Config';
import RadioGroup from  '../common/RadioGroup';
import {Actions} from 'react-native-router-flux';
import Picker from 'react-native-picker';
import Toast from '../../utils/Toast';
import ClassBiz from '../../biz/ClassBiz';
import TextUtils from '../../utils/TextUtils';
import {
    ListRow
} from 'teaset';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView, {EmptyType} from "../common/EmptyView";


export default class AddClassAuditing extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };

    }

    _fetchData(page = 1, startFetch, abortFetch){
        HttpUtils.request(API.ClassApplyList,{
            class_number: this.props.class_number,
            page: page,
            page_size: 10,
        }).then(res=>{
            console.log(res);

            startFetch(res.data,10);
        })
            .catch((err) => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
    }

    _allow(item, type){
        console.log(233);
        HttpUtils.request(API.ApplyStudent,{
            class_number: this.props.class_number,
            student_id: item.id,
            apply: type
        }).then(res=>{
            console.log(res);
            this.listView.refresh();
            ClassBiz.mustRefresh();
        })
    }
    renderFlatItem(item){
        console.log(item);
        return (
            <View>
                <ListRow
                    icon={<Image source={(item.img_url) ? {uri: item.img_url} : require('../../images/head_teacher.png')} style={styles.headimg}/>}
                    bottomSeparator='none'
                    style={styles.listrow}
                    title={<View style={{marginLeft: 10,}}>
                        <View style={styles.listName}>
                            <Text style={styles.name}>{item.user_name}</Text>
                            <Image source={(item.sex === 0) ? require('../../images/men.png') : require('../../images/women.png')} style={styles.sex}/>
                        </View>
                        <Text style={styles.number}>{item.mobile}</Text>
                    </View>}
                    detail={
                        <View style={styles.detail}>
                            <TouchableOpacity  onPress={()=>{
                                this._allow(item,1);
                            }}>
                                <Text style={styles.allow}>通过</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>{
                                Actions.confirmDialog({
                                    title: '提示',
                                    buttons: ["确认", "取消"],
                                    message: '确认拒绝该学生入班申请？',
                                    onClick: (index) => {
                                        if (index === 0) {
                                            this._allow(item,2);
                                        } else {
                                            console.log("取消撤回");
                                        }

                                    }
                                })
                            }}>
                                <Text style={styles.noallow}>拒绝</Text>
                            </TouchableOpacity>
                        </View>
                    }

                />
            </View>
        );
    }

    renderEmptyView = () => {
        return (
            <EmptyView
                noDataStr='暂无待审核学生'
                emptyType={1}
                onClick={()=>this.listView.refresh()}
            />
        );
    };

    render() {
        return (
            <View style={{flex: 1, padding: 10, backgroundColor: '#FFFFFF'}}>

                <UltimateListView
                    ref={ref => this.listView = ref}
                    item={this.renderFlatItem.bind(this)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    refreshableMode='basic'
                    onFetch={this._fetchData.bind(this)}
                    numColumns={1}
                    allLoadedText=''
                    emptyView={()=>this.renderEmptyView()}
                    style={{flex: 1}}
                    paginationFetchingView={() => {
                        return null
                    }}
                    showsVerticalScrollIndicator={false}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    noallow: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        marginLeft: 7,
        color: '#afafaf'
    },
    allow: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#4791ff',
        color: '#fff',
        borderRadius: 5,
        overflow: 'hidden'
    },
    detail: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    number: {
        paddingTop: 10,
        color: '#a3a7b2',
        fontSize: 12,
    },
    sex: {
        width: 18,
        height: 14,
        marginLeft: 5
    },
    listName: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    },
    headimg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    listrow: {

        height: 80,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
    }
});