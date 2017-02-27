import React, { Component } from 'react';

class Line extends Component {
  constructor(props) {
     super(props);
     this.state = {
       text: this.props.lineText
     };

  }
  componentDidMount(){
    if (this.props.remote) {
      this.fetch();
    }
  }
  fetch(){
    if (this.props.remote) {
      let _fetch = this.props.remote.fetch.bind(this);
      _fetch(this.props.remote.cmd , this.props.remote.args);
    }
  }

  fulfill(msg){
    let message = msg.result;
    this.setState({text:message})
  }
  reject(){
    this.setState() //maybe do this from App.js state.lines directly  ?
  }
  Angel(){
    if (this.props.type !== 'result') {
      return <span className="angel">$&gt;</span>
    }else return '';
  }
  Text(){
    if (this.props.type !== 'result' && this.state.text) {
      return this.state.text
    }else if (this.state.text && this.state.text.length > 0) {
        let message = this.state.text

        if (message.indexOf("\n") >= 0 ) {
          console.log('replacing br');
          console.log(message);
          var _message = message.split('\n').map((item, key) => {
                      return <span key={key}>{item}<br /></span>
                    })
        }
        if (message.indexOf("<img>") >= 0  && message.indexOf("</img>") >= 0) {
          console.log('replacing img');
          let url = message.match("<img>(.*)</img>")[1]
          var img = <img src={url} alt="" className="cmd_img"/>
          console.log('img',url,message);
        }
        if (_message) {
          return <pre>{_message}</pre>
        }else if (img) {
          return img
        }else {
          return message
        }
    }
    else return <div className="loader">Loading...</div>
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
