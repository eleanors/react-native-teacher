'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';
import AHWebView from "../../common/AHWebView";
import {Actions} from "react-native-router-flux";
import Touch from "../../public/Touch";
import DisplayUtils from "../../../utils/DisplayUtils";

//答题卡
export default class AnswerCard extends Component {
    static defaultProps = {
        info: {
            choice_list: [],
            multi_choice_list: [],
            solve_list: [],
        },
        types: 2,
    };

    // 构造
    constructor(props) {
        super(props);
    }


    _choice(type) {
        let name, list;
        switch (type) {
            case 1:
                name = '单选题';
                list = this.props.info.choice_list;
                break;
            case 2:
                name = '多选题';
                list = this.props.info.multi_choice_list;
                break;
            case 3:
                name = '解答题';
                list = this.props.info.solve_list;
                break;
        }

        return (
            <View>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.line}/>
                    <Text style={styles.nameText}>{name}</Text>
                    <View style={styles.line}/>
                </View>

                {/*待批改*/}
                {type === 3 ? (

                    <View style={{height: 50, alignItems: 'center'}}>
                        <Text style={styles.waitText}>{this.props.info.solve_unread}人待批改</Text>
                    </View>

                ) : <View/>
                }

                <View style={styles.list}>
                    {this._item(list)}
                </View>
            </View>
        );
    }


    _item(list) {
        return list.map((item, k) => {
            let height = width / 100 * item.test_accuracy;
            return (
                <View style={styles.item} key={k}>
                    <Touch
                        onPress={() => {
                            if (this.props.types === 1) {
                                Actions.subjectList({
                                    info: this.props.info,
                                    test_info: item,
                                    title: this.props.info.task_name
                                })
                            } else {
                                Actions.pop();
                                this.props.replace(item.key);
                            }
                        }}
                    >
                        <View style={{
                            width: width,
                            height: width,
                            backgroundColor: '#4791ff',
                            borderRadius: width / 2,
                        }}/>
                        <View style={{
                            backgroundColor: '#ffffff',
                            position: 'absolute',
                            zIndex: 1,
                            width: width,
                            height: width - height,
                        }}/>
                        <View style={{
                            position: 'absolute',
                            width: width,
                            height: width,
                            zIndex: 1,
                            borderColor: '#4791ff',
                            borderWidth: 2,
                            borderRadius: width / 2,
                            justifyContent:'center',
                            alignItems:'center',
                        }}>
                            <Text style={styles.roundText}>{item.test_accuracy}%</Text>
                        </View>
                    </Touch>
                    <Text style={styles.itemText}>{item.test_number}</Text>
                </View>);
        });
    }

    render() {
        return (
            <View style={[{backgroundColor:'#ffffff'},this.props.types === 2 ? {paddingLeft: 25, paddingRight: 25} : null]}>

                {this.props.types === 2 ?
                    <View style={{}}>
                        <Text style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginTop: 30,
                            marginBottom: 30,
                        }}>答题卡</Text>
                        <Touch style={styles.close} onPress={() => {
                            Actions.pop();
                        }}>
                            <Image source={require('../../../images/modal-close.png')} style={styles.closeImg}/>
                        </Touch>
                    </View>
                    :
                    null
                }
                {/* */}
                {this.props.types === 2 ?
                    <ScrollView showsVerticalScrollIndicator={false} rticalScrollIndicator={false}
                                alwaysBounceVertical={true} style={{height: Dimensions.get('window').height - 85}}>

                        { (this.props.info.choice_list.length > 0) ? this._choice(1) : <View/>}


                        { (this.props.info.multi_choice_list.length > 0) ? this._choice(2) : <View/>}


                        { (this.props.info.solve_list.length > 0) ? this._choice(3) : <View/>}
                    </ScrollView>
                    :
                    <View>

                        { (this.props.info.choice_list.length > 0) ? this._choice(1) : <View/>}


                        { (this.props.info.multi_choice_list.length > 0) ? this._choice(2) : <View/>}


                        { (this.props.info.solve_list.length > 0) ? this._choice(3) : <View/>}
                    </View>
                }

            </View>
        );
    }
}

const width = (Dimensions.get('window').width - 150) / 5;

const styles = StyleSheet.create({
    close: {
        position: 'absolute',
        right: -20,
        top: 10,
        width: 50,
        height: 50,
    },
    closeImg: {
        position: 'absolute',
        width: 16,
        height: 16,
        right: 20,
        top: 23
    },
    waitText: {
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: '#cdcdcd',
        color: '#fff',
        borderRadius: 15,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
    },
    line: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        height: 10,
        width: (Dimensions.get('window').width - 120) / 2,
    },
    nameText: {
        width: 70,
        textAlign: 'center',
        color: '#b5b5b5'
    },
    list: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (Dimensions.get('window').width),
    },
    item: {
        width: (Dimensions.get('window').width - 150) / 5,
        marginRight: 25,
        marginBottom: 10,
        justifyContent: 'center',
    },
    round: {
        width: width,
        height: width,
        borderWidth: 2,
        borderColor: '#4791ff',
        borderRadius: 100,
        overflow: 'hidden',
    },
    roundText: {
        backgroundColor: 'transparent',
        fontSize:13,
        color:'#000000'
    },
    roundBlock: {
        position: 'absolute',
        bottom: 0,
        width: width,
        backgroundColor: '#4791ff',
        zIndex: 1,
    },
    itemText: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
    }
});