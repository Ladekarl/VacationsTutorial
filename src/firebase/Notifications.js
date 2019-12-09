import firebase from 'react-native-firebase';

export default class Notifications {
    static _notificationListener;
    static _topicName = 'VacationsTopic';

    static checkPermissions = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            return true;
        } else {
            return await firebase.messaging().requestPermission();
        }
    };

    static listenNotifications = (listener) => {
        Notifications._notificationListener = firebase.notifications().onNotification(listener);
    };

    static stopListenNotifications = () => {
        if (Notifications._notificationListener) {
            Notifications._notificationListener();
        }
    };
}
