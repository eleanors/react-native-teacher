/**
 * Created by heaton on 2018/3/16.
 * 语音播放工具类
 */
'use strict';
import {Platform} from 'react-native';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';
import AudioConvertUtils from './AudioConvertUtils';


// status 1=准备播放  2=播放完成  3=播放失败
class AudioPlayUtils {
    soundPlayer;

    play(url,callback) {
        console.log(url);
        if(!callback){
            callback = ()=>{}
        }
        this.stop();
        if (url.indexOf('http') >= 0 && Platform.OS === 'ios' && url.indexOf('.amr') > 0) {
            RNFetchBlob
                .config({
                    fileCache: true,
                    appendExt: 'amr',
                })
                .fetch('GET', url)
                .then((res) => {
                    console.log('res', res, res.path());
                    let originPath = res.path();
                    let targetPath = originPath.replace('.amr','.wav');
                    AudioConvertUtils.amrToWav(res.path(),targetPath).then((targetPath)=>{
                        console.log('targetPath',targetPath);
                        this._playSound(targetPath,callback);
                    });
                })
                .catch((err) => {
                    console.log('音频下载错误', err);
                });
        } else {
            this._playSound(url,callback);
        }
    }

    _playSound(path,callback){
        this.soundPlayer = new Sound(path, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                callback(3);
                return;
            }
            callback(1);
            this.soundPlayer.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    callback(2);
                    this.soundPlayer.release();
                } else {
                    console.log('playback failed due to audio decoding errors');
                    callback(3);
                }
            });
        });
    }

    stop() {
        if (this.soundPlayer && this.soundPlayer.isPlaying) {
            console.log('soundPlayer is playing');
            this.soundPlayer.stop();
            this.soundPlayer.reset();
            this.soundPlayer.release();
        }
    }
}
const Instance = new AudioPlayUtils();
export default Instance;