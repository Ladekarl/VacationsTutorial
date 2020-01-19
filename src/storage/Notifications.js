import {AsyncStorage} from 'react-native';
import Config from 'react-native-config';

export default class Notifications {

    static _storageKey = Config.NOTIFICATIONS_STORAGE_KEY;

    static saveNotification = async (notification) => {
        let notifications = await Notifications.getNotifications();
        if (!notifications) {
            notifications = [];
        }
        notifications.push(notification);
        return await Notifications.saveNotifications(notifications);
    };

    static saveNotifications = async (notifications) => {
        return AsyncStorage.setItem(Notifications._storageKey, JSON.stringify(notifications));
    };

    static getNotifications = async () => {
        const notifications = await AsyncStorage.getItem(Notifications._storageKey);
        if (notifications) {
            return JSON.parse(notifications);
        }
    };
}