
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Dimensions,
    Keyboard,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image,
} from 'react-native';
import Highlight from '../public/TouchHighlight';
import Touch from '../public/Touch';
import {Actions} from "react-native-router-flux";
import {
    Input,
} from 'teaset';
import {API} from '../../Config';
import Http from '../../utils/HttpUtils';
import InputClean from '../common/InputClean';
import Toast from "../../utils/Toast";

export default class Forget extends Component {
    title;
    constructor(props) {
        super(props);
        console.log(props);
        this.title = props.title;
        console.log('platform',Platform.OS);
        this.state = {
            mobile: '',
            new_password: '',
            code: '',
            password: '',
            codeText: '发送验证码',
            sendCode: false
        };
    }

    reset(){

        Keyboard.dismiss();

        if(this.state.mobile.length == 0){
            return Actions.errToast({msg:'手机号不能为空'});
        }

        if(this.state.code.length == 0){
            return Actions.errToast({msg:'验证码不能为空'});
        }

        if(this.state.new_password.length == 0){
            return Actions.errToast({msg:'新密码不能为空'});
        }

        if(this.state.new_password.length < 6){
            return Actions.errToast({msg:'新密码不能少于6位'});
        }

        if(this.state.password.length == 0){
            return Actions.errToast({msg:'确认密码能为空'});
        }

        if (this.state.password !== this.state.new_password){
            return Actions.errToast({msg:'两次密码不一致'});
        }


        let reg =  /^1\d{10}$/;
        if (this.state.mobile.length !== 11 || !reg.test(this.state.mobile)){
            return Actions.errToast({msg:'错误的手机号'});
        }

        if (!this.state.code || this.state.code.length !== 6){
            return Actions.errToast({msg:'错误的验证码'});
        }
        if (!this.state.new_password || this.state.new_password === '' || this.state.new_password.length < 6){
            return Actions.errToast({msg:'错误的新密码'});
        }
        if (!this.state.password || this.state.password === '' || this.state.password.length < 6){
            return Actions.errToast({msg:'错误的新密码'});
        }

        Http.request(API.Forget,{
            mobile: this.state.mobile,
            code: this.state.code,
            password: this.state.password,
            new_password: this.state.new_password,
        }).then(result=>{

            ToastAndroid.show('修改成功', ToastAndroid.SHORT);
            Actions.pop();
        });

    }

    sendCode(){
        let reg =  /^1\d{10}$/;
        if(this.state.mobile.length === 0){
            Toast.error('手机号不能为空');
            return;
        }
        if (this.state.mobile.length !== 11 || !reg.test(this.state.mobile)){
            return Actions.errToast({msg:'错误的手机号'});
        }
        if(this.state.sendCode){
            return false;
        }

        //接口验证手机号是否注册
        Http.request(API.CheckPhoneNum,{
            mobile: this.state.mobile
        }).then(result=> {
            if(result && result.status === 1){
                this.refs.code.focus();
                //再发送验证码
                Http.request(API.SendPhoneCode, {
                    mobile: this.state.mobile,
                    send_type: 2
                }).then(result => {
                    let second = 60;
                    console.log(this.state.sendCode);
                    this.setState({sendCode: true});
                    let setin = setInterval(() => {
                        second--;
                        if (second <= 0) {
                            window.clearInterval(setin);
                            second = 60;
                            this.setState({sendCode: false});
                            this.setState({codeText: '发送验证码'});
                        } else {
                            this.setState({codeText: second + 's后重试'});
                            console.log(this.state.codeText);
                        }

                    }, 1000);
                    console.log(result);
                }, err => {
                    console.log('err', err);
                });
            }else{

                return Actions.errToast({msg:'该手机号尚未被注册'});
            }
        });
    }

    _clearMobileInput(){
        console.log('mobile is null ? ',(this.state.mobile && this.state.mobile.length>0));
        if(this.state.mobile && this.state.mobile.length>0){
            this.setState({mobile:''});
        }
    }

    render() {
        return (
            <View style={styles.bg}>
                <View>
                    <View style={styles.inputRoot}>
                        <InputClean
                            onchange={text => this.setState({mobile: text})}
                            style={[styles.input,{marginTop:0,flex:1}]}
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='numeric'
                            maxLength={11}
                            value={this.state.mobile}
                            blurOnSubmit={true}
                            placeholder="请输入手机号"
                            clearInput={()=>this.setState({mobile:''})}
                        />
                    </View>
                    <View>
                        <Input
                            onChangeText={text => this.setState({code: text})}
                            style={styles.input}
                            placeholder="请输入验证码"
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='numeric'
                            ref="code"
                            maxLength={6}
                        />
                        <Touch
                            onPress={()=>this.sendCode()}
                            style={styles.sendCode}
                        >
                            <Text style={(this.state.sendCode)?styles.DeSendCodeText:styles.sendCodeText}><Text style={styles.line}>|</Text>      {this.state.codeText}</Text>
                        </Touch>
                    </View>

                    <View style={styles.inputRoot}>
                        <InputClean
                            secureTextEntry={true}
                            password={true}
                            onchange={text => this.setState({new_password: text})}
                            style={[styles.input,{marginTop:0,flex:1}]}
                            placeholder="请输入新密码"
                            maxLength={15}
                            clearInput={()=>this.setState({new_password:''})}
                        />
                    </View>
                    <View style={styles.inputRoot}>
                        <InputClean
                            secureTextEntry={true}
                            password={true}
                            onchange={text => this.setState({password: text})}
                            style={[styles.input,{marginTop:0,flex:1}]}
                            placeholder="请确认新密码"
                            maxLength={15}
                            clearInput={()=>this.setState({password:''})}
                        />
                    </View>

                    <Highlight
                        style={styles.button}
                        onPress={()=>this.reset()}
                        normalColor='#4791ff'
                        activeColor='#3c6cb3'>
                        <View>
                            <Text style={styles.buttonText}>重置密码</Text>
                        </View>
                    </Highlight>
                </View>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    line: {
        color: "#e8e8e8",
    },
    sendCode: {
        height: 90,
        position: 'absolute',
        right: 20,
        top: 0,
        justifyContent: 'center',
    },
    sendCodeText: {
        color: '#4791ff',
        backgroundColor:'transparent',
    },
    DeSendCodeText: {
        color: '#aeaeae',
        backgroundColor:'transparent',
    },
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        marginTop: 123,
        backgroundColor: '#fff'
    },
    point: {
        width: 30,
        height: 22,
        position: 'absolute',
        top: 0,
        left: 50,
    },
    loginText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#3c4e5d'
    },
    loginDesc: {
        color: '#b5b5b5',
    },
    input: {
        borderWidth: 0,
        backgroundColor: '#f8f8f8',
        marginTop: 20,
        height: 50,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4791ff',
        borderWidth: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    inputRoot:{
        flexDirection:'row',
        backgroundColor: '#f8f8f8',
        marginTop: 20,
        alignItems:'center'
    },
    inputClear:{
        width:15,
        height:15,
    },
});
