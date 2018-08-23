
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Dimensions,
    Image,
    View
} from 'react-native';
import Highlight from '../public/TouchHighlight';
import Touch from '../public/Touch';
import {
    Input,
    Overlay,
    ActionSheet
} from 'teaset';
import {API} from '../../Config';
import Http from '../../utils/HttpUtils';
import ClickSubject from "./ClickSubject";


export default class Improve extends Component {

    static overlayView;

    constructor(props) {
        super(props);
        this.state = {
            select: '小学数学',
            key : 0,
            list: [],
            grade_type: 1,
            subject_id: 1,
        };

        Http.request(API.getSubject).then(result=>{
            this.setState({
                list: result
            });
        });
        console.log(this.state.list);


    }

    _modals(){
        this.overlayView = (<Overlay.PullView side='bottom' modal={false}>
            <ClickSubject
                callbackParent={(subject_name,subject_id,grade_type)=>{
                    console.log('after',this.state.key);
                    Overlay.hide(this.state.key);
                    this.setState({
                        select: subject_name,
                        subject_id: subject_id,
                        grade_type: grade_type,
                    });
                }}
                list={this.state.list}
                grade_type={this.state.grade_type}
                subject_id={this.state.subject_id}
            />
        </Overlay.PullView>);

        let key = Overlay.show(this.overlayView);

        console.log(222,this.state.grade_type);

        this.setState({
            key: key
        });
    }


    _actionSheet(){
        let items = [
            {title: '拍照', onPress: () => alert('Hello')},
            {title: '选择图片'},
        ];
        let cancelItem = {title: '取消'};
        ActionSheet.show(items, cancelItem);
    }
    reset(){

    }


    render() {
        return (
            <View style={styles.bg}>
                <View style={styles.upload}>
                    <Touch onPress={()=>this._actionSheet()}>
                        <Image source={require('../../images/upload-head-img.png')} style={styles.uploadHeadImg} />
                    </Touch>
                </View>
                <View style={[styles.upload,styles.uploadInput]}>
                    <Input
                        onChangeText={text => this.setState({mobile: text})}
                        style={styles.input}
                        placeholder="姓名"
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='numeric'
                        maxLength={11}
                        blurOnSubmit={true}
                    />
                </View>
                <Touch onPress={()=>this._modals()}>
                    <View style={styles.selectBox}>
                        <View style={styles.select}>
                            <Text style={styles.selectText}>{this.state.select}</Text>
                            <Image source={require('../../images/arrow-down.png')} style={styles.selectImg} />
                        </View>
                    </View>
                </Touch>
                <View style={styles.bottomBTN}>
                    <Highlight
                        style={styles.button}
                        onPress={()=>this.reset()}
                        normalColor='#4791ff'
                        activeColor='#3c6cb3'
                    >
                        <View>
                            <Text style={styles.buttonText}>完成</Text>
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
    upload: {
        width: Dimensions.get('window').width,

        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadInput: {
        marginTop: 60,
    },
    uploadHeadImg: {
        width: 100,
        height: 100,
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        textAlign: 'center',
        width:  Dimensions.get('window').width * 0.9,
        backgroundColor: '#f8f8f8',
        borderWidth: 0,
        marginTop: 20,
        height: 50,
    },
    selectBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    select: {
        justifyContent: 'center',
        alignItems: 'center',
        width:  Dimensions.get('window').width * 0.9,
        backgroundColor: '#f8f8f8',
        height: 50,
        borderRadius: 5,
        flexDirection: 'row',
    },
    selectText: {
        color: '#4791ff',
        textAlign: 'right',
    },
    selectImg: {
        width: 9,
        marginTop: 2,
        marginLeft: 2,
        height: 6,
    },

    modal: {
        backgroundColor: '#fff',
        minWidth: 300,
        minHeight: 260,
        justifyContent: 'center',
        alignItems: 'center'
    },

    barStyle: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 1,
        left: 1,

    },
    modalTitle: {
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 25,

    },

    ul: {
        paddingTop: 40,
        paddingRight: 10,
        paddingLeft: 30,
        flexDirection:'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    li: {
        width: (Dimensions.get('window').width - 120)/4,
        height: 40,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 5,
        marginRight: 20,
        marginBottom: 20,
        justifyContent: 'center',
    },
    liText: {
        textAlign: 'center',
        justifyContent: 'center',
    },
    liActive: {
        backgroundColor: '#4791ff',
    },
    liActiveText: {
        color: '#ffffff'
    },


    button: {
        marginTop: 20,
        backgroundColor: '#4791ff',
        borderWidth: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.9,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    bottomBTN: {
        position: 'absolute',
        bottom: 100,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    }


});
