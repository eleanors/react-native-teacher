#!/usr/bin/env bash
platform=$1;
buildType=$2;
version=$3
desc=$4
dirPath='build/'$1'/'$2'/'$3;

### 替换 ./node_modules/whatwg-fetch/fetch.js
cp ./fetch-with-timeout/fetch.js ./node_modules/whatwg-fetch/fetch.js

### 创建文件夹
if [ ! -d $dirPath ]; then
    echo '文件不存在 创建文件';
    mkdir -p $dirPath;
fi


function buildResourceAndroid(){
    echo 'buildResourceAndroid';
    code-push release-react QXTeacher-android android --t $version -d $buildType --des $desc
    return;
}
function buildResourceIOS(){
    echo 'buildResourceIOS';
    code-push release-react QXTeacher-ios ios --t $version -d $buildType --des $desc
    return;
}
function buildAndroid(){
    echo 'buildAndroid';
    #1、编译bundle
    react-native bundle --entry-file index.js --platform android --bundle-output $dirPath/index.android.bundle --assets-dest $dirPath --dev false
    rm $dirPath/drawable-mdpi/src_images_loading.gif
    rm $dirPath/drawable-mdpi/src_images_play_audio.gif
    rm $dirPath/drawable-mdpi/src_images_record.gif
    #2、复制文件到assets 及 drawable
    #2.1 复制bundle
    cp $dirPath'/index.android.bundle' android/app/src/main/assets/
    cp $dirPath'/index.android.bundle.meta' android/app/src/main/assets/
    #2.2 复制drawable
    for dh in $(ls $dirPath'/drawable-hdpi')
    do
        cp $dirPath'/drawable-hdpi/'$dh android/app/src/main/res/drawable-hdpi
    done
    for dm in $(ls $dirPath'/drawable-mdpi')
    do
        cp $dirPath'/drawable-mdpi/'$dm android/app/src/main/res/drawable-mdpi
    done
    for dxh in $(ls $dirPath'/drawable-xhdpi')
    do
        cp $dirPath'/drawable-xhdpi/'$dxh android/app/src/main/res/drawable-xhdpi
    done
    for dxxh in $(ls $dirPath'/drawable-xxhdpi')
    do
        cp $dirPath'/drawable-xxhdpi/'$dxxh android/app/src/main/res/drawable-xxhdpi
    done
    for dxxxh in $(ls $dirPath'/drawable-xxxhdpi')
    do
        cp $dirPath'/drawable-xxxhdpi/'$dxxxh android/app/src/main/res/drawable-xxxhdpi
    done
    #3、打包APK
    cd android&&./gradlew assemble$buildType
    cd ..
    cp android/app/build/outputs/apk/app-$(echo $buildType | tr '[A-Z]' '[a-z]').apk $dirPath/$buildType-$version.apk
    return;
}
function buildIOS(){
    echo 'buildIOS';
    #!/bin/sh  
        security unlock-keychain "-p" "zxc098"   # MAC授权密码
        projectpath="/private/var/root/.jenkins/workspace/QXTeacher-RN/ios/"      # 工程路径
        dirAbsPath=/var/root/.jenkins/workspace/QXTeacher-RN/$dirPath/
        basepath=$HOME          #
        appname="QXTeacher"       # APP的名字
        appnames="CommonRN"      #APP文件夹名称
        # 证书自动配置，故无需配置
        codesignidentify="iPhone Distribution: Qin Xue(Beijing) Education Network Technology Co., Ltd. (9CGEWW2EV8)"


        cd $projectpath         #cd到工程目录下

        rm -r CommonRN.ipa
        rm -r QXTeacher.xcarchive

        #clean
        xcodebuild -project "$appname.xcodeproj" -target "$appnames" -configuration 'Release' clean >> /dev/null
        #build
        xcodebuild -project "$appname.xcodeproj" -target "$appnames" -configuration 'Release' >> /dev/null

        CODE_SIGN_IDENTITY="$codesignidentify"


        #获取版本号，生成文件名，打包
        bundleversion=$(/usr/libexec/PlistBuddy -c "print :CFBundleShortVersionString" "$projectpath/$appnames/Info.plist")
        ipaname="${appname}_v${bundleversion}_`date "+%Y%m%d%H%M"`.ipa"
        apppath="$projectpath/build/Release-iphoneos/$appnames.app"      # .app文件在projectpath路径下

        xcodebuild clean -project $appname.xcodeproj -scheme $appnames -configuration Ad-hoc
        xcodebuild archive -project $appname.xcodeproj -scheme $appnames -archivePath $appname.xcarchive
        if [ $buildType == "Debug" ]; then
            xcodebuild -exportArchive -archivePath $appname.xcarchive -exportPath $projectpath -exportOptionsPlist ad-hoc9CGEWW2EV8Export.plist -allowProvisioningUpdates
        elif [ $buildType == "Release" ]; then
            xcodebuild -exportArchive -archivePath $appname.xcarchive -exportPath $projectpath -exportOptionsPlist app-store9CGEWW2EV8Export.plist -allowProvisioningUpdates
        fi

        #xcodebuild -exportArchive -archivePath $projectpath$appname.xcarchive -exportPath $projectpath$appname -exportFormat ipa -exportProvisioningProfile "dis_99Teacher"
        cp $(echo $projectpath$appnames'.ipa') $dirAbsPath
        #xcrun -sdk iphoneos PackageApplication "$apppath" -o "$ipapath$ipaname"        #xcrun已被下面方法代替
        #xcodebuild -exportArchive -archivePath CommonRN.xcarchive -exportPath ExportDestination -exportOptionsPlist 'Info.plist'
        return;
    }

if [ $platform == "Resource-Android" ]; then
    buildResourceAndroid;
elif [ $platform == "Resource-iOS" ]; then
    buildResourceIOS;
elif [ $platform == "Android" ]; then
    buildAndroid;
elif [ $platform == "iOS" ]; then
    buildIOS;
fi

