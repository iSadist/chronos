import React, { useState } from "react"
import { RegisteredEntry } from "@/common-types"

import styles from "./TimeReport.module.css"

function getWeek(date: Date) {
  const onejan = new Date(date.getFullYear(), 0, 1)
  return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7)
}

function AllEntryReport({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
    return (
      <table className={styles.reportForm}>
        <thead className={styles.reportHeader}>
          <tr className={styles.reportRow}>
            <th className={styles.reportItem}>Project</th>
            <th className={styles.reportItem}>Date</th>
            <th className={styles.reportItem}>Hours</th>
          </tr>
        </thead>
        <tbody className={styles.reportBody}>
          {registeredEntries.map((entry, index) => {
            return (
              <tr key={index} className={styles.reportRow}>
                <td>{entry.project}</td>
                <td>{entry.date.toDateString()}</td>
                <td>{entry.hours}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}

function DailyReport({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
  // Bundle all the entries for the same day
  const dailyEntries = registeredEntries.reduce((acc, entry) => {
    const key = entry.date.toDateString()
    if (!acc[key]) {
      acc[key] = { date: entry.date, hours: 0 }
    }
    acc[key].hours += entry.hours
    return acc
  }
  , {} as { [key: string]: { date: Date, hours: number } })

  // Convert the object back to an array
  const dailyEntryArray = Object.values(dailyEntries)

  return (
    <table className={styles.reportForm}>
      <thead className={styles.reportHeader}>
        <tr className={styles.reportRow}>
          <th className={styles.reportItem}>Date</th>
          <th className={styles.reportItem}>Hours</th>
        </tr>
      </thead>
      <tbody className={styles.reportBody}>
        {dailyEntryArray.map((entry, index) => {
          return (
            <tr key={index} className={styles.reportRow}>
              <td>{entry.date.toDateString()}</td>
              <td>{entry.hours}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function WeeklyReport({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
  // Bundle all the entries for the same week
  const weeklyEntries = registeredEntries.reduce((acc, entry) => {
    const week = getWeek(entry.date)
    if (!acc[week]) {
      acc[week] = { date: entry.date, hours: 0 }
    }
    acc[week].hours += entry.hours
    return acc
  }, {} as { [key: number]: { date: Date, hours: number } })

  // Convert the object back to an array
  const weeklyEntryArray = Object.values(weeklyEntries)

  return (
    <table className={styles.reportForm}>
      <thead className={styles.reportHeader}>
        <tr className={styles.reportRow}>
          <th className={styles.reportItem}>Week</th>
          <th className={styles.reportItem}>Hours</th>
        </tr>
      </thead>
      <tbody className={styles.reportBody}>
        {weeklyEntryArray.map((entry, index) => {
          return (
            <tr key={index} className={styles.reportRow}>
              <td>{getWeek(entry.date)}</td>
              <td>{entry.hours}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MonthlyReport({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
  // Bundle all the entries for the same month and year
  const monthlyEntries = registeredEntries.reduce((acc, entry) => {
    const key = entry.date.getMonth() + '-' + entry.date.getFullYear()
    if (!acc[key]) {
      acc[key] = { date: entry.date, hours: 0 }
    }
    acc[key].hours += entry.hours
    return acc
  }
  , {} as { [key: string]: { date: Date, hours: number } })

  // Convert the object back to an array
  const monthlyEntryArray = Object.values(monthlyEntries)

  // Sort the array by date
  monthlyEntryArray.sort((a, b) => {
    if (a.date < b.date) {
      return -1
    }
    if (a.date > b.date) {
      return 1
    }
    return 0
  })

  function getMonthName(month: number) {
    const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ]
    return months[month]
  }

  return (
    <table className={styles.reportForm}>
      <thead className={styles.reportHeader}>
        <tr className={styles.reportRow}>
          <th className={styles.reportItem}>Month</th>
          <th className={styles.reportItem}>Hours</th>
        </tr>
      </thead>
      <tbody className={styles.reportBody}>
        {monthlyEntryArray.map((entry, index) => {
          return (
            <tr key={index} className={styles.reportRow}>
              <td>{`${getMonthName(entry.date.getMonth())} - ${entry.date.getFullYear()}`}</td>
              <td>{entry.hours}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function TimeReportView({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
  const [reportStyle, setReportStyle] = useState("raw")

  const handleReportStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReportStyle(event.target.value)
  }

  return (
    <>
      <div className={styles.header}>
        <h2>Time report</h2>
        <p>Report style = {reportStyle}</p>
        <select className={styles.select} value={reportStyle} onChange={handleReportStyleChange}>
          <option value="raw">All entries</option>
          <option value="daily">Day by day</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <p>Get a time report for a project</p>

      {reportStyle === "raw" && <AllEntryReport registeredEntries={registeredEntries} />}
      {reportStyle === "daily" && <DailyReport registeredEntries={registeredEntries} />}
      {reportStyle === "weekly" && <WeeklyReport registeredEntries={registeredEntries} />}
      {reportStyle === "monthly" && <MonthlyReport registeredEntries={registeredEntries} />}
    </>
  )
}