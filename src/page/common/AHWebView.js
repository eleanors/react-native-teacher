// TabView.js
/**
 */
'use strict';

import React, {Component} from 'react';
import {View, Platform, TouchableOpacity, Text} from "react-native";
import AutoHeightWebView from 'react-native-autoheight-webview';
import {Actions} from 'react-native-router-flux';

export default class AHWebView extends Component {

    static defaultProps = {
        html: '',
        viewStyle: {},
        webStyle: {},
        maxHeight: 0,
        ImageZoom: true,
        onHeightUpdated: ()=> {
        },
        topic: false,
    };

    constructor(props) {
        super(props);


        this.state = {
            height: 0,
            hideTopic: false,
            hideText: false,
        };
    }


    _editHtml(content) {
        // console.log(html);
        let htmlContent = '<!DOCTYPE html><html><body>' +
            '<head>' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">' +
            '<style type="text/css">' +
            'img{vertical-align:middle}' +
            '</style>' +
            '</head>' +
            `${content}` +
            '<script>' +
            'window.onload=function(){' +
            'var height = document.body.clientHeight;' +
            'window.location.hash = "#" + height;document["title"] = height;};' +
            'function _onclick(data) {WebViewBridge.send(data);}' +
            'function imgClick(url) { window.postMessage(url)}' +
            '</script>' +
            '</body>' +
            '</html>';

        if (this.props.ImageZoom === true) {
            htmlContent = htmlContent.replace(/(<img[^>]*?src=['""]([^'""]*?)['""][^>]*?>)/g, "<a onclick='imgClick(\"$2\")'>$1</a>");
            return htmlContent;
        } else {
            return htmlContent;
        }
    }

    render() {
        let htmlContent = this._editHtml(this.props.html);
        return (
            <View style={[this.props.viewStyle, {height: this.state.height, overflow: 'hidden'}]}>
                <AutoHeightWebView
                    onHeightUpdated={(height) => {
                        // console.log('onHeightUpdated --- '+this.props.index,height);
                        if (this.props.onHeightUpdated) {
                            this.props.onHeightUpdated(height);
                        }
                        if (this.props.maxHeight > 0 && this.props.maxHeight <= height) {
                            this.setState({
                                height: this.props.maxHeight,
                            });
                            if (this.props.topic) {
                                this.setState({
                                    hideTopic: true,
                                    hideText: true,
                                });
                            }
                        } else {
                            this.setState({
                                height : height + (this.state.hideTopic ? 30 : 0)
                            })
                        }
                        this.height = height + (this.state.hideTopic ? 30 : 0);
                    }}
                    enableBaseUrl={false}
                    scalesPageToFit={Platform.OS === 'android' ? true : false}
                    scrollEnabled={false}
                    javaScriptEnabled={true}
                    source={{html: htmlContent, baseUrl: ''}}
                    style={[this.props.webStyle, {flex: 1}]}
                    bounces={false}
                    automaticallyAdjustContentInsets={true}
                    contentInset={{top: 0, left: 0}}
                    customScript={``}
                    onImageClick={(res)=> {
                        Actions.imageDialog({img: res});
                    }}
                    customStyle={`*{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-overflow-scrolling:touch}p{color:#585858}img{max-width:100%!important;}a,abbr,acronym,address,applet,b,big,blockquote,body,caption,center,cite,code,dd,del,dfn,div,dl,dt,em,fieldset,font,form,h1,h2,h3,h4,h5,h6,html,i,iframe,img,ins,kbd,label,legend,li,object,ol,p,pre,q,s,samp,small,span,strike,strong,sub,sup,table,tbody,td,textarea,tfoot,th,thead,tr,tt,u,ul,var{margin:0;padding:0}address,cite,dfn,em,i,var{font-style:normal}body{font-size:1pc;line-height:1.5}table{border-collapse:collapse;border-spacing:0}h1,h2,h3,h4,h5,h6,th{font-size:100%;font-weight:400}button,input,select,textarea{font-size:100%}fieldset,img{border:0}a{text-decoration:none;color:#666;background:0}ol,ul{list-style:none}`}
                    enableAnimation={true}
                />


                {this.state.hideTopic ?
                    <View style={{height: 30}}>
                        <TouchableOpacity
                            onPress={()=> {
                                console.log(this.height);

                                if (this.state.hideText) {
                                    this.setState({
                                        height: this.height,
                                        hideText: false,
                                    });
                                } else {
                                    this.setState({
                                        height: this.props.maxHeight,
                                        hideText: true,
                                    });
                                }


                            }}
                        >
                            <Text style={{
                                textAlign: 'center',
                                marginTop: 10,
                                color: '#4791ff',
                                paddingBottom: 10
                            }}>{this.state.hideText ? '展开题目' : '收起题目'}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
            </View>
        );
    }

}
