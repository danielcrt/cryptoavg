import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../Input/Input';

function Autocomplete(props) {
    const [state, setState] = useState({
        activeOption: 0,
        filteredOptions: [],
        showOptions: false,
        userInput: ''
    });

    const onChange = (e) => {
        console.log('onChanges');

        const { options } = props;
        const userInput = e.currentTarget.value;

        const filteredOptions = options.filter(
            (optionName) =>
                optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        setState({
            ...state,
            activeOption: 0,
            filteredOptions,
            showOptions: true,
            userInput: e.currentTarget.value
        });
    };

    const onClick = (e) => {
        setState({
            ...state,
            activeOption: 0,
            filteredOptions: [],
            showOptions: false,
            userInput: e.currentTarget.innerText
        });
    };
    const onKeyDown = (e) => {
        const { activeOption, filteredOptions } = state;

        if (e.keyCode === 13) {
            setState({
                ...state,
                activeOption: 0,
                showOptions: false,
                userInput: filteredOptions[activeOption]
            });
        } else if (e.keyCode === 38) {
            if (activeOption === 0) {
                return;
            }
            setState({
                ...state, activeOption: activeOption - 1
            });
        } else if (e.keyCode === 40) {
            if (activeOption === filteredOptions.length - 1) {
                console.log(activeOption);
                return;
            }
            setState({
                ...state, activeOption: activeOption + 1
            });
        }
    };

    const { activeOption, filteredOptions, showOptions, userInput } = state
    let optionList;
    if (showOptions && userInput) {
        if (filteredOptions.length) {
            optionList = (
                <ul className="options">
                    {filteredOptions.map((optionName, index) => {
                        let className;
                        if (index === activeOption) {
                            className = 'option-active';
                        }
                        return (
                            <li className={className} key={optionName} onClick={onClick}>
                                {optionName}
                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionList = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }
    return (
        <React.Fragment>
            <div className="autocomplete">
                <Input
                    type='text'
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                />
            </div>
            {optionList}
        </React.Fragment>
    );
}

Autocomplete.propTypes = {
    options: PropTypes.instanceOf(Array).isRequired
}

export default Autocomplete

