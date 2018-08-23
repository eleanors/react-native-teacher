package com.qxcloud.teacher;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.MainThread;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.luck.picture.lib.tools.LightStatusBarUtils;
import com.orhanobut.logger.Logger;
import com.qxcloud.teacher.PictureTexture.AddWatermarkActivity;
import com.qxcloud.teacher.graffiti.GraffitiListener;
import com.qxcloud.teacher.graffiti.GraffitiView;
import com.qxcloud.teacher.graffiti.utils.MyBitmapFactory;

import net.minidev.json.JSONObject;
import net.minidev.json.JSONValue;

import java.io.File;
import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class BoardActivity extends Activity {

    private final static int DEFAULT_PAINT_SIZE = 4;
    private final static int DEFAULT_EARSER_SIZE = 20;

    public static final String EXTRA_SAVED_PATH = "extra_saved_path";

    private Activity activity = this;
    private PhotoEditEntity photoEditEntity;
    private View.OnClickListener mOnClickListener;

    private ImageView boardBack;
    private ImageView errorPic;
    private TextView boardSave;
    private FrameLayout boardContainer;
    private ImageView boardClear;
    private ImageView boardUndo;
    private ImageView boardEarser;
    private ImageView boardPen;
    private ImageView boardMove;
    private ImageView boardRotate;
    private ProgressBar progressBar;

    private Bitmap mBitmap;
    private GraffitiView mGraffitiView;
    private int mTouchMode;
    private boolean mIsMovingPic = false;
    private boolean isForbiddenOperation = false;//是否禁止操作图层

    // 手势操作相关
    private float mOldScale, mOldDist, mNewDist, mToucheCentreXOnGraffiti,
            mToucheCentreYOnGraffiti, mTouchCentreX, mTouchCentreY;// 双指距离

    private float mTouchLastX, mTouchLastY;

    private float mScale = 1;
    private final float mMaxScale = 3.5f; // 最大缩放倍数
    private final float mMinScale = 0.25f; // 最小缩放倍数
    private int mTouchSlop;

    private int imgState = 1;
    private int REQUEST_CODE = 9998;
    private String saveFilePath;

    private OkHttpClient mOkHttpClient;

    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    Bitmap bitmap = (Bitmap) msg.obj;
                    resetBitmap(bitmap);
                    break;
                case 2:
                    String str = (String) msg.obj;
                    progressBar.setVisibility(View.GONE);
                    errorPic.setVisibility(View.VISIBLE);
                    toastMessage(str);
                    break;
                case 11:
                    boardSave.setEnabled(false);
                    break;
                case 12:
                    boardSave.setEnabled(true);
                    break;
            }
        }
    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mOkHttpClient = new OkHttpClient();
