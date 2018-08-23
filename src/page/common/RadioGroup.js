/**
 * Created by heaton on 2018/1/15.
 * Desription :
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import RadioBox from './RadioBox';

export default class RadioGroup extends Component {

    static propTypes = {
        ...RadioBox.propTypes,
        items: PropTypes.array.isRequired,
        checkedItem: PropTypes.string,
        orientation: PropTypes.string,
        onCheckChanged: PropTypes.func,
    };
    static defaultProps = {
        ...RadioBox.defaultProps,
        items: [],
        checkedItem: '',
        orientation: 'row',
        onCheckChanged: () => {
        }
    };

    _buildState(props, index) {
        let boxesState = [];
        props.items.map((item, i) => {
            boxesState.push({
                index: i,
                name: item,
                checked: index < 0 ? (item === props.checkedItem) : (index == i)
            })
        });
        return boxesState;
    }

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            radioBoxes: this._buildState(this.props, -1)
        };
    }

    componentWillReceiveProps(props) {
        console.log('componentWillReceiveProps', props);
        this.setState({
            radioBoxes: this._buildState(props, -1)
        })
    }

    getChecked() {
        let checkedItem = {};
        this.state.radioBoxes.map((item)=> {
            if (item.checked) {
                checkedItem = item;
            }
        });
        return checkedItem;
    }

    _onChange(boxItem, index) {
        this.setState({
            radioBoxes: this._buildState(this.props, index)
        });
        this.props.onCheckChanged && this.props.onCheckChanged(boxItem.name, boxItem.index);
    }

    render() {
        console.log('render', this.state.radioBoxes);
        let itemViews = this.state.radioBoxes.map((item, index) => {
            return (
                <RadioBox
                    {...this.props}
                    key={item.name}
                    title={item.name}
                    style={{marginLeft: 10}}
                    checked={item.checked}
                    checkedIcon={<Image style={{width: 22, height: 22,}}
                                        source={require('../../images/type_seleted.png')}/>}
                    uncheckedIcon={<Image style={{width: 22, height: 22,}}
                                          source={require('../../images/type_unseleted.png')}/>}
                    onChange={(checked) => this._onChange(item, index)}/>
            );
        });
        return (
            <View style={[{flexDirection: this.props.orientation}]}>
                {itemViews}
            </View>
        );
    }
}
const styles = StyleSheet.create({});