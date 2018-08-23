/**
 * 课程记录
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView, NativeEventEmitter, DeviceEventEmitter, Platform, NativeModules,
} from 'react-native';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import {
    ListRow,
    Label
} from 'teaset';
import moment from 'moment';
import DisplayUtils from "../../../utils/DisplayUtils";
import {UltimateListView} from 'react-native-ultimate-listview';
import Orientation from 'react-native-orientation';
import CourseRecordImgs from "./CourseRecordImgs";
import ClassBiz from "../../../biz/ClassBiz";


export default class CourseRecord extends Component {


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log(this.props.info);
        this.state = {
            list: [],
            active: {
                records0: [],
                records1: [],
                records2: [],
                records3: [],
            }
        };


    }

    componentWillUnmount() {
        console.log('this.subScription.remove');
        this.subScription.remove();
    }

    componentWillMount() {

        let that = this;
        /**
         * 用于JS注册的监听
         */
        if (Platform.OS === 'ios'){
            let MyNativeModule = NativeModules.MyNativeModule;
            let emitter = new NativeEventEmitter(MyNativeModule);
            //用获取的模块创建监听器
            console.log('message');
            that.subScription = emitter.addListener("EventMessage", (parameter)=>this._getPath(parameter,this));
        }else {
            console.log(222211111111);
            that.subScription = DeviceEventEmitter.addListener('EventMessage', (parameter)=>this._getPath(parameter,this));
        }
    }


    _fetchData(page, startFetch, abortFetch){

        if(page === 2){
            return startFetch([],10);
        }
        HttpUtils.request(API.GetCourseRecordList,{
            course_id: this.props.info.id,
        }).then(res=>{
            this.setState({
                list: res,
            });
            if(res.length > 0){
                this._click(0);
            }
            console.log(44,this.state.active.records0);
            startFetch(res,10);
        },err=>{
            console.log(err);
            abortFetch();
        })
    }

    _click(index){
        let list = this.state.list;
        for(let i in list){
            list[i].active = false;
        }
        list[index].active = true;
        this.setState({
            list: list,
            active: list[index]
        });
    }

    _renderFlatItem(item,index){
        // console.log(item);
        let img = (item.avatar) ? {uri: item.avatar} : require('../../../images/head_teacher.png');
        return (
            <View>
                <TouchableOpacity
                    onPress={()=>this._click(index)}
                >
                    <View style={styles.avatar}>
                        {
                            (this._checkHas(item))
                                ?
                                <Image source={require('../../../images/recordRight.png')} style={styles.recordRight}/>
                                :
                                null
                        }
                        <Image source={img} style={(item.active) ? styles.activeImg: styles.img}/>
                        <Label style={[styles.username, (item.active) ? styles.activeUsername : null]}>{item.user_name}</Label>
                        {
                            (item.active)
                                ?

                                <View style={{position: 'absolute',right: 0,width:2,height: 30,top: 27.5,backgroundColor: '#4791ff'}}>

                                </View>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _getPath(parameter,that){
        console.log(1,parameter);
        if(!parameter.PATH)return;
        // if(parameter.PATH === this.path){
        //     return;
        // }
        this.path = parameter.PATH;
        // console.log("*************EventMessage************:"+parameter.PATH)
        // that.setState({
        //     path:parameter.PATH
        // })
        console.log('parameter',parameter);
        let postParams = {
            file: {
                uri: parameter.PATH,
                type: 'multipart/form-data',
                name: 'headImg.jpg'
            }
        };

        let formData = new FormData();
        Object.keys(postParams).forEach((key) => {
            formData.append(key, postParams[key]);
        });
        let headers = {
            'Content-Type': 'multipart/form-data',
        };
        let initParams = {
            method: 'POST',
            headers: headers,
            body: formData,
            timeout: 15 * 1000,
        };


        let url = HttpUtils._initUrl(API.UploadImg.url + '?access_token=' + global.access_token, {}, true);
        let key = HttpUtils._showLoading();
        fetch(url, initParams)
            .then(res=>{
                return res.json();
            }).then(res=>{
                let result = res.data;
                let type = this.activeType;
                HttpUtils._hideLoading(key);
                if(result.url){
                    HttpUtils.request(API.AddCourseRecord,{
                        course_id: this.props.info.id,
                        student_id: this.state.active.student_id,
                        type: type,
                        image: result.url,
                    }).then(res => {
                        console.log(res);
                        let active = that.state.active;
                        active['records'+type].push({
                            id: res.id,
                            image: result.url
                        });
                        that.setState({
                            active: active
                        });

                        ClassBiz.mustRefresh();
                    })
                }
            })
            // HttpUtils.request(API.UploadImg, {
            //     file: {
            //         uri: parameter.PATH,
            //         type: 'multipart/form-data',
            //         name: 'headImg.jpg'
            //     },
            //     upload: true
            // }).then(result => {
            //     console.log('result', that);
            //     let type = this.activeType;
            //     if(result.url){
            //         HttpUtils.request(API.AddCourseRecord,{
            //             course_id: this.props.info.id,
            //             student_id: this.state.active.student_id,
            //             type: type,
            //             image: result.url,
            //         }).then(res => {
            //             console.log(res);
            //             let active = that.state.active;
            //             active['records'+type].push({
            //                 id: res.id,
            //                 image: result.url
            //             });
            //             that.setState({
            //                 active: active
            //             });
            //
            //             ClassBiz.mustRefresh();
            //         })
            //     }
            //
            // }, err => {
            //     console.log('err', err);
            // });
    }


    _del(id,type,index){
        HttpUtils.request(API.DelCourseRecord,{
            id: id
        }).then(res=>{
            console.log(res);
            let active = this.state.active;
            console.log('type',type);
            console.log(active['records' + type]);
            active['records' + type].splice(index,1);
            this.setState({
                active: active
            });
            ClassBiz.mustRefresh();
        })
    }

    _checkHas(item){
        if(item.records0.length > 0){
            return true;
        }
        if(item.records1.length > 0){
            return true;
        }
        if(item.records2.length > 0){
            return true;
        }
        if(item.records3.length > 0){
            return true;
        }
        return false;
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.left}>

                    <UltimateListView
                        ref={ref => this.listView = ref}
                        item={(item, index) => this._renderFlatItem(item, index)}
                        keyExtractor={(item, index) => {
                            return "key_" + index;
                        }}
                        allLoadedText=''
                        refreshableMode='basic'
                        onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                        numColumns={1}
                        style={{flex: 1, backgroundColor: '#fff',}}
                        // emptyView={() => this._renderEmptyView()}
                        paginationFetchingView={() => {
                            return null
                        }}
                        showsVerticalScrollIndicator={false}/>
                </View>
                <View style={styles.right}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        rticalScrollIndicator={false}
                        alwaysBounceVertical={true}
                        style={styles.scrollView}
                    >
                        <CourseRecordImgs
                            list={this.state.active.records0}
                            title='题目补充'
                            types='0'
                            cb={()=>this.activeType = 0}
                            del={this._del.bind(this)}
                        />
                        <CourseRecordImgs
                            list={this.state.active.records1}
                            title='答疑解惑'
                            types='1'
                            cb={()=>this.activeType = 1}
                            del={this._del.bind(this)}
                        />
                        <CourseRecordImgs
                            list={this.state.active.records2}
                            title='课堂记录'
                            types='2'
                            cb={()=>this.activeType = 2}
                            del={this._del.bind(this)}
                        />
                        <CourseRecordImgs
                            list={this.state.active.records3}
                            title='其他'
                            types='3'
                            cb={()=>this.activeType = 3}
                            del={this._del.bind(this)}
                        />
                        <View style={{width: 100,height: 40,}}>

                        </View>
                    </ScrollView>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    recordRight: {
        position: 'absolute',
        right: 20,
        top: 10,
        width: 20,
        height: 20,
        zIndex: 100,
    },
    activeImg: {
        width: 50,
        height: 50,
        borderRadius: 50/2,
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 25,
        opacity: 0.5
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        padding: 10,
    },
    username: {
        color: '#434343',
        marginTop: 10,
    },
    activeUsername: {
        fontWeight: 'bold',
    },
    root: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    left: {
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor:'#fff',
        elevation: 10,
        shadowColor: '#3e4749',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.3,
        shadowRadius: 7,
        borderTopWidth: 0.5,
        borderColor: '#f5f5f5',
    },
    right: {
        flex: 3,
        padding: 20,
        paddingTop: 15,
        paddingRight: 0,
        borderTopWidth: 0.5,
        borderColor: '#f5f5f5',
    },
    scrollView: {
        backgroundColor:'#fff',
        height: 200,
    },
});