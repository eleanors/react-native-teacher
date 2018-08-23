import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
} from 'react-native';
import {
    ListRow
} from 'teaset';
import {Actions} from "react-native-router-flux";
import {StorageKeys} from "../../Config";


export default class Setting extends Component {


    constructor(props) {
        super(props);
        this.state = global.userInfo;
    }


    confirmSignOut() {
        Actions.confirmDialog({
            title: '提示',
            buttons: ["确认", "取消"],
            message: '确认退出当前账号？',
            onClick: (index) => {
                if (index === 0) {
                    this.logOut();
                } else {
                    console.log("取消");
                }

            }
        })
    }


    logOut() {

        global.storage.remove({
            key: 'access-token'
        });
        global.storage.remove({
            key: 'userinfo'
        });
        global.storage.remove({
            key:StorageKeys.DefaultSubjectAndGradeKey
        });
        global.access_token = null;
        global.userInfo = null;
        global.subjectAndGrade = null;
        Actions.reset('sign');
    }

    render() {
        return (
            <View style={styles.bg}>
                <View style={styles.line}>
                    <ListRow title='手机号' detail={this.state.mobile} style={styles.listrow}/>
                    <ListRow title='修改密码' accessory='indicator' bottomSeparator='none' style={styles.listrow}
                             onPress={()=>Actions.editPassword()}/>
                </View>
                <View style={styles.line}>
                    <ListRow title='退出当前账号' bottomSeparator='none' style={styles.listrow}
                             onPress={() => this.confirmSignOut()}/>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#fafafd'
    },
    line: {
        marginTop: 20,
    },
    listrow: {
        height: 50,
    },

});
