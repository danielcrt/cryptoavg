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
import { DEFAULT_BACKEND_DATE_FORMAT } from '../../constants'

function CalculatorPage(props) {
    const [state, setState] = useState({
        cryptoCoin: 'bitcoin',
        startDate: moment().subtract(1, 'year').toDate(),
        endDate: moment().toDate(),
        investmentInterval: 'weekly',
        investedAmount: 10,
        fees: 0.5
    })
    const [coins, setCoins] = useState([]);
    const [coinsData, setCoinsData] = useState([]);
    const [results, setResults] = useState();
    useEffect(() => {
        CoinService.getCoins().then(response => {
            setCoins(response);
            let newCoinsData = [];
            for (let i = 0; i < response.length; i++) {
                newCoinsData.push({
                    label: response[i].full_name,
                    value: response[i].id
                })
            }
            setCoinsData(newCoinsData);
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
    const investmentOptions = [
        {
            label: 'Weekly',
            value: 'weekly'
        },
        {
            label: 'Monthly',
            value: 'monthly'
        }
    ]
    return (
        <>
            <div className='calculator-container'>
                <h1>Calculator</h1>
                <Select
                    name='coin'
                    prefixCls='crypto-select'
                    value={state.cryptoCoin}
                    onChange={(value) => {
                        setState({ ...state, cryptoCoin: value })
                    }}
                    showArrow={true}
                    inputIcon={<ArrowIcon />}
                    showSearch={true}
                    label='Crypto currency'
                    placeholder='Crypto currency'
                >
                    {coinsData.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>)}
                </Select>
                <br />
                <br />
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
                <DatePicker
                    selected={state.startDate}
                    onChange={date => setState({ ...state, startDate: date })}
                    placeholder={'Select start date'}
                    customInput={<Input />}
                />
                <br />
                <br />
                <DatePicker
                    selected={state.endDate}
                    onChange={date => setState({ ...state, endDate: date })}
                    placeholder={'Select end date'}
                    customInput={<Input />}
                />
                <br />
                <br />
                <Button variant='primary' onClick={_onSubmit}>Calculate</Button>
            </div >
            {results &&
                <div className='results-container'>
                    <table role="table">
                        <thead role="rowgroup">
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
                        <tbody role="rowgroup">
                            {results.map(row =>
                                <tr role="row" key={row.date}>
                                    <td role="cell">{row.date}</td>
                                    <td role="cell">{row.price}$</td>
                                    <td role="cell">{row.change_percent}%</td>
                                    <td role="cell">{row.change_from_start_percent}%</td>
                                    <td role="cell">{row.total_investment}</td>
                                    <td role="cell">{row.balance}</td>
                                    <td role="cell">{row.profit}</td>
                                    <td role="cell">{row.profit_percent}</td>
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

