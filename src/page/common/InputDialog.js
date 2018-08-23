/**
 * Created by heaton on 2017/12/18.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert, Dimensions,
    Platform,
} from 'react-native';
import {
    ListRow,
    Overlay,
    Label,
    Input
} from 'teaset';
import Touch from '../public/TouchHighlight';
import {Actions} from 'react-native-router-flux';
import DisplayUtils from '../../utils/DisplayUtils';
export default class InputDialog extends Component {

    static defaultProps = {
        title: '请输入内容',
        placeholderText: '请输入内容',
        value: '',
        maxLength:10,
        onConfirm: (text) => {
        },
        onCancel: (text) => {
        }
    };

    key = 1;

    _onConfirm() {
        this.props.onConfirm(this.state.text);
        Overlay.hide(this.key);
        if(Actions.currentScene === 'inputDialog'){
            //     console.log(33333333333333333);
            Actions.pop();
        }
    }


    _onCancel() {
        console.log('newkey2',this.key);
        Overlay.hide(this.key);
        this.props.onCancel(this.state.text);
        Actions.pop();
    }


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: this.props.value,
            modalKey: 0,
        };
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center',marginBottom: (Platform.OS === 'android')?0:100,}}
                modal={false}
                onDisappearCompleted={()=>{
                    Actions.pop();
                }}
            >
                <View style={styles.modal}>
                    <Label style={styles.modalTitle} size='md' text={this.props.title} />
                    <TextInput
                        style={styles.modalInput}
                        defaultValue={this.props.value}
                        autoCorrect={false}
                        autoFocus={true}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({text: text})}
                        placeholder={this.props.placeholderText}
                        maxLength={this.props.maxLength}
                    />
                    <View style={styles.modalBtn}>
                        <TouchableOpacity onPress={() => this._onConfirm()}
                                          style={[styles.modalBtnView, styles.modalBtnViewSuccess]}>
                            <View>
                                <Text style={styles.modalBtnSuccess}>确认</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this._onCancel()} style={styles.modalBtnView}>
                            <View>
                                <Text style={styles.modalBtnCancel}>取消</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay.PopView>
        );


        this.key = Overlay.show(overlayView);
        console.log('newkey',this.key);
        // this.setState({modalKey: key});
    }

    render() {
        return (
            <View style={styles.root}>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        // backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },


    modal: {
        backgroundColor: '#fff',
        paddingTop: 20,
        borderRadius: 15,
        alignItems: 'center'
    },

    modalTitle: {
        color: '#4791ff',
        fontSize: 14,
    },
    modalInput: {
        width: Dimensions.get('window').width * 0.6,
        height: 40,
        borderBottomWidth: 0,
        marginTop: 20,
        backgroundColor: '#f5f5f6',
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 0,
        borderRadius: 5,
        paddingLeft: 10,
    },
    modalBtn: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#f0f0f0',
        marginTop: 20,
    },
    modalBtnSuccess: {
        textAlign: 'center',
        color: '#4791ff',
        justifyContent: 'center',
    },
    modalBtnCancel: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#b5b5b5',
    },

    modalBtnView: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,

    },
    modalBtnViewSuccess: {

        borderRightWidth: 0.5,
        borderColor: '#f0f0f0',
    }
});