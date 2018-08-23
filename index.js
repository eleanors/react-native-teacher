import {
    AppRegistry,
    View,
    Text
} from 'react-native';
import React from 'react';
import Getui from 'react-native-getui';
import App from "./src/Launch";
import Route from "./src/Route";



Getui.clientId((param) => {
    console.log('cid --- ' + param);
    global.clientId = param;
});

const Staging = "0RDx4LqypsLQVDIpPFNNHbWysRmJ4ksvOXqog";
const Production = "xoZJMr5PyD7AZCjXx0iXujJYsKke4ksvOXqog";
const Test = "BtlpOYIQoE8s2RP0Xx1PL7V9ZL4n4ksvOXqog";

AppRegistry.registerComponent('QXTeacher', () => Route);

// AppRegistry.registerComponent('CommonRN', () => Example);