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

  return (
    <div className={styles.rowItem}>
      <h3>Add new client</h3>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button action={handleButtonAction} />
    </div>
  );
}

// TODO: Use AWS Cognito for authentication
// Implement a login page
// Implement a registration page

export default function Home() {
  const [items, setItems] = useState<Array<ItemData>>([]);

  function onSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Form submitted');
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
          <h2>Register time</h2>
          <p>Register time on a project.</p>

          <form className={styles.registerForm} onSubmit={onSubmit}>
            <label>
              Project / Client
              <select>
                {items.map((item, index) => {
                  return <option key={index} value={item.name}>{item.name}</option>
                })}
              </select>
            </label>
            <label>
              Time spent
              <input type="number" />
            </label>
            <label>
              Date
              <input type="date" />
            </label>
            <Button text="Submit" action={() => {}} />
          </form>
        </section>

        <section className={styles.section}>
          <h2>Time report</h2>
          <p>Get a time report for a project</p>
        </section>
      </div>
    </main>
  );
}
