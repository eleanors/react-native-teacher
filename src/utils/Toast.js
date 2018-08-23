/**
 * Created by heaton on 2018/1/16.
 */
'use strict';
import {Overlay} from 'teaset';
import React from "react";
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import Theme from 'teaset/themes/Theme';
import DisplayUtils from './DisplayUtils';

class ToastView extends Overlay.PopoverView {
    static propTypes = {
        ...Overlay.View.propTypes,
        text: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
        position: PropTypes.oneOf(['top', 'bottom', 'center']),
        type: PropTypes.oneOf(['message', 'success', 'error']),
        messageBackgroundColor: PropTypes.string,
        successBackgroundColor: PropTypes.string,
        errorBackgroundColor: PropTypes.string
    };

    static defaultProps = {
        ...Overlay.View.defaultProps,
        overlayOpacity: 0,
        overlayPointerEvents: 'none',
        position: 'center',
        type: 'message',
        messageBackgroundColor: 'rgba(0,0,0,0.8)',
        successBackgroundColor: '#4791ff',
        errorBackgroundColor: '#ff5b5b'
    };

    buildProps() {
        super.buildProps();

        let {style, text, position, type, messageBackgroundColor, successBackgroundColor, errorBackgroundColor, ...others} = this.props;

        style = [{
            paddingLeft: position === 'bottom' ? Theme.toastScreenPaddingLeft : 0,
            paddingRight: position === 'bottom' ? Theme.toastScreenPaddingRight : 0,
            paddingTop: position === 'bottom' ? Theme.toastScreenPaddingTop : 0,
            paddingBottom: position === 'bottom' ? Theme.toastScreenPaddingBottom : 0,
            justifyContent: position === 'top' ? 'flex-start' : (position === 'bottom' ? 'flex-end' : 'center'),
            alignItems: 'center',
        }].concat(style);

        let contentStyle = {
            backgroundColor: type === 'message' ? messageBackgroundColor : (type === 'success' ? successBackgroundColor : errorBackgroundColor),
            paddingLeft: Theme.toastPaddingLeft,
            paddingRight: Theme.toastPaddingRight,
            paddingTop: type === 'message' ? Theme.toastPaddingTop : 25,
            paddingBottom: Theme.toastPaddingBottom,
            borderRadius: position === 'bottom' ? Theme.toastBorderRadius : 0,
            alignItems: 'center',
        };
        if (position === 'top') {
            contentStyle.width = DisplayUtils.SCREEN.width;
            contentStyle.minHeight = 64;
        }

        if (typeof text === 'string' || typeof text === 'number') {
            text = (
                <Text style={{color: '#fff', fontSize: 20,backgroundColor:'transparent'}}>{text}</Text>
            );
        }
        this.props = {style, contentStyle, text, position, ...others};
    }

    renderContent() {
        let {contentStyle, text} = this.props;
        return (
            <View style={[contentStyle]}>
                {text}
            </View>
        );
    }
}


export default class Toast extends Overlay {
    static defaultDuration = 'short';

    static show(options) {
        let {duration, ...others} = options && typeof options === 'object' ? options : {};

        let key = super.show(<ToastView {...others} direction="down"/>);
        if (typeof duration !== 'number') {
            switch (duration) {
                case 'long':
                    duration = 3500;
                    break;
                default:
                    duration = 2000;
                    break;
            }
        }
        setTimeout(() => this.hide(key), duration);

        return key;
    }

    static message(text, duration = this.defaultDuration, position = 'bottom') {
        return this.show({text, duration, position});
    }

    static error(text, duration = this.defaultDuration, position = 'top') {
        return this.show({text, duration, position, type: 'error'});
    }

    static success(text, duration = this.defaultDuration, position = 'top') {
        return this.show({text, duration, position, type: 'success'});
    }
}