import NotificationsManager from "../services/NotificationsManager"
import {getNodeStore} from "../state"

// See https://vscode-docs.readthedocs.io/en/stable/customization/keybindings/

const [store] = getNodeStore()

export default function () {
    store.subscribe(state => {
        // handle store subscriptions here
    })
    const notificationsManager = new NotificationsManager(store).init()
}