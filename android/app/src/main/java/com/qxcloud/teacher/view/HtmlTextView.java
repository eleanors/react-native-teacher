package com.qxcloud.teacher.view;

import android.content.Context;
import android.util.AttributeSet;

import com.orhanobut.logger.Logger;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/2/23
 * CREATED TIME:       上午9:40
 * CREATED DESCRIPTION:
 */

public class HtmlTextView extends android.support.v7.widget.AppCompatTextView  {

    public HtmlTextView(Context context) {
        super(context);
    }

    public HtmlTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public HtmlTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        Logger.e("widthMeasureSpec = "+widthMeasureSpec+" heightMeasureSpec = "+heightMeasureSpec);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
}
