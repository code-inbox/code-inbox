import type {StateCreator, StoreApi} from "zustand/vanilla"
import {Client} from "magicbell"

/**
 * This is where we define the state of our extension.
 * vscode-scripts will look for this module and automatically generate the store and the hooks for us, and ensure that state is synced across all views / processes.
 */

type Notification = Awaited<ReturnType<Client["notifications"]["get"]>>

export type State = {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
}

export type Store = StoreApi<State>

const stateCreator: StateCreator<State, [], []> = (set) => ({
    addNotification: (notification: Notification) => set((state) => ({notifications: [notification, ...state.notifications]})),
    setNotifications: (notifications: Notification[]) => set({notifications}),
    notifications: []
})

export default stateCreator