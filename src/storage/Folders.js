import {AsyncStorage} from 'react-native';
import Config from 'react-native-config';

export default class Folders {

    static _storageKey = Config.FOLDER_STORAGE_KEY;

    static addFolder = async (folder, tabIndex) => {
        let folders = await Folders.getFolders(tabIndex);

        if (!folders) {
            folders = [];
        }

        folders.push(folder);

        return await Folders.saveFolders(folders, tabIndex);
    };

    static editFolder = async (editedFolder, tabIndex) => {
        const folders = await Folders.getFolders(tabIndex);

        if (!folders) {
            return;
        }

        var index = folders.findIndex((folder => folder.id === editedFolder.id));
        if (index > -1) {
            folders.splice(index, 1, editedFolder);
        }
        return await Folders.saveFolders(folders, tabIndex);
    };

    static deleteFolder = async (folderToDelete, tabIndex) => {
        const folders = await Folders.getFolders(tabIndex);

        if (!folders) {
            return;
        }

        var index = folders.findIndex((folder => folder.id === folderToDelete.id));
        if (index > -1) {
            folders.splice(index, 1);
        }

        await Folders.saveFolders(folders, tabIndex);

        return folders;
    };

    static saveFolders = async (folders, tabIndex) => {
        const sortedFolders = Folders.sortFolders(folders);
        return await Folders._saveItems(Folders._storageKey, tabIndex, sortedFolders);
    };

    static saveSubfolders = async (parentId, tabIndex, subfolders) => {
        const sortedSubfolders = Folders.sortFolders(subfolders);
        return await Folders._saveItems(Folders._storageKey + parentId, tabIndex, sortedSubfolders);
    };

    static _saveItems = async (key, tabIndex, items) => {
        try {
            return await AsyncStorage.setItem(key + tabIndex, JSON.stringify(items));
        } catch (error) {
            throw error;
        }
    };

    static getFolders = async (tabIndex) => {
        return await Folders._getItems(Folders._storageKey, tabIndex);
    };

    static _getItems = async (key, tabIndex) => {
        try {
            const folders = await AsyncStorage.getItem(key + tabIndex);
            if (folders) {
                return JSON.parse(folders);
            }
        } catch (error) {
            throw error;
        }
    };

    static addSubfolder = async (subfolder, tabIndex) => {
        let subfolders = await Folders.getSubfolders(subfolder.parent.id, tabIndex);

        if (!subfolders) {
            subfolders = [];
        }

        subfolders.push(subfolder);

        return await Folders.saveSubfolders(subfolder.parent.id, tabIndex, subfolders);
    };

    static editSubfolder = async (editedSubfolder, tabIndex) => {
        const subfolders = await Folders.getSubfolders(editedSubfolder.parent.id, tabIndex);

        if (!subfolders) {
            return;
        }

        const index = subfolders.findIndex(subfolder => subfolder.id === editedSubfolder.id);

        if (index > -1) {
            subfolders.splice(index, 1, editedSubfolder);
        }
        return await Folders.saveSubfolders(editedSubfolder.parent.id, tabIndex, subfolders);
    };

    static deleteSubfolder = async (parentId, tabIndex, subfolderToDelete) => {
        const subfolders = await Folders.getSubfolders(parentId, tabIndex);

        if (!subfolders) {
            return;
        }

        const index = subfolders.findIndex(subfolder => subfolder.id === subfolderToDelete.id);
        if (index > -1) {
            subfolders.splice(index, 1);
        }

        await Folders.saveSubfolders(parentId, tabIndex, subfolders);

        return subfolders;
    };

    static getSubfolders = async (parentId, tabIndex) => {
        return await Folders._getItems(Folders._storageKey + parentId, tabIndex);
    };

    static sortFolders = (folders) => {

        const alphaArr = folders.filter(folder => !folder.sortKey);
        const sortKeyArr = folders.filter(folder => folder.sortKey);

        alphaArr.sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        });

        sortKeyArr.sort((a, b) => {
            if (a.sortKey < b.sortKey) return -1;
            if (a.sortKey > b.sortKey) return 1;
            return 0;
        });

        const sortedArr = [...alphaArr];

        for (let i = 0; i < sortKeyArr.length; i++) {
            const sortKeyFolder = sortKeyArr[i];
            sortedArr.splice(sortKeyFolder.sortKey, 0, sortKeyFolder);
        }

        for (let i = 0; i < sortedArr.length; i++) {
            const sortedFolder = sortedArr[i];
            sortedFolder.sortKey = i;
        }

        return sortedArr;
    };
}