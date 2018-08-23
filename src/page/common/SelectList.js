'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert, Dimensions,
} from 'react-native';
import Touch from "../public/Touch";

export default class SelectList extends Component {


    static defaultProps = {
        top: 0,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            show: false,
            list: this.props.list
        };
    }

    _changeState(type) {
        this.setState({
            show: type
        });
        this.props.close();
    }

    // componentDidMount(){
    //     this.props.refs({
    //         changeState: ()=>{
    //             this.setState({
    //                 show: (this.state.show)? false: true
    //             });
    //         }
    //     });
    // }

    componentWillReceiveProps(newVal) {
        console.log('newVal', newVal);
        this.setState({
            show: newVal.show,
            list: newVal.selectList,
            defaultSelect: newVal.defaultSelect
        })
    }

    _item(list) {
        // if(list.length <= 0) return;
        return list.map((item, k) => {
            let itemBgColor = this.props.defaultSelect == k ?'#4e8cff':'#ffffff';
            let textColor = this.props.defaultSelect == k ?'#ffffff':'#2c2c2c';
            return (
                <Touch
                    key={k}
                    onPress={() => {
                        console.log(k);
                        this.props.selected(k);
                    }}>
                     <View style={[styles.li,{backgroundColor:itemBgColor}]}>
                         <Text style={[styles.item,{color:textColor}]}>{item}</Text>
                     </View>
                </Touch>
            );
        })
    }

    render() {
        return (
            <View style={[styles.select, {top: this.props.top}, (!this.state.show) ? {display: 'none'} : null]}>
                <TouchableWithoutFeedback onPress={() => {
                    this._changeState(false);
                }}>
                    <View style={styles.selectBg}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.selectList}>
                    {/**/}
                    {this._item(this.props.list)}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    li: {
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderColor: '#edecec',
    },
    selected: {
        // backgroundColor: '#4e8cff'
    },
    selectedText: {
        color: '#fff',
    },
    item: {
        textAlign: 'center',
        fontSize: 16,
        paddingTop:15,
        paddingBottom:15,
    },
    selectList: {
        width: Dimensions.get('window').width,
    },
    select: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    selectBg: {
        position: 'absolute',
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#000',
        opacity: 0.8
    },
});