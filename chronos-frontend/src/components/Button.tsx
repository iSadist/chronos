import styles from "./Button.module.css"

type ButtonProps = {
    action: (event: React.MouseEvent<HTMLButtonElement>) => void;
    text?: string;
};

// A button with an action handler. It is a square button with a plus sign and rounded corners.
export function Button(props: ButtonProps) {
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.action(event)
    }

    return (
        <button className={styles.addButton} onClick={onClick}>
            {props.text || "+"}
        </button>
    )
}
  
// A neutral button with text.
export function NeutralButton(props: ButtonProps) {
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.action(event)
    }

    return (
        <>
            <button className={styles.neutralButton} onClick={onClick}>
                {props.text}
            </button>
        </>
    )
}

export function DeleteButton(props: ButtonProps) {
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.action(event)
    }

    return (
        <>
            <button className={styles.deleteButton} onClick={onClick}>
                {props.text || "-"}
            </button>
        </>
    )
}