import type {StoreApi} from "zustand/vanilla"
import {Client} from "magicbell"
import _getStore from "../ipc"

type Notification = Awaited<ReturnType<Client["notifications"]["get"]>>

export type State = {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
}

export type Store = StoreApi<State>

export const getStore = _getStore<State>((set) => ({
    addNotification: (notification: Notification) => set((state) => ({notifications: [...state.notifications, notification]})),
    setNotifications: (notifications: Notification[]) => set({notifications}),
    notifications: []
}))
