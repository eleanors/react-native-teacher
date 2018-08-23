/**
 * Created by heaton on 2017/12/14.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    TouchableOpacity,
} from 'react-native';

export default class Touch extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            disabled: false,
            lastClickTime: 0
        };
    }

    static defaultProps = {
        delay: 500,
        opacity: 0.4
    };


    onClickDelay(lastClickTime) {
        let currClickTime = new Date().getTime();
        console.log('touch currClickTime - ' + currClickTime + ' lastClickTime -- ' + this.state.lastClickTime);
        let delayMilliseconds = currClickTime - lastClickTime;
        this.setState({disabled: true});
        if (delayMilliseconds >= this.props.delay) {
            this.props.onPress();
            this.setState({
                lastClickTime: currClickTime,
                disabled: false
            });
        } else {
            let _this = this;
            setTimeout(()=>{
                _this.setState({
                    disabled: false,
                    lastClickTime:new Date().getTime()
                });
            },this.props.delay);
        }
    }

    render() {
        let child = this.props.children;
        return (
            <TouchableOpacity
                onPress={this.onClickDelay.bind(this,this.state.lastClickTime)}
                style={[this.props.style,{opacity:this.state.disabled?0.2:1}]}
                disabled={this.state.disabled}
                opacity={this.state.disabled?this.props.opacity:1}
                activeOpacity={this.state.disabled?1:this.props.opacity}
            >
                {child}
            </TouchableOpacity>
        );
    }
}