package com.qxcloud.teacher.view;

import android.graphics.drawable.Drawable;
import android.support.annotation.Nullable;
import android.text.Html;
import android.text.Spanned;
import android.view.ViewGroup;
import android.widget.TextView;

import com.facebook.fbui.textlayoutbuilder.TextLayoutBuilder;
import com.facebook.fbui.textlayoutbuilder.glyphwarmer.GlyphWarmerImpl;
import com.facebook.react.flat.DrawCommand;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.orhanobut.logger.Logger;

import java.io.InputStream;
import java.net.URL;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2018/2/12
 * CREATED TIME:       下午1:50
 * CREATED DESCRIPTION:
 */
public class RCTHtmlTextViewManager extends SimpleViewManager<TextView>{
    static final String REACT_CLASS = "RCTHtmlTextView";
    private ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);

    private static final TextLayoutBuilder sTextLayoutBuilder =
            new TextLayoutBuilder()
                    .setShouldCacheLayout(false)
                    .setShouldWarmText(true)
                    .setGlyphWarmer(new GlyphWarmerImpl());
    private @Nullable DrawCommand mDrawCommand;
    private TextView mTextView;
    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @Override
    protected TextView createViewInstance(ThemedReactContext reactContext) {
        TextView textView = new TextView(reactContext);
        textView.setLayoutParams(layoutParams);
        mTextView = textView;
        return textView;
    }

    @ReactProp(name = "html")
    public void setHtml(TextView view,String html){
        Spanned spanned = createSpan(html);
        view.setMaxLines(5);
//        int w = view.getLayout().getWidth();
//        int h = view.getLayout().getHeight();
//        Logger.e("mh --- "+w+" h --- "+h);
        view.setText(spanned);
    }

    private Spanned createSpan(String html) {
        return Html.fromHtml(html, new Html.ImageGetter() {
            @Override
            public Drawable getDrawable(String url) {
                InputStream is = null;
                try {
                    is = (InputStream) new URL(url).getContent();
                    Drawable d = Drawable.createFromStream(is, "src");
                    Logger.e("d --- " + (d == null));
                    d.setBounds(0, 0, d.getIntrinsicWidth(),
                            d.getIntrinsicHeight());
                    is.close();
                    return d;

                } catch (Exception e) {
                    return null;
                }
            }
        }, null);
    }
}
