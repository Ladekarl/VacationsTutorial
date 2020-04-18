import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import DrawerNavigator from './config/DrawerNavigator';
import Config from 'react-native-config';
import SplashScreen from './components/SplashScreen';
import Authentication from './firebase/Authentication';
import DrawerButton from './components/DrawerButton';
import NavigationService from './services/NavigationService';
import {createAppContainer, SafeAreaView} from 'react-navigation';
import Notifications from './firebase/Notifications';

let AppNavigator = createAppContainer(DrawerNavigator);

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderApp: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                renderApp: true
            });
        }, 2000);
        this.initialize();
    }

    componentWillUnmount() {
        Authentication.stopListenDeviceToken();
        Notifications.stopListenNotifications();
    }

    initialize = async () => {
        await Notifications.checkPermissions();
        await Authentication.signIn();
        await Authentication.getDeviceTokenRemotely();
        Authentication.listenDeviceToken();
        Notifications.listenNotifications();
    };

    render() {
        const {renderApp} = this.state;
        if (renderApp) {
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.safeAreaViewHeader}/>
                    <SafeAreaView style={styles.container}>
                        <AppNavigator
                            persistenceKey={Config.NAVIGATION_PERSISTENCE_KEY}
                            ref={NavigationService.setTopLevelNavigator}
                        />
                        <View style={styles.drawerButton}>
                            <DrawerButton/>
                        </View>
                    </SafeAreaView>
                </View>
            );
        } else {
            return (
                <SplashScreen/>
            );
        }
    }
}

const styles = StyleSheet.create({
    safeAreaViewHeader: {
        flex: 0,
        backgroundColor: '#e0e0e0'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    drawerButton: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        height: 50,
        width: 50
    }
});