'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity, Dimensions,
} from 'react-native';
import DisplayUtils from "../../../utils/DisplayUtils";
import TextUtils from "../../../utils/TextUtils";
import {
    Actions,
} from 'react-native-router-flux';
import Touch from "../../public/Touch";

export default class RankingList extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        console.log(this.props);
    }


    _renderItem(list) {
        return list.map((item, k) => {
            console.log(item);
            let imgUri = TextUtils.isEmpty(item.img_url) ? require('../../../images/head_student.png') : {uri: item.img_url};
            let width = progressWidth * item.student_accuracy / 100;
            let indexTextColor = k > 2 ? '#4f5050' : '#ffa462';
            return (
                <View style={styles.li} key={k}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.liText,{color:indexTextColor}]}>{k + 1}</Text>
                        <View>
                            <Image source={imgUri} style={styles.headimg}/>
                        </View>
                    </View>
                    <View style={{marginLeft: 20}}>
                        <Text style={styles.name}>
                            {item.user_name}
                        </Text>
                        <View style={styles.progress}>
                            <View style={[styles.progressBar, {width: width}]}></View>
                            <Text>{item.student_accuracy}%</Text>
                        </View>
                    </View>
                </View>
            );
        });
    }


    render() {
        return (
            <View>
                {this._renderItem(this.props.list)}
            </View>
        );
    }
}


const progressWidth = Dimensions.get('window').width - 180;

const styles = StyleSheet.create({
    myClass: {
        color: '#fff',
        backgroundColor: '#ffa14e',
        paddingLeft: 2,
        paddingRight: 2,
        marginLeft: 20,
    },
    liText: {
        fontSize: 20,
        marginRight: 20,
        marginTop: 9,
        color: '#ffa96f',
    },
    name: {
        marginTop: 5,
    },
    progress: {
        flexDirection: 'row',
    },
    progressBar: {
        backgroundColor: '#4791ff',
        marginRight: 10,
        borderRadius: 10,
        height: 10,
        marginTop: 5,
    },
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 4 - 10,
        backgroundColor: '#4791ff',
        borderRadius: 2,
        borderWidth: 0,
    },
    scrollView: {
        minHeight: Dimensions.get('window').height - 135,
        backgroundColor: "#fff"
    },
    li: {
        backgroundColor: '#fff',
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15,
    },
    headimg: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
    studentName: {
        height: 45,
        marginTop: 13,
        marginLeft: 20,
        color: '#4b4b4b',
    },
    phone: {

        width: 14,
        height: 16,
        marginTop: 14,

    },
    phoneView: {

        width: 50,
        height: 45,
        position: 'absolute',
        right: 0,
    }

});