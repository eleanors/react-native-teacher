/**
 * Created by heaton on 2018/2/5.
 */
'use strict';
import {observable, action} from 'mobx';
import GlobalFloatUtils from '../utils/GlobalFloatUtils';
import HttpUtils from '../utils/HttpUtils';
import {API} from '../Config';

class FavoriteBiz {
    @observable
    mustRefresh = false;
    @action
    setMustRefresh(mustRefresh){
        this.mustRefresh = mustRefresh;
    }
}
const Instance = new FavoriteBiz();
export default Instance;