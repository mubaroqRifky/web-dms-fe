import User from "./UserController";

export default class Authorization {
    _key = null;

    getDataUser(key) {
        const user = User.get() || {};
        return user && user[key] ? user[key] : [];
    }

    checkAbilityIfExist(valueInArray = []) {
        const currData = this.getDataUser(this._key);
        for (const val of valueInArray) {
            if (currData.includes(val)) return true;
        }
        return false;
    }

    ability(valueInArray = []) {
        if (User.isAdmin) return true;
        return this.checkAbilityIfExist(valueInArray);
    }
}
