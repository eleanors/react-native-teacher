// 知识点试题列表 单个试题
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    WebView,
    TouchableOpacity, Dimensions, PixelRatio
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Touch from "../public/Touch";
import HttpUtils from "../../utils/HttpUtils";
import {API} from '../../Config';
import TaskBiz from '../../biz/TaskBiz';
import AHWebView from "../common/AHWebView";
import Toast from "../../utils/Toast";
import DisplayUtils from "../../utils/DisplayUtils";

export default class ExaminationItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            height: 200,
            added: require('../../images/test-added.png'),
            add: require('../../images/test-add.png'),
            status: this.props.item.status,
        };


    }

    componentWillReceiveProps(newProps) {
        this.setState({status: newProps.item.status});
    }


    _renderFlatItem(item, index) {
        // console.log(123,item);

    }

    _addFav() {
        let item = this.props.item;
        if ((item.test_type === 1 || item.test_type === 2) && !item.answer) {
            Toast.error('题目信息不全，不可加入已选');
            return;
        }

        if (this.state.status === 1) {
            //删除

            // let data = [{
            //     cloud_subject_id: item.cloud_subject_id,
            //     cloud_test_id: item.cloud_test_id,
            //     test_type: item.isopt,
            // }];
            // data = JSON.stringify(data);


            let testType = (item.isopt)?item.isopt:item.test_type;

            HttpUtils.request(API.DelFavorites, {
                cloud_subject_id: item.cloud_subject_id,
                cloud_test_id: item.cloud_test_id,
                test_type: testType,
            }).then(res => {
                // console.log(res);
                // this.props.item.status = 1;
                this.setState({status: 0});

                if (this.props.onStatusChange) {
                    this.props.onStatusChange(false);
                }
                TaskBiz.reduce(1);
            })
        } else {


            let testType = (item.isopt)?item.isopt:item.test_type;

            //加入
            let data = [{
                cloud_subject_id: item.cloud_subject_id,
                cloud_test_id: item.cloud_test_id,
                test_type: testType,
            }];
            data = JSON.stringify(data);
            HttpUtils.request(API.AddFavorites, {
                data: data
            }).then(res => {
                // this.props.item.status = 1;
                this.setState({status: 1});
                TaskBiz.add(1);

                if (this.props.onStatusChange) {
                    this.props.onStatusChange(true);
                }
            })
        }
    }


    render() {

        let html = `<div style="width: 100%;overflow: hidden;">${this.props.item.topic}</div>`;

        if (this.props.item.options_a) {
            html += `<div style="margin-top: 10px;width: 100%;overflow: hidden;">
                         <span style="width: 10%;float: left;">A.</span>
                         <div style="width: 90%;float: left;overflow: hidden;word-wrap:break-word;">${this.props.item.options_a}</div>
                     </div>`;
        }
        if (this.props.item.options_b) {
            html += `<div style="margin-top: 10px;width: 100%;overflow: hidden;" >
                         <span style="width: 10%;float: left;">B.</span>
                         <div style="width: 90%;float: left;overflow: hidden;word-wrap:break-word;">${this.props.item.options_b}</div>
                     </div>`;
        }
        if (this.props.item.options_c) {
            html += `<div style="margin-top: 10px;width: 100%;overflow: hidden;" >
                         <span style="width: 10%;float: left;">C.</span>
                         <div style="width: 90%;float: left;overflow: hidden;word-wrap:break-word;">${this.props.item.options_c}</div>
                     </div>`;
        }
        if (this.props.item.options_d) {
            html += `<div style="margin-top: 10px;width: 100%;overflow: hidden;" >
                         <span style="width: 10%;float: left;">D.</span>
                         <div style="width: 90%;float: left;overflow: hidden;word-wrap:break-word;">${this.props.item.options_d}</div>
                     </div>`;
        }
        if (this.props.item.options_e) {
            html += `<div class="option">
                         <span style="width: 10%;float: left;">E.</span>
                         <div style="width: 90%;float: left;overflow: hidden;word-wrap:break-word;">${this.props.item.options_e}</div>
                     </div>`;
        }
        if (this.props.item.options_f) {
            html += `<div style="margin-top: 10px;width: 100%;overflow: hidden;" >
                         <span style="width: 10%;float: left;">F.</span>
                         <div style="width: 90%;float: left;overflow: hidden;word-wrap:break-word;">${this.props.item.options_f}</div>
                     </div>`;
        }


        let testType = parseInt((this.props.item.isopt)?this.props.item.isopt:this.props.item.test_type);
        switch (testType) {
            case 1:
                this.props.item.opt = '单选题';
                break;
            case 2:
                this.props.item.opt = '多选题';
                break;
            case 3:
                this.props.item.opt = '解答题';
                break;
            case 4:
                this.props.item.opt = '完形填空';
                break;
            default:
                this.props.item.opt = '解答题';
                break;
        }

        return (
            <View style={{
                borderBottomWidth: DisplayUtils.px2dp(1),
                borderColor: '#edecec',
                padding: 15,
                backgroundColor: '#fff',
            }}>
                <Touch onPress={() => this.props.itemPress()}>
                    <View>
                        <Text style={{
                            color: '#4791ff',
                            fontSize: 16
                        }}>{this.props.index + 1}、{this.props.item.opt}</Text>
                        <View style={{
                            backgroundColor: '#fff',
                            width: Dimensions.get('window').width - 30,
                        }}>
                            <AHWebView
                                html={html}
                                maxHeight={200}
                                webStyle={{
                                    width: Dimensions.get('window').width - 40,
                                    maxHeight: 200,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                    marginTop: 5
                                }}
                                ImageZoom={false}
                            />
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: 10, flexDirection: 'row', flex: 2, alignItems: 'center'}}>
                                    <Text style={styles.starText}>难度</Text>
                                    <Image
                                        source={(this.props.item.difficulty_value >= 1 || this.props.item.difficulty_id >= 1) ? require('../../images/star.png') : require('../../images/unstar.png')}
                                        style={styles.star}/>
                                    <Image
                                        source={(this.props.item.difficulty_value >= 2 || this.props.item.difficulty_id >= 2) ? require('../../images/star.png') : require('../../images/unstar.png')}
                                        style={styles.star}/>
                                    <Image
                                        source={(this.props.item.difficulty_value >= 3 || this.props.item.difficulty_id >= 3) ? require('../../images/star.png') : require('../../images/unstar.png')}
                                        style={styles.star}/>
                                    <Image
                                        source={(this.props.item.difficulty_value >= 4 || this.props.item.difficulty_id >= 4) ? require('../../images/star.png') : require('../../images/unstar.png')}
                                        style={styles.star}/>
                                    <Image
                                        source={(this.props.item.difficulty_value >= 5 || this.props.item.difficulty_id >= 5) ? require('../../images/star.png') : require('../../images/unstar.png')}
                                        style={styles.star}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </Touch>

                {/*{２是准备教案}*/}
                {(this.props.types === 2)
                    ?

                    <Touch
                        onPress={() => this.props.delTest(this.props.item.id)}
                        style={styles.del}
                    >
                        <View>
                            <Text style={styles.delText}>删除</Text>
                        </View>
                    </Touch>
                    :
                    <Touch
                        onPress={() => this._addFav()}
                        style={styles.addView}
                    >
                        <View>
                            <Image source={(this.state.status == 1) ? this.state.added : this.state.add}
                                   style={(this.state.status == 1) ? styles.added : styles.add}/>
                        </View>
                    </Touch>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    addView: {
        position: 'absolute',
        width: 80,
        height: 60,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        paddingRight: 20,
        justifyContent: 'center'
    },
    del: {
        position: 'absolute',
        right: 20,
        bottom: 0,
        width: 80,
        height: 60,
        justifyContent: 'flex-end'
    },
    delText: {
        fontSize: 16,
        textAlign: 'right',
        color: '#ff4c54',
        marginBottom: 15,
    },
    item: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        backgroundColor: '#fff',
    },
    starText: {
        color: '#b5b5b5',
        marginRight: 5,
        paddingTop: 3,
    },
    star: {
        width: 13,
        height: 13,
        marginTop: 3,
        marginRight: 2,
    },
    add: {
        width: 14,
        height: 14,
        alignSelf: 'flex-end',
        marginTop: 15
    },
    added: {
        width: 16,
        height: 11,
        alignSelf: 'flex-end',
        marginTop: 16
    }
});