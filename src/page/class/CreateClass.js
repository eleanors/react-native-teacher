/**
 * Created by heaton on 2018/1/3.
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
    Dimensions,
    ScrollView,
    NativeEventEmitter,
    DeviceEventEmitter,
    Platform,
    NativeModules,
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
import Picker from 'react-native-picker';
import {Actions} from 'react-native-router-flux';
import HttpUtils from "../../utils/HttpUtils";
import {API} from "../../Config";
import RadioGroup from  '../common/RadioGroup';
import Toast from '../../utils/Toast';
import ClassBiz from '../../biz/ClassBiz';
import TextUtils from '../../utils/TextUtils';
import SpeechConversionText from '../../utils/VoiceToTextUtil';

import {
    ListRow
} from 'teaset';

// const ClassTypes = [{id: 2, name: '1对n班组'}, {id: 3, name: '普通班组'}];

export default class CreateClass extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            subjectName: '请选择',
            gradeName: '请选择',
            className: '请输入',
            subjects: [],
            grades: [],
            subjectSelectedIndex: 0,
            gradeSelectedIndex: 0,
            classType: 2,
            classTypeNames: [],
            classTypes: [],
            checkedTypeName: '',
            canClick: false,//避免按钮重复点击
            gradeId: '',
            addType: '允许任何学生搜索加入',
            addTypeId: 0,
        };
    }


    static onExit() {
        // Picker.isPickerShow((state)=>{});
        Picker.hide();
    }

    _addType(){
        let arr = [
            '允许任何学生搜索加入',
            '需要验证加入',
            '仅限邀请加入'
        ];
        this._showPicker(arr, [this.state.addType], (item, index) => {
            console.log(index);
            this.setState({
                addType: item[0],
                addTypeId: index[0]
            })
        });
    }

    componentDidMount() {
        this._getSubjectAndGrade();
    }

    _getSubjectAndGrade() {
        HttpUtils.request(API.GetSubjectsAndGradeForCreateClass)
            .then((data) => {
                console.log(data);
                let isHasSelected = false;
                data.subjectList.forEach((item, index) => {
                    if (item.is_selectd == 1) {
                        isHasSelected = true;
                        this.setState({
                            subjectName: item.subject_name,
                            subjectSelectedIndex: index
                        });
                    }
                });
                let typeNames = [];
                this.setState({
                    subjects: data.subjectList,
                    grades: data.gradeList,
                    gradeName: data.gradeList[0].grade_name,
                    subjectName: !isHasSelected ? data.subjectList[0].subject_name : this.state.subjectName,
                    gradeId: data.gradeList[0].grade_id,
                });

                if (data.classTypeList) {
                    data.classTypeList.forEach((item)=> {
                        typeNames.push(item.class_type_name);
                    });
                    this.setState({
                        classTypes: data.classTypeList,
                        classTypeNames: typeNames,
                        checkedTypeName: typeNames[0]
                    });
                } else {
                    HttpUtils.request(API.GetClassType)
                        .then((data) => {
                            console.log(data);
                            data.forEach((item)=> {
                                typeNames.push(item.class_type_name);
                            });
                            this.setState({
                                classTypes: data,
                                classTypeNames: typeNames,
                                checkedTypeName: typeNames[0]
                            });

                        })
                        .catch((err) => {

                        });
                }
            })
            .catch((err) => {

            });
    }

    _getGradeBySubject(subjectId) {
        console.log("科目id：", subjectId);
        HttpUtils.request(API.GetSubjectsAndGradeForCreateClass, {subject_id: subjectId})
            .then((data) => {
                console.log(data);
                this.setState({
                    grades: data.gradeList,
                    gradeName: data.gradeList[0].grade_name,
                    gradeId: data.gradeList[0].grade_id
                });
            })
            .catch((err) => {

            });
    }

    _showSubjectPicker() {
        let subjectArr = [];
        this.state.subjects.map((item) => {
            subjectArr.push(item.subject_name);
        });
        let selected = [this.state.subjectName];
        console.log(selected);
        this._showPicker(subjectArr, selected, (item, index) => {
            console.log('index', index, item);
            this.setState({
                    subjectName: item[0],
                    subjectSelectedIndex: index[0]
                }
            );
            let subjectId = this.state.subjects[this.state.subjectSelectedIndex].subject_id;
            console.log(subjectId);
            this._getGradeBySubject(subjectId);
        });
    }

    _showGradePicker() {
        let gradeArr = [];
        this.state.grades.map((item) => {
            gradeArr.push(item.grade_name);
        });
        this._showPicker(gradeArr, [this.state.gradeName], (item, index) => {

            this.setState({
                gradeName: item[0],
                gradeSelectedIndex: index[0],
                gradeId: this.state.grades[index[0]].grade_id,
            });
        });
    }

    _showClassNameInputDialog() {
        Actions.inputDialog({
            title: '请输入班级名称',
            placeholderText: '最多10个字符',
            value: this.state.className === '请输入' ? '' : this.state.className,
            onConfirm: (text) => {
                let name = TextUtils.removeTheSpace(text);
                if (name.length == 0) {
                    // Toast.error('班级名称不能为空');
                    // return;
                } else {
                    if (!TextUtils.checkSpecialCharacter(name)) {
                        return;
                    }
                }

                this.setState({className: name})
            }
        });
    }

    _submitCreateClass() {
        // Actions.detail();

        // console.log(123,parseInt(this.state.addTypeId + 1));
        // return;
        this.setState({
            canClick: true,
        });
        let subId = this.state.subjects[this.state.subjectSelectedIndex].subject_id;
        let gradeId = this.state.gradeId;

        console.log("subId:", subId);
        console.log("gradeId:", gradeId);


        let typeId = this.state.classType;
        console.log(this.state.className);
        if (!subId) {
            Actions.errToast({msg: '请选择班级科目'});
            return;
        }
        if (!gradeId) {
            Actions.errToast({msg: '请选择班级年级'});
            return;
        }
        if (this.state.className === '请输入') {
            Actions.errToast({msg: '请输入班级名称'});
            return;
        }
        if (typeId < 0) {
            Actions.errToast({msg: '请选择班级类型'});
            return;
        }

        let name = TextUtils.removeTheSpace(this.state.className); //删除所有空格; 
        if (name.length == 0) {
            Toast.error('输入字符不能为空');
            return;
        } else {
            if (!TextUtils.checkSpecialCharacter(name)) {
                return;
            }
        }

        // console.log(this.state.subjects[this.state.subjectSelectedIndex], this.state.grades[this.state.gradeSelectedIndex],this.state.className);

        console.log("上传类型：", typeId);
        HttpUtils.request(API.SubmitCreateClass, {
            subject_id: subId,
            grade_id: gradeId,
            class_name: name,
            class_type: typeId,
            join_type: parseInt(this.state.addTypeId + 1)

        }).then((data) => {
            console.log(data);
            ClassBiz.mustRefresh();
            Toast.success('创建成功');
            Actions.pop();
            this.setState({
                canClick: false,
            });
        }).catch((err) => {
            Toast.error('创建班级失败');
            this.setState({
                canClick: false,
            });
            console.log(err);
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

    render() {

        return (
            <View style={styles.root}>
                <View style={styles.topContent}>

                    <ListRow
                        title='科目'
                        detail={this.state.subjectName}
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detailStyle={styles.detailStyle}
                        onPress={this._showSubjectPicker.bind(this)}
                    />
                    <ListRow
                        title='年级'
                        detail={this.state.gradeName}
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detailStyle={styles.detailStyle}
                        onPress={this._showGradePicker.bind(this)}
                    />
                    <ListRow
                        title='班级名称'
                        detail={this.state.className}
                        style={styles.listrow}
                        bottomSeparator='none'
                        titleStyle={styles.titleStyle}
                        detailStyle={(this.state.className === '请输入') ? styles.titleStyle : styles.detailStyle}
                        onPress={this._showClassNameInputDialog.bind(this)}
                    />
                    <ListRow
                        title='班级类型'
                        style={styles.listrow}
                        titleStyle={styles.titleStyle}
                        bottomSeparator='none'
                        detail={
                            <RadioGroup
                                items={this.state.classTypeNames}
                                onCheckChanged={(item, index) => {
                                    console.log('classTypes --- ', this.state.classTypes);
                                    this.setState({
                                        classType: this.state.classTypes[index].class_type,
                                        checkedTypeName: item,
                                    });
                                    console.log("类型，index", item, index)
                                }}
                                checkedItem={this.state.checkedTypeName}
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
                <TouchableOpacity activeOpacity={0.7}
                                  onPress={this._submitCreateClass.bind(this)}
                                  disabled={this.state.canClick}
                >
                    <View style={styles.createBtnRoot}>
                        <Text style={styles.createBtn}>创建班级</Text>
                    </View>
                </TouchableOpacity>
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
    root: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    topContent: {
        backgroundColor: '#fff',
        paddingBottom: 0,
        paddingTop: 0,
    },
    itemRoot: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: 10,
        paddingLeft: 0
    },
    itemLeft: {
        flex: 1,
        color: '#848A91',
        fontSize: 16,
    },
    itemRight: {
        color: '#626262',
        fontSize: 16,
        paddingRight: 5,
    },
    createBtnRoot: {
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4791ff',
        padding: 10,
        height: 50,
        marginTop: 40,
    },
    createBtn: {
        color: '#fff',
        fontSize: 18,
    },
    goImage: {
        width: 11,
        height: 14,
        position: 'absolute',
        right: 0
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#F1F0F0',
    }
});