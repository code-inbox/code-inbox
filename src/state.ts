import type {StoreApi} from "zustand/vanilla"
import {Client} from "magicbell"
import _getStore, {useVscode} from "../ipc"
import * as vscode from "vscode"

type Notification = Awaited<ReturnType<Client["notifications"]["get"]>>

export type State = {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
}

export type Store = StoreApi<State>

const getStore = _getStore<State>((set) => ({
    addNotification: (notification: Notification) => set((state) => ({notifications: [notification, ...state.notifications]})),
    setNotifications: (notifications: Notification[]) => set({notifications}),
    notifications: []
}))

/**
 * Gets a Zustand store for the current Chromium process
 * @returns A Zustand store, and a function to send a command to the Node process
 */
export const getChromiumStore = () => {
    if (typeof window === "undefined") {
        throw new Error("Cannot get chromium store from node process")
    }
    return [getStore(), useVscode()] as const
}

/**
 * Gets a Zustand store for the current Node process, creating it if necessary
 * @returns A Zustand store, and a function to register a new connection to a webview
 */
export const getNodeStore = () => {
    if (typeof window !== "undefined") {
        throw new Error("Cannot get node store from chromium process")
    }
    return [getStore(), (connection: vscode.Webview) => getStore(connection)] as const
}   