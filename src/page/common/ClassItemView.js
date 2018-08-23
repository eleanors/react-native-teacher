/**
 * Created by heaton on 2018/1/8.
 * Desription :
 */

'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import DisplayUtils from '../../utils/DisplayUtils';
import LinearGradient from 'react-native-linear-gradient';
import {CachedImage} from 'react-native-cached-image';
import PropTypes from 'prop-types';


export default class ClassItemView extends PureComponent {
    static propTypes = {
        item: PropTypes.object.isRequired,
        classItemPress: PropTypes.func.isRequired,
        taskItemPress: PropTypes.func.isRequired,
        taskLoadMorePress: PropTypes.func.isRequired
    };
    static defaultProps = {
        item: {},
        classItemPress: () => {
        },
        taskItemPress: () => {
        },
        taskLoadMorePress: () => {
        }
    };

    render() {
        const classItem = this.props.item;
        const taskLoadMore = (
            <TouchableOpacity onPress={this.props.taskLoadMorePress.bind(this, classItem)}>
                <View style={styles.loadMore}>
                    <Text style={styles.loadMoreText}>查看更多</Text>
                </View>
            </TouchableOpacity>
        );
        let classItems = classItem.task_list.map((taskItem, index) => {
            let bgColor = taskItem.is_dead == 1 ? '#ffffff' : '#ffffff';

            let borderBottomRightRadius;
            let borderBottomLeftRadius;

            let ml;
            let mr;

            if (classItem.task_count > 3) {
                borderBottomRightRadius = 0;
                borderBottomLeftRadius = 0;
                ml = 0;
                mr = 0;
            } else {
                borderBottomRightRadius = index == 2 ? 10 : 10;
                borderBottomLeftRadius = index == 2 ? 10 : 10;

                if (classItem.task_count == 3) {

                    if (index != 2) {
                        ml = 0;
                        mr = 0;
                    } else {
                        ml = 10;
                        mr = 10;
                    }

                } else if (classItem.task_count == 2) {

                    if (index != 1) {
                        ml = 0;
                        mr = 0;
                    } else {
                        ml = 10;
                        mr = 10;
                    }
                } else {
                    ml = 10;
                    mr = 10;
                }


            }

            return (
                <View key={taskItem.task_id} style={{
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    height:50,
                    justifyContent:'center',
                }}>
                    <TouchableOpacity
                        onPress={this.props.taskItemPress.bind(this, taskItem)}
                        style={{flex:1}}>
                        <View style={[styles.taskItem, {
                            backgroundColor: bgColor,
                            borderBottomRightRadius: borderBottomRightRadius,
                            borderBottomLeftRadius: borderBottomLeftRadius
                        }]}>
                            <Text style={[styles.taskItemText]}>
                                {taskItem.task_name}
                            </Text>
                            <Text style={[styles.taskItemNumText, {flex: 1}]}>
                                &nbsp;&nbsp;{taskItem.task_test_count}题
                            </Text>
                            {taskItem.is_dead == 1 ?
                                <Text style={[styles.taskItemRightText]}>已截止</Text> :
                                <View style={[{flexDirection: 'row'}]}>
                                    <Text
                                        style={[styles.taskItemRightText, {color: '#ffa96f'}]}>{taskItem.finish_student_count}</Text>
                                    <Text style={[styles.taskItemRightText]}>/{taskItem.class_student_count}</Text>
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.divideLine, {marginLeft: ml, marginRight: mr}]}/>
                </View>
            );
        });
        let img = '';
        if(classItem.class_type === 0){
            img = <Image source={require('../../images/banzu.png')} style={styles.tags}/>;
        }else{
            img = <Image source={require('../../images/gexinghua.png')} style={styles.tags}/>;
        }
        return (
            <TouchableOpacity
                onPress={this.props.classItemPress.bind(this, classItem)}
                activeOpacity={0.7}>
                {img}
                <LinearGradient
                    style={styles.classItemRoot}
                    colors={['#3488FF', '#346AFF', '#345DFF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <View
                        style={styles.classInfo}>
                        <CachedImage
                            style={styles.classImage}
                            source={{uri: classItem.img_url}}
                            defaultSource={require('../../images/head_class.png')}
                            fallbackSource={require('../../images/head_class.png')}/>
                        <View style={styles.classTextRoot}>
                            <Text style={[styles.classTitleText]}>{classItem.class_name}</Text>
                            <Text style={[styles.classDescText]}>
                                {classItem.class_grade_subject} | 班级编号:{classItem.class_number}
                            </Text>
                        </View>
                        <Image
                            source={require('../../images/class_item_tittle_go.png')}
                            style={{width: 25, height: 25}}/>
                    </View>
                    <View style={{backgroundColor: '#fff'}}>
                        {classItems}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    tags: {
        position: 'absolute',
        left: 10,
        top: 10,
        width: 84/2,
        height: 71/2,
        zIndex: 1000,

    },
    classItemRoot: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    classInfo: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    classTitleText: {
        color: '#CBDDE1',
        fontSize: 16,
    },
    classDescText: {
        color: '#A2C8FF',
        fontSize: 14,
    },
    taskItemRoot: {
        padding: 10
    },
    taskItem: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    loadMore: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    loadMoreText: {
        color: '#b5b5b5'
    },
    divideLine: {
        height: DisplayUtils.MIN_LINE_HEIGHT,
        backgroundColor: '#E6E6E6',
    },
    taskItemText: {
        color: '#4E545F',
        fontSize: 16,
    },
    taskItemNumText: {
        color: '#c2c3c4'
    },
    taskItemRightText: {
        color: '#c2c3c4'
    },
    classTextRoot: {
        marginLeft: 10,
        flex: 1,
        backgroundColor: 'transparent'
    },
    classImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    }
});