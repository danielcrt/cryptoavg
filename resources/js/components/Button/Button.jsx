import React from 'react';
import './Button.scss';
import LoadingSpinner from '../LoadingSpinner'

const Button = (props) => {
    const { variant, type, icon, children, loading, onClick } = props

    return (
        <button
            disabled={loading}
            type={type ? type : 'submit'}
            className={'button ' + variant}
            onClick={(e) => {
                if (onClick && !loading) {
                    onClick(e);
                }
            }}>
            {loading ? <LoadingSpinner size={'small'} /> : <>{icon}{children}</>}
        </button>
    );
};

export default Button;