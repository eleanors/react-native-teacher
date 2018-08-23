package com.qxcloud.teacher;

import android.text.TextUtils;

import java.io.Serializable;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2017/4/5
 * CREATED TIME:       上午11:18
 * CREATED DESCRIPTION:
 */

public class PhotoEditEntity implements Serializable {

    private String studentImgPath;
    private String teacherImgPath;
    private String uploadUrl;

    public String getUploadUrl() {
        return uploadUrl;
    }

    public void setUploadUrl(String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    public String getTeacherImgPath() {
        return teacherImgPath;
    }

    public void setTeacherImgPath(String teacherImgPath) {
        this.teacherImgPath = teacherImgPath;
    }

    public String getStudentImgPath() {

        return studentImgPath;
    }

    public void setStudentImgPath(String studentImgPath) {
        this.studentImgPath = studentImgPath;
    }

    public String getShowImgUrl(int imgState) {
        String url = "";
        switch (imgState) {
            case 0:
                url = TextUtils.isEmpty(teacherImgPath) ? studentImgPath : teacherImgPath;
                break;
            case 1:
                url = teacherImgPath;
                break;
            case 2:
                url = studentImgPath;
                break;
        }
        return url;
    }

    @Override
    public String toString() {
        return "PhotoEditEntity{" +
                "studentImgPath='" + studentImgPath + '\'' +
                ", teacherImgPath='" + teacherImgPath + '\'' +
                '}';
    }
}
