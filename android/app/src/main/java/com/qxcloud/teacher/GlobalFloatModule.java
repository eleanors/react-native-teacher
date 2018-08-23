package com.qxcloud.teacher;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.orhanobut.logger.Logger;

import com.qxcloud.imageprocess.activity.newCamera.NewTackPhotoActivity;



/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/2/6
 * CREATED TIME:       上午9:32
 * CREATED DESCRIPTION:
 */

public class GlobalFloatModule extends ReactContextBaseJavaModule {


    public GlobalFloatModule(ReactApplicationContext reactContext) {
        super(reactContext);
        MainActivity.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "GlobalFloatModule";
    }

    @ReactMethod
    public void showFloat(ReadableMap params) {
        Logger.e("GlobalFloatUtils.getInstance().showFloat()");
        if (getCurrentActivity() instanceof MainActivity) {
            MainActivity activity = (MainActivity) getCurrentActivity();
            int num = params.getInt("num");
            String text = num >= 0 ? "已选\n" + num : "加载中";
            activity.showFloat(text);
        }
    }

    @ReactMethod
    public void dismissFloat() {
        Logger.e("GlobalFloatUtils.getInstance().dismissFloat()");
        if (getCurrentActivity() instanceof MainActivity) {
            MainActivity activity = (MainActivity) getCurrentActivity();
            activity.dismissFloat();
        }
    }

    @ReactMethod
    public void isFloatShowing(Callback callback) {
        if (getCurrentActivity() instanceof MainActivity) {
            MainActivity activity = (MainActivity) getCurrentActivity();
            callback.invoke(activity.isFloatShowing());
        }

    }



        /**
         * 同原生交互数据方法和接口
         *
         * @param map     请求参数
         * @param promise 回调函数
         */
        @ReactMethod
        public void NativeMethod(ReadableMap map, Promise promise) {
            //调用Test类中的原生方法。
            Log.e("CFH", "获取的数据为：" + map.getInt("TYPE"));
            if (map.getInt("TYPE") == 1) {
    //            MyNativeModule.promise=promise;
                Intent intent = new Intent(getCurrentActivity(), NewTackPhotoActivity.class);
                getCurrentActivity().startActivityForResult(intent,10000);
            }
        }



}
