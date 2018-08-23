
import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Dimensions,
    ToastAndroid,
    View, Keyboard
} from 'react-native';
import Http from "../../utils/HttpUtils";
import {API} from "../../Config";
import {Actions} from "react-native-router-flux";
import Toast from "../../utils/Toast";


export default class Feedback extends Component {


    constructor(props) {
        super(props);
        this.state = {
            content: '',
        };
    }


    onRight(...props) {
        if(this.state.content === ''){
            return Toast.error('请输入意见反馈');
        }

        if(!this.state.content || this.state.content.length < 5){
            return Toast.error('反馈内容最少5个字符');
        }

        Keyboard.dismiss();
        // ToastAndroid.show('意见反馈成功', ToastAndroid.SHORT);
        // Actions.pop();
        Http.request(API.Feedback,{
            client_type: 1,
            content: this.state.content,
        }).then(result=>{
            ToastAndroid.show('意见反馈成功', ToastAndroid.SHORT);
            Actions.pop();
        });
    }

    render() {
        return (
            <View style={styles.bg}>
                <TextInput
                    style={styles.input}
                    placeholder='请提供您的宝贵意见'
                    numberOfLines={100}
                    multiline={true}
                    autoFocus={true}
                    onChangeText={text => this.setState({content: text})}
                    maxLength={200}
                />
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
    input: {
        borderWidth: 0,
        padding: 15,
        height: Dimensions.get('window').height,
        justifyContent: 'space-between',
        textAlign: 'left',
        textAlignVertical: 'top',
    },

});
