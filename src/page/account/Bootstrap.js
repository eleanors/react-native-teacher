import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Image,
    View,
    ImageBackground,
    Platform,
    StatusBar,
    Animated
} from 'react-native';
import TouchableOpacity from '../public/Touch';
import {Actions} from "react-native-router-flux";
import SplashScreen from 'react-native-splash-screen';

export default class Bootstrap extends Component {
    constructor(props) {
        super(props);
        SplashScreen.hide();
        StatusBar.setBarStyle('dark-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        }
        this.state = {
            fadeOpacity: new Animated.Value(0),
        };
    }

    componentDidMount() {
        Animated.timing(this.state.fadeOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }

    render() {
        let screen = Dimensions.get('window');
        return (
            <View style={styles.bg}>
                <ImageBackground
                    source={require('../../images/splash.png')}
                    style={{
                        width: screen.width,
                        height: screen.height,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: 10,
                    }}>
                    <Animated.View style={{
                        marginTop: 15,
                        opacity: this.state.fadeOpacity,
                    }}>
                        <TouchableOpacity
                            onPress={() => Actions.login()}
                        >
                            <Text style={styles.loginText}>登录</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={{
                        opacity: this.state.fadeOpacity,
                        marginBottom: 30
                    }}>
                        <TouchableOpacity
                            onPress={() => Actions.activate()}
                        >
                            <Text style={styles.reg}>账号开通 ></Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ImageBackground>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height + 200,
        backgroundColor: '#fff'
    },
    bgImg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 1.44,
        marginBottom: 50,
    },
    loginText: {
        // flex: 5,
        color: '#3c4e5d',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },

    reg: {
        textAlign: 'center',
        fontSize: 12,
        color: '#b5b5b5',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },

});
