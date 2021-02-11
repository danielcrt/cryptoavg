import React from 'react'
import { history } from '../../helpers/history'

function NotFoundPage() {
    return (
        <div>
            404. Page not found. Please <a onClick={() => history.goBack()}>go back</a>.
        </div>
    )
}


export default NotFoundPage

