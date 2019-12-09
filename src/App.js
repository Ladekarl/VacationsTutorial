import React, {Component} from 'react';
import AppNavigator from './config/AppNavigator';
import Config from 'react-native-config';
import SplashScreen from './components/SplashScreen';

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
