import {UserData} from "./UserData";

static let userDataSupplier: () => UserData = () => {

};

/**
 * If the session is not yet mapped to an individual, perform login
 * After the login is done, execute the action runnable
 */
export function userRequiredAction(action: () => void): void {



}
