
import React from 'react';
import Autosuggest from 'react-autosuggest';
import styles from "./../css/autosuggestion.css";

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(suggestionMainList, value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return suggestionMainList.filter(suggestionMainList => regex.test(suggestionMainList.name));
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.name}</span>
    );
}

class AutoSuggestList extends React.Component {
    constructor(props) {
        super();

        this.state = {
            value: '',
            suggestions: [],
            suggestionMainList: props.suggestionList,
        };

        //this.setSuggestionList= this.setSuggestionList.bind(this);
    }
    
    onChange = (_, { newValue }) => {
        const { id, onChange } = this.props;
        
        
        this.setState({
            value: newValue            
        });
       
        onChange(id, newValue, this.state.suggestionMainList);

    };

    onSuggestionsFetchRequested = ({ value }) => {

        var list = this.state.suggestionMainList;
        
        if (typeof this.props.getSuggestionListCallBack === "function")
        {
                   list = this.props.getSuggestionListCallBack();
        }

        this.setState({

            suggestions: getSuggestions(list, value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { id, placeholder } = this.props;
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder,
            value,
            onChange: this.onChange
        };

        return (           
                <Autosuggest                   
                    id={id}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />          
        );
    }
}

export default AutoSuggestList;
