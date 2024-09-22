import React, { useState } from 'react';
import { Button } from '@/components/Button';

import styles from './AddRowView.module.css';

type AddRowViewProps = {
    addItem: (name: string) => void;
};
  
export function AddRowView(props: AddRowViewProps) {
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