import React, { Component } from "react";

class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.lineText
    };
  }
  componentDidMount() {
    if (this.props.remote) {
      console.log("remote line mounted, " + JSON.stringify(this.props.remote));
      this.fetch(this.props.remote);
    }
  }
  async fetch(remote) {
    let { cmd, args } = remote;
    if (this.props.remote) {
      const json = await (async function(cmd, args) {
        const response = await fetch("http://localhost:3001/api/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ cmd: cmd, args: args }),
          Accept: "application/json"
        })
          .then(function(response) {
            return response.json();
          })
          .catch(function(error) {
            return {
              result: "Failed to connect to Backend!"
            };
          });
        return response;
      })(cmd, args);

      this.setState({ text: json.result });
    }
  }

  Angel() {
    if (this.props.type !== "result") {
      return <span className="angel">$&gt;</span>;
    } else return "";
  }
  Text() {
    if (this.props.type !== "result" && this.state.text) {
      return this.state.text;
    } else if (this.state.text && this.state.text.length > 0) {
      let message = this.state.text;

      if (message.indexOf("\n") >= 0) {
        console.log("replacing br");
        console.log(message);
        var _message = message.split("\n").map((item, key) => {
          return (
            <span key={key}>
              {item}
              <br />
            </span>
          );
        });
      }
      if (message.indexOf("<img>") >= 0 && message.indexOf("</img>") >= 0) {
        console.log("replacing img");
        let url = message.match("<img>(.*)</img>")[1];
        var img = <img src={url} alt="" className="cmd_img" />;
        console.log("img", url, message);
      }
      if (_message) {
        return <pre>{_message}</pre>;
      } else if (img) {
        return img;
      } else {
        return message;
      }
    } else return <div className="loader">Loading...</div>;
  }
  render() {
    return (
      <span className="line">
        {this.Angel()}
        {this.Text()}
        {/* {cursor} */}
      </span>
    );
  }
}

export default Line;
