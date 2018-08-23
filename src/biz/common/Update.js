/**
 * Created by heaton on 2017/12/20.
 */
'use strict';
import {Platform, Linking,Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNFetchBlob from 'react-native-fetch-blob';
import CodePush from 'react-native-code-push';
import HttpUtils from '../../utils/HttpUtils';
import Config,{API} from '../../Config';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';


const DEPLOYMENT_KEY = Config.evn?
    (Platform.OS == 'ios'?'IDtJSedIYhKeiWZJB2gj0orQNdk84ksvOXqog':"wru4nBV86XSP1CjxNvKOLWKyZQkI4ksvOXqog"):
    (Platform.OS == 'ios'?'lBYyuuQUxwczIxwdyMs0zLox0Pm34ksvOXqog':"ll79UcJjM74gQfGM3b3z1x1U2I2p4ksvOXqog");

class Update {
    checkNativeVersion() {
        return new Promise((resolve, reject) => {
            let params = {
                version_code: DeviceInfo.getVersion(),
                client_type: Platform.OS === 'android' ? 2 : 1,
                customer_type: 1
            };
            HttpUtils.request(API.CheckUpdate, params)
                .then((data) => {
                    if (data.update_level > 0) {
                        SplashScreen.hide();
                        Actions.confirmDialog({
                            title: '有新版本',
                            message: data.update_content,
                            buttons: data.update_level == 1 ? ["立即更新", "稍候更新"] : ["立即更新"],
                            onClick: (index) => {
                                console.log('update --- ' + index + " --- " + JSON.stringify(data));
                                if (index == 1 || data.update_level == 2) {
                                    if (Platform.OS == 'ios') {
                                        console.log('its ios');
                                        reject();
                                        Linking.openURL(data.update_url)
                                    } else if (Platform.OS == 'android') {
                                        console.log('its android');
                                        Actions.progressDialog({received: 0, total: 100});
                                        let path = RNFetchBlob.fs.dirs.DownloadDir + "/update.apk";
                                        RNFetchBlob
                                            .config({
                                                overwrite: true,
                                                path: path,
                                                fileCache: true,
                                                appendExt: 'apk'
                                            })
                                            .fetch('GET', data.update_url)
                                            .progress({count: 1}, (received, total) => {
                                                console.log(received + ' --- ' + total);
                                                Actions.progressDialog({received: received, total: total});
                                            })
                                            .then((res) => {
                                                console.log(res);
                                                console.log(res.path());
                                                reject();
                                                Actions.pop();
                                                RNFetchBlob.android.actionViewIntent(res.path(), 'application/vnd.android.package-archive');
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                this.syncLocalBundle();
                                                resolve();
                                            });
                                    }
                                }
                            }
                        });
                    } else {
                        console.log('原生部分无更新');
                        this.syncLocalBundle();
                        resolve();
                    }
                })
                .catch((err) => {
                    console.log('原生部分更新请求失败', err);
                    this.syncLocalBundle();
                    resolve();
                });


        });
    }

    syncLocalBundle() {
        console.log('syncLocalBundle');
        // return;
        // Alert.alert(DEPLOYMENT_KEY);
        CodePush.sync({
                deploymentKey: DEPLOYMENT_KEY,
                installMode: CodePush.InstallMode.IMMEDIATE,
            },
            (status) => {
                switch (status) {
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                        // Show "downloading" modal
                        Actions.progressDialog({received: 0, total: 100});
                        break;
                    case CodePush.SyncStatus.INSTALLING_UPDATE:
                        // Hide "downloading" modal
                        Actions.pop();
                        break;
                }
            },
            (progress) => {
                console.log('progress',progress.receivedBytes,progress.totalBytes);
                Actions.progressDialog({received: progress.receivedBytes, total: progress.totalBytes});
            }
        ).then((status)=>{
            console.log('sync then ',status);
        }).catch((err)=>{
            console.log('sync catch ',err);
        });
    }
}
export default new Update();