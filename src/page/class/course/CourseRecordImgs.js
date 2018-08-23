/**
 * 课程记录
 */


'use strict';

import React, {Component} from 'react';
import {
    Platform,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    NativeModules,
    PermissionsAndroid,
    DeviceEventEmitter,
    NativeEventEmitter,

} from 'react-native';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../../utils/HttpUtils";
import Config,{API} from "../../../Config";
import {
    ListRow,
    Label
} from 'teaset';
import moment from 'moment';
import ImagePicker from 'react-native-syan-image-picker';
import Touch from "../../public/Touch";
import {CachedImage} from 'react-native-cached-image';
import GlobalFloatUtils from "../../../utils/GlobalFloatUtils";
import MyNativeModule from "./TackPhotoModule";

export default class CourseRecordImgs extends Component {


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list: this.props.list
        };
    }

    componentWillReceiveProps(nextProps){
        console.log(this.props.list);
        setTimeout(()=>{

            this.setState({
                list: this.props.list
            })
        },100);
    }

    _default(){
        return (
            <View>

            </View>
        );
    }





    checkPermission() {
        if (Platform.OS == 'ios'){
            this.tackPhoto();
        }else {
            this.requestMultiplePermission();
        }
    }

    tackPhoto() {

        this.props.cb();
        if(this.props.list.length >= Config.MaxCourseImageCount){
            return Actions.errToast({msg:'最多上传'+ Config.MaxCourseImageCount +'张图片'});
        }
        if (Platform.OS == 'ios'){
            return MyNativeModule.NativeMethod({TYPE: 1});
        }else{

            return GlobalFloatUtils.NativeMethod({TYPE: 1});
        }
    }


    async requestMultiplePermission() {
        let refusePermissions=false;
        let data = "您的: "
        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.CAMERA
            ]



            //返回得是对象类型
            const granteds = await PermissionsAndroid.requestMultiple(permissions)
            if (granteds["android.permission.WRITE_EXTERNAL_STORAGE"] != "granted") {
                refusePermissions=true
                data = data + "SD卡写入权限"
            }
            if (granteds["android.permission.READ_EXTERNAL_STORAGE"] != "granted") {
                refusePermissions=true
                data = data + "、SD卡读取权限"
            }
            if (granteds["android.permission.CAMERA"] != "granted") {
                refusePermissions=true
                data = data + "、相机拍照权限"
            }
            if(refusePermissions){

                console.log("++++++++++33+++++++:"+data+"被拒绝访问")

            }else{
                this.tackPhoto();
            }

            console.log("+++++++++refusePermissions++++++:"+refusePermissions)


        } catch (err) {
            console.log("22*******"+err.toString())
        }
    }



    _renderList(list){
        return list.map((item,k)=>{
            return (
                <View key={k}>
                    <TouchableOpacity
                        onPress={()=>this.props.del(item.id,this.props.types,k)}
                        style={styles.del}
                    >
                        <View>
                            <Image source={require('../../../images/removeRecord.png')} style={{width: 22,height: 22}}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            Actions.imageDialog({img: item.image, types: 2});
                        }}
                    >
                        <View style={styles.li}>
                            <CachedImage source={{uri: item.image}} style={{width: width,height: width/1.5,borderRadius: 5,}}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
    }

    render() {
        return (
            <View style={styles.root}>
                <View>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                <View style={styles.ul}>
                    {this._renderList(this.state.list)}

                    {(this.props.list.length >= Config.MaxCourseImageCount)
                        ?
                        null
                        :
                        <TouchableOpacity
                            onPress={()=>this.checkPermission()}
                        >
                            <View style={styles.li}>
                                <Image source={require('../../../images/addimg.png')} style={{width: 21.5,height: 21.5}}/>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }
}
let width = (Dimensions.get('window').width / 4 * 3 - 55) / 2;
const styles = StyleSheet.create({
    del: {
        position: 'absolute',
        right: 10,
        top: 10,
        height: 22,
        width: 22,
        zIndex: 100,
    },
    root: {
        marginBottom: 20,
        width: Dimensions.get('window').width / 4 * 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4b4b4b',
    },
    ul:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: Dimensions.get('window').width / 4 * 3 + 20 ,
    },
    li: {
        width: width,
        height: width / 1.5,
        backgroundColor: '#f2f2f3',
        marginRight: 20,
        marginTop: 20,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    }
});