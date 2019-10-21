import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import CreateFolder from '../screens/CreateFolder';
import FolderView from '../screens/FolderView';
import SplashScreen from '../screens/SplashScreen';
import Header from '../components/Header';
import TabNavigator from './TabNavigator';

const headerNavigationOptions = {
    header: props => <Header {...props} />
};

const Routes = {
    SplashScreen: {
        screen: SplashScreen
    },
    CreateFolder: {
        screen: CreateFolder,
    },
    FoldersList: {
        screen: TabNavigator,
        navigationOptions: headerNavigationOptions
    },
    FolderView: {
        screen: FolderView,
        navigationOptions: headerNavigationOptions
    }
};

const routeConfig = {
    initialRouteName: 'SplashScreen'
};

export default createAppContainer(
    createStackNavigator({
        ...Routes
    }, routeConfig)
);