import {ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ImageModal extends Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        image: PropTypes.string,
        onRequestClose: PropTypes.func.isRequired,
        onDonePressed: PropTypes.func.isRequired,
        edit: PropTypes.bool,
        overlay: PropTypes.string.isRequired,
        overlays: PropTypes.arrayOf(PropTypes.string)
    };

    constructor(props) {
        super(props);
        this.state = {
            tempOverlays: new Array(6)
        };
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    };

    onDonePressed = () => {
        const {tempOverlays} = this.state;
        this.props.onDonePressed(tempOverlays);
    };

    onClearPressed = () => {
        this.setState({
            tempOverlays: new Array(6).fill(' ')
        });
    };

    changeOverlayText = (index, text) => {
        const {tempOverlays} = this.state;
        tempOverlays[index] = text;
        this.setState({
            tempOverlays
        });
    };

    getOverlayText = (index, textStyle = styles.overlayText) => {
        const {edit, overlays} = this.props;
        const {tempOverlays} = this.state;

        if (edit) {
            let placeholderText = 'INDTAST';
            if (overlays && overlays.length > 0) {
                const overlayText = overlays[index];
                if (overlayText && overlayText.length > 0) {
                    placeholderText = overlayText;
                }
            }
            return (
                <TextInput
                    style={textStyle}
                    placeholder={placeholderText}
                    placeholderTextColor='#000000'
                    value={tempOverlays[index]}
                    onChangeText={(text) => this.changeOverlayText(index, text)}
                />
            );
        } else {
            if (overlays && overlays.length > index) {
                const overlayText = overlays[index];
                if (overlayText && overlayText.length > 5) {
                    return (
                        <Text style={textStyle}>
                            {overlayText.substr(0, 5) + '\n' + overlayText.substr(5, overlayText.length)}
                        </Text>
                    );
                } else {
                    return (
                        <Text style={textStyle}>
                            {overlayText}
                        </Text>
                    );
                }
            }
        }
    };

    buildOverlay1 = () => {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(0)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(1)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(2)}
                </View>
            </View>
        );
    };

    buildOverlay2 = () => {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.overlay2TopContainer}>
                    <View style={styles.overlay2TopRowContainer}>
                        <View style={styles.overlayTextContainer}>
                            {this.getOverlayText(0)}
                        </View>
                        <View style={styles.overlayTextContainer}>
                            {this.getOverlayText(1)}
                        </View>
                    </View>
                    <View style={styles.overlay2TopRowContainer}>
                        <View style={styles.overlayTextContainer}>
                            {this.getOverlayText(2)}
                        </View>
                        <View style={styles.overlayTextContainer}>
                            {this.getOverlayText(3)}
                        </View>
                    </View>
                </View>
                <View style={styles.overlay2BottomContainer}>
                    {this.getOverlayText(4)}
                    {this.getOverlayText(5)}
                </View>
            </View>
        );
    };

    buildOverlay3 = () => {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(0)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(1)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(2)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(3)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(4)}
                </View>
                <View style={styles.overlayTextContainer}>
                    {this.getOverlayText(5)}
                </View>
            </View>
        );
    };

    getOverlay = () => {
        const overlay = this.props.overlay;
        if (overlay === '1') {
            return this.buildOverlay1();
        } else if (overlay === '2') {
            return this.buildOverlay2();
        } else if (overlay === '3') {
            return this.buildOverlay3();
        }
    };

    render() {
        const {
            visible,
            image,
            edit
        } = this.props;

        const overlay = this.getOverlay();

        return (
            <Modal
                visible={visible}
                onRequestClose={this.onRequestClose}>
                {image &&
                <ImageBackground
                    style={styles.imageBackground}
                    source={{uri: image}}
                    resizeMode="contain">
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={this.onDonePressed}>
                        <Text style={styles.doneText}>DONE</Text>
                    </TouchableOpacity>
                    {overlay}
                    {edit &&
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={this.onClearPressed}>
                        <Text style={styles.doneText}>CLEAR</Text>
                    </TouchableOpacity>
                    }
                </ImageBackground>
                }
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1
    },
    doneButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        padding: 5,
        backgroundColor: 'transparent',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 4
    },
    clearButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        padding: 5,
        backgroundColor: 'transparent',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 4
    },
    doneText: {
        fontWeight: 'bold'
    },
    overlayContainer: {
        flex: 1,
        marginTop: 60,
        marginBottom: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlayTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay2TopContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    overlay2TopRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay2BottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    overlay3BottomTextContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlayText: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 4,
        padding: 5,
        color: '#000000',
        fontSize: 20,
        margin: 5
    },
    overlayLargeText: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 4,
        padding: 5,
        color: '#000000',
        fontSize: 30,
        margin: 5
    }
});