import React from 'react'
import PropTypes from 'prop-types';
import './TextArea.scss';

function TextArea(props) {
    const { name, icon, suffix, error, innerRef, ...rest } = props;
    return (
        <div className='input-container'>
            <div className='input-box'>
                {icon}
                <textarea ref={innerRef} id={name} name={name} {...rest} />
                {suffix && <span className='input-suffix'>{suffix}</span>}
            </div>
            {error && <div className='error'></div>}
        </div>
    )
}

TextArea.propTypes = {

}

export default TextArea

