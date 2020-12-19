import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Letter(props) {
    return (
        <span className={props.status}>{props.value}</span>
    );
}

class Word extends React.Component {
    run() {
        console.log(this.props.word.length);
        console.log(this.props.input.length);
        return "";
    }

    isRigthOrWrong(letter, index) {
        return letter === this.props.word[index] ? "right" : "wrong";
    }

    render() {
        const inputLetters = Array.from(this.props.input)
            .map((letter, index) => {
                return (
                    <Letter key={this.index} status={this.isRigthOrWrong(letter, index)} value = {letter} />
                );
            });
        const letters = Array.from(this.props.word)
            .slice(this.props.input.length)
            .map((letter, index) => {
                return (
                    <Letter key={this.index} status="nothing" value = {letter} />
                );
            });

        return (
            <div>
                {inputLetters}
                {letters}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: "Testing",
            input: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event.target.value);
        if (event.target.value.length <= this.state.word.length) {
            this.setState({
                input: event.target.value
            });
        }
    }

    render() {
        return (
            <div>
                <Word word={this.state.word} input={this.state.input}/>
                <label>Type the word above:</label><br />
                <input type="text" value={this.state.input} onChange={this.handleChange}/>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);