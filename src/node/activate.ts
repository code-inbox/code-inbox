import {getNodeStore} from "vscode-scripts"
import NotificationsManager from "./services/NotificationsManager"
import type {State} from "../state"

/**
 * Any code defined in the default export function will be executed when the extension is activated.
 * The zustand store is accessible, as well as all the vscode apis.
 */

const [store] = getNodeStore<State>()

export default function () {
    store.subscribe(state => {
        // handle store subscriptions here
    })
    const notificationsManager = new NotificationsManager(store).init()
}