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
          {store.notifications.map((n) => {
            const date = new Date()
            const sent_at = n.sent_at ? new Date(+n.sent_at * 1000) : null
            return (
              <li key={n.id} className={styles.box}>
                <div className={styles.header}>{sent_at?.toLocaleString()}</div>
                <div>{n.title || "New notification"}</div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
