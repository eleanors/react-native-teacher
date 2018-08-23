/**
 * Created by heaton on 2018/2/12.
 * Desription :
 */

'use strict';

import React from 'react';
import {PropTypes} from 'prop-types';
import { requireNativeComponent, View } from 'react-native';
let htmlView = {
    name: 'HtmlView',
    propTypes: {
        html: PropTypes.string,
        ...View.propTypes // 包含默认的View的属性
    },
};

module.exports = requireNativeComponent('RCTHtmlTextView', htmlView);