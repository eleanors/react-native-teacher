// 图片查看器

'use strict';

import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PhotoView from 'react-native-photo-view';
import DisplayUtils from '../../utils/DisplayUtils';
const SCREEN = DisplayUtils.SCREEN;
export default class ImageDialog extends Component {

    static defaultProps = {
        types: 1
    };

    // 构造
    constructor(props) {
        super(props);
    }

    render() {
        let maximumZoomScale;
        let scale;
        if(this.props.types === 2){
            maximumZoomScale = 10;
            scale = 1;
        }else{
            maximumZoomScale = 1;
            scale = 0.5;
        }
        console.log('scale',scale);
        return (
            <View style={styles.root}>
                <PhotoView
                    source={{uri: this.props.img}}
                    scale={Platform.OS==='android'?scale:0.5}
                    minimumZoomScale={Platform.OS==='android'?0.3:scale}
                    maximumZoomScale={Platform.OS==='android'?10:maximumZoomScale}
                    androidScaleType="fitCenter"
                    style={{
                        width: SCREEN.width,
                        height: SCREEN.height,
                        backgroundColor:'rgba(255,255,255,0.8)'
                    }}
                    onViewTap={()=>Actions.pop()}
                    onTap={()=>Actions.pop()}/>
                <TouchableOpacity style={styles.close} onPress={() => Actions.pop()}>
                    <Image style={{width: 20, height: 20}} source={require('../../images/modal-close.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        backgroundColor: "rgba(50,52,52,0.3)",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    close: {
        position: 'absolute',
        padding: 20,
        right:0,
        top: 10,
    }
});