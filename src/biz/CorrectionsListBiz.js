/**
 * Created by mac on 2018/5/10.
 * Desription :
 */

'use strict';

import {observable, action} from 'mobx';
class CorrectionsListBiz {
    @observable     refresh = false;
    @observable     className = '';


    @action     mustRefresh() {
        console.log('hasNew  ++  true');
        this.refresh = true;
    }

    @action     refreshComplete() {
        console.log('hasNew  ++  false');
        this.refresh = false;
    }
};
const Instance = new CorrectionsListBiz();
export default Instance;