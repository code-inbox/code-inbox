import React from "react"
import { useStore } from "zustand"
import { getChromiumStore } from "../state"

import styles from "./box.module.css"
import globalStyles from "./global.module.css"

const [_store, vscode] = getChromiumStore()

export default function Box() {
  const store = useStore(_store)

  return (
    <div>
      <h1>CodeInbox</h1>
      <div>
        <ul
          style={{
            padding: "0.5rem",
          }}
          className={globalStyles.more}
        >
          {store.notifications.map((n) => (
            <li key={n.id} className={styles.box}>
              {n.title || "New notification"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
