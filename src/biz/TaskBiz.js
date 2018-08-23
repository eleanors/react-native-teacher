/**
 * Created by heaton on 2018/2/5.
 */
'use strict';
import {observable, action} from 'mobx';
import GlobalFloatUtils from '../utils/GlobalFloatUtils';
import HttpUtils from '../utils/HttpUtils';
import {API} from '../Config';

class TaskBiz {
    @observable
    testCount = -1;

    @action
    add(num = 1) {
        this.testCount += num;
        console.log('add ',num)
        GlobalFloatUtils.isFloatShowing((isShowing) => {
            if (isShowing) {
                GlobalFloatUtils.showFloat({num: this.testCount});
            }
        });
    }

    @action
    reduce(num = 1) {
        this.testCount -= num;
        if (this.testCount < 0) {
            this.testCount = 0;
        }
        GlobalFloatUtils.isFloatShowing((isShowing) => {
            if (isShowing) {
                GlobalFloatUtils.showFloat({num: this.testCount});
            }
        });
    }

    @action
    syncServer() {
        HttpUtils.request(API.GetFavoritesCount, {}).then((data) => {
            console.log("++++++****+++++++++getFavoritesCount++++++++++++++++++" + data)
            this.testCount = data;
            GlobalFloatUtils.isFloatShowing((isShowing) => {
                if (isShowing) {
                    GlobalFloatUtils.showFloat({num: this.testCount});
                }
            });
        }).catch((err) => {

        });
    }
    @action
    clear() {
        this.testCount = 0;
        GlobalFloatUtils.isFloatShowing((isShowing) => {
            if (isShowing) {
                GlobalFloatUtils.showFloat({num: this.testCount});
            }
        });
    }
}
const Instance = new TaskBiz();
export default Instance;