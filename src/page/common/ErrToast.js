/**
 * Created by heaton on 2017/12/18.
 * Desription :
 */


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import {Actions} from "react-native-router-flux";

export default class ErrToast extends Component {
    constructor(props){
        super(props);
        // StatusBar.setBackgroundColor('#ff5b5b',false);
        // StatusBar.StatusBarAnimation(true);
        this.animatedValue = new Animated.Value(0)
    }
    static defaultProps = {
        msg:'参数错误'
    };
    componentDidMount() {
        this.animate();
    }
    animate(){
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(()=>{
            // StatusBar.setTranslucent(true);
            // StatusBar.setBackgroundColor('transparent');
            if(Actions.currentScene === 'errToast'){
                Actions.pop();
            }
        });
    }
    render() {
        const movingMargin = this.animatedValue.interpolate({
            inputRange: [0, 0.1, 0.9, 1],
            outputRange: [0, 60, 60, 0]
        })
        return (
            <Animated.View style={[styles.bg,{height: movingMargin}]}>
                <Text style={styles.errMsg}>{this.props.msg}</Text>
            </Animated.View>
        );
    }
}
const styles = StyleSheet.create({
    bg:{
        width: Dimensions.get('window').width,
        height: 60,
        backgroundColor: '#ff5b5b',
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errMsg: {
        color: '#fff',
        fontSize: 20
    }
});