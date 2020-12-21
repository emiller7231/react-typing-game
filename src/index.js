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

function WordsPerMinute(props) {
    return (
        <p>Words per minute {props.wordsPerMinute}</p>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: "",
            startedTime: new Date(),
            currentTime: new Date(),
            options: [],
            current: "",
            input: "",
            words: 0,
            wordsPerMinute: 0
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch("/react-typing-game/sentences.txt")
            .then(res => res.text())
            .then(
                (result) => {
                    let optionsArray = result.split(/\r?\n/);
                    this.setState({
                        isLoaded: true,
                        startedTime: new Date(),
                        currentTime: new Date(),
                        options: optionsArray,
                        current: optionsArray[getRandomInt(0, optionsArray.length)]
                    });
                    setInterval(() => this.tick(), 1000);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    tick() {
        this.setState({
            currentTime: new Date()
        })
    }

    handleChange(event) {
        if (event.target.value.length <= this.state.current.length) {
            this.setState({
                input: event.target.value
            });
            if (this.state.current === event.target.value) {
                let diff = this.state.currentTime.getTime() - this.state.startedTime.getTime();
                let minutes = diff/(1000 * 60);
                let words = this.state.words + event.target.value.split(" ").length;
                this.setState({
                    current: this.state.options[getRandomInt(0, this.state.options.length)],
                    input: "",
                    words: words,
                    wordsPerMinute: Math.floor(words/minutes)
                });
            }
        }
    }

    render() {
        return (
            <section className="hero is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-vcentered">
                            <div className="column is-three-fifths is-offset-one-fifth is-centered">
                                <Sentence current={this.state.current} input={this.state.input}/>
                                <div className="field">
                                    <label className="label">Type the sentence above:</label>
                                    <div className="control">
                                        <input type="text" className="input" value={this.state.input} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <WordsPerMinute wordsPerMinute={this.state.wordsPerMinute} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
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
