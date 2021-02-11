import React from 'react'
import './Input.scss'

function Input(props) {
    const { name, icon, suffix, error, innerRef, ...rest } = props;
    return (
        <div className='input-container'>
            <div className='input-box'>
                {icon}
                <input ref={innerRef} id={name} name={name} {...rest} />
                {suffix && <span className='input-suffix'>{suffix}</span>}
            </div>
            {error && <div className='error'></div>}
        </div>
    )
}


export default React.forwardRef((props, ref) => <Input innerRef={ref} {...props} />);

