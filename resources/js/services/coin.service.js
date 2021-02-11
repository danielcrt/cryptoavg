
import Http from '../helpers/Http';
import qs from 'qs'


const getCoins = (params) => {
    return Http.get('/coins?' + qs.stringify(params))
        .then((response) => {
            return response.data;
        })
}

export const CoinService = {
    getCoins
}