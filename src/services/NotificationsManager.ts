import * as vscode from "vscode";
import fetch from "node-fetch";

import {Store} from "../state";

const config = vscode.workspace.getConfiguration("CodeInbox");

export default class NotificationsManager {
    private githubUsername: string;
    private magicBellApiKey: string;
    private magicBellApiUrl: string;
    private store: Store;
    constructor(store: Store) {
        this.githubUsername = config.get("githubUsername") as string;
        this.magicBellApiKey = config.get("magicBellApiKey") as string;
        this.magicBellApiUrl =
            config.get("magicBellApiUrl") || "https://api.magicbell.com";
        if (!this.githubUsername || !this.magicBellApiKey) {
            throw new Error(
                "Missing configuration for CodeInbox extension. Please set your GitHub username and MagicBell API key in the settings."
            );
        }
        this.store = store;
    }

    private async fetchNotifications() {
        return fetch(
            `${this.magicBellApiUrl}/notifications`,
            {
                headers: {
                    'X-MAGICBELL-API-KEY': this.magicBellApiKey,
                    'X-MAGICBELL-USER-EXTERNAL-ID': this.githubUsername,
                },
            }
        ).then((res) => res.json()).then(res => res.notifications)
    }

    public async init() {
        const notifications = await this.fetchNotifications();
        this.store.getState().setNotifications(notifications as any);
    }
}
