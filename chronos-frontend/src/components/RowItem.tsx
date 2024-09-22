import React, { useState } from "react";
import { NeutralButton, DeleteButton } from "@/components/Button";
import styles from "./RowItem.module.css";

export type ItemData = {
    name: string;
}

type RowItemProps = {
    item: ItemData;
    delete: (name: string) => void;
};

export function RowItem(props: RowItemProps) {
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