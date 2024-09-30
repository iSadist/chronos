import React from "react";
import styles from "@/app/page.module.css";
import { RegisteredEntry } from "@/common-types";

export function TimeReportView({ registeredEntries }: { registeredEntries: Array<RegisteredEntry> }) {
    return (
      <>
      <h2>Time report</h2>
      <p>Get a time report for a project</p>
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
                <td>{entry.date.toString()}</td>
                <td>{entry.hours}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </>
    );
}