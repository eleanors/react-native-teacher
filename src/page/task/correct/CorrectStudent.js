/**
 * Created by heaton on 2018/3/16.
 * Desription : 批改学生解答题图片页面
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {observer} from 'mobx-react';
import DisplayUtils from "../../../utils/DisplayUtils";
import StudentStore from "../../../biz/CorrectStudentBiz";
import Picker from "react-native-picker/index";
import TextUtils from "../../../utils/TextUtils";


const studentStore = new StudentStore();

@observer
export default class CorrectStudent extends Component {


    // 构造
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('CorrectStudent componentDidMount', this.props);

        studentStore.init({
            studentArr: this.props.studentArr,
            studentIndex: this.props.studentIndex,
            taskId: this.props.taskId,
            testNumber: this.props.testNumber,
            onAnswerTypeChange: this.props.onAnswerTypeChange
        });
    }


    _onRight() {
        console.log('点击右上角按钮处理');
        Actions.originalTest({
            title: '第' + (this.props.testNumber) + '题',
            taskId: this.props.taskId,
            testNumber: this.props.testNumber,
        });
    }


    _renderTestStateTitleImage() {
        let studentItem = studentStore.studentItem;

        if (studentItem && studentItem.computedTestState >= 0) {
            console.log('_renderTestStateTitleImage', studentItem.computedTestState);
            if (studentItem.computedTestState == 0) {
                return (
                    <Image
                        source={require('../../../images/correct_wrong_checked.png')}
                        style={styles.headerTestStateImage}/>
                );
            } else if (studentItem.computedTestState == 10) {
                return (
                    <Image
                        source={require('../../../images/correct_right_checked.png')}
                        style={styles.headerTestStateImage}/>
                );
            } else {
                return (
                    <Image
                        source={require('../../../images/correct_banture_checked.png')}
                        style={styles.headerTestStateImage}/>
                );
            }
        } else {
            return null;
        }
    }

    _renderHeader() {
        let studentItem = studentStore.studentItem;
        let testStateImage = this._renderTestStateTitleImage();
        let prevImage = studentStore.canPrev ? require('../../../images/move_down_sele.png') : require('../../../images/move_down_normal.png');
        let nextImage = studentStore.canNext ? require('../../../images/move_up_sele.png') : require('../../../images/move_up_normal.png');
        return (
            <View style={styles.headerRoot}>
                <Text style={styles.headerLeftIndexText}>
                    {studentStore.studentIndex + 1}
                    <Text style={styles.headerLeftNameText}>
                        /
                        {studentStore.studentArr.length}
                    </Text>
                </Text>
                <Text style={styles.nameText}>{studentItem && studentItem.studentName}</Text>

                {testStateImage}
                <View style={styles.headerRightChangeView}>
                    <TouchableOpacity
                        style={{padding: 10}}
                        onPress={() => studentStore.correctPrev()}>
                        <Image source={prevImage} style={{width: 25, height: 25}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{padding: 10}}
                        onPress={() => studentStore.correctNext()}>
                        <Image source={nextImage} style={{width: 25, height: 25}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderImagesTag() {
        let studentItem = studentStore.studentItem;
        console.log('_renderImagesTag', studentItem);
        console.log('studentItem.imagePaths.length', studentItem.imagePaths.length);

        if (studentItem && studentItem.imagePaths&&studentItem.imagePaths.length>1) {
            return studentItem.imagePaths.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => studentItem.changeImageIndex(index)}
                    >
                        <View style={[
                            styles.contentLeftImageTag,
                            {backgroundColor: studentItem.currImageIndex == index ? '#4791ff' : '#ffffff',}
                        ]}>
                            <Text style={{color: studentItem.currImageIndex == index ? '#ffffff' : 'gray'}}>
                                {index + 1}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            });
        } else {
            return null;
        }
    }

    _renderContent() {
        let studentItem = studentStore.studentItem;
        console.log('_renderContent', studentItem);
        if (studentItem && studentItem.imagePaths) {
            let imageTagView = this._renderImagesTag();
            console.log('imagePages ---- ',studentItem.imagePaths);
            let imagePath = studentItem.imagePaths[studentItem.currImageIndex];
            let imageSource = imagePath?{uri:imagePath}:require('../../../images/imgnoinfo.png');
            console.log('imagePath', imagePath);
            return (
                <View style={styles.contentRoot}>
                    <Image
                        source={imageSource}
                        style={{
                            flex: 1,
                            width: DisplayUtils.SCREEN.width,
                            transform: [{rotate: studentItem.currImageRotateDegree + 'deg'}]
                        }}
                        resizeMode='contain'/>
                    <View style={styles.contentLeftTagRoot}>
                        {imageTagView}
                    </View>
                    <TouchableOpacity
                        style={styles.contentRightRotate}
                        onPress={() => studentItem.rotate()}>
                        <Image source={require('../../../images/correct_rotate.png')} style={{width: 50, height: 50}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contentRightNativeRoot}
                        onPress={() => studentItem.showBoard()}>
                        <Image source={require('../../../images/correct_edit.png')} style={{width: 50, height: 50}}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return <View style={{flex: 1}}/>;
        }
    }


    _renderFooter() {
        let studentItem = studentStore.studentItem;
        if (studentItem) {
            console.log('_renderFooter', studentItem, studentItem.computedTestState * 10);
            return (
                <View
                    style={styles.footerRoot}>
                    <View
                        style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 75,
                            height: 55,
                            opacity: 0.3
                        }}>
                        <Image source={require('../../../images/message.png')} style={{width: 20, height: 20}}/>
                        <Text style={{fontSize: 13, marginTop: 3}}>消息</Text>
                    </View>
                    <View style={{
                        width: DisplayUtils.MIN_LINE_HEIGHT,
                        backgroundColor: '#cdcdcd',
                        marginTop: 10,
                        marginBottom: 10,
                        height: 35,
                    }}/>
                    <View style={styles.testStateFooterItemRoot}>
                        <TouchableOpacity
                            style={styles.testStateFooterItemTouch}
                            onPress={() => {
                                studentItem.updateStudentTestState(0);
                            }}>
                            <Image
                                source={studentItem.computedTestState == 0 ?
                                    require('../../../images/correct_wrong_checked.png') :
                                    require('../../../images/correct_wrong_unchecked.png')}
                                style={[
                                    styles.testStateFooterItem,
                                ]
                                }/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.testStateFooterItemTouch}
                            onPress={() => {
                                studentItem.updateStudentTestState(-2);
                            }}>
                            {
                                studentItem.computedTestState > 0 && studentItem.computedTestState < 10 ? (
                                    <View style={styles.testStateFooterBanture}>
                                        <Text style={styles.testStateFooterText}>
                                            {studentItem.computedTestState * 10}%
                                        </Text>
                                    </View>

                                ) : (
                                    <Image
                                        source={require('../../../images/correct_banture_unchecked.png')}
                                        style={[
                                            styles.testStateFooterItem,
                                        ]
                                        }/>
                                )
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.testStateFooterItemTouch}
                            onPress={() => {
                                studentItem.updateStudentTestState(10);
                            }}>
                            <Image
                                source={studentItem.computedTestState == 10 ?
                                    require('../../../images/correct_right_checked.png') :
                                    require('../../../images/correct_right_unchecked.png')}
                                style={[
                                    styles.testStateFooterItem,
                                    {

                                    }]
                                }/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: DisplayUtils.MIN_LINE_HEIGHT,
                        backgroundColor: '#cdcdcd',
                        marginTop: 10,
                        marginBottom: 10,
                        height: 35,
                    }}/>
                    <TouchableOpacity
                        onPress={() => studentItem.updateStudentTestVoices()}>
                        <View style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 75,
                            height: 55,
                        }}>
                            <Image source={require('../../../images/voice.png')} style={{width: 20, height: 20}}/>
                            <Text style={{fontSize: 13, marginTop: 3}}>语音</Text>
                        </View>

                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    }

    render() {
        let headerView = this._renderHeader();
        let contentView = this._renderContent();
        let footerView = this._renderFooter();
        return (
            <View style={{flex: 1}}>
                {headerView}
                {contentView}
                {footerView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerRoot: {
        flexDirection: 'row',
        height: 50,
        padding: 10,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    headerTestStateImage: {
        width: 30,
        height: 30,
    },
    headerLeftIndexText: {
        color: '#4791ff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlignVertical: 'bottom',
        marginRight: 10,
    },
    headerLeftNameText: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 'normal',
    },
    headerRightChangeView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    contentLeftImageTag: {
        width: 60,
        height: 40,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom:0.5,
    },
    contentRoot: {
        flex: 1,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentLeftTagRoot: {
        width: 60,
        position: 'absolute',
        left: 0,
        top: 10,
    },
    contentRightRotate: {
        position: 'absolute',
        right: 10,
        top: 20,
    },
    contentRightNativeRoot: {
        position: 'absolute',
        right: 10,
        top: 80,
    },
    footerRoot: {
        flexDirection: 'row',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: (TextUtils.isIphoneX()) ? 20 : 0
    },
    testStateFooterItemRoot: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    testStateFooterItemTouch: {
        flex: 1,
        alignItems: 'center'
    },
    testStateFooterBanture: {
        width: 36,
        height: 36,
        backgroundColor: '#ffcc5f',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    testStateFooterText: {
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    testStateFooterItem: {
        width: 36,
        height: 36,
    },
    nameText: {
        fontSize: 16,
        color: '#646464',
        marginRight: 3,
    }

});