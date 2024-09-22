'use client';

import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, NeutralButton } from "@/components/Button";
import { RowItem, ItemData } from "@/components/RowItem";
import { AddRowView } from "@/components/AddRowView";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

import styles from "./page.module.css";

function RegisterTimeView({
  items,
  onRegister,
}: { items: Array<ItemData>, onRegister: (hours: number, date: Date, project: string) => void }) {
  const [hours, setHours] = useState(0);
  const [project, setProject] = useState('');
  const [date, setDate] = useState(new Date());

  function onSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Form submitted');
    onRegister(hours, date, project);
  }

  function handleQuickSelection (event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const newValue = parseInt(event.currentTarget.textContent || '0');
    console.log('Quick selection', newValue);

    // Set the hours to the value of the button
    setHours(newValue);
  }

  function onChange (event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(event.target.value);
    setHours(newValue)
  }

  function onSetDate (newDate: Date) {
    setDate(newDate);
  }

  function onSetProject (event: React.ChangeEvent<HTMLSelectElement>) {
    setProject(event.target.value);
  }

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    setProject(items[0]?.name);
  }, [items]);

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
  );
}

// TODO: Use AWS Cognito for authentication
// Implement a login page
// Implement a registration page

type RegisteredEntry = {
  hours: number;
  date: Date;
  project: string;
}

export default function Home() {
  const [items, setItems] = useState<Array<ItemData>>([]);
  const [registeredEntries, setRegisteredEntries] = useState<Array<RegisteredEntry>>([]);

  const onRegister = (hours: number, date: Date, project: string) => {
    if (!hours || !date || !project) {
      return;
    }

    setRegisteredEntries([...registeredEntries, { hours, date, project }]);
  }

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
            return <RowItem key={index} item={item} delete={(name) => {
              setItems(items.filter((item) => item.name !== name));
            }} />
          })}

          <AddRowView addItem={(name) => {
            setItems([...items, { name }]);
          }} />
        </section>

        <section className={styles.section}>
          <RegisterTimeView items={items} onRegister={onRegister} />
        </section>

        <section className={styles.section}>
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
        </section>
      </div>
    </main>
  );
}
