import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import SortableList from 'react-native-sortable-list';
import PropTypes from 'prop-types';
import Folder from '../components/Folder';
import Account from '../storage/Account';

export default class SortableFolderList extends Component {

    static propTypes = {
        folders: PropTypes.array.isRequired,
        isParent: PropTypes.bool.isRequired,
        canDelete: PropTypes.bool.isRequired,
        onDeletePress: PropTypes.func.isRequired,
        onPress: PropTypes.func.isRequired,
        onOrderUpdated: PropTypes.func.isRequired,
        onFolderPress: PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    prepareFolders = (folders) => {
        const preparedFolders = {};
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            preparedFolders[i] = folder;
        }

        return preparedFolders;
    }

    renderRow = ({ data, active }) => {
        const isSignedIn = Account.getSignedIn();
        const {
            onDeletePress,
            onPress,
            onFolderPress,
            isParent,
            canDelete
        } = this.props;
        return <Folder
            folder={data}
            isSignedIn={isSignedIn}
            active={active}
            isParent={isParent}
            canDelete={canDelete}
            onDeletePress={onDeletePress}
            onPress={onPress}
            onFolderPress={onFolderPress}
        />
    }

    sortedFolders = {};

    onReleaseRow = (key, nextOrder) => {
        for (let i = 0; i < nextOrder.length; i++) {
            const folderKey = nextOrder[i];
            if (folderKey === key && folderKey != i) {
                const folders = this.props.folders;
                const folderIndex = folders.findIndex((folder) => folder.id === this.sortedFolders[folderKey].id);
                if (folderIndex > -1) {
                    folders[folderIndex].sortKey = i;
                    this.props.onOrderUpdated(folders);
                }
                break;
            }
        }
    }

    render() {
        const { folders } = this.props;
        this.sortedFolders = this.prepareFolders(folders);

        if (Object.keys(this.sortedFolders).length > 0) {
            return (
                <SortableList
                    style={styles.container}
                    manuallyActivateRows={true}
                    data={this.sortedFolders}
                    onReleaseRow={this.onReleaseRow}
                    renderRow={this.renderRow}
                />)
        } else {
            return null;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});