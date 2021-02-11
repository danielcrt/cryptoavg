import React, { Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import NavBar from '../components/NavBar/NavBar';
import CalculatorPage from './CalculatorPage/CalculatorPage';
import NotFoundPage from './NotFoundPage';

function Application(props) {
    return (
        <HashRouter>
            <>
                <NavBar />
                <div id='crypto-layout'>
                    <Suspense fallback={<LoadingSpinner />}>
                        <>
                            <Switch>
                                <Route exact path="/" component={CalculatorPage} />
                                <Route path='*' component={NotFoundPage} />
                            </Switch>
                        </>
                    </Suspense>
                </div>
            </>
        </HashRouter>
    );
}

export default Application