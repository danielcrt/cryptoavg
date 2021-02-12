import React from 'react';
import './Footer.scss';
import BTCQR from '../../../assets/images/btc_qr.png';
import ETHQR from '../../../assets/images/eth_qr.png';
import EGLDQR from '../../../assets/images/egld_qr.png';
import ContactForm from '../ContactForm/ContactForm';

function Footer(props) {
    return (
        <div id='footer'>
            <div className='row'>
                <div className='col'>
                    <h3>If you've found this helpful, feel free to support this project. Thank you!</h3>
                    <div className='row'>
                        <img className='crypto-address' src={BTCQR} alt='3JBR9uNpHapss3bVgXBSN5WakJ8DXVteH1' />
                        <div className='address-container'>
                            <p>Bitcoin (BTC):</p>
                            <p>3JBR9uNpHapss3bVgXBSN5WakJ8DXVteH1</p>
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <img className='crypto-address' src={ETHQR} alt='0xFB8C9D1caf984Dc7fda8e45458dedec5e45463dD' />
                        <div className='address-container'>
                            <p>Ethereum (ETH): </p>
                            <p>0xFB8C9D1caf984Dc7fda8e45458dedec5e45463dD</p>
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <img className='crypto-address' src={EGLDQR} alt='erd1khnzu6rnur6rvgrq3n3tzekusrj4l4kmtl874k6wfaf0n7ejwj5s56ha3e' />
                        <div className='address-container'>
                            <p>Elrond (EGLD): </p>
                            <p>erd1khnzu6rnur6rvgrq3n3tzekusrj4l4kmtl874k6wfaf0n7ejwj5s56ha3e</p>
                        </div>
                    </div>
                    <br />
                </div>
                <div className='col'>
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}


export default Footer

