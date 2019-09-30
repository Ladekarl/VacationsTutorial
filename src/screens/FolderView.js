import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Account from '../storage/Account';
import Icon from 'react-native-vector-icons/FontAwesome';
import Folders from '../storage/Folders';
import Orientation from 'react-native-orientation';
import SortableFolderList from '../components/SortableFolderList';
import ImageModal from '../components/ImageModal';

export default class FolderView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            subfolders: [],
            loading: false,
            imageModalVisible: false,
            folder: null
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {params = {}} = navigation.state;

        this.setState({
            loading: true
        });

        if (params.folder) {
            Folders.getSubfolders(params.folder.id, params.tabIndex).then(subfolders => {
                if (subfolders && subfolders.length > 0) {
                    this.setState({
                        subfolders,
                        loading: false
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                }
            }, () => {
                this.setState({
                    loading: false
                });
            });
        }
    }

    onAddSubfolderPressed = () => {
        const {navigation} = this.props;
        const {params = {}} = navigation.state;
        this.props.navigation.navigate('CreateFolder', {
            title: 'Create New Subfolder',
            parent: params.folder,
            tabIndex: params.tabIndex,
            onGoBack: this.onGoBack
        });
    };

    onGoBack = (subfolder) => {
        const subfolders = this.state.subfolders;
        const index = subfolders.findIndex(f => f.id == subfolder.id);
        if (index > -1) {
            subfolders.splice(index, 1, subfolder);
        } else {
            subfolders.push(subfolder);
        }
        this.setState({
            subfolders: Folders.sortFolders(subfolders)
        });
    };

    onFolderPressed = (folder) => {
        const isSignedIn = Account.getSignedIn();
        const {navigation} = this.props;
        const {params = {}} = navigation.state;
        if (isSignedIn) {
            this.props.navigation.navigate('CreateFolder', {
                title: folder.title,
                folder,
                parent: params.folder,
                tabIndex: params.tabIndex,
                onGoBack: this.onGoBack
            });
        } else {
            this.openImageModal(folder);
        }
    };

    onDeleteFolderPressed = (folder) => {
        const {navigation} = this.props;
        const {params = {}} = navigation.state;
        this.setState({
            loading: true
        });
        Folders.deleteSubfolder(params.folder.id, params.tabIndex, folder).then(subfolders => {
            this.setState({
                subfolders,
                loading: false
            });
        }, () => {
            this.setState({
                loading: false
            });
        });
    };

    openImageModal = (folder) => {
        Orientation.lockToPortrait();
        this.setState({
            imageModalVisible: true,
            folder
        });
    };

    closeImageModal = () => {
        Orientation.unlockAllOrientations();
        this.setState({
            imageModalVisible: false
        });
    };

    onOrderUpdated = (folders) => {
        const {navigation} = this.props;
        const {params = {}} = navigation.state;
        Folders.saveSubfolders(params.folder.id, params.tabIndex, folders);
    };

    render() {
        const {loading, subfolders, imageModalVisible, folder} = this.state;
        const {navigation} = this.props;
        const {params = {}} = navigation.state;

        const isSignedIn = Account.getSignedIn();

        return (
            <View style={styles.container}>
                <Text style={styles.foldersText}>{params.folder.title}</Text>
                <SortableFolderList
                    folders={subfolders}
                    isParent={false}
                    onPress={this.onFolderPressed}
                    canDelete={true}
                    onOrderUpdated={this.onOrderUpdated}
                    onDeletePress={this.onDeleteFolderPressed}
                />
                {isSignedIn &&
                <TouchableOpacity
                    style={styles.addSubfolderButton}
                    onPress={this.onAddSubfolderPressed}>
                    <Icon name={'plus'} color='#e0e0e0' size={20}/>
                </TouchableOpacity>
                }
                {loading &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large'/>
                </View>
                }
                {folder &&
                <ImageModal
                    visible={imageModalVisible}
                    image={'file://' + folder.image}
                    overlay={folder.overlay}
                    overlays={folder.overlays}
                    onDonePressed={this.closeImageModal}
                    onRequestClose={this.closeImageModal}/>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    foldersText: {
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 15
    },
    addSubfolderButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        backgroundColor: '#459288',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 23,
        paddingBottom: 23,
        borderRadius: 200,
        elevation: 8
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
});