import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    View, ToastAndroid
} from 'react-native';
import {
    ListRow,
    Overlay,
} from 'teaset';
import {Actions} from "react-native-router-flux";
import ImagePicker from "react-native-syan-image-picker";
import Http from "../../utils/HttpUtils";
import {API} from "../../Config";
import Picker from "react-native-picker";
import ClickSubject from "../account/ClickSubject";
import {observer} from 'mobx-react';
import UserBiz from '../../biz/UserBiz';
import Toast from '../../utils/Toast';
import Time from "../common/Time";
import TextUtils from '../../utils/TextUtils';
import moment from 'moment';
import DisplayUtils from "../../utils/DisplayUtils";

const defaultBirthdayTime = moment([1990,1,1]).unix();

@observer
export default class Info extends Component {

    userInfo = global.userInfo;

    static onExit() {
        // Picker.isPickerShow((state)=>{});
        Picker.hide();
    }

    constructor(props) {
        super(props);

        this.state = {
            headImg: this.userInfo.img_url ? {uri: this.userInfo.img_url} : require('../../images/head_teacher.png'),
            user_name: this.userInfo.user_name,
            mobile: this.userInfo.mobile,
            sex: this.userInfo.sex,
            modalKey: '',
            select: this.userInfo.grade.grade_name + this.userInfo.subject.name,
            list: [],
            grade_type: this.userInfo.grade.grade_type,
            subject_id: this.userInfo.subject.id,
            key: 0,
            birthday_time:defaultBirthdayTime,
        };

        Http.request(API.getSubject).then(result => {
            this.setState({
                list: result
            });
        });
        this.getUserInfo();
        console.log('state', this.state);
    }


    //获取用户信息并保存
    getUserInfo() {
        Http.request(API.getUserInfo).then(userinfo => {
            //保存

            let user = new UserBiz();
            user.updateUserInfo(userinfo);
            // global.userInfo = userinfo;
            console.log('test', this.userInfo);
            for (let i in userinfo) {
                if (userinfo[i] !== this.userInfo[i]) {
                    this.userInfo[i] = userinfo[i];
                }
            }
            userinfo.birthday_time = userinfo.birthday_time?userinfo.birthday_time:defaultBirthdayTime;
            // let date = userinfo.birthday_time;
            // let birdayMoment;
            // if (!date) {
            //     birdayMoment = moment(315417600);
            // } else {
            //     birdayMoment = moment(date * 1000);
            // }
            // userinfo.fullBirthday = birdayMoment.format('YYYY-MM-DD');
            // userinfo.birthdayArray = [birdayMoment.year(), birdayMoment.month(), birdayMoment.date()];
            this.setState(userinfo);
        });
    }

    _showDatePicker() {
        console.log('birthday date -- ',this.state.birthday_time);
        Actions.datePickerDialog({
            title: '请选择生日',
            selectedDate: moment(this.state.birthday_time*1000).toDate(),
            maxDate:moment().toDate(),
            mode: 'date',
            onConfirm: (date) => {
                console.log('birthday date -- ',date);
                let timestamp = date.getTime() / 1000;
                Http.request(API.EditUserInfo, {
                    field: 'birthday_time',
                    changed: timestamp
                }).then(res => {
                    this.getUserInfo();
                });
            }
        });
    }

    _showSexPicker() {
        Picker.init({
            pickerData: ['男', '女'],
            selectedValue: [(this.state.sex === 0) ? '男' : '女'],
            pickerTitleText: '性别',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            onPickerConfirm: (pickedValue, pickedIndex) => {
                Http.request(API.EditUserInfo, {
                    field: 'sex',
                    changed: pickedIndex[0]
                }).then(res => {
                    this.getUserInfo();
                });
            }
        });
        Picker.show();
    }

    editHeadimg() {
        ImagePicker.asyncShowImagePicker({
            imageCount: 1,
            isCrop: true,
            CropW: 400,
            CropH: 400,
            showCropGrid: true
        }).then(image => {
            let uri = image[0].uri;
            this.setState({
                headImg: {uri: uri}
            });
            //todo 上传图片
            Http.request(API.UploadImg, {
                file: {uri: uri, type: 'multipart/form-data', name: 'headImg.jpg'},
                upload: true
            }).then(result => {
                //修改头像
                Http.request(API.EditUserInfo, {
                    field: 'img_url',
                    changed: result.url
                }).then(res => {
                    //重新获取用户信息
                    this.getUserInfo();

                });
            }, err => {
                console.log('err', err);
            });

        }).catch((err) => {
            console.log(err);
        });
    }

    editUserNameModal() {
        Actions.inputDialog({
            title: '修改姓名',
            placeholderText: '最多10个字符',
            value: this.state.className === '请输入' ? '' : this.state.user_name,
            onConfirm: (text) => {

                let name = TextUtils.removeTheSpace(text); //删除所有空格; 
                if (name.length == 0) {
                    Toast.error('班级名称不能为空');
                    return;
                } else {
                    if (!TextUtils.checkSpecialCharacter(name)) {
                        return;
                    }
                }

                this.editUserName(name);
            }
        });

    }

