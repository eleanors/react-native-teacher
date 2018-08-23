// 转让班级


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    NativeEventEmitter,
    DeviceEventEmitter,
    TextInput,
    NativeModules,
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../utils/HttpUtils";
import {API} from "../../Config";
import RadioGroup from  '../common/RadioGroup';
import Toast from '../../utils/Toast';
import ClassBiz from '../../biz/ClassBiz';
import TextUtils from '../../utils/TextUtils';
import SpeechConversionText from '../../utils/VoiceToTextUtil';

import {
    ListRow,
    Input
} from 'teaset';
import InputClean from "../common/InputClean";
import EmptyView from "../common/EmptyView";


export default class TransferClass extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showClean: true,
            mobile: '',
            teacher: {
                user_name: ''
            },
            man: require('../../images/men.png'),
            woman: require('../../images/women.png')
        };
    }

    _search(mobile){
        if(mobile.length === 11){
            HttpUtils.request(API.SearchTeacher,{
                mobile: mobile
            }).then(res=>{

                console.log(res);
                let teacher = res;
                if(teacher.img_url){
                    teacher.img_url = {uri: teacher.img_url}
                }else{
                    teacher.img_url = require('../../images/head_teacher.png');
                }
                this.setState({
                    teacher: res
                });
            },res=>{
                this.setState({
                    teacher: {}
                });
            })
        }
    }

    _transfer(){

        Actions.confirmDialog({
            title: '提示',
            buttons: ["确认", "取消"],
            message: '确认转让班级',
            onClick: (index) => {
                if (index === 0) {

                    HttpUtils.request(API.TransferClass,{
                        class_number: this.props.class_number,
                        teacher_id: this.state.teacher.id
                    }).then(res=>{
                        Toast.success('班级转让成功');
                        Actions.reset('main');
                    })
                } else {
                    console.log("取消撤回");
                }

            }
        })
    }

    render() {

        return (
            <View style={styles.root}>
                <View>
                    <Text style={styles.title}> </Text>
                </View>
                <View style={styles.inputView}>
                    <Input
                        onChangeText={text => {

                            this.setState({mobile: text});
                            if(text.length === 11){
                                this._search(text);
                            }else{
                                this.setState({
                                    teacher: {}
                                });
                            }
                        }}
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='numeric'
                        maxLength={11}
                        blurOnSubmit={true}
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.mobile}
                        placeholder="请输入正确的教师手机号"
                    />
                    {(this.state.mobile.length > 0) ?
                        <TouchableOpacity
                            style={{
                                justifyContent:'center',
                                alignItems:'center',
                                position: 'absolute',
                                right: 30,
                                top: 0,
                                height: 50,
                            }}
                            onPress={()=>{
                                this.setState({
                                    mobile: '',
                                    teacher: {}
                                });
                                this._search('')
                            }}>
                            <Image
                                source={require('../../images/input-clean.png')}
                                style={styles.inputClear}/>
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
                {(this.state.teacher.user_name) ?
                    <View>
                        <ListRow
                            icon={<Image source={this.state.teacher.img_url} style={styles.headimg}/>}
                            bottomSeparator='none'
                            style={styles.listrow}
                            title={<View style={{marginLeft: 10,}}>
                                <View style={styles.listName}>
                                    <Text style={styles.name}>{this.state.teacher.user_name}</Text>
                                    <Image source={(this.state.teacher.sex === 0) ? this.state.man : this.state.woman} style={styles.sex}/>
                                </View>
                                <Text style={styles.number}>{this.state.teacher.mobile}</Text>
                            </View>}
                            detail={
                                <View style={styles.detail}>
                                    <TouchableOpacity  onPress={()=>{
                                        this._transfer();
                                    }}>
                                        <Text style={styles.allow}>转让</Text>
                                    </TouchableOpacity>
                                </View>
                            }

                        />
                    </View>
                    :
                    <EmptyView
                        noDataStr=''
                        emptyType={1}
                        onClick={()=>this.listView.refresh()}
                    />
                }

            </View>
        );
    }
}
const styles = StyleSheet.create({
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
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
    },
    title: {
        padding: 20,
        color: '#a5a5a5',
    },
    input: {
        width:  DisplayUtils.SCREEN.width - 40,
        height: 50,
        borderWidth: 0
    },
    inputView: {
        paddingLeft: 20,
        paddingRight: 20,
    },

    inputClear:{
        width:15,
        height:15,
    },
});