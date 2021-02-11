import React from 'react';
import './LoadingSpinner.scss';
import PropTypes from 'prop-types'

const LoadingSpinner = ({ size }) => {
    return <div className={'loading-spinner' + (size ? ` ${size}` : '')}></div>;
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),

}
export default LoadingSpinner;