    editUserName(text) {
        // if (!this.state.editUserName || this.state.editUserName === '') {
        //     return ToastAndroid.show('用户名错误', ToastAndroid.SHORT);
        // }
        if (!text || text === '') {
            return Toast.error('用户名错误');
            // return ToastAndroid.show('用户名错误', ToastAndroid.SHORT);
        }
        console.log('abc', this.userInfo);
        Http.request(API.EditUserInfo, {
            field: 'user_name',
            changed: text
        }).then(result => {
            this.setState({user_name: text});
            this.userInfo.user_name = text;
            // this.getUserInfo();
            // UserBiz.updateUserInfo(this.userInfo);
            // this.getUserInfo();
            // this.hideModal();
        })
    }

    hideModal() {
        Overlay.hide(this.state.modalKey);
    }

    //修改学科
    _editSubjectModals() {
        Picker.hide();
        this.overlayView = (<Overlay.PullView side='bottom' modal={false}>
            <ClickSubject
                callbackParent={(subject_name, subject_id, grade_type) => {
                    Overlay.hide(this.state.key);
                    this.setState({
                        select: subject_name,
                        subject_id: subject_id,
                        grade_type: grade_type,
                    });

                    //发送请求
                    Http.request(API.EditUserInfo, {
                        field: 'grade_subject',
                        changed: grade_type + ',' + subject_id
                    }).then(res => {
                        //重新获取用户信息

                        this.getUserInfo();
                    });

                }}
                list={this.state.list}
                grade_type={this.state.grade_type}
                subject_id={this.state.subject_id}
            />
        </Overlay.PullView>);

        let key = Overlay.show(this.overlayView);

        this.setState({
            key: key
        });
    }

    render() {
        return (
            <View style={styles.bg}>
                <ListRow
                    title='头像'
                    style={styles.headimgLine}
                    titleStyle={styles.titleStyle}
                    accessory='indicator'
                    bottomSeparator='none'
                    onPress={() => this.editHeadimg()}
                    detail={
                        <View style={styles.headImg}>
                            <Image source={this.state.headImg} style={styles.headImg}/>
                        </View>
                    }
                />
                <ListRow
                    title='姓名'
                    style={styles.textLine}
                    titleStyle={styles.titleStyle}
                    accessory='indicator'
                    detail={this.state.user_name}
                    bottomSeparator='none'
                    onPress={() => this.editUserNameModal()}
                />
                <ListRow
                    title='性别'
                    style={styles.textLine}
                    titleStyle={styles.titleStyle}
                    accessory='indicator'
                    detail={(this.state.sex === 0) ? '男' : '女'}
                    bottomSeparator='none'
                    onPress={() => this._showSexPicker()}
                />
                <ListRow
                    title='生日'
                    style={styles.textLine}
                    titleStyle={styles.titleStyle}
                    accessory='indicator'
                    detail={moment(this.state.birthday_time*1000).format('YYYY-MM-DD')}
                    bottomSeparator='none'
                    onPress={() => this._showDatePicker()}
                />
                <ListRow
                    bottomSeparator='none'
                    title='学段科目'
                    style={styles.textLine}
                    titleStyle={styles.titleStyle}
                    accessory='indicator'
                    detail={this.state.select}
                    onPress={() => this._editSubjectModals()}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff'
    },

    titleStyle: {
        color: '#818890'
    },


    textLine: {
        height: 60,
        borderBottomWidth: DisplayUtils.px2dp(1),
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 0,
        paddingRight: 0,
        borderColor: '#edecec'
    },

    headimgLine: {
        height: 100,
        borderBottomWidth: DisplayUtils.px2dp(1),
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 0,
        paddingRight: 0,
        borderColor: '#edecec'
    },
    headImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },

    modal: {
        backgroundColor: '#fff',
        paddingTop: 20,
        borderRadius: 15,
        alignItems: 'center'
    },

    modalTitle: {
        color: '#4791ff',
        fontSize: 14,
    },
    modalInput: {
        width: Dimensions.get('window').width * 0.6,
        height: 40,
        borderBottomWidth: 0,
        marginTop: 20,
        backgroundColor: '#f5f5f6',
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 0,
        borderRadius: 5,
        paddingLeft: 10,
    },
    modalBtn: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#f0f0f0',
        marginTop: 20,
    },
    modalBtnSuccess: {
        textAlign: 'center',
        color: '#4791ff',
        justifyContent: 'center',
    },
    modalBtnCancel: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#b5b5b5',
    },

    modalBtnView: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,

    },
    modalBtnViewSuccess: {

        borderRightWidth: 0.5,
        borderColor: '#f0f0f0',
    }


});
