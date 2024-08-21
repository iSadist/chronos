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

function DeleteButton(props: ButtonProps) {
  const onClick = () => {
    props.action();
  }

  return (
    <button className={styles.deleteButton} onClick={onClick}>
      -
    </button>
  );
}

type RowItemProps = {
  item: ItemData;
  delete: (name: string) => void;
};

function RowItem(props: RowItemProps) {
  const handleButtonAction = () => {
    props.delete(props.item.name);
  }

  return (
    <div className={styles.rowItem}>
      <p>{props.item.name}</p>
      <DeleteButton action={handleButtonAction} />
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

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Chronos</h1>
        <p>Chronos is a time tracking application.</p>
      </header>

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

      </section>


      <section className={styles.section}>
        <h2>Time report</h2>
        <p>Get a time report for a project</p>

      </section>
    </main>
  );
}
