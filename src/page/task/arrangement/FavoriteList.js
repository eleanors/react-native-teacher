/**
 * Created by heaton on 2018/1/18.
 * Desription :收藏列表
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';

import Highlight from '../../public/TouchHighlight';
import {Input,} from 'teaset';
import HttpUtils from '../../../utils/HttpUtils';
import DisplayUtils from '../../../utils/DisplayUtils';
import EmptyView, {EmptyType} from  '../../common/EmptyView';
import {API} from "../../../Config";
import {Actions} from "react-native-router-flux";
import {UltimateListView} from 'react-native-ultimate-listview';
import Toast from '../../../utils/Toast';
import TextUtils from '../../../utils/TextUtils';
import FavoriteBiz from '../../../biz/FavoriteBiz';

export default class FavoriteList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
            storeName: '',
            list: [],
        };
    }

    refreshList() {
        this.listView.refresh();
        FavoriteBiz.setMustRefresh(false);
    }


    _fetchData(page, startFetch, abortFetch) {
        HttpUtils.request(API.GetCollectionFolder, {
            page: page,
            page_size: 10
        })
            .then((data) => {
                    this.setState({
                        emptyType: EmptyType.NO_DATA,
                    });
                    startFetch(data.list, 10);
                }
            )
            .catch((err) => {
                this.setState({
                    emptyType: EmptyType.REQUEST_ERROR,
                });
                abortFetch();
            });
    }


    renderFlatItem = (item, index) => {
        let img;
        if (index === 0) {
            img = <Image style={{width: 40, height: 40, marginLeft: 10}}
                         source={require('../../../images/work_collect_my.png')}/>
        } else {
            img = <Image style={{width: 40, height: 40, marginLeft: 10}}
                         source={require('../../../images/work_collect_custom.png')}/>
        }

        return (
            <View>
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                  onPress={() => {
                                      console.log("item", item)
                                      Actions.collectionFolderDetail({
                                          storeId: item.id,
                                          title: item.store_name,
                                          number: item.numbers,
                                          index: index,
                                          refreshCallBack: () => {
                                              this.listView.refresh();
                                          }
                                      });
                                  }}>
                    <View style={styles.item}>
                        {img}
                        <View>
                            <Text style={[styles.f16, styles.ml10, {color: '#282828'}]}>{item.store_name}</Text>
                            <Text
                                style={[styles.f14, styles.black, styles.ml10, styles.mt5]}>{item.numbers}道题目</Text>
                        </View>
                    </View>
                    <Image style={styles.goImage}
                           source={require('../../../images/item_go.png')}
                           resizeMode='contain'/>
                </TouchableOpacity>
                <View style={styles.divideLine}/>
            </View>
        );

    };


    _renderEmptyView = () => {
        return (
            <EmptyView emptyType={this.state.emptyType} onClick={() => this.listView.refresh()}/>
        );
    };


    render() {
        return (
            <View style={styles.bg}>
                <View style={styles.form}>
                    <Input
                        onChangeText={text => this.setState({storeName: text})}
                        style={styles.input}
                        placeholder="新建题组命名"
                        autoCorrect={false}
                        autoFocus={false}
                        value={this.state.storeName}
                        maxLength={10}
                    />
                    <Highlight
                        style={styles.button}
                        onPress={() => {

                            let name = TextUtils.removeTheSpace(this.state.storeName); //删除所有空格;
                            if (name.length === 0) {
                                Toast.error('题组命名不能为空');
                                return;
                            } else {
                                if (!TextUtils.checkSpecialCharacter(name)) {
                                    return;
                                }
                            }

                            if (name.length < 2) {
                                Toast.error('题组命名最少为2字符');
                                return;
                            }

                            HttpUtils.request(API.AddCollectionFolder, {
                                store_name: name,
                                store_type: 1
                            }).then((data) => {
                                    console.log("添加成功");
                                    this.setState({
                                        storeName: '',
                                    })
                                    Keyboard.dismiss();
                                    this.listView.refresh();
                                }
                            ).catch((err) => {

                            });
                        }}
                        normalColor='#4791ff'
                        activeColor='#3c6cb3'
                    >
                        <View>
                            <Text style={styles.buttonText}>创建</Text>
                        </View>
                    </Highlight>
                </View>
                <View style={{flex: 1, paddingBottom: 160}}>
                    <UltimateListView
                        ref={ref => this.listView = ref}
                        item={this.renderFlatItem}
                        keyExtractor={(item, index) => {
                            return "key_" + index;
                        }}
                        refreshableMode='basic'
                        onFetch={this._fetchData.bind(this)}
                        numColumns={1}
                        emptyView={() => this._renderEmptyView()}
                        showsVerticalScrollIndicator={false}
                        style={{flex: 1}}
                        refreshable={true}
                        paginationFetchingView={() => {
                            return null
                        }}
                        allLoadedText="没有更多数据了"/>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
    },
    form: {
        width: DisplayUtils.SCREEN.width,
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#FAFAFD'
    },

    input: {
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        marginTop: 15,
        height: 50,
        flex: 1,
        marginLeft: 10,
        borderColor: '#E8E8E8'

    },
    button: {
        marginTop: 15,
        backgroundColor: '#4791ff',
        borderWidth: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 80,
        marginRight: 10,
        marginLeft: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
    },
    f14: {
        fontSize: 14,
    },
    f16: {
        fontSize: 16,
    },
    ml10: {
        marginLeft: 10,
    },
    black: {
        color: '#AEAFAE'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        flex: 1
    },
    mt5: {
        marginTop: 5
    },
    goImage: {
        width: 20,
        height: 20,
        marginRight: 10,
    }
});