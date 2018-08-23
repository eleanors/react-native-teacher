/**
 * Created by mac on 2018/5/30.
 * Desription :
 */

'use strict';

import {
    NativeModules,
} from 'react-native';

const { SpeechConversionText } = NativeModules;

export default {
    VoiceToText(options){
        return SpeechConversionText.VoiceToText(options);
    },
    CloseRecognition(options){
        return SpeechConversionText.CloseRecognition(options);
    }
};