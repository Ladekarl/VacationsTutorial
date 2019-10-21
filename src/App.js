import React, {Component} from 'react';
import AppNavigator from './config/AppNavigator';
import Config from 'react-native-config';

export default class App extends Component {
    render() {
        return (
            <AppNavigator persistenceKey={Config.NAVIGATION_PERSISTENCE_KEY}/>
        );
    }
}
