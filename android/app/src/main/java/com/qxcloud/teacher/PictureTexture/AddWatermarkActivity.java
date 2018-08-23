package com.qxcloud.teacher.PictureTexture;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.orhanobut.logger.Logger;
import com.qxcloud.teacher.R;
import com.qxcloud.teacher.StatusBarUtils;
import com.qxcloud.teacher.graffiti.GraffitiView;

import java.io.IOException;
import java.io.InputStream;
import java.util.Timer;
import java.util.TimerTask;

import cn.jarlen.photoedit.operate.ImageObject;
import cn.jarlen.photoedit.operate.OperateUtils;
import cn.jarlen.photoedit.operate.OperateView;
import cn.jarlen.photoedit.operate.TextObject;

/**
 * 添加水印
 *
 * @author jarlen
 */
public class AddWatermarkActivity extends Activity implements View.OnClickListener {

    private LinearLayout content_layout;
    private OperateView operateView;
    private String camera_path;
    private String mPath = null;
    OperateUtils operateUtils;
    private TextView btn_ok;
    private ImageView btn_cancel;
    private ImageView chunvzuo, shenhuifu, qiugouda, textTv;
    private Bitmap resizeBmp;
    private int saveW, saveH;
    private ProgressBar progressBar;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.addwatermark);
        StatusBarUtils.setStatusBar(this);
        resizeBmp = GraffitiView.getmGraffitiBitmap();//获取BitMap对象
        operateUtils = new OperateUtils(this);
        initView();
        // 延迟每次延迟1000 毫秒 隔1秒执行一次
        timer.schedule(task, 1000, 1000);
        Logger.e("++++++++++++++++++onCreate+++++++++++++++++++++");

    }

    @Override
    protected void onResume() {
        super.onResume();
        Logger.e("++++++++++++++++++onResume+++++++++++++++++++++");
    }

    final Handler myHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            if (msg.what == 1) {
                if (content_layout.getWidth() != 0) {
                    Log.i("LinearLayoutW", content_layout.getWidth() + "");
                    Log.i("LinearLayoutH", content_layout.getHeight() + "");
                    // 取消定时器
                    timer.cancel();
                    fillContent();
                }
            }
        }
    };

    Timer timer = new Timer();
    TimerTask task = new TimerTask() {
        public void run() {
            Message message = new Message();
            message.what = 1;
            myHandler.sendMessage(message);
        }
    };

    /**
     * 初始胡页面数据
     */
    private void initView() {
        content_layout = (LinearLayout) findViewById(R.id.mainLayout);
        progressBar = (ProgressBar) findViewById(R.id.progress);
        btn_ok = (TextView) findViewById(R.id.board_save);
        btn_cancel = (ImageView) findViewById(R.id.board_back);
        btn_ok.setOnClickListener(this);
        btn_cancel.setOnClickListener(this);

        chunvzuo = (ImageView) findViewById(R.id.seal_1);
        shenhuifu = (ImageView) findViewById(R.id.seal_2);
        qiugouda = (ImageView) findViewById(R.id.seal_3);
        textTv = (ImageView) findViewById(R.id.seal_4);
        chunvzuo.setOnClickListener(this);
        shenhuifu.setOnClickListener(this);
        qiugouda.setOnClickListener(this);
        textTv.setOnClickListener(this);
    }

    /**
     * 设置图片内容
     */
    private void fillContent() {
        Logger.e("++++++++++++fillContent+++++++++++++++++");
//        Bitmap resizeBmp = BitmapFactory.decodeFile(camera_path);
//        Bitmap bitmap =getImageFromAssetsFile("splash.png");

        int newW, newH;//计算新图片的宽高
        int contentW = content_layout.getWidth();//获取内容区的宽高
        int contentH = content_layout.getHeight();
        int bitW = resizeBmp.getWidth();//获取图片的宽和高
        int bitH = resizeBmp.getHeight();
        saveH = bitH;
        saveW = bitW;
        if (bitW > bitH) {
            //宽大于高
            newW = contentW;
            newH = contentW * bitH / bitW;
        } else {
            newH = contentH;
            newW = contentH * bitW / bitH;

        }

        //绘制图片
        operateView = new OperateView(AddWatermarkActivity.this, resizeBmp, newW, newH);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                newW, newH);
        Logger.e(resizeBmp.getWidth() + ":resizeBmp.getWidth()++++++++++++++++++++++resizeBmp.getHeight():" + resizeBmp.getHeight());
        Logger.e(content_layout.getWidth() + ":content_layout.getWidth()++++++++++++++++++++++content_layout.getHeight():" + content_layout.getHeight());
        operateView.setLayoutParams(layoutParams);
        content_layout.addView(operateView);
        operateView.setMultiAdd(true); // 设置此参数，可以添加多个图片
        progressBar.setVisibility(View.GONE);
    }

    private void btnSave() {
        try {
            operateView.save();
            Bitmap bmp = getBitmapByView(operateView);
            Logger.e(bmp.getWidth() + "++++++++++++++++getBitmapByView++2++++++++++++：" + bmp.getHeight());
            // 计算缩放比例
            float scaleWidth = ((float) saveW) / bmp.getWidth();
            float scaleHeight = ((float) saveH) / bmp.getHeight();
            // 取得想要缩放的matrix參數
            Matrix matrix = new Matrix();
            matrix.postScale(scaleWidth, scaleHeight);
            // 得到新的圖片
            Bitmap newbm = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), matrix, true);
            Logger.e(newbm.getWidth() + "++++++++++++++++getBitmapByView+++3+++++++++++：" + newbm.getHeight());
            GraffitiView.gotomGraffitiBitmap = newbm;
            setResult(0);
            finish();


