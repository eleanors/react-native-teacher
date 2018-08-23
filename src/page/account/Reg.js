
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    ScrollView,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    View
} from 'react-native';
import Highlight from '../public/TouchHighlight';
import Touch from '../public/Touch';
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from "react-native-router-flux";
import {
    NavigationBar,
    Input,
    Button
} from 'teaset';
import {API} from '../../Config';
import Http from '../../utils/HttpUtils';






//      此页面暂时关闭


//      2018年1月25日





























export default class Reg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '', code: '',
            client_type: (Platform.OS === 'ios')?2:1,
            user_type: 1,
            codeText: '发送验证码'
        };

    }

    Reg(){
        return   Actions.improve();
        let reg =  /^1\d{10}$/;
        if (this.state.mobile.length !== 11 || !reg.test(this.state.mobile)){
            return Actions.errToast({msg:'错误的手机号'});
        }
        if (this.state.password.length < 6){
            return Actions.errToast({msg:'错误的密码'});
        }
        //  TODO   注册操作
        // Http.request(API.Login,loginInfo).then(result=>{
        //     console.log(result);
        //     window.storage.save({
        //         key: 'access-token',
        //         data: result.access_token
        //     });
        //     window.storage.save({
        //         key: 'userinfo',
        //         data: result
        //     });
        //     // window.storage = result;
        //     global.access_token = result.access_token;
        //     Actions.main();
        // });
    }

    sendCode(){

        console.log('sendCode');
        let reg =  /^1\d{10}$/;
        if (this.state.mobile.length !== 11 || !reg.test(this.state.mobile)){
            return Actions.errToast({msg:'错误的手机号'});
        }
        Http.request(API.CheckPhoneNum,{
            mobile: this.state.mobile
        }).then(result=>{
            console.log(result);
            //先判断是否存在手机号
            if(result && result.status === 1){
                return Actions.errToast({msg:'手机号码已存在'});
            }
            //再发送验证码
            Http.request(API.SendPhoneCode,{
                mobile: this.state.mobile,
                send_type: 1,
            }).then(result=>{
                console.log(result);
                //TODO 验证码倒计时
            });
        });
    }

    render() {
        return (
            <View style={styles.bg}>
                <View>

                    <Image source={require('../../images/login-point.png')} style={styles.point} />
                    <Text style={styles.loginText}>注册</Text>
                    <Text style={styles.loginDesc}>设置账号和密码</Text>

                </View>
                <View style={styles.inputs}>
                    <Input
                        onChangeText={text => this.setState({mobile: text})}
                        style={styles.input}
                        placeholder="请输入手机号"
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='numeric'
                        maxLength={11}
                        blurOnSubmit={true}
                    />
                    <View>
                        <Input
                            onChangeText={text => this.setState({code: text})}
                            style={styles.input}
                            placeholder="请输入验证码"
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='numeric'
                        />
                        <Touch
                            onPress={()=>this.sendCode()}
                            style={styles.sendCode}
                        >
                            <Text style={styles.sendCodeText}>{this.state.codeText}</Text>
                        </Touch>
                    </View>
                    <Input
                        secureTextEntry={true}
                        password={true}
                        onChangeText={text => this.setState({password: text})}
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="请设置账号密码"
                    />

                    <Highlight
                        style={styles.button}
                        onPress={()=>this.Reg()}
                        normalColor='#4791ff'
                        activeColor='#3c6cb3'
                    >
                            <View>
                                <Text style={styles.buttonText}>注册</Text>
                            </View>
                    </Highlight>

                </View>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    sendCode: {
        height: 90,
        position: 'absolute',
        right: 20,
        top: 0,
        justifyContent: 'center',
    },
    sendCodeText: {
        color: '#4791ff'
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
        backgroundColor: 'transparent',
        color: '#3c4e5d'
    },
    loginDesc: {
        color: '#b5b5b5',
    },
    inputs: {
        marginTop: 40,
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
        backgroundColor: 'transparent',
        fontSize: 18,
    }

});
