import React, { Component } from "react";
import { Image, Message } from "semantic-ui-react";
import { Logo } from "../../assets";
import "./style.scss";

class NotFound extends Component {
  componentDidMount() {
    document.title = "Page Not Found";
  }
  render() {
    return (
      <div className="notfound-wrapper">
        <Image src={Logo} />
        <div className="notfound-title">
          <h2>404 : Page Not Found</h2>
        </div>
        <div className="notfound-message">
          <Message negative>
            <Message.Header>
              Halaman <i>{window.location.href}</i> tidak ditemukan
            </Message.Header>
          </Message>
        </div>
      </div>
    );
  }
}

export default NotFound;
