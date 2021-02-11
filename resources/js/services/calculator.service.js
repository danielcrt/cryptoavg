
import Http from '../helpers/Http';

const compute = (params) => {
    return Http.post('/compute', params)
        .then((response) => {
            return response.data;
        })
}

export const CalculatorService = {
    compute
}