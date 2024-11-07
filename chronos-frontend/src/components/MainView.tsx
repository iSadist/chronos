'use client'

import React, { useCallback, useEffect, useState } from "react"
import { ItemData } from "@/components/RowItem"
import { TimeReportView } from "@/components/TimeReportView"
import { RegisteredEntry } from "@/common-types"
import ClientListView from "@/components/ClientListView"
import RegisterTimeView from "@/components/RegisterTimeView"
import API, { DailyReportEntry } from "@/api"

import styles from "../app/page.module.css"

/**
 * MainView component is the main entry point for the Chronos time tracking application.
 * It manages the state and interactions for clients and time entries.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <MainView />
 *
 * @remarks
 * This component uses several hooks to manage state and side effects:
 * - `useState` to manage the state of items, registered entries, and loading status.
 * - `useCallback` to memoize functions that perform API calls and state updates.
 * - `useEffect` to trigger the initial loading of the client list.
 *
 * The component includes the following main functionalities:
 * - Fetching and displaying a list of clients.
 * - Registering time entries for clients.
 * - Adding and deleting clients.
 *
 * @function
 * @name MainView
 */
export default function MainView() {
  const [items, setItems] = useState<Array<ItemData>>([])
  const [registeredEntries, setRegisteredEntries] = useState<Array<RegisteredEntry>>([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch the time entries for a client
   * @param clientId The ID of the client to fetch time entries for
   * @returns An array of time entries for the client
   * */
  const getEntriesForClient = useCallback(async (clientId: string) => {
    const api = new API()
    const response = await api.getTimeEntries({ clientId: clientId, from: '2021-01-01', to: '2024-12-31', mode: 'daily' })

    if (!Array.isArray(response.data)) {
      return []
    }

    return response.data.map((entry: DailyReportEntry) => {
      return {
        hours: entry.Duration,
        date: new Date(entry.Date),
        project: entry.ClientId,
        entryId: entry.EntryId
      }
    })
  }, [])

  /**
   * Refresh the list of time entries for all clients
   * @returns void
   * */
  const refreshTimeEntries = useCallback(async () => {
    const promises = items.map(async (item) => {
      const entries = await getEntriesForClient(item.name)
      return entries
    })

    const all = await Promise.all(promises)

    setRegisteredEntries(all.flat())
  }, [getEntriesForClient, items, setRegisteredEntries])

  /**
   * Register time for a client
   * @param hours The number of hours to register
   * @param date The date to register the hours for
   * @param project The name of the client to register the hours for
   * @returns void
   * */
  const onRegisterTime = useCallback( async (hours: number, date: Date, project: string) => {
    if (!hours || !date || !project) {
      return
    }

    const api = new API()
    const response = await api.registerTime({ clientId: project, duration: hours, date: date.toISOString() })

    await refreshTimeEntries()
  }, [refreshTimeEntries])

  /**
   * Refresh the list of clients
   * @returns void
   * */
  const refreshClientList = useCallback(async () => {
    const api = new API()
    const response = await api.getClients()
    const items = response.map((item: string) => {
      return { name: item, isUpdating: false }
    })

    setItems(items)
    setLoading(false)
  }, [])

  /**
   * Add a new client to the list
   * @param name The name of the client to add
   * @returns void
   * */
  const addItem = useCallback(async (name: string) => {
    const api = new API()
    setItems([...items, { name, isUpdating: true }])
    const response = await api.createClient(name)

    if (response.error) {
      console.error(response.error)
      return
    }

    await refreshClientList()
  }, [refreshClientList, setItems, items])

  /**
   * Delete a client from the list
   * @param name The name of the client to delete
   * @returns void
   * */
  const deleteItem = useCallback(async (name: string) => {
    const api = new API()
    const deletedItem = items.find((item) => item.name === name)

    if (deletedItem) {
      deletedItem.isUpdating = true
      setItems([...items])
    }

    const response = await api.deleteClient(name)

    if (response.error) {
      console.error(response.error)
      return
    }

    await refreshClientList()
  }, [refreshClientList, items])

  const deleteEntry = useCallback(async (entryId: string) => {
    const api = new API()
    const response = await api.deleteTimeEntry(entryId)

    if (response.error) {
      console.error(response.error)
      return
    }

    await refreshTimeEntries()
  }, [refreshTimeEntries])

  /**
   * Logout the user by removing the access token and user ID from local storage
   * @returns void
   */
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userId")

    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }, [])

  useEffect(() => {
    refreshClientList()
  }, [refreshClientList])

  useEffect(() => {
    refreshTimeEntries()
  }, [refreshTimeEntries])

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.row}>
          <h1>Chronos</h1>
          <button className={styles.logout} onClick={logout}>Logout</button>
        </div>
        <p>Chronos is a time tracking application.</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <ClientListView addItem={addItem} deleteItem={deleteItem} items={items} loading={loading} />
        </section>

        <section className={styles.section}>
          <RegisterTimeView items={items} onRegister={onRegisterTime} />
        </section>

        <section className={styles.section}>
          <TimeReportView registeredEntries={registeredEntries} onDelete={deleteEntry} />
        </section>
      </div>
    </main>
  )
}
