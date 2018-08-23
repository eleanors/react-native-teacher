/**
 * 课堂实录
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Platform, Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView, {EmptyType} from '../../../page/common/EmptyView';
import ListRow from '../../common/ListRow';
import {API} from "../../../Config";
import HttpUtils from "../../../utils/HttpUtils";
import AudioPlayUtils from "../../../utils/AudioPlayUtils";
import Video from '../Subject/Video/index'
import DisplayUtils from "../../../utils/DisplayUtils";
// import Video from 'react-native-af-video-player';

export default class SectionVideo extends Component {


    // 构造
    constructor(props) {
        super(props);
        console.log('this.props.list：',this.props.list);
        let list = this.props.list;
        for(let i in list){
            if(list[i].data_url.indexOf('mp3') > -1 || list[i].type !=3){
                list.splice(i,1);
            }
        }
        this.state = {
            play_url: this.props.list[0].data_url,
            play_num: 0
        };
    }


    _renderList(list){
        return list.map((item,k)=>{
            if(k === this.state.play_num){

                return (
                    <View key={k}>
                        <ListRow
                            title={item.name}
                            style={[styles.listrow]}
                            titleStyle={(k === this.state.play_num)?styles.playText:null}
                        />
                    </View>
                );
            }else{

                return (
                    <View key={k}>
                        <ListRow
                            title={item.name}
                            style={[styles.listrow]}
                            onPress={()=>{
                                this.setState({
                                    play_url: item.data_url,
                                    play_num: k
                                });
                            }}
                        />
                    </View>
                );
            }
        });
    }

    onFullScreen(status) {
        Actions.refresh({hideNavBar: status});
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <Video
                    ref={ref => this.videoView = ref}
                    url={this.state.play_url}
                    onFullScreen={status => this.onFullScreen(status)}
                    style={styles.video}
                    scrollBounce={true}
                    rotateToFullScreen
                    lockPortraitOnFsExit={true}
                    ScrollViewStyle={{
                        flex: 1,
                        backgroundColor: '#fff',
                    }}
                    contentBelow={
                        <View style={styles.list}>
                            {this._renderList(this.props.list)}
                        </View>
                    }
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    video: {
        marginTop: 20,
    },
    list: {
        padding: 20,
    },
    listrow: {
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
    },
    playText: {
        color: '#4791ff',
    },
});
