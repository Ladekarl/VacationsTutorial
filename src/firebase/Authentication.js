import firebase from 'react-native-firebase';

export default class Authentication {
    static _credential;
    static _user;
    static _deviceToken;
    static _onTokenRefreshListener;

    static signIn = async () => {
        const credential = await firebase.auth().signInAnonymously();
        if (credential) {
            Authentication._credential = credential;
            Authentication._user = credential.user;
            return credential.user;
        }
    };

    static listenDeviceToken = () => {
        Authentication._onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            Authentication._deviceToken = fcmToken;
        });
    };

    static stopListenDeviceToken = () => {
        if(Authentication._onTokenRefreshListener) {
            Authentication._onTokenRefreshListener();
        }
    };

    static getDeviceTokenRemotely = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            Authentication._deviceToken = fcmToken;
            return fcmToken;
        }
    };
}