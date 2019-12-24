import React from 'react';
import {createStackNavigator} from 'react-navigation';
import CreateFolder from '../screens/CreateFolder';
import FolderView from '../screens/FolderView';
import Header from '../components/Header';
import TabNavigator from './TabNavigator';

const headerNavigationOptions = {
    header: props => <Header {...props} />
};

const Routes = {
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
    initialRouteName: 'FoldersList'
};


export default createStackNavigator({
    ...Routes
}, routeConfig);