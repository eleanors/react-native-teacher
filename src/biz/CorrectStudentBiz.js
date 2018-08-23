/**
 * Created by heaton on 2018/3/28.
 */
'use strict';
import React from 'react';
import {observable, action, computed} from 'mobx';
import HttpUtils from '../utils/HttpUtils';
import {API, EventName} from '../Config';
import {Overlay} from 'teaset';
import BoardUtils from "../utils/BoardUtils";
import Toast from '../utils/Toast';
import {Actions} from 'react-native-router-flux';
import SliderView from '../page/common/SliderView';
import {DeviceEventEmitter} from 'react-native';
import CorrectionsListBiz from '../biz/CorrectionsListBiz';
import TextUtils from "../utils/TextUtils";

export default class StudentStore {
    taskId;
    testNumber;
    @observable
    studentArr = [];
    onAnswerTypeChange;

    @observable
    studentIndex = 0;
    @observable
    studentItem;

    @computed get studentNum() {
        return this.studentArr.length;
    }

    @computed get canPrev() {
        if (this.studentIndex == 0) {
            return false;
        }
        return true;

    }

    @computed get canNext() {
        if (this.studentIndex == this.studentArr.length - 1) {
            return false;
        }
        return true;
    }


    @action
    init(options) {
        console.log('init', options);
        this.studentArr = options.studentArr;
        this.studentIndex = options.studentIndex;
        this.taskId = options.taskId;
        this.testNumber = options.testNumber;
        this.onAnswerTypeChange = options.onAnswerTypeChange;
        this._getStudentTestInfo(this.studentArr[this.studentIndex]);
    }


    @action
    correctNext() {
        let position = this.studentIndex + 1;
        if (position >= this.studentArr.length) {
            //已经是最后一个学生
            return;
        }
        this._getStudentTestInfo(this.studentArr[position]);
        this.studentIndex = position;

    }

    @action
    correctPrev() {
        let position = this.studentIndex - 1;
        if (this.studentIndex <= 0) {
            //已经是第一个学生
            return;
        }
        this._getStudentTestInfo(this.studentArr[position]);
        this.studentIndex = position;
    }

    _getStudentTestInfo(options) {
        console.log('_getStudentTestInfo', new Date().getTime());
        HttpUtils.request(API.GetStudentTestAnswer, {
            student_id: options.student_id,
            task_id: this.taskId,
            test_number: this.testNumber,
        })
            .then((data) => {
                console.log('_getStudentTestInfo', data);
                this.studentItem = new StudentItem({
                    ...options,
                    ...data,
                    onAnswerTypeChange: (answerType) => {
                        this.onAnswerTypeChange(this.studentIndex, answerType);
                    }
                });
                console.log('_getStudentTestInfo', new Date().getTime());
            })
            .catch((err) => {
                console.log('_getStudentTestInfo', err);
            });
    }
}

class StudentItem {
    // 构造
    constructor(options) {
        // 初始状态
        console.log('studentItem constructor', options);
        this.studentName = options.student_name;
        this.studentTestState = options.answer_type;
        this.studentAnswers = options.student_answer;
        this.teacherAnswers = options.teacher_answer;
        this.studentId = options.student_id;
        this.voices = options.voice.list || [];
        this.voiceId = options.voice.id || 0;
        this.taskId = options.task_id;
        this.testNumber = options.test_number;
        this.isAnswered = options.is_answered == 1;
        this.currImageIndex = 0;
        this.currImageRotateDegree = 0;
        this.onAnswerTypeChange = options.onAnswerTypeChange;
    }

    onAnswerTypeChange;
    taskId;
    testNumber;
    studentId;
    @observable
    studentName;
    @observable
    studentTestState;
    @observable
    currImageIndex = 0;
    @observable
    currImageRotateDegree = 0;
    @observable
    isAnswered;
    studentAnswers = [];
    @observable
    teacherAnswers = [];
    voices = [];
    voiceId = 0;

    @computed
    get imagePaths() {
        let imagePaths = [];
        this.studentAnswers.map((studentPath, index) => {
            let teacherPath = this.teacherAnswers[index];
            if (teacherPath) {
                imagePaths.push(teacherPath);
            } else {
                imagePaths.push(studentPath);
            }
        });
        return imagePaths;
    };

    @action
    changeImageIndex(index) {
        this.currImageIndex = index;
        this.currImageRotateDegree = 0;
    }

    @action
    rotate() {
        if (!this.isAnswered) {
            Toast.error("学生未作答");
            return;
        }
        if (this.currImageRotateDegree == 360) {
            this.currImageRotateDegree = 90;
        } else {
            this.currImageRotateDegree += 90;
        }
        console.log('rotate', this.currImageRotateDegree);
    }

