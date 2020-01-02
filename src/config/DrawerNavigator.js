import React from 'react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import Notifications from '../screens/Notifications';
import AppNavigator from './AppNavigator';
import Header from '../components/Header';
import SendNotifications from '../screens/SendNotifications';

const headerNavigationOptions = {
    header: props => <Header {...props} />
};

const routes = {
    Home: {
        screen: AppNavigator,
    },
    Notifications: {
        screen: createStackNavigator({
            Notifications: {
                screen: Notifications,
                navigationOptions: headerNavigationOptions
            }
        }),
        navigationOptions: {
            title: 'Notifikationer'
        }
    },
    SendNotifications: {
        screen: createStackNavigator({
            Notifications: {
                screen: SendNotifications,
                navigationOptions: headerNavigationOptions
            }
        }),
        navigationOptions: {
            title: 'Send Notifikationer'
        }
    }
};

const routeConfig = {
    initialRouteName: 'Home',
};

export default createDrawerNavigator({
    ...routes
}, routeConfig);