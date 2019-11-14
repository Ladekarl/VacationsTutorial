import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import Swipeout from 'react-native-swipeout';

export default class Folder extends Component {

    static propTypes = {
        folder: PropTypes.object.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        onFolderPress: PropTypes.func,
        isParent: PropTypes.bool.isRequired,
        onDeletePress: PropTypes.func.isRequired,
        canDelete: PropTypes.bool.isRequired,
        toggleRowActive: PropTypes.func,
        active: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            fontSizeTitle: 25,
            fontSizeAbout: 25
        }
    }

    calcFontSizeTitle = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const { folder } = this.props;
        const fontSize = this.calcFontSize(width, height, folder.title, 25, 20);
        this.setState({
            fontSizeTitle: fontSize
        });
    }

    calcFontSizeAbout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const { folder } = this.props;
        const fontSize = this.calcFontSize(width, height, folder.about, 25, 20);
        this.setState({
            fontSizeAbout: fontSize
        });
    }

    calcFontSize = (textWidth, textHeight, text, maximumFontSize, minimumFontSize) => {
        const fontSize = Math.sqrt(textWidth * textHeight / text.length);
        return fontSize > maximumFontSize ? maximumFontSize : fontSize < minimumFontSize ? minimumFontSize : fontSize;
    }

    onOuterPress = () => {
        this.props.onPress(this.props.folder);
    }

    onInnerPress = () => {
        this.props.onFolderPress(this.props.folder);
    }

    onDeleteFolderPress = () => {
        this.props.onDeletePress(this.props.folder);
    }

    renderFolder = () => {
        const {
            folder,
            isSignedIn,
            isParent,
            active,
            toggleRowActive
        } = this.props;

        const {
            fontSizeTitle,
            fontSizeAbout
        } = this.state;

        return (
            <TouchableOpacity
                style={[styles.container, active ? styles.activeStyle : null]}
                onLongPress={toggleRowActive}
                activeOpacity={0.7}
                onPress={this.onOuterPress}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'file://' + folder.icon }}
                    resizeMode='cover'
                    borderRadius={10} />
                <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <Text
                            onLayout={this.calcFontSizeTitle}
                            style={[styles.title, { fontSize: fontSizeTitle }]}
                            numberOfLines={1}>
                            {folder.title}
                        </Text>
                        {!!folder.about &&
                            <Text
                                onLayout={this.calcFontSizeAbout}
                                style={[styles.about, { fontSize: fontSizeAbout }]}
                                numberOfLines={1}>
                                {folder.about}
                            </Text>
                        }
                    </View>
                    {isSignedIn && isParent &&
                        <TouchableOpacity style={styles.folderButton} onPress={this.onInnerPress}>
                            <Image style={styles.folderImage} source={require('../../images/folder.png')} />
                        </TouchableOpacity>
                    }
                </View>
            </TouchableOpacity>
        )
    };

    render() {
        const {
            isSignedIn,
            canDelete
        } = this.props;

        if (isSignedIn && canDelete) {
            const swipeoutButtons = [
                {
                    text: 'DELETE',
                    type: 'delete',
                    onPress: this.onDeleteFolderPress
                }
            ];

            return (
                <Swipeout
                    backgroundColor='#ffffff'
                    right={swipeoutButtons}>
                    {this.renderFolder()}
                </Swipeout>
            )
        } else {
            return this.renderFolder();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    activeStyle: {
        backgroundColor: '#006727'
    },
    icon: {
        height: 50,
        width: 50,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 20,
        marginRight: 20
    },
    columnContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    title: {
        flex: 1,
        color: '#000000',
        textAlignVertical: 'center'
    },
    about: {
        flex: 1,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    folderButton: {
        marginRight: 15,
        alignSelf: 'center'
    },
    folderImage: {
        height: 30,
        width: 50
    }
});