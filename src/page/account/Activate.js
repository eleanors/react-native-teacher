
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Http from "../../utils/HttpUtils";
import {API} from "../../Config";

export default class Activate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        };

    }

    componentDidMount(){

        Http.request(API.getAccountList,{}).then(result=>{
            console.log(result);
            // this.state.list = this.createList(result.list);
            this.setState({
                list: this.createList(result.list)
            })
        })
    }

    createList(list){
        if(!list || list === '') return false;
        console.log(123);
        return list.map((item,k)=>{
            console.log(item,k);
            return <View style={styles.th} key={k}>
                <Text style={styles.tdText}>{item.company_name}</Text>
                <Text style={styles.tdText}>{item.username}</Text>
            </View>;
        });
    }

    render() {
        return (
            <ScrollView style={styles.bg}>
                <View>
                    <LinearGradient
                        style={styles.btn}
                        colors={['#409bff', '#338bff', '#257aff']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}>
                        <View>
                            <Text style={styles.btnText}>请通过校区人事联系各个分公司管理员开通账号</Text>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.table}>
                    <View style={styles.th}>
                        <Text style={[styles.thText]}>所属部门</Text>
                        <Text style={{color: '#9fa2a6',
                            textAlign: 'center',
                            fontSize: 14,}}>></Text>
                        <Text style={[styles.thText]}>联系人</Text>
                    </View>
                    {this.state.list}
                </View>
            </ScrollView>
        );
    }
}




const styles = StyleSheet.create({

    bg: {
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        padding: 20,
        backgroundColor: '#fff',
    },

    btn: {
        marginTop: 10,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    table: {
        marginTop: 20,
        borderWidth: 0.5,
        borderColor: '#e3e5e7',
        borderRadius: 15,
        padding: 20,
        marginBottom: 100,
    },

    th: {
        flexDirection: 'row',
        height: 40,
    },

    thText: {
        color: '#9fa2a6',
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },

    tdText: {
        color: '#3c495d',
        flex: 1,
        textAlign: 'center',
        fontSize: 16,

    },

});
