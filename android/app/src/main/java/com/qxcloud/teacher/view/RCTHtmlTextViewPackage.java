package com.qxcloud.teacher.view;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/2/12
 * CREATED TIME:       下午2:18
 * CREATED DESCRIPTION:
 */

public class RCTHtmlTextViewPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new RCTHtmlTextViewManager());
    }
}
