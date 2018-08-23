/**
 * Created by heaton on 2018/1/18.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform, Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView,{EmptyType} from '../../../page/common/EmptyView';
import HttpUtils from '../../../utils/HttpUtils';
import DisplayUtils from '../../../utils/DisplayUtils';
import {API} from '../../../Config';
import Section from "../material/Section";


export default class TeachingMaterialList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps --- ');
        if (nextProps.gradeType != this.props.gradeType || nextProps.subjectId != this.props.subject_id) {
            this.listView.scrollToOffset({y:0});
            setTimeout(()=>this.listView.refresh(), 500);
        }
    }

    _fetchData(page, startFetch, abortFetch) {
        console.log(this.props);
        HttpUtils.request(API.GetBookList, {
            grade_type_id: this.props.gradeType,
            subject_id: this.props.subjectId,
            version_id: 0,
        }).then((data) => {
            console.log(data);
            this.setState({
                emptyType: EmptyType.NO_DATA,
            });
            startFetch(data, 10);

        }).catch((err) => {
            console.log(err);
            this.setState({
                emptyType: EmptyType.REQUEST_ERROR,
            });
            abortFetch();
        })
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
            <View style={styles.list}>
                <Text style={styles.listTitle}>{item.name}</Text>
                <View style={styles.ul}>
                    {this.renderBookItem(item.list)}
                </View>
            </View>
        );
    }


    renderBookItem(list){
        let s1 = 0;
        let s2 = 0;
        let s3 = 0;
        return list.map((item,k)=>{
            let img;
            if((k%3) === 0){

                if(s1 === 0){
                    img = <Image source={require('../../../images/tutorBG2.png')} style={styles.bgImg}/>;
                }
                if(s1 === 1){
                    img = <Image source={require('../../../images/tutorBG1.png')} style={styles.bgImg}/>;
                }
                if(s1 === 2){
                    img = <Image source={require('../../../images/tutorBG3.png')} style={styles.bgImg}/>;
                }
                s1++;
                if(s1 >= 3){
                    s1 = 0;
                }
            }else if((k%3) === 1){

                if(s2 === 0){
                    img = <Image source={require('../../../images/tutorBG3.png')} style={styles.bgImg}/>;
                }
                if(s2 === 1){
                    img = <Image source={require('../../../images/tutorBG2.png')} style={styles.bgImg}/>;
                }
                if(s2 === 2){
                    img = <Image source={require('../../../images/tutorBG1.png')} style={styles.bgImg}/>;
                }
                s2++;
                if(s2 >= 3){
                    s2 = 0;
                }
            }else{
                if(s3 === 0){
                    img = <Image source={require('../../../images/tutorBG1.png')} style={styles.bgImg}/>;
                }
                if(s3 === 1){
                    img = <Image source={require('../../../images/tutorBG3.png')} style={styles.bgImg}/>;
                }
                if(s3 === 2){
                    img = <Image source={require('../../../images/tutorBG2.png')} style={styles.bgImg}/>;
                }
                s3++;
                if(s3 >= 3){
                    s3 = 0;
                }
            }
            return (
                <TouchableOpacity key={k} onPress={()=>{

                    Actions.section({
                        info: item,
                    });
                }}>
                    <View style={styles.li}>
                        {img}
                        <Text style={styles.liText}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
    }

    _getImg(){

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
                    style={{flex: 1}}
                    pagination={false}
                    paginationFetchingView={()=>{return null}}
                    separator={() => {
                        return (
                            <View style={{
                                marginLeft: 10,
                                height: DisplayUtils.MIN_LINE_HEIGHT,
                                backgroundColor: '#F1F0F0',
                            }}/>
                        );
                    }}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    randomColor: {
        marginLeft: 10,
        marginTop: 12,
        width: 4,
        height: 13,
        borderRadius: 2,
    },
    itemtext: {
        color: '#272727',
        fontSize: 16,
        flex: 1,
        marginLeft: 5,
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 10,
    },
    list: {
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 10,
        width: Dimensions.get('window').width
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#212121",
    },

    ul: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    li: {
        width: (Dimensions.get('window').width - 60)/3,
        height:  (Dimensions.get('window').width - 60)/2.5,
        marginRight: 15,
        marginTop: 15,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 10,
    },
    liText: {
        color: '#fff',
        backgroundColor: 'transparent',

    },
    bgImg: {
        width: (Dimensions.get('window').width - 60)/3,
        height:  (Dimensions.get('window').width - 60)/2.4,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});