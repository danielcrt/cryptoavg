import React, { useEffect, useState, useRef } from 'react'
import { CoinService } from '../../services/coin.service'
import { CalculatorService } from '../../services/calculator.service';
import Input from '../../components/Input/Input';
import Button from '../../components/Button';
import DatePicker from 'react-datepicker';
import Select, { Option } from 'rc-select';
import './CalculatorPage.scss';
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from '../../components/icons/ArrowIcon';
import { message } from '../../helpers/message/message';
import moment from 'moment';
import { DEFAULT_BACKEND_DATE_FORMAT, MOBILE_BREAKPOINT } from '../../constants'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CoinGeckoLogo from '../../../assets/images/coingecko.png';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import ResultsTable from './ResultsTable';
import useWindowDimenstions from '../../helpers/useWindowDimensions'

function CalculatorPage(props) {
    const firstRun = useRef(true);
    const { width } = useWindowDimenstions();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [state, setState] = useState({
        cryptoCoin: 'bitcoin', // bitcoin ID
        startDate: moment().subtract(1, 'year').toDate(),
        endDate: moment().toDate(),
        investmentInterval: 'weekly',
        investedAmount: 10,
        fees: 0.5,
        loading: false,
    });
    const [loadingCoins, setLoadingCoins] = useState(true);
    const [coinsData, setCoinsData] = useState([]);
    const [results, setResults] = useState();
    useEffect(() => {
        CoinService.getCoins().then(response => {
            let newCoinsData = [];
            for (let i = 0; i < response.length; i++) {
                newCoinsData.push({
                    label: response[i].full_name,
                    value: response[i].coingecko_id
                })
            }
            setCoinsData(newCoinsData);
            setLoadingCoins(false);
            _onSubmit();
        }).catch(err => {
            message.error(err.toString());
        })
    }, [])
    const _onSubmit = async () => {
        setState({
            ...state,
            loading: true
        });
        const token = await executeRecaptcha('contact_page');
        let params = {
            start_date: moment(state.startDate).format(DEFAULT_BACKEND_DATE_FORMAT),
            end_date: moment(state.endDate).format(DEFAULT_BACKEND_DATE_FORMAT),
            coin_id: state.cryptoCoin,
            investment_interval: state.investmentInterval,
            investment_amount: state.investedAmount,
            transaction_fee: state.fees,
            recaptcha: token
        }
        CalculatorService.compute(params).then(response => {
            setResults(response);
            setState({
                ...state,
                loading: false
            });
            if (firstRun.current === false && width < MOBILE_BREAKPOINT) {
                var chartContainer = document.getElementById('chart-container');
                chartContainer.scrollIntoView({ behavior: 'smooth' });
            }
            firstRun.current = false;
        }).catch(err => {
            message.error(err.toString());
            setState({
                ...state,
                loading: false
            });
        });
    }
    const _onChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });
    }
    const _onSearchCoin = (value) => {
        if (!value) {
            return;
        }
        setLoadingCoins(true);
        CoinService.getCoins({
            q: value
        }).then(response => {
            let newCoinsData = [];
            for (let i = 0; i < response.length; i++) {
                newCoinsData.push({
                    label: response[i].full_name,
                    value: response[i].coingecko_id
                })
            }
            setCoinsData(newCoinsData);
            setLoadingCoins(false);
        }).catch(err => {
            message.error(err.toString());
        })
    }
    const investmentOptions = [
        {
            label: 'Daily',
            value: 'daily'
        },
        {
            label: 'Weekly',
            value: 'weekly'
        },
        {
            label: 'Biweekly',
            value: 'biweekly'
        },
        {
            label: 'Monthly',
            value: 'monthly'
        }
    ];

    let getName = (x) => { return moment(x.date).format('D MMM Y'); }
    let getLumpSumInvestment = (x) => {
        let amountInvested = results[results.length - 1].total_investment;
        let total = amountInvested + amountInvested * x.change_from_start_percent / 100;
        return (Math.round((total + Number.EPSILON) * 100) / 100);
    }
    return (
        <div id='calculator-page'>
            <div className='introduction'>
                <h1>Dollar-cost averaging (DCA) calculator for cryptocurrency assets</h1>
                <p><i>Dollar-cost averaging (DCA) is an investment strategy in which an investor divides up the total amount to be invested across periodic purchases of a target asset in an effort to reduce the impact of volatility on the overall purchase</i> - <span>source: <a target='_blank' href='https://www.investopedia.com/terms/d/dollarcostaveraging.asp' rel='noopener'>Investopedia</a></span></p>
            </div>
            <div className='row'>
                <div className='calculator-container'>
                    <label>Coin</label>
                    <Select
                        name='coin'
                        prefixCls='crypto-select'
                        value={state.cryptoCoin}
                        onSelect={(value) => {
                            setState({ ...state, cryptoCoin: value })
                        }}
                        onSearch={_onSearchCoin}
                        showArrow={true}
                        inputIcon={<ArrowIcon />}
                        showSearch={true}
                        label='Crypto currency'
                        placeholder='Crypto currency'
                        loading={loadingCoins}
                        filterOption={false}
                    >
                        {coinsData.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>)}
                    </Select>
                    <span className='info'>Cannot find you coin? Request it <a href='#' onClick={(e) => {
                        e.preventDefault();
                        var footer = document.getElementById('footer');
                        footer.scrollIntoView({ behavior: 'smooth' });
                        // window.scrollTo(0, document.body.scrollHeight);
                    }}>here</a></span>
                    <br />
                    <br />
                    <label>Investment interval</label>
                    <Select
                        prefixCls='crypto-select'
                        showArrow={true}
                        inputIcon={<ArrowIcon />}
                        value={state.investmentInterval}
                        onChange={(value) => {
                            setState({ ...state, investmentInterval: value })
                        }}
                    >
                        {investmentOptions.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>)}
                    </Select>
                    <br />
                    <br />
                    <label>Invested amount</label>
                    <Input
                        name='investedAmount'
                        type='number'
                        min={0}
                        suffix={'$'}
                        placeholder='Invested amount'
                        label='Invested amount'
                        onChange={_onChange}
                        value={state.investedAmount}
                    />
                    <br />
                    <label>Transaction fees</label>
                    <Input
                        name='fees'
                        type='number'
                        min={0}
                        suffix={'%'}
                        placeholder='Transaction fees'
                        label='Transaction fees'
                        onChange={_onChange}
                        value={state.fees}
                    />
                    <br />
                    <label>Start date</label>
                    <DatePicker
                        dateFormat="dd.MM.yyyy"
                        selected={state.startDate}
                        onChange={date => setState({ ...state, startDate: date })}
                        placeholder={'Select start date'}
                        customInput={<Input />}
                    />
                    <br />
                    <br />
                    <label>End date</label>
                    <DatePicker
                        dateFormat="dd.MM.yyyy"
                        maxDate={moment().toDate()}
                        selected={state.endDate}
                        onChange={date => setState({ ...state, endDate: date })}
                        placeholder={'Select end date'}
                        customInput={<Input />}
                    />
                    <br />
                    <br />
                    <Button variant='primary' onClick={_onSubmit} loading={state.loading}>Calculate</Button>
                    <div className='data-provider'>
                        <p className='info'>Data retrieved from </p> <a href='https://coingecko.com' target='_blank' rel='noopener'><img src={CoinGeckoLogo} alt='coingecko' height={30} /></a>
                    </div>
                </div>
                <div id='chart-container'>
                    {results &&
                        <ResponsiveContainer height="99%" minHeight="500px">
                            <LineChart
                                data={results}
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 10,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={getName} minTickGap={60} tickFormatter={(tickItem) => {
                                    return moment(tickItem, 'D MMM Y').format('D MMM');
                                }} />
                                <YAxis tickFormatter={(tickItem) => { return tickItem + '$' }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey={"balance"} stroke="#1890ff" name="Cost average" />
                                <Line type="monotone" dataKey={getLumpSumInvestment} stroke="#58d1c9" name="YOLO" />
                            </LineChart>
                        </ResponsiveContainer>
                    }
                </div>
            </div>
            <ResultsTable results={results} />
        </div>
    )
}

CalculatorPage.propTypes = {

}

export default CalculatorPage

