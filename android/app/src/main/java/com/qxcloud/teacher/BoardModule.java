package com.qxcloud.teacher;

import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;

import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.orhanobut.logger.Logger;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/2/1
 * CREATED TIME:       上午10:29
 * CREATED DESCRIPTION:
 */

public class BoardModule extends ReactContextBaseJavaModule {

    private static final int ACTION_BOARD_ACTIVITY = 101;
    private static final String REJECT_ERR_CODE_UNKNOWN = "4001";
    private static final String REJECT_ERR_CODE_NO_OPEN = "4002";
    private static final String REJECT_ERR_CODE_CANCEL = "4003";
    private static final String REJECT_ERR_CODE_NO_DATA = "4004";


    private Promise mBoardPromise;

    private BaseActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == ACTION_BOARD_ACTIVITY) {
                if (mBoardPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mBoardPromise.reject(REJECT_ERR_CODE_CANCEL, "用户取消");
                    } else if (resultCode == Activity.RESULT_OK) {
                        String uriStr = data.getStringExtra(BoardActivity.EXTRA_SAVED_PATH);
                        if (TextUtils.isEmpty(uriStr)) {
                            mBoardPromise.reject(REJECT_ERR_CODE_NO_DATA, "图片路径为空");
                        } else {
                            Logger.e("path === " + uriStr);
                            mBoardPromise.resolve(uriStr);
                        }
                    }
                    mBoardPromise = null;
                }
            }
        }
    };

    public BoardModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @ReactMethod
    public void openBoard(ReadableMap map, Promise promise) {
        try {
            PhotoEditEntity entity = new PhotoEditEntity();
            entity.setStudentImgPath(map.getString("studentImagePath"));
            entity.setTeacherImgPath(map.getString("teacherImagePath"));
            entity.setUploadUrl(map.getString("uploadUrl"));

            this.mBoardPromise = promise;
            Activity activity = this.getCurrentActivity();
            if (activity != null) {
                Intent intent = new Intent(activity, BoardActivity.class);
                intent.putExtra("PhotoEditEntity", entity);
                activity.startActivityForResult(intent, ACTION_BOARD_ACTIVITY);
            } else {
                promise.reject(REJECT_ERR_CODE_NO_OPEN, "找不到指定的activity");
            }
        } catch (Exception e) {
            promise.reject(REJECT_ERR_CODE_UNKNOWN, "打开批改页面错误" + e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "BoardModule";
    }
}
