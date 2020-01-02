import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Notifications from '../storage/Notifications';
import NotificationFirebase from '../firebase/Notifications';

export default class Notification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notifications: []
        };
    }

    componentDidMount() {
        Notifications.getNotifications().then(notifications => {
            this.notificationsUpdated(notifications);
        });
        NotificationFirebase.setListenerFunction(this.notificationsUpdated);
    }

    notificationsUpdated = (notifications) => {
        if (notifications) {
            this.setState({
                notifications: notifications.reverse()
            });
        }
    };

    renderNotifications = () => {
        return this.state.notifications.map((item, index) => (
            <View key={index} style={styles.notificationContainer}>
                <View style={styles.notificationTitleBar}>
                    <Text style={styles.notificationTitleTextLeft}>{item.title}</Text>
                    <Text style={styles.notificationTitleTextCenter}>{item.date}</Text>
                    <Text style={styles.notificationTitleTextRight}>{item.time}</Text>
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationContentText}>{item.content}</Text>
                </View>
            </View>
        ));
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.titleText}>
                        Notifikationer
                    </Text>
                </View>
                <ScrollView style={styles.notificationsList}>
                    {this.renderNotifications()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleBar: {
        backgroundColor: '#42abff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 35,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    notificationsList: {
        flex: 1
    },
    notificationContainer: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(70, 129, 32, 0.1)'
    },
    notificationTitleBar: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(70, 129, 32,0.2)'
    },
    notificationContent: {
        flex: 1,
        padding: 10,
    },
    notificationTitleTextLeft: {
        fontWeight: 'bold',
        color: '#457297',
        flex: 1,
        textAlign: 'left'
    },
    notificationTitleTextCenter: {
        fontWeight: 'bold',
        color: '#457297',
        flex: 1,
        textAlign: 'center'
    },
    notificationTitleTextRight: {
        fontWeight: 'bold',
        color: '#457297',
        flex: 1,
        textAlign: 'right'
    },
    notificationContentText: {
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    }
});