    @action
    updateStudentTestState(state) {
        console.log('_getStudentTestInfo', new Date().getTime());
        if (!this.isAnswered) {
            Toast.error("学生未作答，不可更改状态");
            return;
        }
        if (state == -2) {
            this._showHalfSlider();
            return;
        }
        let tempState;
        switch (state) {
            case -1://未批阅
                tempState = 0;
                break;
            case 0://错误
                tempState = 2;
                break;
            case 1://10%
                tempState = 6;
                break;
            case 2://20%
                tempState = 3;
                break;
            case 3://30%
                tempState = 7;
                break;
            case 4://40%
                tempState = 8;
                break;
            case 5://50%
                tempState = 4;
                break;
            case 6://60%
                tempState = 9;
                break;
            case 7://70%
                tempState = 10;
                break;
            case 8://80%
                tempState = 5;
                break;
            case 9://90%
                tempState = 11;
                break;
            case 10://正确
                tempState = 1;
                break;
        }
        console.log('_getStudentTestInfo', new Date().getTime());
        HttpUtils.request(API.SetStudentTestState, {
            student_id: this.studentId,
            task_id: this.taskId,
            test_number: this.testNumber,
            answer_type: tempState,
        })
            .then((data) => {
                console.log('updateStudentTestState', data, this.onAnswerTypeChange);
                this.studentTestState = tempState;
                if (this.onAnswerTypeChange) {
                    this.onAnswerTypeChange(tempState);
                }
                DeviceEventEmitter.emit(EventName.OnTestStatusChange);
                CorrectionsListBiz.mustRefresh();
                console.log('_getStudentTestInfo', new Date().getTime());
            })
            .catch((err) => {
                Toast.error('批改题目错误');
                console.log('updateStudentTestState', err);
            });

    }

    _showHalfSlider() {
        let key;
        let sliderView = (
            <Overlay.View
                style={{justifyContent: 'flex-end', paddingBottom: (TextUtils.isIphoneX()) ? 20 : 0}}
                modal={true}
                overlayOpacity={0}>
                <SliderView
                    onCancel={() => {
                        Overlay.hide(key);
                    }}
                    onSure={(value) => {
                        Overlay.hide(key);
                        this.updateStudentTestState(value);
                    }}
                    value={this.computedTestState}/>
            </Overlay.View>
        );
        key = Overlay.show(sliderView);
    }

    @computed
    get computedTestState() {
        if (!this.studentTestState) {
            return -1;
        }
        let state = -1;
        console.log('studentTestState', this.studentTestState);
        switch (this.studentTestState) {
            case 0://未批阅
                state = -1;
                break;
            case 1://正确
                state = 10;
                break;
            case 2://错误
                state = 0;
                break;
            case 3:
                state = 2;
                break;
            case 4:
                state = 5;
                break;
            case 5:
                state = 8;
                break;
            case 6:
                state = 1;
                break;
            case 7:
                state = 3;
                break;
            case 8:
                state = 4;
                break;
            case 9:
                state = 6;
                break;
            case 10:
                state = 7;
                break;
            case 11:
                state = 9;
                break;
        }
        return state;
    }

    @action
    updateStudentTestVoices() {
        // if (!this.isAnswered) {
        //     Toast.error("学生未作答");
        //     return;
        // }
        Actions.audioDialog({
            voiceList: this.voices,
            uploadOptions: {
                task_id: this.taskId,
                test_number: this.testNumber,
                student_id: this.studentId,
                voice_type: 1,
                voice_id: this.voiceId,
            },
            submitSuccess: (result) => {
                this.voices = result.voice_list.map((item) => {
                    item.url = item.voice_url;
                    item.time = item.voice_time;
                    return item;
                });
                this.voiceId = result.id;
            }
        });
    }

    @action
    showBoard() {
        if (!this.isAnswered) {
            Toast.error("学生未作答");
            return;
        }
        let studentImagePath = this.studentAnswers[this.currImageIndex];
        let teacherImagePath = this.teacherAnswers[this.currImageIndex];
        let uploadUrl = HttpUtils._initUrl(API.UploadImg.url, {access_token: global.access_token});
        console.log(uploadUrl);
        // return;
        BoardUtils.openBoard({
            studentImagePath: studentImagePath,
            teacherImagePath: teacherImagePath,
            uploadUrl: uploadUrl
        })
            .then((url) => {
                console.log('completed url ', url);
                HttpUtils.request(API.SubmitTeacherAnswer, {
                    student_id: this.studentId,
                    task_id: this.taskId,
                    test_number: this.testNumber,
                    index: this.currImageIndex,
                    result: url,
                })
                    .then((data) => {
                        Toast.success("保存批改成功");
                        let teacherAnswers = Array.from(this.teacherAnswers);
                        teacherAnswers[this.currImageIndex] = url;
                        this.teacherAnswers = teacherAnswers;
                    })
                    .catch((err) => {
                        Toast.error("保存批改失败");
                    });
            })
            .catch((err) => {
                console.log('completed err ', err);
            });
    }
}
