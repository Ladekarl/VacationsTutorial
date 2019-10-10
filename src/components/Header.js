import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Account from '../storage/Account';
import SignIn from './SignIn';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSignIn: false
        };
    }

    onBackPress = () => {
        const {navigation} = this.props;
        let index = navigation.state.index;
        if (index >= 0) {
            const route = navigation.state.routes[index];
            if (route && route.params && route.params.onBack) {
                route.params.onBack();
            }
        }
        navigation.goBack(null);
    };

    openSignInModal = () => {
        const isSignedIn = Account.getSignedIn();
        if (isSignedIn) {
            this.setSignedIn(false);
        } else {
            this.setState({
                showSignIn: true
            });
        }
    };

    closeSignInModal = (isSignedIn = false) => {
        this.setState({
            showSignIn: false,
        });
        this.setSignedIn(isSignedIn);
    };

    setSignedIn = (signedIn) => {
        Account.setSignedIn(signedIn);
        const {navigation} = this.props;
        let routeName = navigation.state.routeName;
        let index = navigation.state.index;
        if (!routeName && index >= 0) {
            let route = navigation.state.routes[index];

            const getRoute = nestedRoute => {
                if (nestedRoute.routes && nestedRoute.routes.length > 0) {
                    getRoute(nestedRoute.routes[nestedRoute.index]);
                } else {
                    route = nestedRoute;
                }
            };
            getRoute(route);

            if (route) {
                routeName = route.routeName;
            }
        }
        if (routeName) {
            navigation.navigate(routeName, {});
        }
    };

    onSignInPressed = (correctPassword) => {
        this.closeSignInModal(correctPassword);
    };

    render() {
        const {showSignIn} = this.state;
        const {navigation} = this.props;
        const index = navigation.state.index;

        const isSignedIn = Account.getSignedIn();
        return (
            <View style={styles.container}>
                {index > 0 &&
                <TouchableOpacity
                    style={styles.leftButton}
                    onPress={this.onBackPress}>
                    <Image
                        style={styles.headerButtonImage}
                        source={require('../../images/back.png')}
                    />
                </TouchableOpacity>
                }
                <Image
                    style={[styles.headerImage, index === 0 ? styles.noBackImage : {}]}
                    source={require('../../images/vacation.jpeg')}
                    resizeMode='cover'
                />
                <TouchableOpacity
                    onPress={this.openSignInModal}
                    style={styles.rightButton}>
                    {isSignedIn &&
                    <Image
                        style={styles.headerButtonImage}
                        source={require('../../images/logout.png')}
                    />
                    }
                    {!isSignedIn &&
                    <Image
                        style={styles.headerButtonImage}
                        source={require('../../images/login.png')}
                    />
                    }
                </TouchableOpacity>
                <SignIn
                    visible={showSignIn}
                    onSignIn={this.onSignInPressed}
                    onClose={this.closeSignInModal}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#e0e0e0',
        elevation: 4
    },
    leftButton: {
        marginLeft: 15
    },
    headerImage: {
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center',
        flex: 1,
        height: 50,
        width: undefined,
        borderRadius: 2
    },
    noBackImage: {
        marginLeft: 65
    },
    rightButton: {
        marginRight: 15
    },
    headerButtonImage: {
        height: 40,
        width: 40
    }
});