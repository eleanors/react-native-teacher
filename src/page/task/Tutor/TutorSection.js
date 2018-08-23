/**
 * 教辅章节
 */


'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    TouchableOpacity,
    Platform, Dimensions,
    Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView,{EmptyType} from '../../../page/common/EmptyView';
import HttpUtils from '../../../utils/HttpUtils';
import DisplayUtils from '../../../utils/DisplayUtils';
import {API} from '../../../Config';
import ListRow from "../../common/ListRow";
import Touch from "../../public/Touch";
import SectionTest from "../material/SectionTest";

class AnimateListRows extends Component {
    static defaultProps = {
        index: 0,
        item: {
            name: ''
        },
        open : 0
    }



    constructor(props) {
        super(props);
        this.state = {
            showAnim : new Animated.Value(this.props.open),
            showorhide: this.props.open
        };
        this.showorhide = this.props.open;
    }
    _renderItems(list,index){
        return list.map((item,key)=>{
            return (
                <ListRow
                    key={key}
                    title={index + '.' + (key + 1) + '.' + item.names}
                    style={styles.listrow2}
                    accessory='none'
                    onPress={()=>{
                        if(item.paper_count > 0){
                            Actions.sectionTest({item: item, title: item.names});
                        }
                    }}
                    titleStyle={(item.paper_count <= 0)?{color: '#d3d3d3'}:null}
                />
            )
        })
    }

    _showorhideItems(){
        Animated.timing(
            this.state.showAnim,
            {
                toValue: this.showorhide==0?1:0
            }
        ).start();
        this.showorhide=this.showorhide==0?1:0;
        console.log(this.showorhide);
        this.setState({
            showorhide: this.showorhide
        })
    }

    render(){
        let index = this.props.index;
        let item = this.props.item;
        if(!item.children){
            item.children = [];
        }
        return (
            <View style={styles.list}>
                <ListRow
                    title={(index + 1) + '.' + item.names}
                    style={styles.listrow}
                    accessory={(!this.state.showorhide)?'indicator':<Image source={require('../../../images/tutorIcon.png')} style={{width: 11,height: 9}} />}
                    onPress={this._showorhideItems.bind(this)}
                />
                <Animated.View
                    style={[styles.listView,{
                        height:this.state.showAnim.interpolate({
                            inputRange: [0, 0.8,1],
                            outputRange: [0, item.children.length * 60 * 0.8 , item.children.length * 60]
                        }),
                        overflow:'hidden'
                    }]}
                >
                    {this._renderItems(item.children,index+1)}
                </Animated.View>

            </View>
        );
    }
}
export default class TutorSection extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            data: [],
        };
        Actions.refresh({title:this.props.info.book_name});
    }

    _fetchData(page, startFetch, abortFetch) {

        HttpUtils.request(API.GetTutorCatalogList, {
            id: this.props.info.id
        }).then((data) => {
            console.log(data);
            startFetch(data);

        }).catch((err) => {
            console.log(err);
            abortFetch();
        });

    }

    _renderEmptyView() {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={() => this.listView.refresh()}
            />
        );
    }

    _renderFlatItem(item, index) {
        return (
            <AnimateListRows
                item={item}
                index={index}
                open={(index === 0)?1:0}
            />
        );
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F8F8FD'}}>
                <UltimateListView
                    ref={ref => this.listView = ref}
                    item={(item, index) => this._renderFlatItem(item, index)}
                    keyExtractor={(item, index) => {
                        return "key_" + index;
                    }}
                    refreshableMode='basic'
                    onFetch={(page, startFetch, abortFetch) => this._fetchData(page, startFetch, abortFetch)}
                    emptyView={()=>this._renderEmptyView()}
                    showsVerticalScrollIndicator={false}
                    refreshViewStyle={Platform.OS === 'ios' ? {height: 80, top: -80} : {height: 80}}
                    style={{flex: 1,marginTop: 10}}
                    pagination={false}
                    paginationFetchingView={()=>{return null}}
                    />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    list: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
    },
    listrow: {
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
    },
    listrow2: {
        // paddingTop: 20,
        // paddingBottom: 20,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        paddingLeft: 30,
        height: 60,
    },
    listView: {

    },
});