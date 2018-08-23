'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity, Dimensions, TouchableWithoutFeedback,
    Platform

} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Touch from "../public/Touch";
import ExaminationList from "./ExaminationList";
import SelectList from "../common/SelectList";
import TestListBiz from "../../biz/TestListBiz";
import DisplayUtils from "../../utils/DisplayUtils";

export default class TestList extends Component {
    // 构造
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            checkOpt: false,
            checkDiff: false,
            arrowUp: require('../../images/nav-arrow-up.png'),
            arrowDown: require('../../images/nav-arrow-down.png'),
            listNum: '0',
            difficulty_id: 0,
            isopt: 0,
            showSelect: false,
            typeList: [
                '全部题型',
                '单选题',
                '多选题',
                '解答题',
            ],
            defaultSelect: 0,
            difficultyList: [
                '全部难度',
                '简单',
                '较易',
                '中等',
                '较难',
                '困难',
            ],
            selectList: []
        };
        console.log((this.state.checkDiff) ? this.state.arrowUp : this.state.arrowDown);
    }

    _onEnter() {
        if (TestListBiz.mustRefresh) {
            setTimeout(() => this._listRef.refreshList(), 200)
            TestListBiz.setMustRefresh(false);
        }
    }


    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.nav}>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            let showSelect;
                            if (this.state.showSelect && this.state.checkOpt) {
                                showSelect = false;
                            } else {
                                showSelect = true;
                            }
                            this.setState({
                                showSelect: showSelect,
                                selectList: this.state.typeList,
                                checkOpt: (this.state.checkOpt) ? false : true,
                                checkDiff: false,
                                defaultSelect: this.state.isopt,
                            });
                        }}>
                        <View style={styles.navTextView}>
                            <Text style={styles.navText}>{this.state.typeList[this.state.isopt]}</Text>
                            <Image source={(this.state.checkOpt) ? this.state.arrowUp : this.state.arrowDown}
                                   style={styles.arrow}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            let showSelect;
                            if (this.state.showSelect && this.state.checkDiff) {
                                showSelect = false;
                            } else {
                                showSelect = true;
                            }
                            this.setState({
                                showSelect: showSelect,
                                selectList: this.state.difficultyList,
                                checkOpt: false,
                                checkDiff: (this.state.checkDiff) ? false : true,
                                defaultSelect: this.state.difficulty_id,
                            });
                        }}
                    >
                        <View style={styles.navTextView}>

                            <Text style={styles.navText}>{this.state.difficultyList[this.state.difficulty_id]}</Text>

                            <Image source={(this.state.checkDiff) ? this.state.arrowUp : this.state.arrowDown}
                                   style={styles.arrow}/>
                        </View>
                    </TouchableOpacity>
                </View>
                {/**/}
                <ExaminationList
                    difficulty_id={this.state.difficulty_id}
                    isopt={this.state.isopt}
                    loreds_id={this.props.loredsId}
                    subject_id={this.props.subjectId}
                    grade_type={this.props.gradeType}
                    num={(num) => {
                        this.setState({listNum: num});
                    }}
                    ref={ref => this._listRef = ref}
                />

                <SelectList
                    top={60}
                    show={this.state.showSelect}
                    list={this.state.selectList}
                    defaultSelect={this.state.defaultSelect}
                    close={() => {
                        this.setState({
                            showSelect: false,
                            checkOpt: false,
                            checkDiff: false,
                        })
                    }}
                    selected={(res) => {
                        //选择
                        if (this.state.checkOpt) {
                            this.setState({
                                showSelect: false,
                                selectList: [],
                                checkOpt: false,
                                checkDiff: false,
                                isopt: res,
                            });
                        } else {
                            this.setState({
                                showSelect: false,
                                selectList: [],
                                checkOpt: false,
                                checkDiff: false,
                                difficulty_id: res,
                            });
                        }
                        setTimeout(() => this._listRef.refreshList(), 200);
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    nav: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    navTextView: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    navText: {
        lineHeight: (Platform.OS === 'android') ? 40 : 55,
    },
    arrow: {
        marginTop: 28,
        width: 13,
        height: 6,
        marginLeft: 3,
    },
    listTitle: {
        backgroundColor: '#fff',
        borderBottomWidth: DisplayUtils.px2dp(1),
        borderColor: '#edecec',
        padding: 15,
        flexDirection: 'row',
    },
    textLeft: {
        color: '#b5b5b5',
        textAlign: 'left',
        width: (Dimensions.get('window').width - 30) / 2,
    },
    textRight: {
        textAlign: 'right',
        width: (Dimensions.get('window').width - 30) / 2,
        color: '#4791ff',
        fontWeight: 'bold'
    }
});