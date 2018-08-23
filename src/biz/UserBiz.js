

import {observable,action} from 'mobx';
export default class UserBiz {
    @observable userInfo = {
        access_token:'',
        expires_in:-1,
        img_url:'',
        mobile:'',
        sex:-1,
        user_name:'',
        user_type:-1,
        grade:{
            grade_name:'',
            grade_type:'',
        },
        subject:{
            subject_name:'',
            subject_id:'',
        },
        birthday_time:''
    };
    @action
    updateUserInfo(info){
        this.userInfo = info;
    }
}