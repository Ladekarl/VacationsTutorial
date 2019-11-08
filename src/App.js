import React, {Component} from 'react';
import SplashScreen from './screens/SplashScreen';
import Config from 'react-native-config';
import AppNavigator from './config/AppNavigator';

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
    }

    render() {
        const {renderApp} = this.state;
        if (renderApp) {
            return (
                <AppNavigator persistenceKey={Config.NAVIGATION_PERSISTENCE_KEY}/>
            );
        } else {
            return (
                <SplashScreen/>
            );
        }
    }
}
