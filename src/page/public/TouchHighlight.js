/**
 * Created by heaton on 2017/12/14.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default class Highlight extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            disabled: false,
            lastClickTime: 0,
            isTouching:false
        };
    }

    static defaultProps = {
        delay: 1000,
        normalColor: '#4791ff',
        activeColor: '#3c6cb3',
    };



    OnpressIn(){
        let currClickTime = new Date().getTime();
        let delayMilliseconds = currClickTime - this.state.lastClickTime;
        console.log('delayMilliseconds -- '+delayMilliseconds);
        if (delayMilliseconds >= this.props.delay) {
            console.log('set isTouching true');
            this.setState({isTouching:true,lastClickTime:currClickTime});
        }
    }
    OnpressOut(){
        if(this.state.isTouching){
            this.setState({isTouching:false});
            this.props.onPress();
        }


    }
    render() {
        let child = this.props.children;
        return (
            <TouchableWithoutFeedback
                onPressIn={()=>this.OnpressIn()}
                onPressOut={()=>this.OnpressOut()}
            >
                <View style={[this.props.style,{opacity:this.state.disabled?0.2:1,backgroundColor: this.state.isTouching?this.props.activeColor:this.props.normalColor}]}>
                    {child}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}