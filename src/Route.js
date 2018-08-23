import React from 'react';

import {
    Image,
    StyleSheet,
    ToastAndroid,
    Platform,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    BackHandler,
    DeviceEventEmitter,
    NativeModules,
    NativeEventEmitter,
    NativeModule,
    StatusBar
} from 'react-native';
import {
    Scene,
    Router,
    Reducer,
    Tabs,
    Lightbox,
    Actions,
    ActionConst,
    Modal,
} from 'react-native-router-flux';
import DisplayUtils from './utils/DisplayUtils';
import Launch from "./Launch";

/*account*/
import Login from "./page/account/Login";
import Reg from "./page/account/Reg";
import Bootstrap from "./page/account/Bootstrap";
import Forget from "./page/account/Forget";
import Improve from "./page/account/Improve";
import Activate from "./page/account/Activate";
/*end-account*/

/*tabHome start*/
import Task from "./page/tabHome/Task";
import My from "./page/tabHome/My";
import ClassList from "./page/tabHome/ClassList";
import CollectionFolderDetail from "./page/task/arrangement/CollectionFolderDetail";
/*tabHome end*/

/*class start*/
import CreateClass from "./page/class/CreateClass";
import ClassDetail from "./page/class/ClassDetail";
import ClassInfo from "./page/class/ClassInfo";
import StudentTaskSituation from "./page/class/StudentTaskSituation";
import ToBeCorrectedList from "./page/class/ToBeCorrectedList";

/*class end*/

/*common start*/
import Loading from "./page/common/Loading";
import ShareBoard from "./page/common/ShareBoard";
import ProgressDialog from "./page/common/ProgressDialog";
import ConfirmDialog from "./page/common/ConfirmDialog";
import ErrToast from "./page/common/ErrToast";
import InputDialog from "./page/common/InputDialog";
import PopupStudent from "./page/common/PopupStudent";

/*common end*/

/*task start*/
import TaskList from "./page/task/correct/TaskList";
import TaskDetail from "./page/task/correct/TaskDetail";
/*task end*/

// my start
import Feedback from "./page/my/Feedback";
import Setting from "./page/my/Setting";
import Info from "./page/my/Info";
import EditPassword from "./page/my/EditPassword";
// my end

//布置作业 start
import KnowledgePointList from "./page/task/arrangement/KnowledgePointList";
import TestList from "./page/task/TestList";
import GlobalFloatUtils from "./utils/GlobalFloatUtils";
import TaskBiz from './biz/TaskBiz';
import CourseSelected from "./page/task/arrangement/CourseSelected";
import MyCollection from './page/task/arrangement/MyCollection';
import CourseList from './page/task/arrangement/CourseList';
import SelectSubject from './page/task/arrangement/SelectSubject';
//布置作业 end

