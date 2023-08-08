import type {StoreApi} from "zustand/vanilla"
import _getStore from "../ipc"

export type State = {
    notifications: unknown[];
    setNotifications: (notifications: unknown[]) => void;
    addNotification: (notification: unknown) => void;
}

export type Store = StoreApi<State>

export const getStore = _getStore<State>((set) => ({
    addNotification: (notification: unknown) => set((state) => ({notifications: [...state.notifications, notification]})),
    setNotifications: (notifications: unknown[]) => set({notifications}),
    notifications: []
}))
