import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import Folders from '../storage/Folders';
import Icon from 'react-native-vector-icons/FontAwesome';
import Account from '../storage/Account';
import SortableFolderList from '../components/SortableFolderList';
import PropTypes from 'prop-types';

export default class FoldersList extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        tabIndex: PropTypes.number.isRequired,
        createFolderTitle: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            folders: [],
            loading: false
        };
    }

    willFocusListener;

    componentDidMount() {
        this.setState({
            loading: true
        });

        this.willFocusListener = this.props.navigation.addListener('willFocus', () => this.forceUpdate());

        Folders.getFolders(this.props.tabIndex).then(folders => {
            if (folders && folders.length > 0) {
                this.setState({
                    folders,
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

    componentWillUnmount() {
        if (this.willFocusListener) {
            this.willFocusListener.remove();
        }
    }

    onAddFolderPressed = () => {
        this.props.navigation.navigate('CreateFolder', {
            onGoBack: this.onGoBack,
            tabIndex: this.props.tabIndex,
            title: this.props.createFolderTitle
        });
    };

    onFolderPressed = (folder) => {
        const isSignedIn = Account.getSignedIn();
        if (isSignedIn) {
            this.props.navigation.navigate('CreateFolder', {
                title: folder.title,
                folder,
                onGoBack: this.onGoBack,
                tabIndex: this.props.tabIndex
            });
        } else {
            this.navigateFolderView(folder);
        }
    };

    navigateFolderView = (folder) => {
        this.props.navigation.navigate('FolderView', {
            folder,
            tabIndex: this.props.tabIndex,
            onBack: () => {
                this.forceUpdate();
            }
        });
    };

    onDeleteFolderPressed = (folder) => {
        this.setState({
            loading: true
        });
        Folders.deleteFolder(folder, this.props.tabIndex).then(folders => {
            this.setState({
                folders,
                loading: false
            });
        }, () => {
            this.setState({
                loading: false
            });
        });
    };

    onGoBack = (folder) => {
        const folders = this.state.folders;
        const index = folders.findIndex(f => f.id == folder.id);
        if (index > -1) {
            folders.splice(index, 1, folder);
        } else {
            folders.push(folder);
        }
        this.setState({
            folders: Folders.sortFolders(folders)
        });
    };

    onOrderUpdated = (folders) => {
        Folders.saveFolders(folders, this.props.tabIndex);
    };

    render() {
        const {folders, loading} = this.state;
        const isSignedIn = Account.getSignedIn();

        return (
            <View style={styles.container}>
                <SortableFolderList
                    folders={folders}
                    isParent={true}
                    canDelete={true}
                    onDeletePress={this.onDeleteFolderPressed}
                    onPress={this.onFolderPressed}
                    onFolderPress={this.navigateFolderView}
                    onOrderUpdated={this.onOrderUpdated}
                />
                {isSignedIn &&
                <TouchableOpacity
                    style={styles.addFolderButton}
                    onPress={this.onAddFolderPressed}
                >
                    <Icon name={'plus'} color='#e0e0e0' size={20}/>
                </TouchableOpacity>
                }
                {loading &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large'/>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    addFolderButton: {
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
    }
});