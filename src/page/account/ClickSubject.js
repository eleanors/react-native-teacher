import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Dimensions,
    View
} from 'react-native';
import {
    Label,
} from 'teaset';
import Touch from '../public/Touch';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import DisplayUtils from "../../utils/DisplayUtils";

const ItemWidth = DisplayUtils.SCREEN.width / 4;
export default class ClickSubject extends Component {


    test(item, subject_id, grade_type) {
        this.props.callbackParent(item, subject_id, grade_type);
    }

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            list: this.props.list,
            grade_type: this.props.grade_type,
            subject_id: this.props.subject_id,
        };
    }

    subjectItem(list, parent) {
        return list.map((item, k) => {
            console.log('gradeItem --- ', item);
            let activeStyles = this.state.subject_id === item.subject_id && this.state.grade_type === parent.grade_type?
                {
                    liActive:styles.liActive,
                    liActiveText:styles.liActiveText,
                }:
                {
                    liActive:null,
                    liActiveText:null,
                };
            return (
                <View
                    key={k}
                    style={styles.liRoot}>
                    <Touch
                        onPress={() => this.test(parent.grade_name + item.subject_name, item.subject_id, parent.grade_type)}
                        style={styles.liTouchRoot}>
                    <View style={[styles.li,activeStyles.liActive]}>
                        <Text style={[styles.liText,activeStyles.liActiveText]}>{item.subject_name}</Text>
                    </View>
                    </Touch>
                </View>
            );
        });
    }

    TabViewSheet(list) {
        return list.map((item, k) => {
            console.log(item.grade_name);
            return (
                <View
                    tabLabel={item.grade_name}
                    key={k}
                >
                    <View style={styles.ul}>
                        {this.subjectItem(item.subject_list, item)}
                    </View>
                </View>
            );
        });
    }

    render() {
        return (
            <View style={styles.modal}>
                <View style={styles.label}>
                    <Label style={styles.modalTitle}>学段科目</Label>
                </View>
                <ScrollableTabView
                    initialPage={(this.props.grade_type - 1)}
                    style={{borderBottomWidth: 0}}
                    renderTabBar={() => <DefaultTabBar
                        activeTextColor='#4791ff'
                        underlineStyle={{
                            backgroundColor: '#4791ff',
                            position: 'absolute',
                            width: 30,
                            left: (DisplayUtils.SCREEN.width / 3 - 30)/2,
                            borderRadius: 2,}}
                        tabStyle={{borderBottomWidth: 0}}
                    />}
                >
                    {this.TabViewSheet(this.state.list)}

                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    modal: {
        backgroundColor: '#fff',
        minWidth: 300,
        minHeight: 260,
    },

    label: {

        justifyContent: 'center',
        alignItems: 'center'
    },

    barStyle: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 1,
        left: 1,

    },
    modalTitle: {
        fontWeight: 'bold',
        marginTop: 20,

    },

    ul: {
        flexDirection: 'row',
        paddingTop:30,
        flexWrap:'wrap',
    },
    liRoot:{
        width: ItemWidth,
        marginTop:10,
        height: 40,
        paddingLeft:15,
        paddingRight:15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liTouchRoot:{
        width: ItemWidth - 30,
        height: 40,
    },
    li: {
        flex:1,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center',
    },
    liText: {
        textAlign: 'center',
        justifyContent: 'center',
    },
    liActive: {
        backgroundColor: '#4791ff',
    },
    liActiveText: {
        color: '#ffffff'
    },
    slider: {
        position: 'absolute',
        width: 20,
        left: DisplayUtils.SCREEN.width / 6 - 10,
        backgroundColor: '#0E67FF',
        borderRadius: 2,
    }


});