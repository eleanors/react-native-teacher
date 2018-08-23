/**
 * Created by heaton on 2018/3/28.
 * Desription :
 */

'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
import Slider from "react-native-slider";

class MySlider extends Slider {
    _renderThumbImage = () => {
        var {thumbImage} = this.props;

        if (!thumbImage) return;

        return <Image source={thumbImage} resizeMode='contain' style={{width: 30, height: 30}}/>;
    };
}

export default class SliderView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let propsValue = this.props.value && this.props.value > 0 && this.props.value < 10 ? this.props.value : 1;
        this.state = {
            value: propsValue,
        };
    }

    _getSliderImage() {
        let imageSource;
        console.log(this.state.value);
        switch (this.state.value) {
            case 1:
                imageSource = require('../../images/slider_percent_10.png');
                break;
            case 2:
                imageSource = require('../../images/slider_percent_20.png');
                break;
            case 3:
                imageSource = require('../../images/slider_percent_30.png');
                break;
            case 4:
                imageSource = require('../../images/slider_percent_40.png');
                break;
            case 5:
                imageSource = require('../../images/slider_percent_50.png');
                break;
            case 6:
                imageSource = require('../../images/slider_percent_60.png');
                break;
            case 7:
                imageSource = require('../../images/slider_percent_70.png');
                break;
            case 8:
                imageSource = require('../../images/slider_percent_80.png');
                break;
            case 9:
                imageSource = require('../../images/slider_percent_90.png');
                break;
        }
        return imageSource;
    }


    render() {
        let image = this._getSliderImage();
        return (
            <View style={styles.popupSliderRoot}>
                <TouchableOpacity
                    style={styles.popupSliderCancel}
                    onPress={() => this.props.onCancel()}>
                    <Image source={require('../../images/btm_close.png')} style={{width: 20, height: 20}}/>
                </TouchableOpacity>
                <View style={styles.popupSliderView}>
                    <MySlider
                        step={1}
                        minimumValue={1}
                        maximumValue={9}
                        thumbImage={image}
                        onValueChange={(value) => this.setState({value: value})}
                        minimumTrackTintColor='#ffcc5f'
                        thumbStyle={{
                            width: 30,
                            height: 30,
                            backgroundColor: 'transparent',
                        }}
                        value={this.state.value}/>
                </View>

                <TouchableOpacity
                    style={styles.popupSliderSure}
                    onPress={() => this.props.onSure(this.state.value)}>
                    <Image source={require('../../images/btm_ensure.png')} style={{width: 20, height: 20}}/>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    popupSliderRoot: {
        width: DisplayUtils.SCREEN.width,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    popupSliderCancel: {
        padding: 10,
        width: 50,
        height: 50,
        justifyContent: 'center'
    },
    popupSliderView: {
        flex: 1,
        height: 50,
        justifyContent: 'center'
    },
    popupSliderSure: {
        padding: 10,
        width: 50,
        height: 50,
        justifyContent: 'center'
    },
    popupSliderPlaceText: {
        width: 30,
        height: 30,
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: 15,
        top: 10,
        textAlign: 'center',
        color: 'white',
        textAlignVertical: 'center',
        fontSize: 13
    }
});