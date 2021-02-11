import React from 'react'
import Notification from 'rc-notification';
import './message.scss';
import CheckCircle from '../../components/icons/CheckCircle';
import ExclamationCircle from '../../components/icons/ExclamationCircle';
import InfoCircle from '../../components/icons/InfoCircle';

const showNotification = (message, duration = 5, type) => {
    let notification = null;
    let icon = undefined;
    switch (type) {
        case 'success':
            icon = <CheckCircle />
            break;
        case 'error':
            icon = <ExclamationCircle />
            break;
        case 'warning':
            icon = <AlertTriangle />
            break;
        case 'info':
            icon = <InfoCircle />
            break;
        default:
            break;
    }
    Notification.newInstance({
        prefixCls: `crypto-notification`,
        style: {}
    }, (n) => notification = n);
    notification.notice({
        content: <div className={type}>
            <span className='icon'>{icon}</span>
            <span className='message'>{message}</span>
        </div>,
        duration: duration
    });
}

export const message = {
    success: (message, duration) => showNotification(message, duration, 'success'),
    error: (message, duration) => showNotification(message, duration, 'error'),
    warn: (message, duration) => showNotification(message, duration, 'warning'),
    info: (message, duration) => showNotification(message, duration, 'info')
}

