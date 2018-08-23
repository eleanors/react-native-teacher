package com.qxcloud.teacher;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.getui.reactnativegetui.GetuiModule;
import com.orhanobut.logger.Logger;
import com.umeng.analytics.MobclickAgent;
import android.text.TextUtils;


import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    private RelativeLayout floatView;
    private TextView numTv;
    private static Activity activity;
    public static ReactContext reactContext;

    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 0:
                    String numText = (String) msg.obj;
                    if (floatView != null && numTv != null) {
                        floatView.setVisibility(View.VISIBLE);
                        numTv.setText(numText);
                    }
                    break;
                case 1:
                    if (floatView != null) {
                        floatView.setVisibility(View.GONE);
                    }
                    break;
            }
        }
    };

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "QXTeacher";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Logger.e("onCreate -- show SplashScreen");
        SplashScreen.show(this,true);
        activity=this;
        super.onCreate(savedInstanceState);
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);
        GetuiModule.initPush(this);

        FrameLayout rootView = findViewById(android.R.id.content);

        int size = DisplayUtils.dp2px(this, 60F);
        floatView = (RelativeLayout) getLayoutInflater().inflate(R.layout.layout_float_button, null);
        floatView.setVisibility(View.GONE);
        numTv = floatView.findViewById(R.id.num_text);

        floatView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
                if (reactContext != null) {
                    reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("clickFloatButton", null);
                }
            }
        });
        FrameLayout.LayoutParams floatLayoutParams = new FrameLayout.LayoutParams(size, size);
        int[] screen = DisplayUtils.getScreen(this);
        int rightMargin = DisplayUtils.dp2px(this, 15F);
        int bottomMargin = DisplayUtils.dp2px(this, 80F);
        floatLayoutParams.setMargins(screen[0] - size - rightMargin, screen[1] - size - bottomMargin, rightMargin, bottomMargin);

        rootView.addView(floatView, floatLayoutParams);
    }

    public void showFloat(String numText) {
        Message msg = new Message();
        msg.what = 0;
        msg.obj = numText;
        handler.sendMessage(msg);
    }

    public void dismissFloat() {
        handler.sendEmptyMessage(1);
    }

    public boolean isFloatShowing() {
        return floatView != null && floatView.getVisibility() == View.VISIBLE;
    }

    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Logger.e("onDestroy");
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==10000){
            String path = data.getStringExtra("PATH");
            Logger.e("PATH********************************："+path);
            senMessage(path);
        }
    }


    /*
     * 原生模块可以在没有被调用的情况下往JavaScript发送事件通知。
     * 最简单的办法就是通过RCTDeviceEventEmitter，
     * 这可以通过ReactContext来获得对应的引用，像这样：
     * sendEvent(reactContext, "EventName", event);
     * */
    private static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap paramss) {
        System.out.println("reactContext=" + reactContext);
        if (null == reactContext) {
            Toast.makeText(activity, "reactContext is null", Toast.LENGTH_SHORT).show();
        } else {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, paramss);
        }
    }

    public static void senMessage(String path) {
            WritableMap event = Arguments.createMap();
            if(TextUtils.isEmpty(path)){
                event.putString("PATH", "");
            }else{
                event.putString("PATH", "file://"+path);
            }
            sendEvent(reactContext, "EventMessage", event);
        }
}
