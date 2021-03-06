import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Notifications from '../firebase/Notifications';

export default class SendNotifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }

    sendNotification = () => {
        Notifications.sendNotification(this.state.text);
    };

    onChangeText = (text) => {
        this.setState({
            text
        });
    };

    render() {
        const {text} = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.titleText}>
                        Send Notifikationer
                    </Text>
                </View>
                <View style={styles.notificationContainer}>
                    <TextInput style={styles.notificationTextInput}
                               value={text}
                               onChangeText={this.onChangeText}
                               multiline={true}/>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.sendNotification}>
                        <Image style={styles.sendImage}
                               source={require('../../images/save.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleBar: {
        backgroundColor: '#42ABFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 35,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    notificationContainer: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(70, 129, 32, 0.3)'
    },
    notificationTextInput: {
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        flex: 1
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendImage: {
        height: 50,
        width: 50
    }
});