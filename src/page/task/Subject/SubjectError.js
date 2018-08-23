// 题目报错
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView, Dimensions, ScrollView, Keyboard, ToastAndroid

} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AHWebView from "../../common/AHWebView";
import Radio from "./Radio";
import Explain from "./Explain";
import Checkbox from "./Checkbox";
import Touch from "../../public/Touch";
import Http from "../../../utils/HttpUtils";
import Toast from "../../../utils/Toast";
import {API} from "../../../Config";
import TextUtils from '../../../utils/TextUtils';

export default class SubjectError extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log('this.props',this.props);
        this.state = {
            content: '',
        };
    }
    _renderTopic(){
        return(

            <AHWebView
                html={this.props.info.cloud_data.topic}
                viewStyle={{width: Dimensions.get('window').width-30,marginLeft:15}}
                webStyle={{width: Dimensions.get('window').width-30,}}
            />
        );
    }

    _renderOptions(){
        console.log('this.props.info.cloud_data',this.props.info.cloud_data);
        let cloud_data = this.props.info.cloud_data;
        return (
            <View>
                {(this.props.info.test_type === 1)?
                    <View style={styles.line}>
                        <Radio
                            info={cloud_data}
                            noPercent={true}
                        />
                    </View>
                    :
                    null
                }
                {(this.props.info.test_type === 2)?
                    <View style={styles.line}>
                        <Checkbox
                            info={cloud_data}
                            noPercent={true}
                            type = {0}
                        />
                    </View>
                    :
                    null
                }
                {(this.props.info.test_type === 3)?
                    <Explain
                        info={cloud_data}
                        noPercent={true}
                    />
                    :
                    null
                }
            </View>
        );
    }


    _TestErrorCheck(){


        let name = TextUtils.removeTheSpace(this.state.content); //删除所有空格;
        if (name.length == 0) {
            Toast.error('题目错误原因不能为空');
            return;
        }

        Keyboard.dismiss();
        console.log(this.props);
        Http.request(API.TestErrorCheck,{
            cloud_subject_id: this.props.info.cloud_data.cloud_subject_id,
            cloud_test_id: this.props.info.cloud_data.cloud_test_id,
            error_info: name,
        }).then(result=>{
            ToastAndroid.show('题目报错成功', ToastAndroid.SHORT);
            Actions.pop();
        });
    }

    render() {
        return (
            <KeyboardAvoidingView  behavior='position' style={{paddingTop: 20,backgroundColor: '#fff',minHeight: Dimensions.get('window').height}}>
                <ScrollView  showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true} style={styles.scrollView}>
                {/*题干*/}
                    {this._renderTopic()}

                    {/*选项*/}
                    {this._renderOptions()}


                    <TextInput
                        style={styles.input}
                        placeholder='请您描述一下题目错误原因'
                        numberOfLines={100}
                        multiline={true}
                        underlineColorAndroid='transparent'
                        onChangeText={text => this.setState({content: text})}
                        maxLength={200}
                    />
                    <Touch onPress={()=>this._TestErrorCheck()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>提交</Text>
                        </View>
                    </Touch>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 0,
        padding: 15,
        width: Dimensions.get('window').width-40,
        marginLeft: 20,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        height: 200,
        justifyContent: 'space-between',
        textAlign: 'left',
        textAlignVertical: 'top',
        marginTop: 10,
    },
    button: {
        height: 45,
        width: Dimensions.get('window').width-40,
        marginLeft: 20,
        backgroundColor: '#4791ff',
        justifyContent: 'center',
        marginTop: 20,
        borderRadius: 7,
        marginBottom: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',

    },
    scrollView: {
        backgroundColor:'#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 85,
    },
});