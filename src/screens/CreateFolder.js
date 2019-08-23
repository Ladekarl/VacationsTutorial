import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator, Picker } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Folders from '../storage/Folders';
import uuid from 'react-native-uuid';

export default class CreateFolder extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: params.title ? params.title : 'Create New Folder',
            headerStyle: {
                backgroundColor: '#e0e0e0'
            },
            headerLeft:
                <TouchableOpacity
                    style={styles.headerLeftButton}
                    onPress={() => navigation.goBack(null)}>
                    <Image
                        style={styles.headerImage}
                        source={require('../../images/back.png')} />
                </TouchableOpacity>,
            headerRight:
                <TouchableOpacity
                    onPress={params.onCreateFolderPressed}
                    style={styles.headerRightButton}>
                    <Image
                        style={styles.headerImage}
                        source={require('../../images/save.png')} />
                </TouchableOpacity>
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            folder: {
                title: '',
                about: '',
                icon: null,
                overlay: '0'
            },
            tabIndex: null,
            cachedIcon: null,
            cachedImage: null,
            loading: false
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.setParams({
            onCreateFolderPressed: this.onCreateFolderPressed
        });
        if (navigation.state.params) {
            const { folder, tabIndex } = navigation.state.params;
            const stateToUpdate = {
                tabIndex
            };
            if (folder) {
                stateToUpdate.folder = folder;
            }
            this.setState(stateToUpdate);
        }
    }

    iconOptions = {
        title: 'Choose custom icon',
        takePhotoButtonTitle: null,
        storageOptions: {
            skipBackup: true,
            path: 'images'
        }
    }

    imageOptions = {
        title: 'Choose image',
        takePhotoButtonTitle: null,
        storageOptions: {
            skipBackup: true,
            path: 'images'
        }
    }

    onCreateFolderPressed = () => {
        const { folder, tabIndex } = this.state;

        if (!folder.title || !folder.icon) {
            return;
        }

        this.setState({
            loading: true
        });

        if (folder.id) {
            if (folder.parent) {
                Folders.editSubfolder(folder, tabIndex).then(this.onFolderUpdated);
            } else {
                Folders.editFolder(folder, tabIndex).then(this.onFolderUpdated);
            }
        } else {
            folder.id = uuid.v1();

            if (folder.parent) {
                Folders.addSubfolder(folder, tabIndex).then(this.onFolderUpdated);
            } else {
                Folders.addFolder(folder, tabIndex).then(this.onFolderUpdated);
            }
        }
    }

    onFolderUpdated = () => {
        const folder = this.state.folder;
        const navigation = this.props.navigation;
        this.setState({
            loading: false
        });
        if (navigation.state.params && navigation.state.params.onGoBack) {
            navigation.state.params.onGoBack(folder);
        }
        navigation.goBack();
    }

    onAddIconPressed = () => {
        const { navigation } = this.props;
        const { params = {} } = navigation.state;
        ImagePicker.showImagePicker(this.iconOptions, (response) => {
            if (!response.didCancel && !response.error) {
                const icon = response.path;
                this.setState({
                    folder: {
                        ...this.state.folder,
                        parent: params.parent,
                        icon,
                    },
                    cachedIcon: response.uri
                });
            }
        });
    };

    onAddImagePressed = () => {
        const { navigation } = this.props;
        const { params = {} } = navigation.state;
        ImagePicker.showImagePicker(this.imageOptions, (response) => {
            if (!response.didCancel && !response.error) {
                const image = response.path;
                this.setState({
                    folder: {
                        ...this.state.folder,
                        image,
                        parent: params.parent
                    },
                    cachedImage: response.uri
                });
            }
        });
    };

    render() {
        const { folder, cachedIcon, cachedImage, loading, tabIndex } = this.state;
        const { navigation } = this.props;
        const { params = {} } = navigation.state;

        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.titleText}>Title:</Text>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid='#459288'
                        selectionColor='#459288'
                        placeholder='input title'
                        value={folder.title}
                        onChangeText={text => this.setState({ folder: { ...this.state.folder, title: text } })}
                    />
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.titleText}>About:</Text>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid='#459288'
                        selectionColor='#459288'
                        placeholder='input description'
                        value={folder.about}
                        onChangeText={text => this.setState({ folder: { ...this.state.folder, about: text } })}
                    />
                </View>
                {tabIndex === 1 &&
                    <View style={styles.rowContainer}>
                        <Text style={styles.titleText}>Overlay:</Text>
                        <Picker
                            style={styles.textInput}
                            selectedValue={folder.overlay}
                            onValueChange={value => this.setState({ folder: { ...this.state.folder, overlay: value } })}
                        >
                            <Picker.Item label="None" value="0" />
                            <Picker.Item label="Overlay 1" value="1" />
                            <Picker.Item label="Overlay 2" value="2" />
                            <Picker.Item label="Overlay 3" value="3" />
                        </Picker>
                    </View>
                }
                <TouchableOpacity
                    style={styles.addIconButton}
                    disabled={loading}
                    onPress={this.onAddIconPressed}
                >
                    <Text style={styles.addIconText}>ADD CUSTOM ICON</Text>
                </TouchableOpacity>
                {cachedIcon &&
                    <Image
                        style={styles.previewIcon}
                        resizeMode="contain"
                        borderRadius={10}
                        source={{ uri: cachedIcon }}
                    />
                }
                {!cachedIcon && folder.icon &&
                    <Image
                        style={styles.previewIcon}
                        resizeMode="contain"
                        borderRadius={10}
                        source={{ uri: 'file://' + folder.icon }}
                    />
                }
                {params.parent &&
                    <TouchableOpacity
                        style={styles.addIconButton}
                        disabled={loading}
                        onPress={this.onAddImagePressed}
                    >
                        <Text style={styles.addIconText}>ADD IMAGE</Text>
                    </TouchableOpacity>
                }
                {params.parent && cachedImage &&
                    <Image
                        style={styles.previewIcon}
                        resizeMode="contain"
                        borderRadius={10}
                        source={{ uri: cachedImage }}
                    />
                }
                {params.parent && !cachedImage && folder.image &&
                    <Image
                        style={styles.previewIcon}
                        resizeMode="contain"
                        borderRadius={10}
                        source={{ uri: 'file://' + folder.image }}
                    />
                }
                {loading &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 15
    },
    headerLeftButton: {
        marginLeft: 15,
        marginRight: 10
    },
    headerImage: {
        height: 40,
        width: 40
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    rowContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'space-between'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        width: 75,
        textAlign: 'right',
        marginRight: 10
    },
    textInput: {
        flex: 1,
        fontSize: 20
    },
    addIconButton: {
        backgroundColor: '#459288',
        margin: 10,
        padding: 10,
        borderRadius: 2,
        elevation: 2
    },
    addIconText: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    previewIcon: {
        flex: 1,
        alignSelf: 'stretch',
        marginLeft: 60,
        marginRight: 60
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});