import React from 'react';
import {
    createMaterialTopTabNavigator,
} from 'react-navigation';
import FoldersList from '../screens/FoldersList';

const Routes = {
    Home: {
        screen: (props) => <FoldersList {...props} tabIndex={0}/>,
        navigationOptions: {
            title: 'Home'
        }
    },
    MyNewTab: {
        screen: (props) => <FoldersList {...props} tabIndex={1} createFolderTitle='Create new tab folder' />,
        navigationOptions: {
            title: 'My New Tab'
        }
    }
}

const routeConfig = {
    swipeEnabled: false
}

export default TabNavigator = createMaterialTopTabNavigator({
    ...Routes
}, routeConfig);