import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import CorrectList from "./page/task/correct/CorrectList";
import SubmitList from "./page/task/correct/SubmitList";
import Ranking from "./page/task/correct/Ranking";
import StudentSubmit from "./page/task/Student/StudentSubmit";
import SubjectList from "./page/task/Subject/SubjectList";
import PublishTask from "./page/task/arrangement/PublishTask";
import CourseAddTeaching from './page/task/arrangement/CourseAddTeaching';
import ClassCourseSelected from "./page/task/arrangement/ClassCourseSelected";
import AnswerCard from "./page/task/Subject/AnswerCard";
import PublishSuccess from "./page/task/arrangement/PublishSuccess";
import PrintTask from "./page/task/arrangement/PrintTask";
import AudioDialog from "./page/common/AudioDialog";
import SubjectItem from "./page/task/Subject/SubjectItem";
import CorrectStudent from "./page/task/correct/CorrectStudent";
import SubjectError from "./page/task/Subject/SubjectError";
import OriginalTest from "./page/task/correct/OriginalTest";
import DatePickerDialog from "./page/common/DatePickerDialog";
import ImageDialog from "./page/common/ImageDialog";
import Section from "./page/task/material/Section";
import SectionImgs from "./page/task/material/SectionImgs";
import SectionVideo from "./page/task/material/SectionVideo";
import SectionTest from "./page/task/material/SectionTest";
import TutorSection from "./page/task/Tutor/TutorSection";
import CourseTEMP from "./page/class/course/CourseTEMP";
import CourseDesc from "./page/class/CourseDesc";
import CourseInfo from "./page/class/course/CourseInfo";
import CourseTest from "./page/class/course/CourseTest";
import CourseRecord from "./page/class/course/CourseRecord";
import CourseFeedback from "./page/class/course/CourseFeedback";
import ClassRank from "./page/class/ClassRank";
import LiveCourse from "./page/class/live/LiveCourse";
import TestReport from "./page/class/live/TestReport";
import TestRecommend from "./page/class/live/TestRecommend";
import ShareBoardImg from "./page/common/ShareBoardImg";
import AddClassAuditing from "./page/class/AddClassAuditing";
import TransferClass from "./page/class/TransferClass";
import InvitationStudent from "./page/class/InvitationStudent";

class TabIcon extends React.Component {
    render() {
        return (
            <Image source={this.props.source} style={{width: 30, height: 30}}/>
        );
    }
}

/**
 * 需要显示购物车悬浮框的页面
 * @type {[*]}
 */
const showFloatScenes = ["_task", "task", "knowledgeList", "testList", "collectionFolderDetail", "courseList", "selectSubject", "section", "sectionTest", "tutorList", "tutorSection", "testRecommend"];

if (Platform.OS === 'ios') {
    // //开始监听
    let GlobalFloatModule = NativeModules.GlobalFloatModule;
    GlobalFloatModule.startObserving();
    let emitter = new NativeEventEmitter(GlobalFloatModule);
    //用获取的模块创建监听器
    this.subScription = emitter.addListener("clickGlobalFloat", (body) => {

        console.info('收到', Actions.currentScene);
        if(Actions.currentScene === 'courseRecord'){
            return;
        }
        Actions.courseSelected();
    })

} else {
    DeviceEventEmitter.addListener("clickFloatButton", () => {
        Actions.courseSelected();
    });
}

const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
        // console.log('ACTION:', action, state);
        if (action.type === ActionConst.FOCUS || action.type === 'Navigation/INIT') {
            let currScene = Actions.currentScene;
            // console.log('currScene --- ', currScene, showFloatScenes.indexOf(currScene));
            if (showFloatScenes.indexOf(currScene) >= 0) {
                let testNum = TaskBiz.testCount;
                // console.log('reducerCreate showFloat --- ' + testNum);
                GlobalFloatUtils.showFloat({num: testNum});
            } else {
                GlobalFloatUtils.dismissFloat();
            }
        }
        return defaultReducer(state, action);
    };
};
const getSceneStyle = () => ({
    backgroundColor: '#f5f5f5',
    shadowOpacity: 1,
    shadowRadius: 3,
});

let backTouchMills = 0;
const backAndroidHandler = () => {
    // console.log(Actions.state.routes[0].routes[0]);
    if (Actions.state.routes[0].routes[0].index == 0) {
        let currBackMills = new Date().getTime();
        if (currBackMills - backTouchMills < 2000) {
            return false;
        }
        backTouchMills = currBackMills;
        ToastAndroid.show('再次点击退出程序', ToastAndroid.SHORT);
        return true;
    }
    Actions.pop();
    return true;
};

