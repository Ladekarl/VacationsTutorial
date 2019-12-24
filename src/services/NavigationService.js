import {DrawerActions, NavigationActions} from 'react-navigation';

export default class NavigationService {

    static _navigator;

    static setTopLevelNavigator(navigatorRef) {
        NavigationService._navigator = navigatorRef;
    }

    static navigate(routeName, params) {
        NavigationService._navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
    }

    static toggleDrawer() {
        NavigationService._navigator.dispatch(DrawerActions.openDrawer());
    }
}