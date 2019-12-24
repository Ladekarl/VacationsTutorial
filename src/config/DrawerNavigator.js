import React from 'react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import Notifications from '../screens/Notifications';
import AppNavigator from './AppNavigator';
import Header from '../components/Header';

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
        })
    }
};

const routeConfig = {
    initialRouteName: 'Home',
};

export default createDrawerNavigator({
    ...routes
}, routeConfig);