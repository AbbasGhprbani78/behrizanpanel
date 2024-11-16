import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ label, value, onChange, name, type, icon: Icon, handleToggle, style, disable }, ref) => {
    return (
        <div className={`${styles.inputwrapper}  ${style && styles.style} ${disable && styles.disableInput}`}>
            <label className={styles.lableinput}>{label}</label>
            <input
                name={name}
                type={type}
                className={styles.input}
                autoComplete='off'
                value={value}
                onChange={onChange}
                ref={ref}
                disabled={disable}
            />
            {handleToggle ? (
                Icon && <Icon className={styles.icon} onClick={handleToggle} />
            ) : (
                Icon && <Icon className={styles.icon} />
            )}
        </div>
    );
});

export default Input;
