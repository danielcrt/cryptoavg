import React, { useEffect, useState } from 'react'
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
import { DEFAULT_BACKEND_DATE_FORMAT, DEFAULT_DATE_FORMAT } from '../../constants'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CoinGeckoLogo from '../../../assets/images/coingecko.png';

function CalculatorPage(props) {
    const [state, setState] = useState({
        cryptoCoin: 'bitcoin', // bitcoin ID
        startDate: moment().subtract(1, 'year').toDate(),
        endDate: moment().toDate(),
        investmentInterval: 'weekly',
        investedAmount: 10,
        fees: 0.5
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
    const _onSubmit = () => {
        let params = {
            start_date: moment(state.startDate).format(DEFAULT_BACKEND_DATE_FORMAT),
            end_date: moment(state.endDate).format(DEFAULT_BACKEND_DATE_FORMAT),
            coin_id: state.cryptoCoin,
            investment_interval: state.investmentInterval,
            investment_amount: state.investedAmount,
            transaction_fee: state.fees,
        }
        CalculatorService.compute(params).then(response => {
            setResults(response);
        }).catch(err => {
            message.error(err.toString());
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
            label: 'Weekly',
            value: 'weekly'
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
        <>
            <div className='row'>
                <div className='calculator-container'>
                    <h1>Calculator</h1>
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
                        footer.scrollIntoView();
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
                        selected={state.startDate}
                        onChange={date => setState({ ...state, startDate: date })}
                        placeholder={'Select start date'}
                        customInput={<Input />}
                    />
                    <br />
                    <br />
                    <label>End date</label>
                    <DatePicker
                        selected={state.endDate}
                        onChange={date => setState({ ...state, endDate: date })}
                        placeholder={'Select end date'}
                        customInput={<Input />}
                    />
                    <br />
                    <br />
                    <Button variant='primary' onClick={_onSubmit}>Calculate</Button>
                    <div className='data-provider'>
                        <p className='info'>Data retrieved from </p> <a href='https://coingecko.com' target='_blank' rel='noopener'><img src={CoinGeckoLogo} alt='coingecko' height={30} /></a>
                    </div>
                </div>
                <div className='chart-container'>
                    {results &&
                        <ResponsiveContainer height="99%">
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

            {results &&
                <div className='crypto-table'>
                    <table role="table">
                        <thead role="rowgroup" className='crypto-table-thead'>
                            <tr role="row">
                                <th role="columnheader">Date</th>
                                <th role="columnheader">Coin price</th>
                                <th role="columnheader">Change %</th>
                                <th role="columnheader">Change from start %</th>
                                <th role="columnheader">Total investment</th>
                                <th role="columnheader">Balance</th>
                                <th role="columnheader">Profit</th>
                                <th role="columnheader">Profit %</th>
                            </tr>
                        </thead>
                        <tbody role="rowgroup" className='crypto-table-tbody'>
                            {results.map(row =>
                                <tr role="row" key={row.date}>
                                    <td role="cell">{moment(row.date).format(DEFAULT_DATE_FORMAT)}</td>
                                    <td role="cell">{row.price}$</td>
                                    <td role="cell" className={(row.change_percent < 0) ? 'error' : 'success'}>{row.change_percent}%</td>
                                    <td role="cell" className={(row.change_from_start_percent < 0) ? 'error' : 'success'}>{row.change_from_start_percent}%</td>
                                    <td role="cell">{row.total_investment}$</td>
                                    <td role="cell" className={(row.profit < 0) ? 'error' : 'success'}>{row.balance}$</td>
                                    <td role="cell" className={(row.profit < 0) ? 'error' : 'success'}>{row.profit}$</td>
                                    <td role="cell" className={(row.profit < 0) ? 'error' : 'success'}>{row.profit_percent}%</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}

CalculatorPage.propTypes = {

}

export default CalculatorPage

