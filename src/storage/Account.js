export default class Account {
    static _isSignedIn = false;

    static getSignedIn = () => {
        return Account._isSignedIn;
    }

    static setSignedIn = (isSignedIn) => {
        Account._isSignedIn = isSignedIn
    }
}