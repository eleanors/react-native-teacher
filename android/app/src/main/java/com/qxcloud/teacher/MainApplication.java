package com.qxcloud.teacher;

import android.support.multidex.MultiDexApplication;
import android.util.Log;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.beefe.picker.PickerViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.facebook.react.ReactApplication;
import com.iou90.autoheightwebview.AutoHeightWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.getui.reactnativegetui.GetuiPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.qxcloud.teacher.view.RCTHtmlTextViewPackage;
import com.reactlibrary.RNSyanImagePickerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.theweflex.react.WeChatPackage;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.soexample.invokenative.DplusReactPackage;
import com.umeng.soexample.invokenative.RNUMConfigure;
import com.zmxv.RNSound.RNSoundPackage;
import com.test.aai.aaiPackage;
import com.wog.videoplayer.VideoPlayerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import me.vanpan.rctqqsdk.QQSDKPackage;


public class MainApplication extends MultiDexApplication implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new AutoHeightWebViewPackage(),
            new PhotoViewPackage(),
                    new RNSoundPackage(),
                    new ReactNativeAudioPackage(),
                    new OrientationPackage(),
                    new VectorIconsPackage(),
                    new KCKeepAwakePackage(),
                    new ReactVideoPackage(),
                    new RNSyanImagePickerPackage(),
                    new PickerViewPackage(),
                    new RNDeviceInfo(),
                    new LinearGradientPackage(),
                    new RNFetchBlobPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG, "http://47.96.158.247:3000"),
                    new QQSDKPackage(),
                    new WeChatPackage(),
                    new GetuiPackage(),
                    new SplashScreenReactPackage(),
                    new DplusReactPackage(),
                    new AutoHeightWebViewPackage(),
                    new BoardPackage(),
                    new GlobalFloatPackage(),
                    new aaiPackage(),
                    new RCTHtmlTextViewPackage(),
                    new VideoPlayerPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Log.e("APPLICATION", "init 友盟相关");
        RNUMConfigure.init(this, "59c9cae4734be44a55000271", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
                "");
    }
}
