package com.qxcloud.teacher;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.annotation.TargetApi;
import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.support.v4.view.ViewCompat;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/3/21
 * CREATED TIME:       上午10:44
 * CREATED DESCRIPTION:
 */

public class StatusBarUtils {
    /**
     * StatusBar.setBarStyle('dark-content', true);
     * if (Platform.OS === 'android') {
     * StatusBar.setTranslucent(true);
     * StatusBar.setBackgroundColor('transparent');
     * }
     *
     * @param activity
     * @param style
     */
    public static void setBarStyle(Activity activity, String style) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decorView = activity.getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                    style.equals("dark-content") ? View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR : 0);
        }
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public static void setTranslucent(final Activity activity, final boolean translucent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            View decorView = activity.getWindow().getDecorView();
            if (translucent) {
                decorView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                    @Override
                    public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                        WindowInsets defaultInsets = v.onApplyWindowInsets(insets);
                        return defaultInsets.replaceSystemWindowInsets(
                                defaultInsets.getSystemWindowInsetLeft(),
                                0,
                                defaultInsets.getSystemWindowInsetRight(),
                                defaultInsets.getSystemWindowInsetBottom());
                    }
                });
            } else {
                decorView.setOnApplyWindowInsetsListener(null);
            }

            ViewCompat.requestApplyInsets(decorView);
        }
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public static void setBackgroundColor(final Activity activity,final boolean animated,final int color) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {

            activity.getWindow()
                    .addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            if (animated) {
                int curColor = activity.getWindow().getStatusBarColor();
                ValueAnimator colorAnimation =
                        ValueAnimator.ofObject(new ArgbEvaluator(), curColor, color);

                colorAnimation.addUpdateListener(
                        new ValueAnimator.AnimatorUpdateListener() {
                            @Override
                            public void onAnimationUpdate(ValueAnimator animator) {
                                activity
                                        .getWindow()
                                        .setStatusBarColor((Integer) animator.getAnimatedValue());
                            }
                        });
                colorAnimation.setDuration(300).setStartDelay(0);
                colorAnimation.start();
            } else {
                activity.getWindow().setStatusBarColor(color);
            }
        }
    }

    public static void setStatusBar(Activity activity){
        setBarStyle(activity,"dark-content");
        setTranslucent(activity,true);
        setBackgroundColor(activity,true, Color.TRANSPARENT);
    }
}
