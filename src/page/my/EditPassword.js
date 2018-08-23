
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Dimensions,
    View,
    Keyboard,
    ToastAndroid
} from 'react-native';
import {
    Input,
} from 'teaset';
import Highlight from '../public/TouchHighlight';
import {Actions} from "react-native-router-flux";
import Http from "../../utils/HttpUtils";
import {API} from "../../Config";
import Toast from "../../utils/Toast";
import InputClean from "../common/InputClean";


export default class EditPassword extends Component {


    constructor(props) {
        super(props);
        console.log(123);
        this.state = global.userInfo;

    }

    _submit(){
        //验证

        Keyboard.dismiss();

        if(!this.state.old_password || this.state.old_password.length == 0){
            return Actions.errToast({msg:'原密码不能为空'});
        }

        if(this.state.old_password.length < 6){
            return Actions.errToast({msg:'原密码不能少于6位'});
        }

        if(!this.state.new_password || this.state.new_password.length == 0){
            return Actions.errToast({msg:'新密码不能为空'});
        }

        if(this.state.new_password.length < 6){
            return Actions.errToast({msg:'新密码不能少于6位'});
        }

        if(!this.state.password || this.state.password.length == 0){
            return Actions.errToast({msg:'确认密码不能为空'});
        }


        if(this.state.old_password === ''
            || !this.state.old_password
            || this.state.new_password === ''
            || !this.state.new_password
            || this.state.password === ''
            || !this.state.password
        ){
            return Toast.error('请填写正确的密码');
        }

        if(this.state.new_password !== this.state.password){
            return Toast.error('两次密码不一致');
        }

        Http.request(API.EditPassword,{
            old_password: this.state.old_password,
            new_password: this.state.new_password,
            password: this.state.password,
        }).then(result=>{
            console.log(result);
            ToastAndroid.show('修改成功', ToastAndroid.SHORT);
            window.storage.remove({
                key: 'access-token'
            });
            Actions.reset('sign');
        },err=>{
            console.log(123123123,err);
        });
    }


    render() {
        return (
            <View style={styles.bg}>
                <View style={styles.form}>
                    <View style={styles.inputRoot}>
                    <InputClean
                        onchange={text => this.setState({old_password: text})}
                        style={styles.input}
                        placeholder="请输入原密码"
                        secureTextEntry={true}
                        password={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        maxLength={15}
                        clearInput={()=>this.setState({old_password:''})}
                    />
                    </View>
                    <View style={styles.inputRoot}>
                    <InputClean
                        onchange={text => this.setState({new_password: text})}
                        style={styles.input}
                        placeholder="请输入新密码"
                        secureTextEntry={true}
                        password={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        maxLength={15}
                        clearInput={()=>this.setState({new_password:''})}
                    />
                    </View>
                    <View style={styles.inputRoot}>
                    <InputClean
                        onchange={text => this.setState({password: text})}
                        style={styles.input}
                        placeholder="请确认新密码"
                        secureTextEntry={true}
                        password={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        maxLength={15}
                        clearInput={()=>this.setState({password:''})}
                    />
                    </View>

                    <Highlight
                        style={styles.button}
                        onPress={()=>this._submit()}
                        normalColor='#4791ff'
                        activeColor='#3c6cb3'
                    >
                        <View>
                            <Text style={styles.buttonText}>修改密码</Text>
                        </View>
                    </Highlight>
                </View>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff'
    },
    form: {
        padding: 20,
        paddingTop: 30,
    },

    input: {
        borderWidth: 0,
        backgroundColor: '#f8f8f8',
        height: 50,
        flex: 1
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
    inputRoot:{
        flexDirection:'row',
        backgroundColor: '#f8f8f8',
        marginTop: 20,
        alignItems:'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        backgroundColor: 'transparent',
    }
});
