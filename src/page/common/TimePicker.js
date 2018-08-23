// TabView.js

'use strict';

import React, {Component} from 'react';
import Picker from 'react-native-picker';
export default class TimePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex ? this.props.activeIndex : 0,
        };
    }



}
