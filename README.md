### 安装方式
* 1、执行 yarn 安装依赖
* 2、react-native run-android/run-ios
### NOTICE
#### 1、处理fetch无法设置timeout，引入 whatwg-fetch-timeout
<code>

    yarn add whatwg-fetch-timeout --save 
    import 'whatwg-fetch-timeout --save';
    fetch('http://abc.com',{timeout:3000});
      
</code>

1、按钮触发延时，重复点击禁用
2、tab 切换卡顿 
3、navigation 导航层级设置

4、创建班级、修改班级、个人信息、布置作业学段科目、年级科目 合并？

### HTTP上传图片
<code>
    
    HTTP.request(API.UploadImg,{
        file: {uri: uri, type: 'multipart/form-data', name: 'headImg.jpg'},
        upload: true
    })
    //uri为图片本地地址
    
</code>

### code-push-server
<code>
    
    //从源码安装code-push-server
    $ git clone https://github.com/lisong/code-push-server.git
    $ cd code-push-server
    $ npm install
    $ ./bin/db init --dbhost localhost --dbuser root --dbpassword xxx #初始化mysql数据库
    
    //更新code-push-server
    $ cd /path/to/code-push-server
    $ git pull --rebase origin master
    $ ./bin/db upgrade --dbhost localhost --dbuser root --dbpassword #升级codepush数据库
    
    //修改配置文件
    $ vim config/config.js
    db: {
        username: "root",
        password: null,
        database: "codepush",
        host: "127.0.0.1",
        dialect: "mysql"
      },
      //七牛云存储配置 当storageType为qiniu时需要配置
      qiniu: {
        accessKey: "",
        secretKey: "",
        bucketName: "",
        downloadUrl: "" //文件下载域名地址
      },
      //阿里云存储配置 当storageType为oss时需要配置
      oss: {
        accessKeyId: "",
        secretAccessKey: "",
        endpoint: "",
        bucketName: "",
        prefix: "", // 对象Key的前缀，允许放到子文件夹里面
        downloadUrl: "", // 文件下载域名地址，需要包含前缀
      },
      //文件存储在本地配置 当storageType为local时需要配置
      local: {
        storageDir: "/Users/tablee/workspaces/storage",
        //文件下载地址 CodePush Server 地址 + '/download' download对应app.js里面的地址
        downloadUrl: "http://localhost:3000/download",
        // public static download spacename.
        public: '/download'
      },
      jwt: {
        // 登录jwt签名密钥，必须更改，否则有安全隐患，可以使用随机生成的字符串
        // Recommended: 63 random alpha-numeric characters
        // Generate using: https://www.grc.com/passwords.htm
        tokenSecret: 'INSERT_RANDOM_TOKEN_KEY'
      },
      common: {
        dataDir: "/Users/tablee/workspaces/data",
        //选择存储类型，目前支持local,oss,qiniu,s3配置
        storageType: "local"
      },
      
    //运行本地服务 默认监听 http://localhost:3000
    $ ./bin/www
    
</code>

### react-native-code-push

<code>

    //1、安装react-native-code-push
    $ yarn add react-native-code-push
    //link时输入key跳过，后面手动配置
    $ react-native link react-native-code-push
    
    //2、安装code-push-cli
    $ npm install -g code-push-cli
    //3、登录本地code-push-server 用户名：admin 密码：123456 登录成功后生成token 复制到命令行
    $ code-push login http://localhost:3000
    //4、创建项目 保存生成的 Staging(灰度) 及 Production(生产) 的key 
    $ code-push app add CommonRN-anroid/ios android/ios react-native/cordova
    //5、添加 Test(测试) 
    $ code-push deployment add CommonRN-android Test
    //6、查看 所有key
    $ code-push deployment ls CommonRN-android -k
    
    updateDialog (UpdateDialogOptions) :可选的，更新的对话框，默认是null,包含以下属性 
    appendReleaseDescription (Boolean) - 是否显示更新description，默认false
    descriptionPrefix (String) - 更新说明的前缀。 默认是” Description: “
    mandatoryContinueButtonLabel (String) - 强制更新的按钮文字. 默认 to “Continue”.
    mandatoryUpdateMessage (String) - 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
    optionalIgnoreButtonLabel (String) - 非强制更新时，取消按钮文字. Defaults to “Ignore”.
    optionalInstallButtonLabel (String) - 非强制更新时，确认文字. Defaults to “Install”.
    optionalUpdateMessage (String) - 非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
    title (String) - 要显示的更新通知的标题. Defaults to “Update available”.
</code>

### 生成离线包

<code>

    react-native bundle --entry-file index.android.js --bundle-output ./android/app/src/main/assets/index.android.jsbundle 
    --platform android --assets-dest ./android/app/src/main/res/ --dev false
    注意:[./android/app/src/main/assets/]文件夹存在。

</code>

### 发布更新
<code>
    
    code-push release <应用名称> <Bundles所在目录> <对应的应用版本> --deploymentName： 更新环境 --description： 更新描述  --mandatory： 是否强制更新
    
    code-push deployment history AppName deploymentName 查看历史发布记录
    
    code-push release-react MyApp-iOS ios  --t 1.0.0 --dev false --d Production --des "1.优化操作流程" --m true
    code-push release-react QXTeacher-android android --t 1.0.9 --dev false --d Staging --des '测试测试00001' --m true
</code>

### 版本更新规则

* 1、版本号规则（原生）三位 x.x.x
* 2、codepush 更新基于原生版本号更新，支持回滚，
* 3、推荐原生更新时显示对话框，jsbundle更新时静默更新（支持显示对话框）



* 1、工具类使用单例模式
* 2、类名大写字母开始，驼峰
* 3、方法名小写字母开始，驼峰，私有方法前添加_
* 4、变量名称小写字母开始，驼峰

### 离线包测试
sh build.sh Android Release 1.0.9
gradlew.bat assembleRelease



#### 
* 1、题目详情左右对齐
* 2、返回按钮统一替换
* 3、webView 交互禁用
* 4、图片预览交互