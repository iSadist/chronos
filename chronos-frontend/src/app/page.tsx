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
import API from "@/api"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

import styles from "./page.module.css"

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

  const onRegister = (hours: number, date: Date, project: string) => {
    if (!hours || !date || !project) {
      return
    }

    setRegisteredEntries([...registeredEntries, { hours, date, project }])
  }

  const refreshClientList = useCallback(async () => {
    const api = new API()

    const response = await api.getClients()
    
    const items = response.map((item: string) => {
      return { name: item }
    })

    setItems(items)
  }, [])

  useEffect(() => {
    refreshClientList()
  }, [refreshClientList])

  const addItem = useCallback(async (name: string) => {
    const api = new API()
    const response = await api.createClient(name)

    if (response.error) {
      console.error(response.error)
      return
    }

    await refreshClientList()
  }, [refreshClientList])

  const deleteItem = useCallback(async (name: string) => {
    const api = new API()
    const response = await api.deleteClient(name)

    if (response.error) {
      console.error(response.error)
      return
    }

    await refreshClientList()
  }, [refreshClientList])

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

          {/* Render a RowItem for every item */}
          {items.map((item, index) => {
            return <RowItem key={index} item={item} delete={deleteItem} />
          })}

          <AddRowView addItem={addItem} />
        </section>

        <section className={styles.section}>
          <RegisterTimeView items={items} onRegister={onRegister} />
        </section>

        <section className={styles.section}>
          <TimeReportView registeredEntries={registeredEntries} />
        </section>
      </div>
    </main>
  )
}
