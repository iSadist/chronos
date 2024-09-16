'use client';

import React, { useState } from "react";
import styles from "./page.module.css";

type ButtonProps = {
  action: () => void;
  text?: string;
};

type ItemData = {
  name: string;
}

// A button with an action handler. It is a square button with a plus sign and rounded corners.
function Button(props: ButtonProps) {
  const onClick = () => {
    props.action();
  }

  return (
    <button className={styles.addButton} onClick={onClick}>
      {props.text || "+"}
    </button>
  );
}

// A neutral button with text.
function NeutralButton(props: ButtonProps) {
  const onClick = () => {
    props.action();
  }

  return (
    <>
      <button className={styles.neutralButton} onClick={onClick}>
        {props.text}
      </button>
    </>
  );
}

function DeleteButton(props: ButtonProps) {
  const onClick = () => {
    props.action();
  }

  return (
    <>
      <button className={styles.deleteButton} onClick={onClick}>
        {props.text || "-"}
      </button>
    </>
  );
}

type RowItemProps = {
  item: ItemData;
  delete: (name: string) => void;
};

function RowItem(props: RowItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleButtonAction = () => {
    setConfirmDelete(true);
  }

  const handleDelete = () => {
    props.delete(props.item.name);
  }

  const cancelDelete = () => {
    setConfirmDelete(false);
  }

  return (
    <div className={styles.rowItem}>
      <p className={styles.paragraph}>{props.item.name}</p>
      {confirmDelete && <DeleteButton text="Confirm delete" action={handleDelete} />}
      {confirmDelete && <NeutralButton text="x" action={cancelDelete} />}
      {!confirmDelete && <DeleteButton action={handleButtonAction} />}
    </div>
  );
}

type AddRowViewProps = {
  addItem: (name: string) => void;
};

function AddRowView(props: AddRowViewProps) {
  const [name, setName] = useState('');

  const handleButtonAction = () => {
    if (name === '') {
      return;
    }

    props.addItem(name);
    setName('');
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleButtonAction();
    }
  }

  return (
    <div className={styles.rowItem}>
      <h3>Add new client</h3>
      <input
        className={styles.field}
        type="text"
        value={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <Button action={handleButtonAction} />
    </div>
  );
}

function RegisterTimeView({
  items,
}: { items: Array<ItemData> }) {
  const [hours, setHours] = useState(0);

  function onSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Form submitted');
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

  return (
    <>
      <h2>Register time</h2>
      <p>Register time on a project.</p>

      <form className={styles.registerForm} onSubmit={onSubmit}>
        <label>
          Project / Client
          <select className={styles.select}>
            {items.map((item, index) => {
              return <option key={index} value={item.name}>{item.name}</option>
            })}
          </select>
        </label>
        <div className={styles.inputRow}>
          <label>
            Time spent
          </label>
          <input className={styles.field} type="number" onChange={onChange} value={hours} />
          <button className={styles.neutralButton} onClick={handleQuickSelection} >1</button>
          <button className={styles.neutralButton} onClick={handleQuickSelection}>2</button>
          <button className={styles.neutralButton} onClick={handleQuickSelection}>4</button>
          <button className={styles.neutralButton} onClick={handleQuickSelection}>8</button>
        </div>
        <div className={styles.inputRow}>
          <label>
            Date
          </label>
          <input className={styles.field} type="date" />
        </div>
        <Button text="Submit" action={() => {}} />
      </form>
    </>
  );
}

// TODO: Use AWS Cognito for authentication
// Implement a login page
// Implement a registration page

export default function Home() {
  const [items, setItems] = useState<Array<ItemData>>([]);

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
          <RegisterTimeView items={items} />
        </section>

        <section className={styles.section}>
          <h2>Time report</h2>
          <p>Get a time report for a project</p>
        </section>
      </div>
    </main>
  );
}
