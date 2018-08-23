/**
 * Created by zjd on 2018/4/9.
 */
'use strict';
import {observable, action} from 'mobx';
import GlobalFloatUtils from '../utils/GlobalFloatUtils';
import HttpUtils from '../utils/HttpUtils';
import {API} from '../Config';

class TestListBiz {
    @observable
    mustRefresh = false;

    @action
    setMustRefresh(mustRefresh){
        this.mustRefresh = mustRefresh;
    }

}
const Instance = new TestListBiz();
export default Instance;