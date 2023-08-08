import NotificationsManager from "../services/NotificationsManager"
import {getStore} from "../state"

// See https://vscode-docs.readthedocs.io/en/stable/customization/keybindings/

export default function () {
    const store = getStore()
    store.subscribe(state => {
        // handle store subscriptions here
    })
    const notificationsManager = new NotificationsManager(store).init()
}