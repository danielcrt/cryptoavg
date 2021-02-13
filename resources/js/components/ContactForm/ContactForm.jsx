import React, { useState } from 'react'
import { message } from '../../helpers/message/message';
import Button from '../Button/Button';
import Input from '../Input/Input';
import TextArea from '../TextArea/TextArea';
import './ContactForm.scss';
import { ContactService } from '../../services/contact.service';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ContactForm(props) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const recaptchaRef = React.createRef();
    const [state, setState] = useState({
        loading: false,
        submitted: false,
        email: '',
        message: '',
        recaptcha: ''
    })
    const [errors, setErrors] = useState();
    const _onChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });
    }
    const _onSubmit = async () => {
        const token = await executeRecaptcha('contact_page');
        setState({
            ...state,
            loading: true,
        });
        setErrors(null);
        let params = {
            ...state,
            recaptcha: token
        };
        ContactService.send(params).then(response => {
            setState({
                ...state,
                loading: false,
                submitted: true
            });
            message.success('Message has been successfully sent!', 5);
        }).catch(err => {
            setState({
                ...state,
                loading: false,
            });
            err = err.response;
            if (err && err.data) {
                setErrors(err.data);
                message.error('Please fix the errors and try again.');
            } else {
                message.error('Unexpected error. Please try again later.');
            }
        })
    }
    const _renderErrors = () => {
        return Object.keys(errors).map(key => {
            return <p key={key}>{errors[key][0]}</p>
        })
    }
    if (state.submitted) {
        return <h3 className='success'>Message has been successfully sent! Thank you!</h3>;
    }
    return (
        <div className='contact-form'>
            <h2>Send a message</h2>
            <Input
                name='email'
                type='email'
                placeholder='Email address'
                onChange={_onChange}
                value={state.email}
            /><br />
            <TextArea
                name='message'
                rows={5}
                placeholder='Write something nice'
                onChange={_onChange}
                value={state.message}
            />
            {errors &&
                <div className='errors-container'>
                    {_renderErrors()}
                </div>
            }
            <br />
            <Button variant='primary'
                loading={state.loading}
                onClick={() => {
                    _onSubmit();
                }}>Send</Button>
        </div>
    )
}

export default ContactForm