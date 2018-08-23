package com.qxcloud.teacher;

/**
 * CREATED BY:         heaton
 * CREATED DATE:       2017/4/8
 * CREATED TIME:       上午10:54
 * CREATED DESCRIPTION:
 */

public class EventMessage {
    public int what;
    public int arg1;
    public int arg2;
    public String arg3;
    public String arg4;
    public Object obj;

    @Override
    public String toString() {
        return "EventMessage{" +
                "what=" + what +
                ", arg1=" + arg1 +
                ", arg2=" + arg2 +
                ", arg3='" + arg3 + '\'' +
                ", arg4='" + arg4 + '\'' +
                ", obj=" + obj +
                '}';
    }
}
