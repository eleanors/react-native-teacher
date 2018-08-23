/**
 * Created by heaton on 2017/12/6.
 */
'use strict';
import React from 'react';
import Config, {API, errCode} from '../Config';
import {Overlay} from 'teaset';
import Loading from '../page/common/Loading';
import {Actions} from "react-native-router-flux";
import Toast from "./Toast";
const TIME_OUT_MILLS = 15 * 1000;

/**
 * 网络请求公用类
 */
class HttpUtils {
    // 构造
    constructor() {
        console.log('init HttpUtils');
    }

    /**
     * 所有请求调用此方法
     * @param api Config 中 API 配置中枚举类型
     * @param params ...Object
     *               GET request(API.Login,{a:'a'}) result:http://aaa.com/test?a=a
     *               POST request(API.Login,{a:'a'},{b:'b'}) result:http://aaa.com/test?a=a body:b=b
     *               POST request(API.Login,{a:'a'}) result:http://aaa.com/test body:a=a
     * @returns Promise
     *
     * EXAMPLE import HttpUtils from './utils/HttpUtils'; HttpUtils.request(API.Login,{}).then().catch();
     */
    request(api, ...params) {
        // Actions.loading();
        let key;
        if (!api.hideLoading) {
            key = this._showLoading();
        }
        return new Promise((resolve, reject) => {
            if (api) {
                if (api.isLogin) {
                    if (params.length > 0) {
                        params[0].access_token = global.access_token;
                    } else {
                        params[0] = {access_token: global.access_token};
                    }
                }
                switch (api.method) {
                    case 'GET':
                        return this._get(api.url, params[0])
                            .then((data) => {
                                // Actions.pop();
                                if (!api.hideLoading) {
                                    this._hideLoading(key);
                                }
                                resolve(data);
                            })
                            .catch((err) => {
                                // Actions.pop();
                                if (!api.hideLoading) {
                                    this._hideLoading(key);
                                }
                                reject(err);
                            });
                    case 'POST':
                        return this._post(api.url, params[1] ? params[0] : {}, params[1] ? params[1] : params[0])
                            .then((data) => {
                                // Actions.pop();
                                if (!api.hideLoading) {
                                    this._hideLoading(key);
                                }
                                resolve(data);
                            })
                            .catch((err) => {
                                // Actions.pop();
                                if (!api.hideLoading) {
                                    this._hideLoading(key);
                                }
                                reject(err);
                            });
                }
            } else {
                console.log('api 初始化失败，请检查name');
                reject('接口不存在');
            }
        });
    }

    /**
     * 请求基类方法
     * @param url
     * @param initParams
     * @returns {Promise}
     */
    _fetchData(url, initParams) {
        console.log('fetchData --- requestUrl    +++ ', url);
        console.log('fetchData --- requestParams +++ ', initParams);
        return new Promise((resolve, reject) => {
            fetch(url, initParams)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw {type: 1, data: res};
                    }
                })
                .then((json) => {
                    console.log('fetchData --- responseJSON  +++ ', json);
                    if (json && json['err_code'] === 0) {
                        resolve(json.data);
                    } else {
                        throw {type: 2, data: json};
                    }
                })
                .catch((err) => {
                    switch (err.type) {
                        case 1:
                            let bizError = this._handleHttpError(err.data);
                            reject(bizError);
                            break;
                        case 2:
                            let httpError = this._handleBizError(err.data);
                            reject(httpError);
                            break;
                        default:
                            let unknownError = this._handleUnknownError(err);
                            reject(unknownError);
                            break;
                    }
                });
        });
    }

    /**
     * GET 请求封装
     * @param url API CONFIG 中配置的请求路径
     * @param params get 请求的参数
     * @returns Promise 对象
     */
    _get(url, params) {
        console.log(params);
        url = this._initUrl(url, params);
        let initParams = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            timeout: TIME_OUT_MILLS,
        };
        return this._fetchData(url, initParams);
    }

    /**
     * POST 请求封装
     * @param url API CONFIG 中配置的请求路径
     * @param searchParams 需拼装至 url 中的参数
     * @param postParams post body 参数 支持文件
     * @returns Promise 对象
     */
    _post(url, searchParams, postParams) {
        url = this._initUrl(url, searchParams, true);
        let formData = new FormData();
        Object.keys(postParams).forEach((key) => {
            formData.append(key, postParams[key]);
        });

        let headers;
        if (postParams.upload) {
            headers = {
                'Content-Type': 'multipart/form-data',
            };
        } else {
            headers = {
                'Accept': 'application/json',
            };
        }
        let initParams = {
            method: 'POST',
            headers: headers,
            body: formData,
            timeout: TIME_OUT_MILLS,
        };
        return this._fetchData(url, initParams);
    }

    /**
     * 组装url
     * @param url
     * @param params
     * @returns {*}
     */
    _initUrl(url, params, isPost) {
        console.log('url：',url);
        if (url.indexOf('qinxue100.com') <= 0) {
            if (Config.evn) {
                url = Config.Host + url;
            } else {
                url = Config.TestHost + url;
            }
        }
        if (isPost) {
            return url;
        }
        let paramsStr = '';
        Object.keys(params).forEach((key) => {
            paramsStr += key + '=' + params[key] + '&';
        });

        if (url.search(/\?/) === -1) {
            url += '?' + paramsStr;
        } else {
            url += '&' + paramsStr;
        }
        return url;
    }

    /**
     * 处理网络问题异常
     * example 400 404 500
     * @param res
     */
    _handleHttpError(res) {
        console.log('fetchData --- handleHttpError +++ ', res.status);
        return '网络请求错误:' + res.status;
    }

    /**
     * 处理业务异常
     * @param jsonData
     */
    _handleBizError(jsonData) {
        console.log('fetchData --- handleBizError +++ ', jsonData);
        /**
         * TODO + 弹出错误提示
         */
        if (jsonData.err_code == 3002 || jsonData.err_code == 3003 || jsonData.err_code == 3003) {
            Actions.reset('sign');
        }
        if (jsonData.err_code && errCode[jsonData.err_code] && errCode[jsonData.err_code].msg) {
            console.log('本地错误信息：', errCode[jsonData.err_code].msg);
            Toast.error(errCode[jsonData.err_code].msg);
        } else if (jsonData.err_msg) {
            Toast.error(jsonData.err_msg);
        }
        return '服务器返回异常信息：' + jsonData.err_msg;
    }

    /**
     * 处理未知异常
     * @param err
     */
    _handleUnknownError(err) {
        Toast.error('服务器请求错误，请检查网络');
        console.log('fetchData --- handleUnknownError +++ ', err);
        return '请求异常了：' + err;
    }

    _showLoading() {
        let overlayView = (
            <Overlay.View
                style={{alignItems: 'center', justifyContent: 'center'}}
                modal={true}
                overlayOpacity={0}>
                <Loading/>
            </Overlay.View>
        );
        return Overlay.show(overlayView);
    }

    _hideLoading(key) {
        Overlay.hide(key);
    }
}
const Instance = new HttpUtils();
export default Instance;