// console.log(123123,);
export default Route = () => (
    <Router
        createReducer={reducerCreate}
        getSceneStyle={getSceneStyle}
        backAndroidHandler={backAndroidHandler}>
        <Lightbox>
            <Scene
                key="root"
                hideNavBar
                transitionConfig={() => ({screenInterpolator: CardStackStyleInterpolator.forHorizontal})}
                navigationBarStyle={styles.mainNavBarStyle}
                titleStyle={styles.mainTitleStyle}
                rightTitle=" "
                onRight={() => {
                    // console.log('onRight')
                }}
                // headerMode='screen'
                navBarButtonColor="#cccccc"
                backButtonTextStyle={{width: 0}}
                backButtonImage={require('./images/nav_back_normal.png')}>
                <Scene key="launch" component={Launch} title="Launch" initial hideNavBar/>
                <Scene key="main">
                    <Tabs key="tabHome"
                          tabBarPosition="bottom"
                          swipeEnabled={false}
                          animationEnabled={false}
                          labelStyle={styles.tabLabelStyle}
                          tabBarStyle={styles.tabBarStyle}
                          tabStyle={styles.tabStyle}
                          leftTitle=" "
                          onLeft={() => {
                              console.log('onLeft')
                          }}>
                        <Scene
                            key="classList"
                            component={ClassList}
                            tabBarLabel="班级"
                            title="班级"
                            icon={(state) => {
                                let source = state.focused ?
                                    require('./images/tab_class_pre.png') :
                                    require('./images/tab_class_normal.png');
                                return (
                                    <TabIcon source={source}/>
                                );
                            }}
                            renderRightButton={() => {
                                return (
                                    <TouchableOpacity onPress={() => Actions.refs.classList.onRight()}>
                                        <View style={{marginRight: 10, padding: 10}}>
                                            <Image
                                                source={require('./images/class_nav_new_normal.png')}
                                                style={{width: 15, height: 15}}/>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            onEnter={() => Actions.refs.classList.onEnter()}/>
                        <Scene
                            key="task"
                            component={Task}
                            tabBarLabel="资源"
                            title="高中数学"
                            icon={(state) => {
                                let source = state.focused ?
                                    require('./images/tab_work_pre.png') :
                                    require('./images/tab_work_normal.png');
                                return (
                                    <TabIcon source={source}/>
                                );
                            }}
                            renderTitle={(nav) => {
                                return (
                                    <View style={styles.mainTitleWrapStyle}>
                                        <TouchableOpacity
                                            onPress={() => Actions.refs.task._showPopover()}>
                                            <View style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                            }}>
                                                <Text style={[styles.mainTitleStyle, {fontWeight: 'bold'}]}>
                                                    {nav.title}
                                                </Text>
                                                <Text style={[styles.mainTitleStyle, {fontSize: 8}]}> ▼ </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                            onEnter={() => Actions.refs.task._onEnter()}>
                        </Scene>
                        <Scene
                            key="my"
                            component={My}
                            tabBarLabel="我的"
                            title="我的"
                            hideNavBar={true}
                            icon={(state) => {
                                let source = state.focused ?
                                    require('./images/tab_mine_pre.png') :
                                    require('./images/tab_mine_normal.png');
                                return (
                                    <TabIcon source={source}/>
                                );
                            }}/>
                    </Tabs>


                    <Scene key="feedback"
                           component={Feedback}
                           title="意见反馈"
                           renderRightButton={() => {
                               return (
                                   <TouchableOpacity onPress={() => {
                                       Actions.refs.feedback.onRight()
                                   }}>
                                       <View style={{marginRight: 10, padding: 10}}>
                                           <Image source={require('./images/feedback-send.png')}
                                                  style={{width: 20, height: 20}}/>
                                       </View>
                                   </TouchableOpacity>
                               )
                           }}
                    />

                    <Scene key="setting" component={Setting} title="设置"/>
                    <Scene key="info" component={Info} title="个人信息"/>
                    <Scene key="editPassword" component={EditPassword} title="修改密码"/>

                    <Scene
                        key="classDetail"
                        component={ClassDetail}
                        title=""
                        renderRightButton={() => {
                            //下期再做
                            return (
                                <View>

                                    <TouchableOpacity  onPress={() => Actions.refs.classDetail.onRight()}>
                                    <View style={{marginRight: 10, padding: 10}}>
                                    <Image source={require('./images/fenxiang.png')}
                                    style={{width: 18, height: 18}}/>
                                    </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                        hideNavBar={true}
                        onEnter={() => Actions.refs.classDetail.onEnter()}/>
                    <Scene key="createClass" component={CreateClass} title="创建班级"/>
                    <Scene key="classInfo" component={ClassInfo} title="班级信息"/>
                    <Scene
                        key="toBeCorrectedList"
                        component={ToBeCorrectedList}
                        title="待改作业"
                        onEnter={() => Actions.refs.toBeCorrectedList._onEnter()}
                    />
                    <Scene
                        key="studentTaskSituation"
                        hideNavBar
                        component={StudentTaskSituation}
                        title="学生作业情况"/>
                    <Scene key="classTaskList" component={TaskList} title="作业列表"/>
                    <Scene
                        key="taskDetail"
                        component={TaskDetail}
                        title="作业详情"
                        renderRightButton={() => {
                            return (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap',}}>
                                    <TouchableOpacity
                                        onPress={() => Actions.refs.taskDetail.Print()}>
                                        <View style={{padding: 10}}>
                                            <Image
                                                source={require('./images/dayin.png')}
                                                style={{width: 18, height: 18}}
                                                resizeMode='contain'/>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => Actions.refs.taskDetail.addCollection()}>
                                        <View style={{marginRight: 10, padding: 10}}>
                                            <Image
                                                source={require('./images/subject_collect.png')}
                                                style={{width: 18, height: 18}}
                                                resizeMode='contain'/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}/>
                    <Scene key="correctList" component={CorrectList} title="选择学生开始批阅" hideNavBar/>
                    <Scene key="ranking" component={Ranking} title="排行榜"/>
                    <Scene
                        key="submitList"
                        component={SubmitList}
                        title="提交情况"
                        rightTitle=""
                        onRight={() => Actions.refs.submitList.onRight()}
                    />
                    <Scene key="knowledgeList" component={KnowledgePointList} title="二级知识点"/>
                    <Scene
                        key="courseSelected"
                        component={CourseSelected}
                        title="已选题目"
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.refs.courseSelected.onRight()}>
                                    <View style={{padding: 10}}>
                                        <Image
                                            source={require('./images/subject_collect.png')}
                                            style={{width: 18, height: 18}}
                                            resizeMode='contain'/>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}/>
                    <Scene
                        key="myCollection"
                        component={MyCollection}
                        title="我的收藏"
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.refs.myCollection.onRight()}>
                                    <View style={{padding: 10}}>
                                        <Text style={{color: '#636363', fontSize: 16,}}>完成</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}/>
                    <Scene key="courseList" component={CourseList} title="教材详情"/>
                    <Scene key="selectSubject" component={SelectSubject} title="选择题目"
                           onEnter={() => Actions.refs.selectSubject._onEnter()}/>
                    <Scene
                        key="collectionFolderDetail"
                        component={CollectionFolderDetail}
                        title="题组列表"
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.refs.collectionFolderDetail.onRight()}>
                                    <View style={{marginRight: 10, padding: 10}}>
                                        <Image source={require('./images/nav_more_normal.png')}
                                               style={{width: 20, height: 20}}
                                               resizeMode='contain'/>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        onEnter={() => Actions.refs.collectionFolderDetail._onEnter()}/>
                    <Scene
                        key="testList"
                        component={TestList}
                        title="题目列表"
                        onEnter={() => Actions.refs.testList._onEnter()}
                    />
                    <Scene
                        key="studentSubmit"
                        component={StudentSubmit}
                        title=''
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.refs.studentSubmit.onRight()}>
                                    <View style={{padding: 10}}>
                                        <Image source={require('./images/fenxiang.png')}
                                               style={{width: 18, height: 18}}
                                               resizeMode='contain'/>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <Scene key="subjectError" component={SubjectError} title='题目报错'/>
                    <Scene
                        key="subjectList"
                        component={SubjectList}
                        title=''
                        renderRightButton={() => {
                            return (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap',}}>
                                    <TouchableOpacity onPress={() => Actions.refs.subjectList.onRightError()}>
                                        <View style={{padding: 10}}>
                                            <Image source={require('./images/subject_error.png')}
                                                   style={{width: 18, height: 18}}
                                                   resizeMode='contain'/>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Actions.refs.subjectList.onRightCollect()}>
                                        <View style={{marginRight: 10, padding: 10}}>
                                            <Image source={require('./images/subject_collect.png')}
                                                   style={{width: 18, height: 18}}
                                                   resizeMode='contain'/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                    <Scene
                        key="subjectItem"
                        component={SubjectItem}
                        title='题目详情'
                        renderRightButton={() => {
                            return (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap',}}>
                                    <TouchableOpacity onPress={() => Actions.refs.subjectItem.onRightError()}>
                                        <View style={{padding: 10}}>
                                            <Image source={require('./images/subject_error.png')}
                                                   style={{width: 16, height: 16}}
                                                   resizeMode='contain'/>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Actions.refs.subjectItem.onRightCollect()}>
                                        <View style={{marginRight: 10, padding: 10}}>
                                            <Image source={require('./images/subject_collect.png')}
                                                   style={{width: 16, height: 16}}
                                                   resizeMode='contain'/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />

                    <Scene key="publishTask" component={PublishTask} title='发布作业'/>
                    <Scene key="courseAddTeaching" component={CourseAddTeaching} title='加入教案'/>
                    <Scene key="answerCard" component={AnswerCard} title='答题卡' hideNavBar/>
                    <Scene key="classCourseSelected" component={ClassCourseSelected} title='发布作业'/>
                    <Scene key="publishSuccess" component={PublishSuccess} title='发布作业成功' hideNavBar/>
                    <Scene key="printTask" component={PrintTask} title='打印作业'/>
                    <Scene key="section" component={Section}/>
                    <Scene key="sectionImgs" component={SectionImgs} title='教材讲义'/>
                    <Scene key="sectionVideo" component={SectionVideo} title='课堂实录'/>
                    <Scene key="sectionTest" component={SectionTest} title='电子试题'
                           onEnter={() => Actions.refs.sectionTest._onEnter()}/>
                    <Scene key="tutorSection" component={TutorSection} title='章节列表'/>
                    <Scene
                        key="correctStudent"
                        component={CorrectStudent}
                        title="批改学生作业"
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.refs.correctStudent._onRight()}>
                                    <View
                                        style={{padding: 10}}>
                                        <Text style={{color: '#636363', fontSize: 16,}}>原题</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}/>
                    <Scene
                        key="originalTest"
                        component={OriginalTest}
                        title='原题'
                        hideBackImage={true}
                        onBack={()=>{}}
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.pop()}>
                                    <View style={{padding: 15, paddingLeft: 70,}}>
                                        <Image source={require('./images/modal-close.png')}
                                               style={{width: 16, height: 16}}
                                               resizeMode='contain'/>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />

                    {/*5.21新需求*/}

                    <Scene key="addCourse" component={CourseTEMP} title='添加课程'/>
                    <Scene key="editCourse" component={CourseTEMP} title='编辑课程'/>
                    <Scene key="courseDesc" component={CourseDesc} title='课程介绍'/>
                    <Scene key="courseInfo" component={CourseInfo} title='课程详情' onEnter={() => Actions.refs.courseInfo.onEnter()}/>
                    <Scene key="courseTest" component={CourseTest} title='准备教案'/>
                    <Scene key="addClassAuditing" component={AddClassAuditing} title='入班审核'/>
                    <Scene key="transferClass" component={TransferClass} title='转让班级'/>
                    <Scene key="invitationStudent" component={InvitationStudent} title='邀请学生'/>
                    <Scene
                        key="courseFeedback"
                        component={CourseFeedback}
                        title='课后反馈'
                        renderRightButton={() => {
                            return (
                                <TouchableOpacity onPress={() => Actions.refs.courseFeedback._onRight()}>
                                    <View
                                        style={{padding: 10}}>
                                        <Text style={{color: '#636363', fontSize: 16,}}>保存</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}/>
                    <Scene key="classRank" component={ClassRank} title='排行榜'  onEnter={() => Actions.refs.classRank._onEnter()}/>
                    <Scene key="courseRecord" component={CourseRecord} title='上课记录'/>


                    {/*6.11新需求*/}
                    <Scene key="liveCourse" component={LiveCourse} title='课程详情' onEnter={() => Actions.refs.liveCourse._onEnter()}/>
                    <Scene key="testRecommend" component={TestRecommend} title='推荐试题'  onEnter={() => Actions.refs.testRecommend._onEnter()}/>
                    <Scene key="testReport" component={TestReport}
                           renderTitle={(nav) => {
                               return (
                                   <View style={styles.mainTitleWrapStyle}>
                                       <TouchableOpacity
                                           onPress={() => Actions.refs.testReport._showPopover()}>
                                           <View style={{
                                               justifyContent: 'center',
                                               alignItems: 'center',
                                               flexDirection: 'row',
                                           }}>
                                               <Text style={[styles.mainTitleStyle, {fontWeight: 'bold'}]}>
                                                   {nav.title}
                                               </Text>
                                               <Text style={[styles.mainTitleStyle, {fontSize: 8}]}> ▼ </Text>
                                           </View>
                                       </TouchableOpacity>
                                   </View>
                               );
                           }}
                    />

                </Scene>
                <Scene key="sign">
                    <Scene
                        key="login"
                        component={Login}
                        rightTitle=" 忘记密码？"
                        back={true}
                    />
                    <Scene key="reg" component={Reg}/>
                    <Scene key="activate" component={Activate} title='账号开通'/>
                    <Scene key="bootstrap" component={Bootstrap} initial hideNavBar/>
                    <Scene key="forget" component={Forget} title="重置密码"/>
                    <Scene key="improve" component={Improve} title="完善资料"/>
                </Scene>
            </Scene>
            <Scene key="loading" component={Loading}/>
            <Scene key="progressDialog" component={ProgressDialog}/>
            <Scene key="shareBoard" component={ShareBoard}/>
            <Scene key="shareBoardImg" component={ShareBoardImg}/>
            <Scene key="confirmDialog" component={ConfirmDialog}/>
            <Scene key="popupStudent" component={PopupStudent}/>
            <Scene key="errToast" component={ErrToast}/>
            <Scene key="inputDialog" component={InputDialog}/>
            <Scene key="audioDialog" component={AudioDialog}/>
            <Scene key="imageDialog" component={ImageDialog}/>
            <Scene key="datePickerDialog" component={DatePickerDialog}/>
        </Lightbox>
    </Router>
);

const styles = StyleSheet.create({
    mainNavBarStyle: {
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight-4,
        height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 40,
        borderBottomWidth: 0,
        elevation:0,
        // borderBottomColor: '#cccccc'
    },
    mainTitleWrapStyle: {
        position: 'absolute',
        alignSelf: 'center',
    },
    mainTitleStyle: {
        alignSelf: 'center',
        fontWeight: 'normal',
        color: '#000000',
        fontSize: 16,
    },
    tabLabelStyle: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    tabBarStyle: {
        borderTopColor: '#cccccc',
        borderTopWidth: DisplayUtils.px2dp(1),
        height: 60,
    },
    tabStyle: {
        paddingBottom: 5,
        paddingTop: 5,
        backgroundColor: '#fff',
    }
});