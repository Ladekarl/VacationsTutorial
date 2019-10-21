import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation';
import FoldersList from '../screens/FoldersList';

const Routes = {
    Home: {
        screen: (props) => <FoldersList {...props} tabIndex={0}/>,
        navigationOptions: {
            title: 'Home'
        }
    },
    MyNewTab: {
        screen: (props) => <FoldersList {...props} tabIndex={1} createFolderTitle='Create new tab folder'/>,
        navigationOptions: {
            title: 'New'
        }
    },
    MyThirdTab: {
        screen: (props) => <FoldersList {...props} tabIndex={2} createFolderTitle='Create third tab folder'/>,
        navigationOptions: {
            title: 'Third'
        }
    },
    MyFourthTab: {
        screen: (props) => <FoldersList {...props} tabIndex={3} createFolderTitle='Create fourth tab folder'/>,
        navigationOptions: {
            title: 'Fourth'
        }
    },
};

const routeConfig = {
    swipeEnabled: false
};

export default createMaterialTopTabNavigator({
    ...Routes
}, routeConfig);