//        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_board);
        LightStatusBarUtils.setLightStatusBar(this,true);
        StatusBarUtils.setStatusBar(this);
        progressBar = (ProgressBar) findViewById(R.id.progress);
        photoEditEntity = (PhotoEditEntity) getIntent().getSerializableExtra("PhotoEditEntity");
        if (photoEditEntity == null) {
            Logger.e("photoEditEntity is null!");
            activity.finish();
            return;
        }

        mOnClickListener = new GraffitiOnClickListener();
        boardBack = (ImageView) findViewById(R.id.board_back);
        errorPic = (ImageView) findViewById(R.id.error_pic);
        boardBack.setOnClickListener(mOnClickListener);
        initData();
    }

    /**
     * 重绘图片
     * imgState  1：老师批改、2：学生原图
     */
    private void initData() {
        progressBar.setVisibility(View.VISIBLE);
        errorPic.setVisibility(View.GONE);
        Logger.e("+++++++++initData++++++++++++++++imgState：" + imgState);
        String url = photoEditEntity.getShowImgUrl(imgState);
        if (TextUtils.isEmpty(url)) {
            if (imgState == 1) {
                imgState = 2;
                Logger.e("+++++++++initData+++++++为空+++++++++imgState：" + imgState);
                url = photoEditEntity.getShowImgUrl(imgState);
            }
        }
        downloadImg(url, new ShowImgListener() {
            @Override
            public void onFailed(String msg) {

                Message message = new Message();
                message.what = 2;
                message.obj = msg;
                handler.sendMessage(message);
            }

            @Override
            public void onSuccess(Bitmap bitmap) {
                Message message = new Message();
                message.what = 1;
                message.obj = bitmap;
                handler.sendMessage(message);
            }
        });
    }

    @MainThread
    private void resetBitmap(Bitmap bitmap) {
        progressBar.setVisibility(View.GONE);
        mBitmap = bitmap;
        initView();
        if (mBitmap == null) {
            Logger.e("TAG", "bitmap is null!");
            activity.finish();
            return;
        } else {
            //下图两个if顺序不能变  注意++警告
            if (imgState == 2) {
                //数据重置，点击删除不在进行重绘
                imgState = -1;
            } else if (imgState == 1) {
                imgState = 2;
            }
        }
    }


    private void initView() {
        boardContainer = (FrameLayout) findViewById(R.id.board_container);

        boardSave = (TextView) findViewById(R.id.board_save);
        boardClear = (ImageView) findViewById(R.id.board_clear);
        boardUndo = (ImageView) findViewById(R.id.board_undo);
        boardEarser = (ImageView) findViewById(R.id.board_earser);
        boardPen = (ImageView) findViewById(R.id.board_pen);
        boardMove = (ImageView) findViewById(R.id.board_move);
        boardRotate = (ImageView) findViewById(R.id.board_rotate);

        boardBack.setOnClickListener(mOnClickListener);
        boardSave.setOnClickListener(mOnClickListener);
        boardClear.setOnClickListener(mOnClickListener);
        boardUndo.setOnClickListener(mOnClickListener);
        boardEarser.setOnClickListener(mOnClickListener);
        boardPen.setOnClickListener(mOnClickListener);
        boardMove.setOnClickListener(mOnClickListener);
        boardRotate.setOnClickListener(mOnClickListener);

        // /storage/emulated/0/DCIM/Graffiti/1479369280029.jpg
        mGraffitiView = new GraffitiView(this, mBitmap, null, true,
                new GraffitiListener() {
                    @Override
                    public void onSaved(Bitmap bitmap, Bitmap bitmapEraser) { // 保存图片
                        if (mGraffitiView != null && !mGraffitiView.isModified()) {
                            new AlertDialog.Builder(BoardActivity.this)
                                    .setTitle("提示")
                                    .setMessage("请批改后保存")
                                    .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialogInterface, int i) {
                                        }
                                    }).show();
                            return;
                        }
                        handler.sendEmptyMessage(11);
                        progressBar.setVisibility(View.VISIBLE);
                        Logger.e("onSaved");
                        mGraffitiView.setPaintSize(DEFAULT_PAINT_SIZE);
                        if (bitmapEraser != null) {
                            bitmapEraser.recycle(); // 回收图片，不再涂鸦，避免内存溢出
                        }
                        saveBitmap(bitmap);
                    }

                    @Override
                    public void onError(int i, String msg) {
                        toastMessage(msg);
                    }

                    @Override
                    public void onReady() {
                        mGraffitiView.setPaintSize(DEFAULT_PAINT_SIZE);
                        boardPen.performClick();
                    }

                    @Override
                    public void onSelectedText(boolean selected) {
                    }

                    @Override
                    public void onEditText(boolean showDialog, String string) {

                    }
                });
        mGraffitiView.setIsDrawableOutside(false);
        boardContainer.removeAllViews();
        boardContainer.addView(mGraffitiView, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        mGraffitiView.setPaintSize(DEFAULT_PAINT_SIZE);
        mTouchSlop = ViewConfiguration.get(getApplicationContext()).getScaledTouchSlop();

//        ScaleOnTouchListener onTouchListener = new ScaleOnTouchListener();

        // 添加涂鸦的触摸监听器，移动图片位置
        mGraffitiView.setOnTouchListener(new View.OnTouchListener() {

            boolean mIsBusy = false; // 避免双指滑动，手指抬起时处理单指事件。

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (isForbiddenOperation) {
                    return true;
                }
                if (!mIsMovingPic) {
                    return false;  // 交给下一层的涂鸦处理
                }
                mScale = mGraffitiView.getScale();
                switch (event.getAction() & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_DOWN:
                        mTouchMode = 1;
                        mTouchLastX = event.getX();
                        mTouchLastY = event.getY();
                        return true;
                    case MotionEvent.ACTION_UP:
                    case MotionEvent.ACTION_CANCEL:
                        mTouchMode = 0;
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        if (mTouchMode < 2) { // 单点滑动
                            if (mIsBusy) { // 从多点触摸变为单点触摸，忽略该次事件，避免从双指缩放变为单指移动时图片瞬间移动
                                mIsBusy = false;
                                mTouchLastX = event.getX();
                                mTouchLastY = event.getY();
                                return true;
                            }
                            float tranX = event.getX() - mTouchLastX;
                            float tranY = event.getY() - mTouchLastY;
                            mGraffitiView.setTrans(mGraffitiView.getTransX() + tranX, mGraffitiView.getTransY() + tranY);
                            mTouchLastX = event.getX();
                            mTouchLastY = event.getY();
                        } else { // 多点
                            mNewDist = spacing(event);// 两点滑动时的距离
                            if (Math.abs(mNewDist - mOldDist) >= mTouchSlop) {
                                float scale = mNewDist / mOldDist;
                                mScale = mOldScale * scale;

                                if (mScale > mMaxScale) {
                                    mScale = mMaxScale;
                                }
                                if (mScale < mMinScale) { // 最小倍数
                                    mScale = mMinScale;
                                }
                                // 围绕坐标(0,0)缩放图片
                                mGraffitiView.setScale(mScale);
                                // 缩放后，偏移图片，以产生围绕某个点缩放的效果
                                float transX = mGraffitiView.toTransX(mTouchCentreX, mToucheCentreXOnGraffiti);
                                float transY = mGraffitiView.toTransY(mTouchCentreY, mToucheCentreYOnGraffiti);
                                mGraffitiView.setTrans(transX, transY);
                            }
                        }
                        return true;
                    case MotionEvent.ACTION_POINTER_UP:
                        mTouchMode -= 1;
                        return true;
                    case MotionEvent.ACTION_POINTER_DOWN:
                        mTouchMode += 1;
                        mOldScale = mGraffitiView.getScale();
                        mOldDist = spacing(event);// 两点按下时的距离
                        mTouchCentreX = (event.getX(0) + event.getX(1)) / 2;// 不用减trans
                        mTouchCentreY = (event.getY(0) + event.getY(1)) / 2;
                        mToucheCentreXOnGraffiti = mGraffitiView.toX(mTouchCentreX);
                        mToucheCentreYOnGraffiti = mGraffitiView.toY(mTouchCentreY);
                        mIsBusy = true; // 标志位多点触摸
                        return true;
                }
                return true;
            }
        });

    }


    private void saveBitmap(final Bitmap bitmap){
        new Thread(){
            @Override
            public void run() {
                File graffitiFile = new File(Environment.getExternalStorageDirectory(), "QXCloud/Graffiti");
                if (!graffitiFile.exists()) {
                    graffitiFile.mkdirs();
                }
                File file = new File(graffitiFile, System.currentTimeMillis() + ".jpg");
                try {
                    MyBitmapFactory.saveBitmap(bitmap, file.getAbsolutePath());
                    Logger.e("save complete size = " + file.length() / 1024 + "KB path = " + file.getAbsolutePath());

                    /**
                     * 本地保存成功，调用js方法上传
                     */
                    uploadImage(file);
                } catch (Exception e) {
                    e.printStackTrace();
                    toastMessage("保存文件失败");
                }
            }
        }.start();
    }

    /**
     * 计算两指间的距离
     *
     * @param event
     * @return
     */

    private float spacing(MotionEvent event) {
        float x = event.getX(0) - event.getX(1);
        float y = event.getY(0) - event.getY(1);
        return (float) Math.sqrt(x * x + y * y);
    }

    private class GraffitiOnClickListener implements View.OnClickListener {

        private View mLastPenView, mLastShapeView;
        private boolean mDone = false;

        @Override
        public void onClick(View v) {

            if (v.getId() == R.id.board_back) {
                Logger.e("board_back");
                backCheck();
                return;
            }

            if (v.getId() == R.id.board_rotate) {
                Logger.e("board_rotate");
                mGraffitiView.rotate(mGraffitiView.getRotateDegree() + 90);
                mGraffitiView.setPaintSize(DEFAULT_PAINT_SIZE);
                return;
            }
            v.setSelected(false);
            mIsMovingPic = false;
            isForbiddenOperation = false;
            mDone = false;
            if (v.getId() == R.id.board_pen) {
                boardPen.setImageResource(R.drawable.board_pen_checked);
                boardEarser.setImageResource(R.drawable.board_earser_normal);
                boardMove.setImageResource(R.drawable.board_move_normal);
                mGraffitiView.setPaintSize(DEFAULT_PAINT_SIZE);
                mGraffitiView.setPen(GraffitiView.Pen.HAND);
                mDone = true;
            } else if (v.getId() == R.id.board_earser) {
                boardPen.setImageResource(R.drawable.board_pen_normal);
                boardEarser.setImageResource(R.drawable.board_earser_checked);
                boardMove.setImageResource(R.drawable.board_move_normal);
                Logger.e("橡皮擦？？？？");
                Intent intent = new Intent(BoardActivity.this, AddWatermarkActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivityForResult(intent, REQUEST_CODE);
                mGraffitiView.tackBitMap();
                mDone = true;
                isForbiddenOperation = true;
            }
            if (mDone) {
                if (mLastPenView != null) {
                    mLastPenView.setSelected(false);
                }
                v.setSelected(true);
                mLastPenView = v;
                return;
            }

            if (v.getId() == R.id.board_clear) {
                Logger.e("清除：" + imgState);
                if (mGraffitiView.isModified_two()) {
                    Logger.e("isModified = " + true);
                    toastMessage("清除本次笔迹");
                    mGraffitiView.clear();
                    imgState = 1;
                } else {
                    if (imgState == -1) {
                        toastMessage("当前已显示为学生原图");//有笔记将状态重置为1
                    } else if (imgState == 1) {
                        toastMessage("老师上次批改");
                    } else {
                        toastMessage("学生原图");
                    }
                    if (imgState > -1) {
                        initData();
                    }
                }


                mDone = true;
            } else if (v.getId() == R.id.board_undo) {
                Logger.e("撤销");
                mGraffitiView.undo();
                mDone = true;
            }
            if (mDone) {
                return;
            }

            if (v.getId() == R.id.board_save) {
                Logger.e("save");
                mGraffitiView.save();
                mDone = true;
            } else if (v.getId() == R.id.board_move) {
                Logger.e("move");
                boardPen.setImageResource(R.drawable.board_pen_normal);
                boardEarser.setImageResource(R.drawable.board_earser_normal);
                boardMove.setImageResource(R.drawable.board_move_checked);

                v.setSelected(true);
                mIsMovingPic = v.isSelected();
                if (mIsMovingPic) {
                    Toast.makeText(getApplicationContext(), "单指拖动，双指缩放", Toast.LENGTH_SHORT).show();
                }
                mDone = true;
            }
            if (mDone) {
                return;
            }

            if (mLastShapeView != null) {
                mLastShapeView.setSelected(false);
            }
            v.setSelected(true);
            mLastShapeView = v;
        }
    }

    @Override
    public void onBackPressed() {
        backCheck();
    }

    private void backCheck() {
        if (mGraffitiView != null && mGraffitiView.isModified()) {
            new AlertDialog.Builder(this)
                    .setTitle("提示")
                    .setMessage("有修改的内容未保存，是否退出")
                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {

                        }
                    })
                    .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            activity.finish();
                        }
                    }).show();
        } else {
            activity.finish();
        }
    }

    private void downloadImg(String url, final ShowImgListener listener) {
        Logger.e("url = " + url);
        ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(Uri.parse(url)).setProgressiveRenderingEnabled(true).build();
        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
        dataSource.subscribe(new BaseBitmapDataSubscriber() {
            @Override
            public void onNewResultImpl(@Nullable Bitmap bitmap) {
                //bitmap即为下载所得图片
                try {
                    Bitmap bmp = bitmap.copy(Bitmap.Config.RGB_565, true);
                    listener.onSuccess(bmp);
                } catch (Exception e) {
                    e.printStackTrace();
                    Logger.e("error = " + e.getMessage());
                    listener.onFailed("图片加载异常");
                }
            }

            @Override
            public void onFailureImpl(DataSource dataSource) {
                Logger.e("error = " + dataSource.getFailureCause());
                listener.onFailed("图片加载异常");
            }
        }, CallerThreadExecutor.getInstance());
    }

    public static interface ShowImgListener {
        void onFailed(String msg);

        void onSuccess(Bitmap bitmap);
    }

    private void toastMessage(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Logger.e("requestCode:" + requestCode);
        Logger.e("resultCode:" + resultCode);
        if (requestCode == REQUEST_CODE && resultCode == 0) {
            mGraffitiView.resetCanvasSticker();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        GraffitiView.mGraffitiBitmap = null;
        GraffitiView.gotomGraffitiBitmap = null;
        GraffitiView.saveGraffitiBitmap = null;
    }

    public void uploadImage(final File uploadFile) {
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", "HeadPortrait.jpg",
                        RequestBody.create(MediaType.parse("image/jpeg"), uploadFile));
        RequestBody requestBody = builder.build();
        Request request = new Request.Builder()
                .url(photoEditEntity.getUploadUrl())
                .post(requestBody)
                .build();
        Call call = mOkHttpClient.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Logger.e("onFailure: " + e);
                uploadFile.delete();
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        handler.sendEmptyMessage(12);
                        progressBar.setVisibility(View.GONE);
                        Toast.makeText(BoardActivity.this, "上传文件失败", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Logger.e("成功" + response.toString());
                uploadFile.delete();
                if(response.code() == 200){
                    ResponseBody body = response.body();
                    final JSONObject jo = JSONValue.parse(body.string(), JSONObject.class);
                    Logger.e("jo -- "+jo);
                    if(jo.getAsNumber("err_code").intValue()==0){
                        final JSONObject data = (JSONObject) jo.get("data");
                        Logger.e("data"+data);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                handler.sendEmptyMessage(12);
                                progressBar.setVisibility(View.GONE);
                                Toast.makeText(BoardActivity.this, "上传文件成功", Toast.LENGTH_SHORT).show();
                                Intent intent = new Intent();
                                intent.putExtra(EXTRA_SAVED_PATH, data.getAsString("url"));
                                activity.setResult(RESULT_OK, intent);
                                activity.finish();
                            }
                        });
                    }else{
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                handler.sendEmptyMessage(12);
                                progressBar.setVisibility(View.GONE);
                                Toast.makeText(BoardActivity.this, "上传文件失败"+jo.getAsString("err_msg"), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                }else{
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            progressBar.setVisibility(View.GONE);
                            Toast.makeText(BoardActivity.this, "上传文件失败", Toast.LENGTH_SHORT).show();
                        }
                    });
                }

            }
        });
    }
}

