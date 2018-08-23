/**
 * Created by heaton on 2018/2/1.
 * Desription :
 */

'use strict';

import {
    NativeModules,
} from 'react-native';

const { AudioConversion } = NativeModules;
export default {
    amrToWav(originPath,targetPath){
        return AudioConversion.amrToWav({
            originPath:originPath,
            targetPath:targetPath
        });
    }
};