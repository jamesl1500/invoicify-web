import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import React from 'react';

export default function Loading(props) {
    const { text = "Loading..." } = props;

    // This is the loading screen component
    return (
        <div className="loading-screen">
            <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin/>
            </div>
            <div className="loading-text">{text}</div>
        </div>
    );
}