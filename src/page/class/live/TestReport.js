/**
 * 添加课程
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import DisplayUtils from '../../../utils/DisplayUtils';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import {API} from "../../../Config";
import Video from '../../task/Subject/Video/index';
import {
    ListRow,
} from 'teaset';
import moment from 'moment';

export default class TestReport extends Component {


    static onExit() {
        // Picker.isPickerShow((state)=>{});
        Picker.hide();
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            selectTitle: '',
            nameList: [],
            item: {
                info: {
                    level: '',
                    accuracy: '',
                    avergae_accuracy: '',
                    highest_accuracy: '',
                    rank: '',
                    lores: [],
                }
            },
            list: []
        };

        HttpUtils.request(API.GetLiveReport,{
            task_id: this.props.task_id,
        }).then(res=>{
            console.log(res);
            let nameList = [];
            let selectTitle;
            let item;
            // this.setState(res);
            for(let i in res){
                if(i == 0){
                    selectTitle = res[i].student_name;
                    item = res[i];
                    Actions.refresh({title: selectTitle});
                }
                nameList.push(res[i].student_name.toString());
            }
            this.setState({
                nameList: nameList,
                selectTitle: selectTitle,
                item: item,
                list: res
            });
        })

    }



    _showPopover(){
        console.log(this.state.selectTitle);
        Picker.init({
            pickerData: this.state.nameList,
            selectedValue: [this.state.selectTitle],
            pickerTextEllipsisLen: 20,
            pickerTitleText: '选择学生',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            onPickerConfirm: (pickedValue, pickedIndex) => {
                Actions.refresh({title: pickedValue[0]});
                let item = this.state.list[pickedIndex];
                this.setState({
                    selectTitle: pickedValue[0],
                    item: item
                });
            }
        });
        Picker.show();
    }

    _getLeft(rank){
        console.log(rank);
        let now = rank.split('/')[0];
        let total = rank.split('/')[1];
        let level1 = (Dimensions.get('window').width - 60) / 4 ;
        let level2 = (Dimensions.get('window').width - 60) / 2 ;
        let level3 = (Dimensions.get('window').width - 60) * 3 / 4 ;

        let all = (Dimensions.get('window').width - 60);

        let fen = parseFloat(all/total);
        let left = fen * (total - now + 1) - 4;

        let img;
        if(left <= level1){
            img = require('../../../images/location1.png');
        }else if(left > level1 && left <= level2){
            img = require('../../../images/location2.png');
        }else if(left > level2 && left <= level3){
            img = require('../../../images/location3.png');
        }else{
            img = require('../../../images/location4.png');
        }

        return (
            <Image source={img} style={[styles.lineImage1, {left: left}]}/>
        );
    }

    _renderList(list){

        return list.map((item,k)=>{
            let width = parseInt((Dimensions.get('window').width - 60) /12 * 11 *  item.accuracy / 100);
            let style;
            if(item.accuracy < 60){
                style = styles.liLineIn4;
            }else if(item.accuracy >= 60 && item.accuracy < 80){
                style = styles.liLineIn3;

            }else if(item.accuracy >= 80 && item.accuracy < 90){

                style = styles.liLineIn2;
            }else{

                style = styles.liLineIn1;
            }

            return (

                <View style={styles.li} key={k}>
                    <Text style={styles.liTitle} numberOfLines={1}>{item.lore_name}</Text>
                    <View style={styles.liLineView}>
                        <View style={styles.liLine}>
                            <View style={[styles.liLineIn, style , {width: width}]}>

                            </View>
                        </View>
                        <Text style={{flex: 1,marginTop: 5,textAlign: 'right'}}>{item.accuracy}</Text>
                    </View>
                </View>
            );
        })
    }
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true} style={styles.bg}>
                <View style={styles.top}>
                    <Image source={require('../../../images/TestReportBg.png')} style={styles.topImage}/>
                    <View style={styles.level}>
                        <Text style={styles.levelText}>{this.state.item.info.level}</Text>
                    </View>

                    <View style={styles.topBottom}>
                        <View style={styles.lv}>

                            <View style={styles.yuan}>
                                <Text style={styles.yuanText}>{this.state.item.info.accuracy}%</Text>
                                <View style={[styles.yuanView, {height: parseInt(70 * this.state.item.info.accuracy / 100)}]}>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.lvText}>正确率</Text>
                            </View>
                        </View>
                        <View style={styles.lv}>

                            <View style={styles.yuan}>
                                <Text style={styles.yuanText}>{this.state.item.info.avergae_accuracy}%</Text>
                                <View style={[styles.yuanView, {height: parseInt(70 * this.state.item.info.avergae_accuracy / 100)}]}>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.lvText}>平均正确率</Text>
                            </View>
                        </View>
                        <View style={styles.lv}>
                            <View style={styles.yuan}>
                                <Text style={styles.yuanText}>{this.state.item.info.highest_accuracy}%</Text>
                                <View style={[styles.yuanView, {height: parseInt(70 * this.state.item.info.highest_accuracy / 100)}]}>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.lvText}>最高正确率</Text>
                            </View>
                        </View>
                    </View>

                </View>

                <View style={styles.center}>
                    <View style={styles.rank}>
                        <View style={styles.rankTitle}>
                            <Text style={styles.rankTitleText}>综合排名</Text>
                            <Text style={styles.rankTitleTextRight}>{this.state.item.info.rank}</Text>
                        </View>
                        <View style={styles.rankLine}>
                            {this._getLeft(this.state.item.info.rank)}
                            <View style={[styles.lines, styles.line1]}>

                            </View>
                            <View style={[styles.lines, styles.line2]}>

                            </View>
                            <View style={[styles.lines, styles.line3]}>

                            </View>
                            <View style={[styles.lines, styles.line4]}>

                            </View>
                        </View>
                        <View style={styles.rankTextView}>
                            <Text style={styles.rankText}>较差</Text>
                            <Text style={styles.rankText}>中等</Text>
                            <Text style={styles.rankText}>良好</Text>
                            <Text style={styles.rankText}>优秀</Text>
                        </View>
                    </View>

                    <View style={[styles.rank, {marginTop: 20}]}>
                        <View style={[styles.rankTitle, {marginBottom: 20,}]}>
                            <Text style={styles.rankTitleText}>知识点掌握情况</Text>
                        </View>
                        {this._renderList(this.state.item.info.lores)}
                    </View>

                </View>


            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    liTitle: {
        // textOverflow: 'ellipsis',
    },
    li: {
        marginBottom: 10,
    },
    liLineIn: {
        height: 10,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    liLineIn1: {
        backgroundColor: '#4692ff',
    },
    liLineIn2: {
        backgroundColor: '#fed35f',
    },
    liLineIn3: {
        backgroundColor: '#42baff',
    },
    liLineIn4: {
        backgroundColor: '#ffae6d',
    },
    liLineIn5: {
        backgroundColor: '#42baff',
    },
    liLineView: {
        flexDirection: 'row',
    },
    liLine: {
        flex: 11,
        height: 10,
        backgroundColor: '#eeeeee',
        borderRadius: 10,
        marginTop: 10,
        overflow: 'hidden',
    },
    rankTextView: {
        flexDirection: 'row',
    },
    rankText: {
        flex: 1,
        textAlign: 'center',
        marginTop: 10,
    },
    lineImage1: {
        width: 8.5,
        height: 16,
        position: 'absolute',
        top: -20,
    },
    lineImage2: {
        width: 8.5,
        height: 16,
        position: 'absolute',
        top: -20,
    },
    lineImage3: {
        width: 8.5,
        height: 16,
        position: 'absolute',
        top: -20,
    },
    lineImage4: {
        width: 8.5,
        height: 16,
        position: 'absolute',
        top: -20,
    },
    rankLine: {
        flexDirection: 'row',
    },
    lines: {
        flex: 1,
        height: 10,
        backgroundColor: '#000',
        // paddingTop: 40,
    },
    line1: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: '#ffae6d',
    },
    line2: {
        backgroundColor: '#fed35f',
    },
    line3: {
        backgroundColor: '#42baff',
    },
    line4: {
        backgroundColor: '#4692ff',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },

    center: {
        marginTop: Dimensions.get('window').width * 640 / 750 - 50,
        paddingLeft: 10,
        paddingRight: 10,
        width: Dimensions.get('window').width,
        zIndex: 100,
        position: 'relative',
    },

    rank: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20,
    },

    rankTitle: {
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#eeeeee',
        flexDirection: 'row',

        marginBottom: 40,
    },
    rankTitleText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
        paddingBottom: 20,
        fontWeight: 'bold',
    },
    rankTitleTextRight: {
        color: '#ffa96f',
        flex: 1,
        textAlign: 'right',
    },
    lvText: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 10,
        backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        top: 0,
        zIndex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 60,
        backgroundColor: '#f9f9f9',
    },
    top: {
        position: 'absolute',
        top: 0,
        zIndex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 640 / 750,
        backgroundColor: '#fff',
    },
    topImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 640 / 750,
        zIndex:1,
    },
    level: {
        zIndex:100,
        position: 'absolute',
        top: 20,
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth:5,
        borderColor: '#79cefd',
        left: (Dimensions.get('window').width - 110) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5cbffc',
    },
    levelText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 60,
        paddingLeft: 5,
        paddingBottom: 5,
    },
    topBottom: {
        width: Dimensions.get('window').width,
        zIndex:100,
        position: 'absolute',
        bottom: 80,
        left: 0,
        flexDirection: 'row',
    },
    lv: {
        flex: 1,
        alignItems: 'center',
    },
    yuan: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 5,
        borderColor: '#59a5fc',
        backgroundColor: '#59a5fc',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    yuanText: {
        position: 'relative',
        color: '#fff',
        zIndex: 10,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: 'transparent'
    },
    yuanView: {
        zIndex: 0,
        position: 'absolute',
        width: 70,
        bottom: 0,
        left: 0,
        backgroundColor: '#fed35f',
    },
});