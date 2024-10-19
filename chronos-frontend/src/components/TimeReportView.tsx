import React, { useState } from "react"
import { RegisteredEntry } from "@/common-types"

import styles from "./TimeReport.module.css"

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
    return (
      <table className={styles.reportForm}>
        <thead className={styles.reportHeader}>
          <tr className={styles.reportRow}>
            <th className={styles.reportItem}>Date</th>
            <th className={styles.reportItem}>Hours</th>
          </tr>
        </thead>
        <tbody className={styles.reportBody}>
          {registeredEntries.map((entry, index) => {
            return (
              <tr key={index} className={styles.reportRow}>
                <td>{entry.date.toString()}</td>
                <td>{entry.hours}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}

function WeeklyReport({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
    return (
      <table className={styles.reportForm}>
        <thead className={styles.reportHeader}>
          <tr className={styles.reportRow}>
            <th className={styles.reportItem}>Week</th>
            <th className={styles.reportItem}>Hours</th>
          </tr>
        </thead>
        <tbody className={styles.reportBody}>
          {registeredEntries.map((entry, index) => {
            return (
              <tr key={index} className={styles.reportRow}>
                <td>{entry.date.toString()}</td>
                <td>{entry.hours}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}

function MonthlyReport({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
    return (
      <table className={styles.reportForm}>
        <thead className={styles.reportHeader}>
          <tr className={styles.reportRow}>
            <th className={styles.reportItem}>Month</th>
            <th className={styles.reportItem}>Hours</th>
          </tr>
        </thead>
        <tbody className={styles.reportBody}>
          {registeredEntries.map((entry, index) => {
            return (
              <tr key={index} className={styles.reportRow}>
                <td>{entry.date.toString()}</td>
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