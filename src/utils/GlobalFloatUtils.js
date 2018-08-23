/**
 * Created by heaton on 2018/2/1.
 * Desription :
 */

'use strict';

import {
    NativeModules,
} from 'react-native';

const { GlobalFloatModule } = NativeModules;
let isShowing = false;
export default {
    showFloat(options){
        console.log('showFloat',options);
        isShowing = true;
        return GlobalFloatModule.showFloat(options);
    },
    dismissFloat(){
        isShowing = false;
        return GlobalFloatModule.dismissFloat();
    },
    isFloatShowing(callBack = ()=>{}){
        // return GlobalFloatModule.isFloatShowing(callBack);
        callBack(isShowing);
    },
    NativeMethod(options){
        return GlobalFloatModule.NativeMethod(options);
    },
};