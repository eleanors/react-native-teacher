/**
 * 讲义
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform, Dimensions,
    TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView, {EmptyType} from '../../../page/common/EmptyView';
import ListRow from '../../common/ListRow';
import {API} from "../../../Config";
import HttpUtils from "../../../utils/HttpUtils";
import Image from 'react-native-scalable-image';
import DisplayUtils from "../../../utils/DisplayUtils";

class ScrollViewItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};

    }

    onClick() {
        this.props.onClick();
    }

    render() {

        let color;
        let sliderColor;
        //type为1时为选中状态
        if (this.props.item.type == 1) {
            color = "#1B6FFF";
            sliderColor = "#1B6FFF";
        } else {
            color = "#3A3A3A";
            sliderColor = "#fff";
        }


        return (
            <View>
                <TouchableOpacity onPress={() => {
                    this.onClick();
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 16, padding: 15, color: color}}>{(this.props.item.name)?this.props.item.name:this.props.item.names}</Text>
                        <View style={{width: 18, height: 4, backgroundColor: sliderColor, borderRadius: 2,}}></View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class SectionImgs extends Component {


    // 构造
    constructor(props) {
        super(props);
        console.log(this.props.item);
        this.props.item.map((item, index1) => {

            if (index1 == 0) {
                item.type = 1;
            } else {
                item.type = 0;
            }
        });
        let id = this.props.item[0].id;
        this.state = {
            imgList: [],
            topic_list: this.props.item,
            id: id
        };
        this.state.topic_list[0].type = 1;
        this.setState({
            topic_list: this.state.topic_list
        });

        console.log(222222,this.props.item);



    }


    onClick(index) {
        let id = this.state.topic_list[index].id;
        this.setState({
            id: id,
        });
        this.state.topic_list.map((item, index1) => {

            if (index == index1) {
                item.type = 1;
            } else {
                item.type = 0;
            }
        });

        HttpUtils.request(API.GetBookNoteList, {
            id: id,
            page: 1
        }).then(result=>{

            this.setState({
                imgList: result,
            });

            if(this.listView){
                this.listView.refresh();
                    setTimeout(()=>{

                        this.listView.scrollToOffset({x: 0, y: 0, animated: false});
                    },1000);
                // console.log(2333,this.listView.getRows());
                // this.listView.scrollToOffset({y: 0});
                // if (this.listView.getRows().length > 0) {
                //     this.listView.scrollToIndex({y: 0});
                // }
            }
        }, err => {
            console.log(err);
            this.setState({
                emptyType: EmptyType.REQUEST_ERROR,
            });

        });
    }


    _fetchData(page, startFetch, abortFetch) {
        console.log('this.state.imgList',this.state.imgList);
        HttpUtils.request(API.GetBookNoteList, {
            id: this.state.id,
            page: 1
        }).then((data) => {
            startFetch(data);

        }).catch((err) => {
            abortFetch();
            console.log(err);
        });
        startFetch(this.state.imgList);
    }

    _renderEmptyView() {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={() => this.listView.refresh()}
            />
        );
    }

    _renderImgs(item,index){
        if(item.type === 1){
            // console.log(item.data_url + '?x-oss-process=image/resize,w_' + parseInt(Dimensions.get('window').width));
            return (
                <View>
                    <TouchableOpacity
                        onPress={()=>{
                            Actions.imageDialog({img: item.data_url, types: 2});
                        }}
                    >
                        <Image
                            width={Dimensions.get('window').width}
                            source={{uri: item.data_url + '?x-oss-process=image/resize,w_' + parseInt(Dimensions.get('window').width) * 2}}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    renderExpenseItem(item,index){
        return <ScrollViewItem index={index} key={index} item={item} onClick={() => this.onClick(index)}/>;
    }

    render() {

        return (
            <View>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    scrollEventThrottle={0}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                    style={{marginBottom: 10,backgroundColor: '#fff'}}
                >
                    {
                        this.state.topic_list.map((item, index) => this.renderExpenseItem(item, index))
                    }
                </ScrollView>


                <UltimateListView
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderImgs(item, index)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    emptyView={()=>this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    // style={{flex: 1}}
                    pagination={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    paginationFetchingView={()=>{return null}}
                    style={{height: Dimensions.get('window').height - 130}}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    imgs: {
        width: Dimensions.get('window').width,
        height: 100,
    },

    listTitle: {
        backgroundColor: '#fff',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        marginTop: 15,
        flexDirection: 'row',
    },
    textLeft: {
        color: '#b5b5b5',
        textAlign: 'left',
        width: (Dimensions.get('window').width - 30) / 2,
    },
    textRight: {
        textAlign: 'right',
        width: (Dimensions.get('window').width - 30) / 2,
        fontWeight: 'bold'
    },
    scrollView: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    }
});


class Imgs extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            width: 0,
            height: 0,
        };
    }

    componentDidMount() {
        let screenWidth = Dimensions.get('window').width;
        Image.getSize(this.props.image, (width, height) => {
            height = screenWidth * height / width;
            this.setState({height: height});
        });
    }

    render(){
        return (
            <TouchableOpacity
                onPress={()=>{
                    Actions.imageDialog({img: this.props.image});
                }}
            >
                <Image style={[styles.imageStyle, {width: Dimensions.get('window').width, height: this.state.height}]}
                       source={{uri: this.props.image}}/>
            </TouchableOpacity>
        )
    }
}