/**
 * Created by heaton on 2018/1/9.
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
    Alert,
    NativeModules
} from 'react-native';
import ImagePicker from 'react-native-syan-image-picker';
import HttpUtils from '../../utils/HttpUtils';
import DisplayUtils from '../../utils/DisplayUtils';
import {API, ClassTypes} from '../../Config';
import RadioGroup from  '../common/RadioGroup';
import {Actions} from 'react-native-router-flux';
import Picker from 'react-native-picker';
import Toast from '../../utils/Toast';
import ClassBiz from '../../biz/ClassBiz';
import TextUtils from '../../utils/TextUtils';
import {
    ListRow
} from 'teaset';


export default class ClassInfo extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            classImage: require('../../images/head_class.png'),
            className: '',
            classSubjectId: 0,
            classSubjectName: '',
            classGradeId: 0,
            classGradeName: '',
            classType: 0,
            subjects: [],
            grades: [],
            subjectSelectedIndex: 0,
            gradeSelectedIndex: 0,
            classTypeNames: [],
            classTypes: [],
            checkedTypeName: '',
            type: 1,
            addType: '允许任何学生搜索加入',
            join_type: 1,
        };
        console.log(this.props);

    }

    componentDidMount() {
        this._requestData();
    }

    static onExit() {
        // Picker.isPickerShow((state)=>{});
        Picker.hide();
    }
    arr = [
        '允许任何学生搜索加入',
        '需要验证加入',
        '仅限邀请加入'
    ];
    _addType(){
        this._showPicker(this.arr, [this.arr[this.state.join_type-1]], (item, index) => {
            console.log(index);
            this.setState({
                addType: item[0],
                join_type: index[0]+1
            });
            this.setClassInfo('join_type', index[0]+1);
        });
    }

    _requestData() {
        HttpUtils.request(API.GetClassInfo, {class_number: this.props.classNum})
            .then((data) => {
                console.log(data);
                this.setState({
                    className: data.class_name.toString(),
                    classImage: data.img_url ? {uri: data.img_url} : require('../../images/head_class.png'),
                    classSubjectId: data.subject_id,
                    classSubjectName: data.subject_name,
                    classGradeId: data.grade_id,
                    classGradeName: data.grade_name,
                    classType: data.class_type,
                    join_type: data.join_type,
                    addType: this.arr[data.join_type-1]
                });

                console.log("科目id：", data.subject_id);
                console.log("年级id：", data.grade_id);

                if (data.subject_id != '') {
                    this._getGradeBySubject(data.subject_id);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    _getGradeBySubject(subjectId) {
        console.log("科目id：", subjectId);
        HttpUtils.request(API.GetSubjectsAndGradeForCreateClass, {subject_id: subjectId})
            .then((data) => {
                console.log(data);
                let typeNames = [];
                data.classTypeList.forEach((item)=> {
                    typeNames.push(item.class_type_name);
                });

                if (this.state.classType == 2) {

                    //初次进入用数据返回
                    if (this.state.type == 1) {

                        this.setState(
                            {
                                subjects: data.subjectList,
                                grades: data.gradeList,
                                classTypes: data.classTypeList,
                                classTypeNames: typeNames,
                                checkedTypeName: typeNames[0],
                            });

                    } else {
                        //选择学科后重置年级
                        this.setState(
                            {
                                subjects: data.subjectList,
                                grades: data.gradeList,
                                classTypes: data.classTypeList,
                                classTypeNames: typeNames,
                                classGradeName: data.gradeList[0].grade_name,
                                checkedTypeName: typeNames[0],
                                classGradeId: data.gradeList[0].grade_id,
                            });
                    }

                } else {

                    if (this.state.type == 1) {

                        this.setState(
                            {
                                subjects: data.subjectList,
                                grades: data.gradeList,
                                classTypes: data.classTypeList,
                                classTypeNames: typeNames,
                                checkedTypeName: typeNames[1]
                            });

                    } else {
                        this.setState(
                            {
                                subjects: data.subjectList,
                                grades: data.gradeList,
                                classTypes: data.classTypeList,
                                classTypeNames: typeNames,
                                classGradeName: data.gradeList[0].grade_name,
                                checkedTypeName: typeNames[1],
                                classGradeId: data.gradeList[0].grade_id,
                            });
                    }

                }

            }).catch((err) => {
        });
    }


    _showSubjectPicker() {
        let subjectArr = [];
        this.state.subjects.map((item) => {
            subjectArr.push(item.subject_name);
        });
        let selected = [this.state.classSubjectName];
        console.log(selected);
        this._showPicker(subjectArr, selected, (item, index) => {
            console.log('index', index, item);
            this.setState({
                    classSubjectName: item[0],
                    subjectSelectedIndex: index[0],
                    type: 2
                }
            );

            let subjectId = this.state.subjects[this.state.subjectSelectedIndex].subject_id;
            console.log(subjectId);
            this._getGradeBySubject(subjectId);

            this.setClassInfo('subject_id', subjectId);

        });
    }

    _showGradePicker() {
        let gradeArr = [];
        this.state.grades.map((item) => {
            gradeArr.push(item.grade_name);
        });
        let selected = [this.state.classGradeName];
        console.log(selected);
        this._showPicker(gradeArr, selected, (item, index) => {
            console.log('index', index, item);
            this.setState({
                classGradeName: item[0],
                gradeSelectedIndex: index[0],
                classGradeId: this.state.grades[index[0]].grade_id,
            });
            let gradeId = this.state.classGradeId;
            this.setClassInfo('grade_id', gradeId);
        });
    }


    _showPicker(data, selected, onPickerConfirm) {
        console.log(data);
        Picker.init({
            pickerTextEllipsisLen: 20,
            pickerData: data,
            selectedValue: selected,
            onPickerConfirm: onPickerConfirm,
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择'
        });
        Picker.show();
    }


    jumpHomePage() {
        Actions.confirmDialog({
            title: '解散班级',
            buttons: ["解散", "取消"],
            message: '请问您是否解散【' + this.state.className + '】班级吗？',
            onClick: (index) => {
                if (index === 0) {
                    this.dissmissClass();
                } else {
                    console.log("取消解散");
                }

            }
        })
    }


    dissmissClass() {
        HttpUtils.request(API.DismissClass, {
            class_number: this.props.classNum
        }).then((data) => {
            Toast.success('解散班级成功');
            ClassBiz.mustRefresh();
            setTimeout(()=>Actions.popTo('_classList'), 1000);
        }).catch((err) => {
            console.log(err);
            Toast.error('解散班级失败，请稍后重试');
        });

    }


    _showClassNameInputDialog() {


        Actions.inputDialog({
            title: '请输入班级名称',
            placeholderText: '最多10个字符',
            value: this.state.className === '请输入' ? '' : this.state.className,
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

                this.setState({className: name});
                this.setClassInfo('class_name', name, (value)=>ClassBiz.setClassName(value));
                // setTimeout(() => , 100);
            }
        });
    }

    setClassInfo(field, value, callBack = null) {

        console.log('传输信息:', field, value)

        HttpUtils.request(API.SetClassInfo, {
            class_number: this.props.classNum,
            field: field,
            changed: value
        }).then((data) => {
            console.log(data);

            //修改学科时需修改年级
            if (this.state.type == 2) {
                this.setClassInfo('grade_id', this.state.classGradeId);
                this.setState({
                        type: 1,
                    }
                );

            } else {
                Toast.success('修改班级信息成功');
                ClassBiz.mustRefresh();
                if (callBack) {
                    callBack(value);
                }
            }

        }).catch((err) => {
            Toast.error('修改班级信息失败');
            console.log(err);
        });
    }


    _pickerImage() {
        /**
         * 默认参数
         */
        ImagePicker.asyncShowImagePicker({
            imageCount: 1,
            isCrop: true,
            CropW: 400,
            CropH: 400,
            showCropGrid: true
        }).then(image => {
            this.setState({classImage: {uri: image[0].uri}});

            HttpUtils.request(API.UploadImg, {
                file: {
                    uri: image[0].uri,
                    type: 'multipart/form-data',
                    name: 'headImg.jpg'
                },
                upload: true
            }).then(result => {

                this.setClassInfo('img_url', result.url);

            }, err => {
                console.log('err', err);
            });


        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        console.log(this.state.classImage);
        let goImage = <Image style={styles.goImage}
                             source={require('../../images/item_go.png')}/>
        return (
            <View style={{flex: 1, padding: 10, backgroundColor: '#FFFFFF'}}>
                <View style={styles.topContent}>

                    <ListRow
                        title='班级头像'
                        detail={<Image
                            style={{width: 50, height: 50, borderRadius: 25, marginRight: 5}}
                            source={this.state.classImage}/>}
                        style={styles.listrow}
                        bottomSeparator='none'
                        titleStyle={styles.titleStyle}
                        onPress={this._pickerImage.bind(this)}
                    />

                    <ListRow
                        title='班级名称'
                        detail={this.state.className}
                        style={styles.listrow}
                        bottomSeparator='none'
                        titleStyle={styles.titleStyle}
                        detailStyle={(this.state.className === '请输入')?styles.titleStyle:styles.detailStyle}
                        onPress={this._showClassNameInputDialog.bind(this)}
                    />

                    <ListRow
                        title='科目'
                        detail={this.state.classSubjectName}
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detailStyle={styles.detailStyle}
                        onPress={this._showSubjectPicker.bind(this)}
                    />

                    <ListRow
                        title='年级'
                        detail={this.state.classGradeName}
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detailStyle={styles.detailStyle}
                        onPress={this._showGradePicker.bind(this)}
                    />

                    <ListRow
                        title='班级类型'
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detail={
                            <RadioGroup
                                items={this.state.classTypeNames}
                                checkedItem={this.state.checkedTypeName}
                                onCheckChanged={(item, index) => {
                                    this.setState({
                                        classType: this.state.classTypes[index].class_type,
                                        checkedTypeName: item
                                    })
                                    console.log("类型，index", item, index)
                                    this.setClassInfo('class_type', this.state.classTypes[index].class_type);
                                }}
                                titleStyle={{fontSize: 16, color: '#585858'}}
                                size="lg"/>
                        }
                    />
                    <ListRow
                        detailStyle={styles.detailStyle}
                        title='加入方式'
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detail={this.state.addType}
                        onPress={this._addType.bind(this)}
                    />


                </View>
                <TouchableOpacity onPress={this.jumpHomePage.bind(this)}>
                    <View style={[styles.buttonRoot]}>
                        <Text style={styles.createBtn}>解散班级</Text>
                    </View>
                </TouchableOpacity>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.promptText}>*班级解散后学生将丢失班级数据,请谨慎使用</Text>
                    <Text style={styles.promptText}>*请不要因为结课解散班级</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    detailStyle: {
        fontSize: 16,
        color: '#4b4b4b'
    },
    titleStyle: {
        fontSize: 16,
        color: '#818890'
    },
    listrow: {
        height: 65,
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec'
    },
    topContent: {
        backgroundColor: '#fff',
        paddingBottom: 0,
        paddingTop: 0
    },
    itemRoot: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        minHeight: 50,
        backgroundColor: '#fff',

    },
    buttonRoot: {
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FC3243',
        padding: 10,
        height: 50,
        marginTop: 30,
    },
    createBtn: {
        color: '#fff',
        fontSize: 18,
    },
    itemLeft: {
        flex: 1,
        color: '#8B9197',
        fontSize: 16,
    },
    itemRight: {
        color: '#626262',
        fontSize: 16,
        paddingRight: 5,
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
    },
    promptText: {
        color: '#BDBDBE',
        fontSize: 14,
    },
    goImage: {
        width: 11,
        height: 14,
        position: 'absolute',
        right: 0
    }

});