//        if (bmp != null)
//        {
//            mPath = saveBitmap(bmp, "saveTemp");
//            Intent okData = new Intent();
//            okData.putExtra("camera_path", mPath);
//            setResult(RESULT_OK, okData);
//            this.finish();
//        }
        } catch (Exception e) {
            Logger.e("++++++++btnSave+++++++++" + e.toString());
        }
    }

    // 将模板View的图片转化为Bitmap
    public Bitmap getBitmapByView(View v) {
        Logger.e(saveW + "++++++++++++++++getBitmapByView++++1++++++++++：" + saveH);
        Bitmap bitmap = Bitmap.createBitmap(v.getWidth(), v.getHeight(),
                Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        v.draw(canvas);
        return bitmap;
    }

//    // 将生成的图片保存到内存中
//    public String saveBitmap(Bitmap bitmap, String name)
//    {
//        if (Environment.getExternalStorageState().equals(
//                Environment.MEDIA_MOUNTED))
//        {
//            File dir = new File(Constants.filePath);
//            if (!dir.exists())
//                dir.mkdir();
//            File file = new File(Constants.filePath + name + ".jpg");
//            FileOutputStream out;
//
//            try
//            {
//                out = new FileOutputStream(file);
//                if (bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out))
//                {
//                    out.flush();
//                    out.close();
//                }
//                return file.getAbsolutePath();
//            } catch (IOException e)
//            {
//                e.printStackTrace();
//            }
//        }
//
//        return null;
//    }

    /**
     * 添加贴图
     *
     * @param position
     */
    private void addpic(int position) {
        try {
            if (progressBar.getVisibility() == View.VISIBLE) {
                Toast.makeText(this, "图片加载中，请等待", Toast.LENGTH_SHORT).show();
                return;
            }
            Bitmap bmp = BitmapFactory.decodeResource(getResources(), position);
            // ImageObject imgObject = operateUtils.getImageObject(bmp);
            ImageObject imgObject = operateUtils.getImageObject(bmp, operateView,
                    5, 150, 100);
            operateView.addItem(imgObject);
        } catch (Exception e) {
            Logger.e("+++++++++addpic++++++++：" + e.toString());
        }
    }

    int watermark[] = {R.drawable.tab_pic_seal_1_big, R.drawable.tab_pic_seal_2_big,
            R.drawable.tab_pic_seal_3_big};

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.seal_1:
                addpic(watermark[0]);
                break;
            case R.id.seal_2:
                addpic(watermark[1]);
                break;
            case R.id.seal_3:
                addpic(watermark[2]);
                break;
            case R.id.seal_4:
                addText();
                break;
            case R.id.board_save:
                if (progressBar.getVisibility() == View.VISIBLE) {
                    Toast.makeText(this, "图片加载中，请等待", Toast.LENGTH_SHORT).show();
                    return;
                }
                btnSave();
                break;
            case R.id.board_back:
                backPage();
                break;
            default:
                break;
        }

    }

    /**
     * 根据图片获取BitMap
     *
     * @param fileName
     * @return
     */
    private Bitmap getImageFromAssetsFile(String fileName) {
        Bitmap bitMap = null;
        AssetManager am = getResources().getAssets();
        try {
            InputStream is = am.open(fileName);
            bitMap = BitmapFactory.decodeStream(is);
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return bitMap;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        operateView = null;
    }

    private void addText() {
        showEditDialog("", new EditCompleteListener() {
            @Override
            public void onCompleteListener(String text) {
                TextObject textObj = operateUtils.getTextObject(text,
                        operateView, 5, 150, 100);
                if (textObj != null) {
                    textObj.commit();
                    operateView.addItem(textObj);
                    operateView.setOnListener(new OperateView.MyListener() {
                        public void onClick(TextObject tObject) {
                            Logger.e("执行click");
                            alert(tObject);
                        }
                    });
                }
            }
        });
    }

    private void showEditDialog(String text, final EditCompleteListener editCompleteListener) {
        View view = this.getLayoutInflater().inflate(R.layout.edit_dialog, null);
        final EditText editText = (EditText) view.findViewById(R.id.text_edit);
        TextView cancelTv = (TextView) view.findViewById(R.id.cancel_tv);
        TextView sureTv = (TextView) view.findViewById(R.id.sure_tv);
        editText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int i, KeyEvent keyEvent) {
                return keyEvent != null && keyEvent.getKeyCode() == KeyEvent.KEYCODE_ENTER;
            }
        });
        if (!TextUtils.isEmpty(text)) {
            editText.setText(text);
            editText.setSelection(text.length());
        }

        final AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(view).create();


        sureTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
                String string = editText.getText().toString();
                if (TextUtils.isEmpty(string)) {
                    Toast.makeText(AddWatermarkActivity.this, "未添加文字", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (editCompleteListener != null) {
                    editCompleteListener.onCompleteListener(string);
                }
            }
        });
        cancelTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        });

        dialog.getWindow().setSoftInputMode(
                WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        dialog.show();
    }


    private void alert(final TextObject tObject) {
        showEditDialog(tObject.getText(), new EditCompleteListener() {
            @Override
            public void onCompleteListener(String text) {
                if (tObject.getText().equals(text)) {
                    return;
                }
                tObject.setText(text);
                tObject.commit();
            }
        });
    }

    @Override
    public void onBackPressed() {
        backPage();
    }

    private void backPage() {
        setResult(1);
        finish();
    }

    public interface EditCompleteListener {
        void onCompleteListener(String text);
    }
}
