import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Letter(props) {
    return (
        <span className={props.status}>{props.value}</span>
    );
}

class Sentence extends React.Component {
    isRigthOrWrong(letter, index) {
        return letter === this.props.current[index] ? "right" : "wrong";
    }

    render() {
        const inputLetters = Array.from(this.props.input)
            .map((letter, index) => {
                return (
                    <Letter key={index} status={this.isRigthOrWrong(letter, index)} value = {letter} />
                );
            });
        const letters = Array.from(this.props.current)
            .slice(this.props.input.length)
            .map((letter, index) => {
                return (
                    <Letter key={index} status="nothing" value = {letter} />
                );
            });

        return (
            <div className="title">
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
            isLoaded: false,
            options: [],
            error: "",
            current: "",
            input: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch("/react-typing-game/sentences.txt")
            .then(res => res.text())
            .then(
                (result) => {
                    let optionsArray = result.split(`\r\n`);
                    this.setState({
                        isLoaded: true,
                        options: optionsArray,
                        current: optionsArray[getRandomInt(0, optionsArray.length)]
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    handleChange(event) {
        if (event.target.value.length <= this.state.current.length) {
            this.setState({
                input: event.target.value
            });
            if (this.state.current === event.target.value) {
                this.setState({
                    current: this.state.options[getRandomInt(0, this.state.options.length)],
                    input: ""
                });
            }
        }
    }

    render() {
        return (
            <div className="container">
                <div className="columns">
                    <div className="column is-three-fifths is-offset-one-fifth is-centered">
                        <Sentence current={this.state.current} input={this.state.input}/>
                        <div className="field">
                            <label className="label">Type the sentence above:</label>
                            <div className="control">
                                <input type="text" className="input" value={this.state.input} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
