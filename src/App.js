import React, { Component } from "react";
import Line from "./Line";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [
        {
          lineText:
            "This is the ultimate sandboxed-linux-based personal website",
          key: "0",
          id: "0"
        },
        {
          lineText: "type `help` to view the list of available commands",
          key: "1",
          id: "1"
        }
      ],
      input: "",
      history: [],
      currentHistory: null
    };
    this.focusOnInput = this.focusOnInput.bind(this);
    this.addLine = this.addLine.bind(this);

    this.handleRemoteCommand = this.handleRemoteCommand.bind(this);
    this.localCommands = {
      help: "You can use a list of commands here : help,ls,cat,pwd,uname",
      "?": "You can use a list of commands here : help,ls,cat,pwd,uname",
      pwd: "/Universe/MilkyWay/Solar System/Earth/Iraq",
      uname: "thats some dedication :D get a life man"
    };
  }
  componentDidMount() {
    this.focusOnInput();
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }
  addLine() {
    let lines = this.state.lines;
    let linesLength = lines.length;
    let newline = this.state.input.trim();
    lines.push({
      lineText: newline,
      key: linesLength,
      id: linesLength
    });

    this.setState({ input: "", lines: lines });
    this.handleProLineAdd(newline); // handles the commands result
    // console.log('added line:' + JSON.stringify(lines[linesLength]));
  }
  handleProLineAdd(command) {
    // handles the commands result
    let history = this.state.history;
    history.unshift(command);
    this.setState({ history: history, currentHistory: null });

    let cmd = command.split(" ")[0];
    let args = command.split(" ").splice(1);

    if (this.isCommandLocal(cmd)) {
      // check if command local
      this.handleLocalCommand(cmd);
    } else {
      // if remote command
      this.handleRemoteCommand(cmd, args);
    }
  }
  isCommandLocal(command) {
    return Object.keys(this.localCommands).includes(command);
  }
  handleRemoteCommand(command, args = []) {
    this.addResult("", { cmd: command, args: args });
  }
  handleLocalCommand(command) {
    // console.log("handling local", command, this.localCommands[command]);
    this.addResult(this.localCommands[command]);
  }
  addResult(result, remote = null) {
    let lines = this.state.lines;
    let linesLength = lines.length;
    lines.push({
      lineText: result,
      key: linesLength,
      id: linesLength,
      type: "result",
      remote: remote
    });
    this.setState({ lines: lines });
    return true;
  }

  normalizeHeight(input) {
    input.style.height = "1.2em";
    let maxCallStack = 0; //to prevent infinite loop that happens sometimes
    while (input.offsetHeight < input.scrollHeight && maxCallStack < 16) {
      input.style.height = parseInt(input.style.height[0], 10) + 1 + ".2em";
      maxCallStack++;
    }
  }
  focusOnInput() {
    this.textInput.focus();
  }
  handleClick(e) {
    e.preventDefault();
    this.focusOnInput();
  }
  handleKeypressed(e) {
    //check if overflowed, call() normalizeHeight()
    this.normalizeHeight(e.target);
    if (e.keyCode === 38) {
      if (this.state.currentHistory === null && this.state.history.length > 0) {
        e.target.value = this.state.history[0];
        this.setState({ currentHistory: 0 });
      } else if (this.state.history.length > 0) {
        if (this.state.currentHistory !== this.state.history.length - 1) {
          e.target.value = this.state.history[this.state.currentHistory + 1];
          this.setState({ currentHistory: this.state.currentHistory + 1 });
        }
      }
    }
    if (e.keyCode === 13) {
      //if key is Enter
      if (e.target.value.trim().length > 0) {
        //if input val is not blank
        this.addLine();
        e.target.value = "";
        e.target.scrollIntoView();
        this.normalizeHeight(e.target);
      } else {
        //input val is blank
        this.setState({ input: "" });
        e.target.value = "";
      }
    }
  }
  isLast(id) {
    if (this.state.lines.length - 1 === parseInt(id, 10)) return true;
    else return false;
  }
  render() {
    return (
      <div>
        <div className="title">
          <h1>
            Alhasan Ahmed<span className="cursor"></span>
          </h1>
        </div>
        <div className="wrapper">
          <div className="container" onClick={this.handleClick.bind(this)}>
            <div className="text">
              {this.state.lines.map((line, index) => (
                <Line
                  lineText={line.lineText}
                  key={line.key}
                  id={line.id}
                  remote={line.remote}
                  type={line.type}
                />
              ))}

              <span className="line input">
                <span className="angle">$&gt;</span>
                <textarea
                  id="input"
                  ref={input => {
                    this.textInput = input;
                  }}
                  onChange={this.handleChange.bind(this)}
                  onKeyUp={this.handleKeypressed.bind(this)}
                ></textarea>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
