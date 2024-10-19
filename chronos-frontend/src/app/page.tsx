'use client'

import React, { useCallback, useEffect, useState } from "react"
import { RowItem, ItemData } from "@/components/RowItem"
import { AddRowView } from "@/components/AddRowView"
import { TimeReportView } from "@/components/TimeReportView"
import { RegisteredEntry } from "@/common-types"
import RegisterTimeView from "@/components/RegisterTimeView"
import Loader from "react-spinners/PulseLoader"
import API, { DailyReportEntry } from "@/api"

import styles from "./page.module.css"

// TODO: Use AWS Cognito for authentication
// Implement a login page
// Implement a registration page

/**
 * Home component is the main entry point for the Chronos time tracking application.
 * It manages the state and interactions for clients and time entries.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Home />
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
 * @name Home
 */
export default function Home() {
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
      return { hours: entry.Duration, date: new Date(entry.Date), project: entry.ClientId }
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
    const response = await api.registerTime({ clientId: project, duration: hours, date: date.toISOString(), userId: 'Net' })

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

  useEffect(() => {
    refreshClientList()
  }, [refreshClientList])

  useEffect(() => {
    refreshTimeEntries()
  }, [refreshTimeEntries])

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Chronos</h1>
        <p>Chronos is a time tracking application.</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Clients</h2>
          <p>View and manage clients.</p>

          {/* Show a loading indicator while loading */}
          {loading && <Loader color={"white"} />}
          {!loading && items.length === 0 && <div>Add your first client by filling in the field below</div>}
          {!loading && items.length > 0 && (
            <>
              {items.map((item, index) => {
                return <RowItem key={index} item={item} delete={deleteItem} />
              })}
            </>
          )}
          {!loading && <AddRowView addItem={addItem} />}
        </section>

        <section className={styles.section}>
          <RegisterTimeView items={items} onRegister={onRegisterTime} />
        </section>

        <section className={styles.section}>
          <TimeReportView registeredEntries={registeredEntries} />
        </section>
      </div>
    </main>
  )
}
