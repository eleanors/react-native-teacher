/**
 * Created by Administrator on 2018-05-25.
 */
import {NativeModules} from 'react-native'
const {MyNativeModule} = NativeModules;
export default {
    NativeMethod(options){
        return MyNativeModule.NativeMethod(options);
    },
};
