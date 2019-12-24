import firebase from 'react-native-firebase';
import NotificationStorage from '../storage/Notifications';

export default class Notifications {
    static _notificationListener;
    static _listenerFunction = () => {
    };

    static checkPermissions = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            return true;
        } else {
            return await firebase.messaging().requestPermission();
        }
    };

    static listenNotifications = () => {
        Notifications._notificationListener = firebase.notifications().onNotification(notification => {
            const now = new Date();
            const notif = {
                title: notification.title,
                date: now.getDate() + '/' + now.getMonth() + '-' + now.getFullYear(),
                time: now.getHours() + ':' + now.getMinutes(),
                content: notification.body
            };
            NotificationStorage.saveNotification(notif).then(() => {
                NotificationStorage.getNotifications().then(notifications => {
                    Notifications._listenerFunction(notifications);
                });
            });
        });
    };

    static setListenerFunction = (listenerFunction) => {
        Notifications._listenerFunction = listenerFunction;
    };

    static stopListenNotifications = () => {
        if (Notifications._notificationListener) {
            Notifications._notificationListener();
        }
    };
}
