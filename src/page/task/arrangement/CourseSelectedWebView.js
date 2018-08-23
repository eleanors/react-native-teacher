/**
 * Created by mac on 2018/3/6.
 * Desription :
 */

'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    WebView,
    Platform,
    Dimensions,
    PixelRatio
} from 'react-native';
import {Checkbox} from 'teaset';
import DisplayUtils from '../../../utils/DisplayUtils';
import AHWebView from "../../common/AHWebView";


export default class CourseSelectedWebView extends PureComponent {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            itemChecked: this.props.item.checked,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            itemChecked: nextProps.item.checked
        });
    }


    render() {

        // console.log("this.props.item.topic:",this.props.item.topic);

        let topicView = <AHWebView
            index={this.props.item.index}
            html={this.props.item.topic}
            maxHeight={200}
            viewStyle={{width: Dimensions.get('window').width - 80}}
            webStyle={{
                width: Dimensions.get('window').width - 80,
                maxHeight: 200,
                overflow: 'hidden'
            }}
        />;

        if (this.props.item.type == 'sectionTitle') {
            return (
                <View style={styles.titleView}>
                    <Checkbox
                        title={this.props.item.title}
                        titleStyle={{color: '#0586FF', paddingLeft: 10, fontSize: 16}}
                        checked={this.props.item.checked}
                        size='lg'
                        checkedIcon={<Image style={{width: 25, height: 25,}}
                                            source={require('../../../images/btn_selected.png')}/>}
                        uncheckedIcon={<Image style={{width: 25, height: 25,}}
                                              source={require('../../../images/btn_unselected.png')}/>}
                        onChange={checked => {
                            console.log("选中状态：", checked)
                            this.props.checkChange(checked, this.props.index);
                        }}
                        style={{marginLeft: 10}}
                    />
                </View>);
        } else {
            return (
                <View>
                    <TouchableOpacity onPress={() => {
                        this.props.checkChange(!this.state.itemChecked, this.props.index);
                        this.setState({itemChecked: !this.state.itemChecked});
                    }}>
                        <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
                            <Checkbox
                                titleStyle={{
                                    color: this.props.isRepeat ? 'red' : 'black',
                                    paddingLeft: 5,
                                    fontSize: 16,
                                    opacity: 0.9
                                }}
                                checked={this.state.itemChecked}
                                size='lg'
                                checkedIcon={<Image style={{width: 25, height: 25,}}
                                                    source={require('../../../images/btn_selected.png')}/>}
                                uncheckedIcon={<Image style={{width: 25, height: 25,}}
                                                      source={require('../../../images/btn_unselected.png')}/>}
                                onChange={checked => {
                                    console.log("选中状态：", checked, this.props.index);
                                    this.props.checkChange(checked, this.props.index);
                                }}
                                style={{margin: 10, height: 25,}}
                            />
                            <View style={{
                                backgroundColor: '#fff',
                                flex: 1,
                                paddingTop: 10,
                            }}>
                                <Text style={{
                                    color: this.props.isRepeat ? 'red' : 'gray',
                                    fontSize: 14,
                                    opacity: 0.9
                                }}>
                                    第{this.props.item.index + 1}题{this.props.isRepeat ? this.props.isTeaching?', 加入过' : ', 布置过' : ''}
                                </Text>
                                {topicView}
                            </View>
                        </View>

                    </TouchableOpacity>
                    <View style={styles.divideLine}/>
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F5F5F5',
    },
    titleView: {
        width: DisplayUtils.SCREEN.width,
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderBottomWidth: DisplayUtils.MIN_LINE_HEIGHT,
        borderBottomColor: '#F1F0F0',
        marginTop:10,
    },
});