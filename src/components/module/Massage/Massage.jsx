import styles from './Massage.module.css';
import { BsFillFileEarmarkArrowDownFill } from 'react-icons/bs';

export default function Massage({ tikectmsg }) {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className={`${tikectmsg?.is_admin ? styles.message_wrapper_snder : styles.message_wrapper_receiver}`}>
            {tikectmsg?.message && (
                <div className={`${styles.message_content} mb-4`}>
                    <div className={`${tikectmsg?.is_admin ? styles.MassageBoxSend : styles.MassageBoxReceive}`}>
                        <span>
                            {tikectmsg?.message}
                        </span>
                    </div>
                    <span className={`${tikectmsg?.is_admin ? styles.date_message_snder : styles.date_message_receiver}`}>
                        {formatTime(tikectmsg?.date)}
                    </span>
                </div>
            )}
            {tikectmsg?.file && (
                <div className={`${styles.message_content} ${tikectmsg?.is_admin ? styles.file_sender : ''} mb-4`}>
                    <a
                        className='place'
                        href={tikectmsg?.file.startsWith('blob:') ? tikectmsg?.file : `${tikectmsg?.file}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        download
                    >
                        <BsFillFileEarmarkArrowDownFill className={`${tikectmsg?.is_admin ? styles.fileIcon : styles.fileIcon_receiver}`} />
                    </a>
                    <span className={`${tikectmsg?.is_admin ? styles.date_message_snder : styles.date_message_receiver}`}>
                        {formatTime(tikectmsg?.date)}
                    </span>
                </div>
            )}
        </div>
    );
}
