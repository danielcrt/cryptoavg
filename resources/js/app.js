/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './helpers';
import Application from './views/Application';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RECAPTCHA_SITE_KEY } from './constants';

render(

    <Provider store={store}>
        <GoogleReCaptchaProvider
            reCaptchaKey={RECAPTCHA_SITE_KEY}
            scriptProps={{
                async: true, // optional, default to false,
                defer: true, // optional, default to false
            }}
        >
            <Application />
        </GoogleReCaptchaProvider>
    </Provider>,
    document.getElementById('app')
);