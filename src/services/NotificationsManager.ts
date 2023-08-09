import MagicBell from "magicbell";
import * as vscode from "vscode";

import {Store} from "../state";

const config = vscode.workspace.getConfiguration("CodeInbox");

export default class NotificationsManager {
    private store: Store;
    private magicBell: MagicBell;
    constructor(store: Store) {
        const githubUsername = config.get("githubUsername") as string;
        const magicBellApiKey = config.get("magicBellApiKey") as string;
        const magicBellApiUrl =
            config.get("magicBellApiUrl") || "https://api.magicbell.com";
        if (!githubUsername || !magicBellApiKey) {
            throw new Error(
                "Missing configuration for CodeInbox extension. Please set your GitHub username and MagicBell API key in the settings."
            );
        }
        this.store = store;
        this.magicBell = new MagicBell({
            apiKey: magicBellApiKey,
            userExternalId: githubUsername,
            host: magicBellApiUrl as string,
        });
    }
    public async init() {
        const {notifications} = await this.magicBell.notifications.list();
        this.store.getState().setNotifications(notifications as any);
        this.magicBell.listen().forEach(async (event) => {
            const newNotification = await this.magicBell.notifications.get(
                event.data.id
            );
            this.store.getState().addNotification(newNotification);
        });
    }
}
