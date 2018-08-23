package com.qxcloud.teacher;

import android.content.Context;
import android.util.DisplayMetrics;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/2/7
 * CREATED TIME:       下午3:05
 * CREATED DESCRIPTION:
 */

public class DisplayUtils {
    public static int dp2px(Context mContext,float dp){
        DisplayMetrics displayMetrics = mContext.getResources().getDisplayMetrics();
        float scale = displayMetrics.density;
        return (int) (dp * scale + 0.5f);
    }
    public static int[] getScreen(Context mContext){
        DisplayMetrics displayMetrics = mContext.getResources().getDisplayMetrics();
        return new int[]{displayMetrics.widthPixels,displayMetrics.heightPixels};
    }
}
