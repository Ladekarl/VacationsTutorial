import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import NavigationService from '../services/NavigationService';

export default class DrawerButton extends Component {

    onDrawerButtonPressed = () => {
        NavigationService.toggleDrawer();
    };

    render() {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={this.onDrawerButtonPressed}>
                <Image
                    style={styles.image}
                    source={require('../../images/drawer_button.png')}
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
    },
    image: {
        height: undefined,
        width: undefined,
        flex: 1
    }
});