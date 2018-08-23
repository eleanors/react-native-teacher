/**
 * 电子试题
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Platform, Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {UltimateListView} from 'react-native-ultimate-listview';
import EmptyView, {EmptyType} from '../../../page/common/EmptyView';
import ListRow from '../../common/ListRow';
import Toast from "../../../utils/Toast";
import DisplayUtils from "../../../utils/DisplayUtils";

export default class SectionRows extends Component {

    static defaultProps = {
        data: {
            courses: []
        }
    }

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            emptyType: EmptyType.NO_DATA,
        };
        console.log('this.props.data',this.props.data);
    }


    _renderEmptyView() {
        return (
            <EmptyView
                emptyType={this.state.emptyType}
                onClick={() => this.listView.refresh()}
            />
        );
    }

    _renderItem(list) {
        return list.map((item, k)=> {
            console.log(23333,item);

            let list = [];
            if (this.props.type === 3) {
                for (let i in item.course_data) {

                    if (item.course_data[i].type === 3) {
                        list.push(item.course_data[i]);
                    }

                }
                console.log(list);
            }


            let lock;
            switch (this.props.type) {
                case 1:
                    if (item.course_paper.length > 0) {
                        lock = true;
                    }
                    break;
                case 2:
                    if (item.notes_category.length > 0) {
                        lock = true;
                    }
                    break;
                case 3:
                    if (list.length > 0) {
                        lock = true;
                    }
                    break;
            }
            if (lock) {

                return (
                    <View key={k}>
                        <ListRow
                            title={(k + 1) + '.' + item.name}
                            style={styles.listrow}
                            accessory='indicator'
                            onPress={() => {
                                switch (this.props.type) {
                                    case 1:
                                        Actions.sectionTest({item: item, title: item.name});
                                        break;
                                    case 2:
                                        Actions.sectionImgs({id: item.id,item: item.notes_category});
                                        break;
                                    case 3:
                                        Actions.sectionVideo({list: list});
                                        break;
                                }
                            }}
                        />
                    </View>
                )
            } else {
                return (
                    <View key={k}>
                        <ListRow
                            title={(k + 1) + '.' + item.name}
                            style={styles.listrow}
                            accessory='indicator'
                            titleStyle={styles.listText}
                            onPress={() => {
                                Toast.error('内容暂缺');
                            }}
                        />
                    </View>
                )
            }
        });
    }

    render() {

        console.log('Task render ', this.props.data);

        return (
           <ScrollView showsVerticalScrollIndicator={false} rticalScrollIndicator={false} alwaysBounceVertical={true} style={styles.view}>
                {
                    (this.props.data.courses.length > 0)
                        ?
                        this._renderItem(this.props.data.courses)
                        :
                        this._renderEmptyView()
                }
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    listrow: {
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: '#edecec',
        borderBottomWidth: DisplayUtils.px2dp(1),
    },
    listText: {
        color: '#d3d3d3'
    },
    view: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#fff",
        height: Dimensions.get('window').height - 85
    },
});