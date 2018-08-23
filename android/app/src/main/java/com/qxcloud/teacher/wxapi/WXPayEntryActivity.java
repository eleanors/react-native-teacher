package com.qxcloud.teacher.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.theweflex.react.WeChatModule;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2017/12/13
 * CREATED TIME:       下午1:43
 * CREATED DESCRIPTION:
 */

public class WXPayEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}
