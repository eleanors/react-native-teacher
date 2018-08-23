// 图片查看器

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
// import ImageView from './test';
import ImageView from 'react-native-image-view';

export default class InputClean extends Component {


    // 构造
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            showClean: false,

        };
    }

    static value = '';

    _onChangeText(text){
        if(text && text.length > 0 ){
            this.setState({
                showClean: true
            })
        }else{

            this.setState({
                showClean: false
            })
        }
        this.props.onchange(text);
        this.value = text;
    }

    _onchage(){
        if(this.value && this.value.length > 0){
            this.setState({
                showClean: true
            })
        }else{

            this.setState({
                showClean: false
            })
        }
    }

    render() {
        return (
            <View style={{flexDirection:'row',}}>
                <Input
                    onFocus={()=>this._onchage()}
                    onBlur={()=>this.setState({showClean: false})}
                    onChangeText={(text)=>this._onChangeText(text)}
                    ref={ref => this.refs = ref}
                    {...this.props}
                />
                {(this.state.showClean)?
                    <TouchableOpacity
                        style={{
                            padding:10,
                            justifyContent:'center',
                            alignItems:'center',
                        }}
                        onPress={()=>{
                            this.refs.clear();
                            this.setState({
                                showClean: false
                            })
                            this.props.clearInput()
                        }}>
                        <Image
                            source={require('../../images/input-clean.png')}
                            style={styles.inputClear}/>
                    </TouchableOpacity>
                    :
                    null
                }

            </View>
        );
    }
}
const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f8f8f8',
        borderWidth: 0,
        height: 50,
        flex:1,
        borderRadius: 5,
        width: 100,

    },

    inputClear:{
        width:15,
        height:15,
    },
});