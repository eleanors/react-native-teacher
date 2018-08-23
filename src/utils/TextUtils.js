/**
 * Created by heaton on 2018/1/25.
 */
'use strict';
import Toast from '../utils/Toast';
import {
    Dimensions,
    Platform,
} from 'react-native';

class TextUtils {
    isEmpty(str, trim = true) {
        if (typeof str == 'undefined' || str == null) {
            return true;
        }
        if (trim) {
            str = str.replace(/\s+/g, '');
        }
        return str.length == 0;
    }


    checkSpecialCharacter(str) {

        let regu = /^[\u4E00-\u9FA5\uF900-\uFA2D\da-zA-Z]+$/;
        let re = new RegExp(regu);

        if (re.test(str)) {
            return true;
        } else {
            Toast.error('请勿输入特殊字符');
            return false;
        }

    }

    removeTheSpace(str) {
       let string = str.replace(/\s+/g, "");
        return string;
    }


    isIphoneX() {
        let X_WIDTH = 375;
        let X_HEIGHT = 812;
        let screenW = Dimensions.get('window').width;
        let screenH = Dimensions.get('window').height;
        return (
            Platform.OS === 'ios' &&
            ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
                (screenH === X_WIDTH && screenW === X_HEIGHT))
        )
    }

}


const Instance = new TextUtils();
export default Instance;