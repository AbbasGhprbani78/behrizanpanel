import React from 'react'
import styles from './ChatMessage.module.css'

export default function ChatMessage({ isSender }) {
    return (
        <div className={`${styles.chat_row} ${isSender ? styles.content_sender : styles.content_receiver}`}>
            <div className={`${styles.message_wrapper} ${!isSender && styles.time_receiver}`}>
                <div
                    className={`${styles.message_contnet} ${isSender ? styles.message_sender : styles.message_receiver}`}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio quidem vel incidunt aut ad aliquid impedit fugiat nulla quae placeat quas quis consequatur voluptate, quibusdam nobis totam! Deserunt, perspiciatis possimus?
                </div>
                <div className={styles.message_time}>
                    <span>6:15</span>
                </div>
            </div>
        </div>
    )
}
