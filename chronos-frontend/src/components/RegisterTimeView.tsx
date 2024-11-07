import React, { useEffect, useState } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LoadingButton, NeutralButton } from "@/components/Button"
import { ItemData } from "@/components/RowItem"

import styles from "./RegisterTimeView.module.css"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

type RegisterTimeViewProps = {
  items: Array<ItemData>
  onRegister: (hours: number, date: Date, project: string) => Promise<void>
}

function RegisterTimeView({
  items,
  onRegister,
}: RegisterTimeViewProps) {
  const [hours, setHours] = useState(0)
  const [project, setProject] = useState('')
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(false)

  async function onSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    await onRegister(hours, date, project)
    setLoading(false)
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

  let theme = lightTheme

  if (typeof window !== "undefined") {
    // Get the browser prefers-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    theme = prefersDarkScheme.matches ? darkTheme : lightTheme
  }

  return (
    <ThemeProvider theme={theme}>
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
          <div className={styles.quickButtons}>
            <NeutralButton action={handleQuickSelection} text={'1'} />
            <NeutralButton action={handleQuickSelection} text={'2'} />
            <NeutralButton action={handleQuickSelection} text={'4'} />
            <NeutralButton action={handleQuickSelection} text={'8'} />
          </div>
        </div>
        <div className={styles.submit}>
          <LoadingButton loading={loading} text="Submit" action={() => {}} />
        </div>
      </form>
    </ThemeProvider>
  )
}

export default RegisterTimeView