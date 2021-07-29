import React, { Component } from 'react';
import './box.css'

class BoxController extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            buttonsAreRevealled: false,
            storyCompiler: "",
        };
    }

    componentDidUpdate() {
        // window.scrollTo(0, 0)
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            buttonsAreRevealled: true
        })
    }

    handleChange(event) {
        const stateObject = {}
        stateObject[event.target.id] = event.target.value
        this.setState(stateObject)
    }

    handleStart(event) {
        this.setState({
            start: event.target.value
        })
    }

    handleClick(event) {
        const id = event.target.id
        let story = ""
        if (!!this.state[id]) {
            story = this.state[id]
        }
        this.setState({
            storyCompiler: this.state.storyCompiler.concat(' ', story)
        })
    }

    render() {

        return (
            <div className="page-wrapper">
                <div className="intro">
                    <h1>Welcome to the two-dimensional storyteller</h1>
                    <p> Enter the beginning of your story - this sets up your characters and scene.</p>
                    <p> Then enter story elements that players can choose in a random order.</p>
                    <p> Tip: Make each story element action-based and self-resolving.</p>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Begin:
                        {/* <input type="text" required={true} id="start" onChange={this.handleStart} /> */}
                        <textarea
                            onChange={this.handleStart}
                            required={true}
                            id="start"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 1:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="1"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 2:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="2"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 3:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="3"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 4:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="4"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 5:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="5"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 6:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="6"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 7:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="7"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 8:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="8"
                            rows={5}
                        />
                    </label><br />
                    <label>
                        Story element 9:
                        <textarea
                            onChange={this.handleChange}
                            required={true}
                            id="9"
                            rows={5}
                        />
                    </label><br />
                    <input type="submit" value="Submit" />
                </form>
                <div className="buttons-section" style={{ visibility: this.state.buttonsAreRevealled ? "visible" : "visible" }}>
                    <div className="buttons-intro">
                        <h3>Make your story</h3>
                        <p>Select buttons in a random order to see how your story will play out.</p>
                    </div>
                    <div className="row">
                        <button id="1" onClick={this.handleClick}>One</button>
                        <button id="2" onClick={this.handleClick}>Two</button>
                        <button id="3" onClick={this.handleClick}>Three</button>
                    </div>
                    <div className="row">
                        <button id="4" onClick={this.handleClick}>Four</button>
                        <button id="5" onClick={this.handleClick}>Five</button>
                        <button id="6" onClick={this.handleClick}>Six</button>
                    </div>
                    <div className="row">
                        <button id="7" onClick={this.handleClick}>Seven</button>
                        <button id="8" onClick={this.handleClick}>Eight</button>
                        <button id="9" onClick={this.handleClick}>Nine</button>
                    </div>
                    <div className="story-section">
                        <div className="buttons-intro">
                            <h2>Welcome to your story</h2>
                        </div>
                        <p>{this.state.start}
                            {this.state.storyCompiler}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default BoxController;