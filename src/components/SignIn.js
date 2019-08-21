import React, { Component } from 'react';
import { StyleSheet, Modal, View, TouchableOpacity, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Config from 'react-native-config';

export default class SignIn extends Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onSignIn: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            password: ''
        }
    }

    password = Config.SIGN_IN_PASSWORD;

    onSignInPressed = () => {
        this.props.onSignIn(this.state.password === this.password);
        this.setState({
            password: ''
        });
    };

    onCancel = () => {
        this.props.onClose(false);
    };

    render() {
        const { visible } = this.props;
        const { password } = this.state;
        return (
            <Modal
                transparent={true}
                animationType='fade'
                visible={visible}
                onRequestClose={this.onCancel}
            >
                <View style={styles.signInContainer}>
                    <View style={styles.signInInnerContainer}>
                        <Text style={styles.signInTitle}>Enter Password</Text>
                        <TextInput
                            style={styles.passwordTextInput}
                            underlineColorAndroid='#459288'
                            selectionColor='#459288'
                            value={password}
                            password={true}
                            textContentType='password'
                            autoComplete='password'
                            autoFocus={true}
                            autoCapitalize='none'
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ password: text })}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.signInButton} onPress={this.onSignInPressed}>
                                <Text style={styles.signInText}>SIGN IN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={this.onCancel}>
                                <Text style={styles.signInText}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    signInContainer: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    signInInnerContainer: {
        width: '90%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        elevation: 8
    },
    signInButton: {
        backgroundColor: '#459288',
        margin: 10,
        padding: 10,
        borderRadius: 2,
        elevation: 2
    },
    cancelButton: {
        backgroundColor: '#C62828',
        margin: 10,
        padding: 10,
        borderRadius: 2,
        elevation: 2
    },
    signInText: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    passwordTextInput: {
        height: 50,
        width: '90%',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 20
    },
    signInTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000'
    },
    buttonContainer: {
        flexDirection: 'row'
    }
});