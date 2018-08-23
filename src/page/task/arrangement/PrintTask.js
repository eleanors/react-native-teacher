
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';
import AHWebView from "../../common/AHWebView";
import Touch from "../../public/Touch";
import {Actions} from "react-native-router-flux";
import ListRow from "../../common/ListRow";
import {CachedImage} from 'react-native-cached-image';
import DisplayUtils from "../../../utils/DisplayUtils";
let moment = require('moment');


export default class PrintTask extends Component {
    // 构造
    constructor(props) {
        super(props);
        if(this.props.teaching){
            Actions.refresh({title: '打印教案'});
        }
        console.log('props',this.props);
    }

    static defaultProps={
        classList: [],
        data: []
    };

    _renderItem(list){
        return list.map((item,key)=>{
            return (
                <Touch key={key} onPress={()=>{
                    let info = this.props.data[key];
                    console.log(this.props.data);
                    Actions.shareBoard({
                        shareInfo: {
                            title: info.share_title,
                            desc: info.share_desc,
                            url: info.pdf_url,
                            img: 'http://qxyunketang.oss-cn-hangzhou.aliyuncs.com/images/teacherlogo.png'
                        }
                    });
                }}>
                    { this.props.teaching ? 
                        <View style={styles.list}>
                            <CachedImage
                                style={styles.img}
                                source={{uri: item.class_img_url}}
                                defaultSource={require('../../../images/head_class.png')}
                                fallbackSource={require('../../../images/head_class.png')}/>
                            <View style={{flex: 1}}>
                                <Text style={styles.courseText} numberOfLines={1}>{item.course_name}</Text>
                                <Text style={styles.courseTextSub}>{item.class_name}</Text>
                            </View>
                            <Text style={styles.courseTime}>{moment(item.start_time*1e3).format('YYYY.MM.DD hh:mm')}</Text>
                        </View>
                        :
                        <View style={styles.list}>
                            <CachedImage
                                style={styles.img}
                                source={{uri: item.class_img_url}}
                                defaultSource={require('../../../images/head_class.png')}
                                fallbackSource={require('../../../images/head_class.png')}/>
                            <Text style={styles.text}>{item.class_name}</Text>
                        </View>
                    }
                </Touch>
            );
        })
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} tabLabel='作业结果' showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true}>
                {this._renderItem(this.props.classList)}

            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10,
        height: Dimensions.get('window').height - 85
    },
    list: {

        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec'
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    text: {
        marginLeft: 10,
    },
    // 教案样式
    courseText: {
        color: '#4b4b4b',
        padding: 2,
        fontSize: 18,
        marginRight: 5,
        marginLeft: 10,
    },

    courseTextSub: {
        color: '#b5b5b5',
        padding: 2,
        fontSize: 14,
        marginRight: 5,
        marginLeft: 10,
    },

    courseTime: {
        color: '#b5b5b5', 
        marginRight: 15,
    }
});