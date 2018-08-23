/**
 * Created by mac on 2018/1/9.
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
    StatusBar,
} from 'react-native';
import {Label} from 'teaset';
import {observer} from 'mobx-react';
import HttpUtils from "../../utils/HttpUtils";
import {UltimateListView} from 'react-native-ultimate-listview';
import DisplayUtils from '../../utils/DisplayUtils';
import {Actions} from "react-native-router-flux";
import {API} from "../../Config";
import EmptyView, {EmptyType} from  '../common/EmptyView';
import ClassBiz from '../../biz/ClassBiz';
import moment from 'moment';
import Config from "../../Config";
import Touch from "../public/Touch";
import Toast from "../../utils/Toast";

@observer
export default class ClassDetail extends Component {

    constructor(props) {
        Actions.refresh({title: ''});
        super(props);
        console.log(this.props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            data: {
                class_accuracy: 0,
                class_completed: 0,
                class_name: '',
                class_number: 0,
                class_student_count: 0,
                student_list: [],
                img_url: require('../../images/head_class.png'),
                class_unaudited_umber: 0
            },
            assembleList: [],
            show: false,
            orderType: 'actual',//類型
            actualOrderState: 'down',//正確率默認狀態
            submitOrderState: 'down', //提交率默認狀態
            excelUrl: '',
            shareDesc: '',
            shareImg: '',
            shareTitle: '',
        };
    }



    onEnter() {
        console.log('onEnter');
        if (ClassBiz.refresh) {
            this.listView.refresh();
            HttpUtils.request(API.GetClassesDetail, {class_number: this.props.class_number})
                .then((data) => {
                    data.img_url = data.img_url ? {uri: data.img_url} : require('../../images/head_class.png')
                    this.setState({data: data});
                })
                .catch((err) => {

                });
            // ClassBiz.refreshComplete();
        }
    }


    //请求导出数据
    requestToExportData() {

        HttpUtils.request(API.generalClassExportData, {class_number: this.props.class_number})
            .then((data) => {
                // this.exportData(data.excel_url,data.share_desc,data.share_img,data.share_title,);
                //刷新列表
                this.setState({
                    excelUrl: data.excel_url,
                    shareDesc: data.share_desc,
                    shareImg: data.share_img,
                    shareTitle: data.share_title,
                })
            })
            .catch((err) => {

            });
    }

    exportData() {

        this._hiddenPopUp();
        Actions.shareBoard({
            shareInfo: {
                title: this.state.shareTitle,
                desc: this.state.shareDesc,
                url: this.state.excelUrl,
                img: this.state.shareImg
            }
        });
    }


    onRight(...props) {
        let url;
        if(Config.evn){
            url = Config.shareUrl + 'index/' + this.props.class_number;
        }else{
            url = Config.shareTestUrl + 'index/' + this.props.class_number;
        }
        Actions.shareBoard({
            shareInfo: {
                title: this.state.data.class_name + '的学习报告',
                desc: '综合报告 | ' + global.userInfo.user_name,
                url: url,
                img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png'
            }
        });

    }

    _hiddenPopUp() {
        this.setState((previousState) => {
            return ({
                show: false,
            });
        });
    }


    //列表选
    itemSelected(item) {
        console.log("列表项:" + JSON.stringify(item));
        this._hiddenPopUp();
        Actions.studentTaskSituation({studentId: item.student_id, classNumber: this.props.class_number});
    }


    _fetchData(page = 1, startFetch, abortFetch) {

        HttpUtils.request(API.GetClassesDetail, {class_number: this.props.class_number})
            .then((data) => {
                data.img_url = data.img_url ? {uri: data.img_url} : require('../../images/head_class.png')
                this.setState({data: data});
            })
            .catch((err) => {

            });
        HttpUtils.request(API.GetClassTasks, {
            class_number: this.props.class_number,
            page: page
        }).then((data) => {
                console.log(data);
                // this.setState({
                //     data: data
                // });
                this.setState({
                    emptyType: EmptyType.NO_DATA,
                });
                startFetch(data.task_list, 10);
                this.requestToExportData();
            })
            .catch((err) => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
    }


    render() {

        return (
            <View style={styles.bg}>
                <View style={{flex: 1}}>

                    <UltimateListView
                        ref={ref => this.listView = ref}
                        item={this.renderFlatItem}
                        keyExtractor={(item, index) => {
                            return "key_" + index;
                        }}
                        header={()=>{
                            return this.renderHeader();
                        }}
                        refreshableMode='basic'
                        onFetch={this._fetchData.bind(this)}
                        numColumns={1}
                        allLoadedText='已经是最后一页了'
                        emptyView={()=>this.renderEmptyView()}
                        style={{flex: 1}}
                        paginationFetchingView={() => {
                            return null
                        }}

                        showsVerticalScrollIndicator={false}/>
                </View>
            </View>
        );
    }



    renderFlatItem = (item, index) => {
        let list = this.listView.getRows();
        // console.log(this.listView.getRows());
        let time;
        if((!list[index-1] || item.create_month_time === list[index-1].create_month_time) && index !== 0){
            time = <View></View>;
        }else{
            time = (
                <View style={styles.timeline}>
                    <Text style={styles.timeText}>{item.create_month_time}</Text>
                </View>
            );
        }

        let img;
        let text;
        let total;
        let status;
        let tag;
        switch (item.status){
            case 0:
                status = '课程准备';
                break;
            case 1:
                status = '上课记录';
                break;
            case 2:
                status = '课后反馈';
                break;
            case 3:
                status = '课程结束';
                break;
        }
        switch (item.task_type){
            case 0:
                tag = <Text style={[styles.liTag, styles.tag0]}>作业</Text>;
                if(item.is_dead === 1){
                    text = (
                        <Text style={{color: '#ccc',fontSize: 12}}>已截止</Text>
                    );
                }else{
                    text = (
                        <Text stlye={styles.liTextRight}>
                            <Text style={{color: '#ffa96f'}}>{item.finish_student_count}</Text>/{item.class_student_count}
                        </Text>
                    );
                }
                total = '共' + item.task_test_count + '题';
                break;
            case 3:
                tag = <Text style={[styles.liTag, styles.tag3]}>试卷</Text>;
                if(item.is_dead === 1){
                    text = (
                        <Text style={{color: '#ccc',fontSize: 12}}>已截止</Text>
                    );
                }else{
                    text = (
                        <Text stlye={styles.liTextRight}>
                            <Text style={{color: '#ffa96f'}}>{item.finish_student_count}</Text>/{item.class_student_count}
                        </Text>
                    );
                }
                total = '共' + item.task_test_count + '题';
                break;
            case 4:
                tag = <Text style={[styles.liTag, styles.tag4]}>课程</Text>;
                text = (
                    <Text style={{color: '#4791ff',fontSize: 12}}>{status}</Text>
                );
                total = moment(item.create_time*1000).format('MM月DD日 HH:mm') + '  ' + (item.duration/3600) + '小时';
                break;

            case 5:
                //直播课
                tag = <Text style={[styles.liTag, styles.tag5]}>精雕细课</Text>;
                total = moment(item.start_time*1000).format('MM月DD日 HH:mm');
                break;
        }

        return (
            <View style={{backgroundColor: '#fff'}}>
                {time}
                <TouchableOpacity
                    onPress={()=>{
                        console.log(item);
                        if(item.task_type === 5){
                            return Actions.liveCourse({lesson_course_id: item.lesson_course_id, class_number: this.props.class_number});
                        }
                        if(item.task_type !== 4){
                            return Actions.taskDetail({taskId: item.task_id, title: item.task_name});
                        }else{
                            return Actions.courseInfo({item:item, data: this.state.data});
                        }
                    }}
                >
                    <View style={styles.li}>
                        <View style={{flex: 7,}}>
                            <Label style={styles.liText}>{item.task_name}</Label>
                            <View style={{flexDirection: 'row',}}>
                                {tag}
                                <Text style={styles.liText2}>{total}</Text>
                            </View>
                        </View>
                        <View style={{flex: 2,justifyContent: 'center', alignItems: 'flex-end'}}>
                            {text}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    renderEmptyView = () => {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={()=>this.listView.refresh()}
            />
        );
    };

    renderHeader(){
        console.log(this.state.data);
        return (
            <View style={{marginBottom: 10,backgroundColor: '#fff'}}>

                <View style={styles.card}>
                    <Image source={require('../../images/class_bg.png')} style={styles.topBg}/>
                    <TouchableOpacity style={{position: 'absolute',left: 0, top: 0,width: 100,height: 100,zIndex: 100}} onPress={()=>{
                        Actions.pop();
                    }}>
                        <Image source={require('../../images/back.png')} style={styles.back}/>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 42}}>
                        <View style={{
                            elevation: 10,
                            backgroundColor: 'transparent',
                            shadowColor: '#3e4749',
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: 0.3,
                            shadowRadius: 7,}}>
                            <Image source={this.state.data.img_url} style={styles.classImage} />
                        </View>
                        <Text style={{backgroundColor: 'transparent',color: '#fff',fontSize: 18,marginTop: 10,}}>{this.state.data.class_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.rowView}>
                            <Text
                                style={[styles.white, styles.f20, styles.backTransparent]}>{this.state.data.class_student_count}</Text>
                            <Text
                                style={[styles.white, styles.f12, styles.mt10, styles.backTransparent, {color: '#E0E5FF'}]}>学生数</Text>
                        </View>
                        <View style={styles.rowView}>
                            <Text
                                style={[styles.white, styles.f20, styles.backTransparent]}>{this.state.data.class_completed}%</Text>
                            <Text
                                style={[styles.white, styles.f12, styles.mt10, styles.backTransparent, {color: '#E0E5FF'}]}>作业提交率</Text>
                        </View>
                        <View style={styles.rowView}>
                            <Text
                                style={[styles.white, styles.f20, styles.backTransparent]}>{this.state.data.class_accuracy}%</Text>
                            <Text
                                style={[styles.white, styles.f12, styles.mt10, styles.backTransparent, {color: '#E0E5FF'}]}>作业正确率</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.icons}>

                    <TouchableOpacity onPress={()=>{
                        Actions.addCourse({
                            class_number: this.props.class_number
                        });
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_addclass.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>添加课程</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        Actions.classRank({class_number: this.props.class_number});
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_list.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>排行榜</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        Actions.invitationStudent({class_number: this.props.class_number});
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_student.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>邀请学生</Text>
                        </View>
                    </TouchableOpacity>


                    {/*<TouchableOpacity onPress={()=>{*/}
                        {/*// Toast('')*/}
                    {/*}}>*/}
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_unopen.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>邀请老师</Text>
                        </View>
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity onPress={()=>{
                        Actions.classInfo({classNum: this.props.class_number});
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_detail.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>班级信息</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={()=>{
                        Actions.addClassAuditing({class_number: this.props.class_number});
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_new.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>入班审核</Text>
                            {(this.state.data.class_unaudited_umber > 0) ?
                                <View style={styles.tagss}>
                                    <Text style={{color: '#fff',textAlign: 'center',fontSize: 12}}>{this.state.data.class_unaudited_umber}</Text>
                                </View>
                                :
                                null
                            }
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        Actions.transferClass({class_number: this.props.class_number});
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_zhuanrang.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>转让班级</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={()=>{
                        this.onRight();
                    }}>
                        <View style={styles.iconView}>
                            <Image source={require('../../images/handle_share.png')} style={styles.icon}/>
                            <Text style={styles.iconText}>分享</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    tagss: {
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: (Platform.OS === 'ios') ? 5 : 7,
        paddingLeft: (Platform.OS === 'ios') ? 5 : 7,
        backgroundColor: '#ff563c',
        position: 'absolute',
        right: 18,
        borderRadius: 10
    },
    iconText: {
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
        paddingLeft: 2,
        fontSize: 12,
        color: '#626262'
    },
    icons: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',

    },
    iconView: {
        width: (DisplayUtils.SCREEN.width) / 4,
        alignItems: 'center',
    },
    icon: {
        width: (DisplayUtils.SCREEN.width - 200) / 4,
        height: (DisplayUtils.SCREEN.width - 200) / 4,
    },
    classImage: {
        width: 55,
        height: 55,
        borderRadius: 55/2,
    },
    back: {
        width: 9,
        height: 15,
        position: 'absolute',
        top: (Platform.OS === 'ios') ? 47 : 37,
        left: 15,
    },
    liTextRight: {
        textAlign: 'right',
        fontSize: 12,
        color: 'red'
    },
    liText: {
        fontSize: 16,
        color: '#3d4f5e',
    },
    tag0: {
        borderColor: '#ff9155',
        color: '#ff9155',
    },
    tag3: {
        borderColor: '#6864ff',
        color: '#6864ff',
    },
    tag4: {
        borderColor: '#ff6767',
        color: '#ff6767',
    },
    tag5: {
        borderColor: '#5a94ff',
        color: '#5a94ff',
    },
    liTag: {
        borderWidth: 0.5,
        paddingLeft: 3,
        paddingRight: 1,
        borderRadius: 1,
        paddingTop: 0,
        paddingBottom: 0,
        height: 18,
        lineHeight: (Platform.OS === 'ios') ? 14: 16.5,
        marginTop: 5,
        marginRight: 5,
        fontSize: 12,
    },
    liText2: {
        color: '#a8a8b1',
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios')?2:0,
        fontSize: 12,
    },
    liView: {

    },
    li: {
        flexDirection: 'row',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    timeline: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 10,
        paddingLeft: 20,
    },
    timeText: {
        color: '#9fa0a3',
        marginTop: 10,
    },
    bg: {
        backgroundColor: '#f6f6f6',
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.SCREEN.height,
        flex: 1,

    },
    card: {
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.SCREEN.width /750 * 436,
        // backgroundColor: '#335CFF',

    },
    topBg: {
        width: DisplayUtils.SCREEN.width,
        height: DisplayUtils.SCREEN.width /750 * 436,
        position: 'absolute',
    },
    leftText: {
        fontSize: 18,
        color: 'white',
        marginTop: 15,
        marginLeft: 7,
        backgroundColor: 'transparent'
    },
    rightText: {
        fontSize: 14,
        color: 'white',
        position: 'absolute',
        top: 17,
        right: 10,
        backgroundColor: 'transparent'
    },
    row: {
        flexDirection: 'row',
        marginTop:  (Platform.OS === 'ios') ? 15 : 20,
    },
    rowView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    white: {
        color: 'white',
        fontFamily: (Platform.OS === 'ios') ? 'DIN' : 'DIN-Medium'
    },
    f20: {
        fontSize: 20,
    },
    f12: {
        fontSize: 12,
    },
    f16: {
        fontSize: 16,
    },
    mt10: {
        marginTop: 10,
    },
    itemView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mt5: {
        marginTop: 5,
    },
    card2: {
        height: 70,
        flexDirection: 'row',
        padding: 10,
    },
    image: {
        width: 30,
        height: 30,
    },
    black: {
        color: '#AEAFAE'
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
    },
    ml10: {
        marginLeft: 10,
    },
    numberImage: {
        width: 26,
        height: 26,
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13
    },
    numberOneImage: {
        width: 30,
        height: 30,
        position: 'absolute',
    },
    numberOne: {
        backgroundColor: '#FF8840',
    },
    numberTwo: {
        backgroundColor: '#FDBD41',
    },
    backTransparent: {
        backgroundColor: 'transparent'
    },
    blackStyle: {
        position: 'absolute',
        right: 7,
        top: 2,
        width: 150,
        height: 130,
        zIndex: 999,
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
        marginRight: 5
    },
    triangleImage: {
        position: 'absolute',
        right: 8,
        width: 7,
        height: 7
    },
    centerLine: {
        width: 140,
        height: 0.5,
        backgroundColor: '#696969',
        marginLeft: 5,
        marginRight: 5
    }

});