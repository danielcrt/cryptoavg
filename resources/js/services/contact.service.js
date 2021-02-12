
import Http from '../helpers/Http';

const send = (params) => {
    return Http.post('/contact', params)
        .then((response) => {
            return response.data;
        })
}

export const ContactService = {
    send
}