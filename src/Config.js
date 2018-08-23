import {Platform} from 'react-native';
export default Config = {

    evn: false,  //true=正式环境 false=测试环境

    'Host': 'http://api.cloudclass.qinxue100.com/',

    'version': '2.2.0',

    'TestHost': 'http://api.test.cloudclass.qinxue100.com/',

    'MaxCourseImageCount': 9,

    'shareUrl': 'http://h5its.qinxue100.com/#/',

    'shareTestUrl': 'http://h5its.test.qinxue100.com/#/',

};
export const ClassTypes = [{id: 2, name: '个性化班组'}, {id: 3, name: '普通班组'}];

export const API = {
    CheckUpdate: {
        url: 'base/version',
        method: 'POST',
        isLogin: false,
        hideLoading:true,
    },
    //登录相关
    Login: {
        url: 'auth/login',
        method: 'POST',
        isLogin: false
    },
    CheckPhoneNum: {
        url: 'auth/check_phone_num',
        method: 'POST',
        isLogin: false
    },
    SendPhoneCode: {
        url: 'auth/send_phone_code',
        method: 'POST',
        isLogin: false
    },
    Forget: {
        url: 'auth/forget',
        method: 'POST',
        isLogin: false
    },
    getAccountList: {
        url: 'auth/accountlist',
        method: 'GET',
        isLogin: false
    },

    //个人中心相关


    Feedback: {
        url: 'base/feedback',
        method: 'POST',
        isLogin: true
    },

    UploadImg: {
        url: 'base/upload/upload_image',
        method: 'POST',
        isLogin: true
    },
    EditUserInfo: {
        url: 'auth/user/save_info',
        method: 'POST',
        isLogin: true
    },
    getUserInfo: {
        url: 'auth/user/info',
        method: 'GET',
        isLogin: true,
        hideLoading:true,
    },
    EditPassword: {
        url: 'auth/user/update_password',
        method: 'POST',
        isLogin: true
    },

    /**
     * 班级相关
     */
    GetClassList: {
        url: 'teacher/class/get_class_list',
        method: 'GET',
        isLogin: true
    },
    GetSubjectsAndGradeForCreateClass: {
        url: 'base/class/component',
        method: 'GET',
        isLogin: true
    },
    GetClassType: {
        url: 'teacher/class/get_classtype_list',
        method: 'GET',
        isLogin: true
    },
    SubmitCreateClass: {
        url: 'teacher/class/create_class',
        method: 'POST',
        isLogin: true
    },
    GetClassesDetail: {
        url: 'teacher/class/get_student_list',
        method: 'GET',
        isLogin: true
    },
    StudentTaskList: {
        url: 'teacher/task/student_task_list',
        method: 'GET',
        isLogin: true
    },
    removeStudent: {
        url: 'teacher/class/expel_student',
        method: 'GET',
        isLogin: true
    },
    GetToBeCorrected: {
        url: 'teacher/class/bemarked',
        method: 'GET',
        isLogin: true
    },

    //获取学科列表
    getSubject: {
        url: 'base/subject',
        method: 'GET',
        isLogin: true
    },
    GetClassInfo: {
        url: 'teacher/class/get_class',
        method: 'GET',
        isLogin: true
    },
    GetClassTasks: {
        url: 'teacher/task/get_class_task',
        method: 'GET',
        isLogin: true
    },
    SetClassInfo: {
        url: 'teacher/class/set_class',
        method: 'POST',
        isLogin: true
    },
    DismissClass: {
        url: 'teacher/class/dismiss_class',
        method: 'POST',
        isLogin: true
    },


    /*已选题目相关*/
    GetFavoritesCount: {
        url: 'teacher/lecture/count_favorites',
        method: 'GET',
        isLogin: true
    },
    getCourseFavorites: {
        url: 'teacher/lecture/get_favorites',
        method: 'GET',
        isLogin: true
    },
    delMultCourseFavorites: {
        url: 'teacher/lecture/del_list_favorites',
        method: 'GET',
        isLogin: true
    },
    selectedCourseListSort: {
        url: 'teacher/lecture/sort_favorites',
        method: 'POST',
        isLogin: true
    },


    //导出数据
    generalClassExportData: {
        url: 'teacher/class/export_class_data',
        method: 'GET',
        isLogin: true
    },

    /**
     * 布置作业相关
     */
    GetKnowledge: {
        url: 'teacher/lecture/get_knowledge',
        method: 'GET',
        isLogin: true
    },
    AddFavorites: {
        url: 'teacher/lecture/add_favorites',
        method: 'POST',
        isLogin: true
    },
    DelFavorites: {
        url: 'teacher/lecture/del_list_favorites_subjectlist',
        method: 'GET',
        isLogin: true
    },
    GetClassListForPublishTask: {
        url: 'teacher/push_task/get_class_list',
        method: 'POST',
        isLogin: true
    },
    GetTestListByClass: {
        url: 'teacher/push_task/get_test_list',
        method: 'POST',
        isLogin: true
    },
    PublishTask: {
        url: 'teacher/push_task/issue',
        method: 'POST',
        isLogin: true
    },
    GetLectureList: {
        url: 'teacher/lecture/get_lecture_list',
        method: 'GET',
        isLogin: true
    },
    GetLessonList: {
        url: 'teacher/lecture/get_lesson_list',
        method: 'GET',
        isLogin: true
    },
    CourseTopicList: {
        url: 'teacher/lecture/get_topic_list',
        method: 'GET',
        isLogin: true
    },
    CourseSubjectList: {
        url: 'teacher/lecture/get_subject_list',
        method: 'GET',
        isLogin: true
    },


    //收藏夹相关
    GetCollectionFolder: {
        url: 'teacher/store/findstore',
        method: 'POST',
        isLogin: true
    },
    AddCollectionFolder: {
        url: 'teacher/store/addstore',
        method: 'POST',
        isLogin: true
    },
    AddCloudToCollectionFolder: {
        url: 'teacher/store/addstore_cloud',
        method: 'POST',
        isLogin: true
    },
    ModifyCollectionFolderName: {
        url: 'teacher/store/editstore',
        method: 'POST',
        isLogin: true
    },
    DeleteCollectionFolder: {
        url: 'teacher/store/delstore',
        method: 'POST',
        isLogin: true
    },


    //新排行榜
    getLeagueClassRank: {
        url: 'teacher/league/class_rank',
        method: 'GET',
        isLogin: true
    },
    //新排行榜只看本班
    getLeagueIsClass: {
        url: 'teacher/league/is_class',
        method: 'GET',
        isLogin: true
    },
    //知识点获取试题
    getKnowledgeDetails: {
        url: 'teacher/lecture/get_knowledge_details',
        method: 'GET',
        isLogin: true
    },
    //收藏夹获取题组信息
    GetCollectionFolderDetail: {
        url: 'teacher/store/getstore_cloud',
        method: 'POST',
        isLogin: true
    },

    //题目详情
    getSubjectDetail: {
        url: 'teacher/lecture/get_subject_detail',
        method: 'GET',
        isLogin: true
    },


    //题目详情
    TestErrorCheck: {
        url: 'teacher/test/error_check',
        method: 'POST',
        isLogin: true
    },


    //题目详情
    TaskRepealTask: {
        url: 'teacher/task/repeal_task',
        method: 'GET',
        isLogin: true
    },

    //获取选项对应学生
    GetOptionStudentList: {
        url: 'teacher/test/option_student_list',
        method: 'GET',
        isLogin: true
    },


    //批改作业相关
    getTaskStudentList: {
        url: 'teacher/task/student_list',
        method: 'GET',
        isLogin: true
    },
    getTaskProfile: {
        url: 'teacher/task/task_profile',
        method: 'GET',
        isLogin: true
    },
    editTaskSetTask: {
        url: 'teacher/task/set_task',
        method: 'POST',
        isLogin: true
    },
    getStudentAnswerList: {
        url: 'teacher/task/student_answer_list',
        method: 'GET',
        isLogin: true
    },
    SendTaskNotice: {
        url: 'teacher/task/send_task_notice',
        method: 'GET',
        isLogin: true
    },
    getTestDetail: {
        url: 'teacher/test/detail',
        method: 'GET',
        isLogin: true
    },
    UpdateVoice: {
        url: 'teacher/test/voice',
        method: 'POST',
        isLogin: true
    },
    ReadStudentList: {
        url: 'teacher/test/read_student_list',
        method: 'GET',
        isLogin: true
    },
    GetStudentTestAnswer: {
        url: 'teacher/test/get_test_answer',
        method: 'GET',
        isLogin: true
    },
    SetStudentTestState: {
        url: 'teacher/test/teacher_commit',
        method: 'POST',
        isLogin: true
    },
    SubmitTeacherAnswer: {
        url: 'teacher/test/teacher_read_test',
        method: 'POST',
        isLogin: true
    },


    ShareLocation: {
        url: 'share/studentAnswerDetailForWeb.html',
        method: 'GET',
        isLogin: true
    },


    //教辅
    GetTutorList: {
        url: 'teacher/tutor/list',
        method: 'GET',
        isLogin: true
    },

    //教材新接口
    GetBookList: {
        url: 'teacher/book/list',
        method: 'GET',
        isLogin: true
    },
    //教材获取章节
    GetBookCateList: {
        url: 'teacher/book/catalog/list',
        method: 'GET',
        isLogin: true
    },
    //教材获取教材讲义
    GetBookNoteList: {
        url: 'teacher/book/note/list',
        method: 'GET',
        isLogin: true
    },
    //试卷ID获取试题
    getBookQuestionList: {
        url: 'teacher/book/question/list',
        method: 'GET',
        isLogin: true
    },
    //教辅获取章节
    GetTutorCatalogList: {
        url: 'teacher/tutor/catalog/list',
        method: 'GET',
        isLogin: true
    },
    //教辅获取章节
    GetTutorPaperList: {
        url: 'teacher/tutor/paper/list',
        method: 'GET',
        isLogin: true
    },

    // 5.21新需求接口

    //课程详情
    GetCourseInfo: {
        url: 'teacher/class_course/info',
        method: 'GET',
        isLogin: true
    },
    //添加课程
    AddCourse: {
        url: 'teacher/class_course/add',
        method: 'POST',
        isLogin: true
    },
    //删除课程
    DelCourse: {
        url: 'teacher/class_course/del',
        method: 'POST',
        isLogin: true
    },
    //修改课程
    EditCourse: {
        url: 'teacher/class_course/edit',
        method: 'POST',
        isLogin: true
    },
    //已添加教案列表
    GetCourseTestList: {
        url: 'teacher/class_course/question/list',
        method: 'GET',
        isLogin: true
    },
    //课程记录
    GetCourseRecordList: {
        url: 'teacher/class_course/student_record/list',
        method: 'GET',
        isLogin: true
    },
    //添加课程记录
    AddCourseRecord: {
        url: 'teacher/class_course/student_record/add',
        method: 'POST',
        isLogin: true
    },
    //删除课程记录
    DelCourseRecord: {
        url: 'teacher/class_course/student_record/del',
        method: 'POST',
        isLogin: true
    },
    //删除课程试题
    DelCourseTest: {
        url: 'teacher/class_course/question/del',
        method: 'POST',
        isLogin: true
    },
    //课后反馈
    GetFeedbackList: {
        url: 'teacher/class_course/student_feedback/list',
        method: 'GET',
        isLogin: true
    },
    //课后反馈
    AddCourseFeedback: {
        url: 'teacher/class_course/student_feedback/add',
        method: 'POST',
        isLogin: true
    },

    //获取课程列表
    GetCourseList: {
        url: 'teacher/class_course/get_course_list',
        method: 'POST',
        isLogin: true
    },
    //添加教案
    AddTeaching: {
        url: 'teacher/class_course/get_add_teaching',
        method: 'POST',
        isLogin: true
    },
    //课程题目信息 
    GetTeachingTestList: {
        url: 'teacher/class_course/get_test_list',
        method: 'POST',
        isLogin: true
    },


    //直播课
    GetLiveLesson: {
        url: 'base/livelesson/getlesson_single',
        method: 'GET',
        isLogin: true
    },
    //直播课
    GetLiveReport: {
        url: 'teacher/live_lesson/report',
        method: 'GET',
        isLogin: true
    },


    //查找老师
    SearchTeacher: {
        url: 'teacher/class/search_teacher',
        method: 'GET',
        isLogin: true
    },

    //转让班级
    TransferClass: {
        url: 'teacher/class/transfer',
        method: 'POST',
        isLogin: true
    },
    //入班申请列表
    ClassApplyList: {
        url: 'teacher/class/apply_list',
        method: 'POST',
        isLogin: true
    },

    //搜索学生
    SearchStudent: {
        url: 'teacher/class/search_student',
        method: 'POST',
        isLogin: true
    },
    //邀请
    InvitationStudent: {
        url: 'teacher/class/invitation_student',
        method: 'GET',
        isLogin: true
    },
    //审核
    ApplyStudent: {
        url: 'teacher/class/add_apply',
        method: 'GET',
        isLogin: true
    },


};
export const errCode = {
    3000: {
        msg: '手机号或密码错误',
    },
    1201: {
        msg: '无效的姓名',
    },
    1015: {
        msg: '原密码不正确',
    },
    3002: {
        msg: '其他设备登录',
    },
    3003: {
        msg: '账号已被禁用',
    },
    3004: {
        msg: '账号和角色不匹配',
    }
};
export const EventName = {
    UpdateFavoriteList: 'UPDATE_FAVORITE_LIST',
    OnTestStatusChange: 'OnTestStatusChange',
};
export const StorageKeys = {
    DefaultSubjectAndGradeKey: 'defaultSubjectGrade',
};