'use client'

import React, { useCallback, useEffect, useState } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Button, NeutralButton } from "@/components/Button"
import { RowItem, ItemData } from "@/components/RowItem"
import { AddRowView } from "@/components/AddRowView"
import { TimeReportView } from "@/components/TimeReportView"
import { RegisteredEntry } from "@/common-types"
import Loader from "react-spinners/PulseLoader"
import API, { DailyReportEntry } from "@/api"

import styles from "./page.module.css"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function RegisterTimeView({
  items,
  onRegister,
}: { items: Array<ItemData>, onRegister: (hours: number, date: Date, project: string) => void }) {
  const [hours, setHours] = useState(0)
  const [project, setProject] = useState('')
  const [date, setDate] = useState(new Date())

  function onSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onRegister(hours, date, project)
  }

  function handleQuickSelection (event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    const newValue = parseInt(event.currentTarget.textContent || '0')

    // Set the hours to the value of the button
    setHours(newValue)
  }

  function onChange (event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(event.target.value)
    setHours(newValue)
  }

  function onSetDate (newDate: Date) {
    setDate(newDate)
  }

  function onSetProject (event: React.ChangeEvent<HTMLSelectElement>) {
    setProject(event.target.value)
  }

  useEffect(() => {
    if (items.length === 0) {
      return
    }

    setProject(items[0]?.name)
  }, [items])

  return (
    <ThemeProvider theme={darkTheme}>
      <h2>Register time</h2>
      <p>Register time on a project.</p>

      <form className={styles.registerForm} onSubmit={onSubmit}>
        <label>
          Project / Client
          <select className={styles.select} onChange={onSetProject}>
            {items.map((item, index) => {
              return <option key={index} value={item.name}>{item.name}</option>
            })}
          </select>
        </label>
        <div className={styles.inputRow}>
          {/* TODO: Hide this initially and just register time for today. Also expose a button to change date if needed. */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar views={['day']} onChange={onSetDate} />
          </LocalizationProvider>
        </div>
        <div className={styles.inputRow}>
          <label>
            Time spent
          </label>
          <input className={styles.field} type="number" onChange={onChange} value={hours} />
          <NeutralButton action={handleQuickSelection} text={'1'} />
          <NeutralButton action={handleQuickSelection} text={'2'} />
          <NeutralButton action={handleQuickSelection} text={'4'} />
          <NeutralButton action={handleQuickSelection} text={'8'} />
        </div>
        <Button text="Submit" action={() => {}} />
      </form>
    </ThemeProvider>
  )
}

// TODO: Use AWS Cognito for authentication
// Implement a login page
// Implement a registration page

export default function Home() {
  const [items, setItems] = useState<Array<ItemData>>([])
  const [registeredEntries, setRegisteredEntries] = useState<Array<RegisteredEntry>>([])
  const [loading, setLoading] = useState(true)

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

  const refreshTimeEntries = useCallback(async () => {
    const promises = items.map(async (item) => {
      const entries = await getEntriesForClient(item.name)
      return entries
    })

    const all = await Promise.all(promises)

    setRegisteredEntries(all.flat())
  }, [getEntriesForClient, items, setRegisteredEntries])

  const onRegisterTime = useCallback( async (hours: number, date: Date, project: string) => {
    if (!hours || !date || !project) {
      return
    }

    const api = new API()
    const response = await api.registerTime({ clientId: project, duration: hours, date: date.toISOString(), userId: 'Net' })

    await refreshTimeEntries()
  }, [refreshTimeEntries])

  const refreshClientList = useCallback(async () => {
    const api = new API()
    const response = await api.getClients()
    const items = response.map((item: string) => {
      return { name: item, isUpdating: false }
    })

    setItems(items)
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshClientList()
  }, [refreshClientList])

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
