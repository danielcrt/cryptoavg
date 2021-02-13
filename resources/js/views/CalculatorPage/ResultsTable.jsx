import React from 'react'
import moment from 'moment'
import { DEFAULT_DATE_FORMAT } from '../../constants';
import './ResultsTable.scss';

function ResultsTable(props) {
    const { results } = props;
    if (!results) {
        return null;
    }
    return (
        results &&
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

    )
}

export default ResultsTable

