import firebase from 'react-native-firebase';
import NotificationStorage from '../storage/Notifications';
import Config from 'react-native-config';

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
        firebase.messaging().subscribeToTopic(Config.FIREBASE_TOPIC);
        Notifications._notificationListener = firebase.notifications().onNotification(notification => {
            const now = new Date();
            const notif = {
                title: notification.title,
                date: ('0' + now.getDate()).slice(-2) + '/' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear(),
                time: ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2),
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
        firebase.messaging().unsubscribeFromTopic(Config.FIREBASE_TOPIC);
    };

    static sendNotification = (text) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'key=' + Config.FIREBASE_SERVER_KEY
        };

        const body = JSON.stringify({
                'to': '/topics/' + Config.FIREBASE_TOPIC,
                'notification': {
                    'body': text,
                    'title': 'Vacations',
                }
            }
        );

        return fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers,
            body
        });
    };
}
