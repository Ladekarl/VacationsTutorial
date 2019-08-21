import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';

export default class Folders {

    static _storageKey = Config.FOLDER_STORAGE_KEY;

    static addFolder = async (folder) => {
        let folders = await Folders.getFolders();

        if (!folders) {
            folders = [];
        }

        folders.push(folder);

        return await Folders.saveFolders(folders);
    }

    static editFolder = async (editedFolder) => {
        const folders = await Folders.getFolders();

        if (!folders) {
            return;
        }

        var index = folders.findIndex((folder => folder.id === editedFolder.id));
        if (index > -1) {
            folders.splice(index, 1, editedFolder);
        }
        return await Folders.saveFolders(folders);
    }

    static deleteFolder = async (folderToDelete) => {
        const folders = await Folders.getFolders();

        if (!folders) {
            return;
        }

        var index = folders.findIndex((folder => folder.id === folderToDelete.id));
        if (index > -1) {
            folders.splice(index, 1);
        }

        await Folders.saveFolders(folders);

        return folders;
    }

    static saveFolders = async (folders) => {
        const sortedFolders = Folders.sortFolders(folders);
        return await Folders._saveItems(Folders._storageKey, sortedFolders);
    }

    static saveSubfolders = async (parentId, subfolders) => {
        const sortedSubfolders = Folders.sortFolders(subfolders);
        return await Folders._saveItems(Folders._storageKey + parentId, sortedSubfolders);
    };

    static _saveItems = async (key, items) => {
        try {
            return await AsyncStorage.setItem(key, JSON.stringify(items));
        } catch (error) {
            throw error;
        }
    }

    static getFolders = async () => {
        return await Folders._getItems(Folders._storageKey);
    };

    static _getItems = async (key) => {
        try {
            const folders = await AsyncStorage.getItem(key);
            if (folders) {
                return JSON.parse(folders);
            }
        } catch (error) {
            throw error;
        }
    }

    static addSubfolder = async (subfolder) => {
        let subfolders = await Folders.getSubfolders(subfolder.parent.id);

        if (!subfolders) {
            subfolders = [];
        }

        subfolders.push(subfolder);

        return await Folders.saveSubfolders(subfolder.parent.id, subfolders);
    }

    static editSubfolder = async (editedSubfolder) => {
        const subfolders = await Folders.getSubfolders(editedSubfolder.parent.id);

        if (!subfolders) {
            return;
        }

        const index = subfolders.findIndex(subfolder => subfolder.id === editedSubfolder.id);

        if (index > -1) {
            subfolders.splice(index, 1, editedSubfolder);
        }
        return await Folders.saveSubfolders(editedSubfolder.parent.id, subfolders);
    }

    static deleteSubfolder = async (parentId, subfolderToDelete) => {
        const subfolders = await Folders.getSubfolders(parentId);

        if (!subfolders) {
            return;
        }

        const index = subfolders.findIndex(subfolder => subfolder.id === subfolderToDelete.id);
        if (index > -1) {
            subfolders.splice(index, 1);
        }

        await Folders.saveSubfolders(parentId, subfolders);

        return subfolders;
    }

    static getSubfolders = async (parentId) => {
        return await Folders._getItems(Folders._storageKey + parentId);
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

        return sortedArr;
    }
}