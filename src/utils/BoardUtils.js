/**
 * Created by heaton on 2018/2/1.
 * Desription :
 */

'use strict';

import {
    NativeModules,
} from 'react-native';

const { BoardModule } = NativeModules;
export default {
    openBoard(options){
        return BoardModule.openBoard(options);
    }
};