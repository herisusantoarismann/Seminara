import React, { Component } from "react";
import {
  Menu,
  Form,
  Button,
  Card,
  Image,
  Message,
  Dropdown,
} from "semantic-ui-react";
import { UserDefault } from "../../assets";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import "./style.scss";

class MassMailer extends Component {
  constructor() {
    super();
    this.state = {
      subject: "",
      recipient: "",
      content: "",
      value: "html",
      subjectError: "",
      recipientError: "",
      contentError: "",
      activeItem: "Mass Mailer",
      errorMessage: "",
      authenticate: false,
    };
  }

  componentDidMount() {
    document.title = "Seminara | Mass Mailer";
    const cookies = new Cookies();
    if (cookies.get("jwt")) {
      this.setState({
        authenticate: true,
      });
    } else {
      sessionStorage.setItem("isLogin", false);
      this.props.history.push("/app/");
    }
  }

  // function to handle active tab
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  // function to handle input
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  // function to handle recipient input
  handleRecipient = (e) => {
    return this.state.recipient.split("\n");
  };

  // function to handle radio input
  handleChangeRadio = (e, { value }) => this.setState({ value });

  // function validation
  validate = () => {
    let SubjectError;
    let RecipientError;
    let ContentError;

    if (!this.state.subject) {
      SubjectError = "Subject harus diisi!";
    }

    if (this.state.recipient.length === 0) {
      RecipientError = "Recipient harus diisi!";
    }

    if (!this.state.content) {
      ContentError = "Content harus diisi!";
    }

    if (SubjectError || RecipientError || ContentError) {
      this.setState({
        subjectError: SubjectError,
        recipientError: RecipientError,
        contentError: ContentError,
      });
      return false;
    }

    return true;
  };

  // function to handle logout
  handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("jwt");
    this.props.history.push("/app/");
  };

  // function to handle submit
  handleSubmit = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    var recipient;
    var numberofemails;
    if (this.state.recipient.includes("\n")) {
      recipient = this.handleRecipient();
      numberofemails = recipient.length;
    } else {
      recipient = this.state.recipient;
      numberofemails = 1;
    }
    const isValid = this.validate();
    if (isValid) {
      Swal.fire({
        title: "Sending Email",
        text: "Are you sure?",
        icon: "warning",
        footer: "Will send to " + numberofemails + " email",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Send",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(process.env.REACT_APP_SERVER + "admin/sendmassmail", {
            method: "POST",
            body: JSON.stringify({
              recipients: recipient,
              subject: this.state.subject,
              type: this.state.value,
              content: this.state.content,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: cookies.get("jwt"),
            },
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.message === "Email Berhasil Dikirim") {
                Swal.fire("Terkirim!", "Email Berhasil terkirim", "success");
                window.location.reload();
              } else {
                Swal.fire("Gagal Terkirim!", res.message, "error");
              }
            })
            .catch((err) => {
              Swal.fire("Gagal Terkirim!", err, "error");
            });
        }
      });
    }
  };

  render() {
    const {
      subject,
      recipient,
      content,
      value,
      subjectError,
      recipientError,
      contentError,
      activeItem,
    } = this.state;
    return (
      <div className="wrapper">
        <div className="sidebar">
          <div className="menu">
            <div className="sidebar-title">
              <h2>Seminara Admin</h2>
            </div>
            <Menu secondary vertical>
              <Menu.Item
                name="Home"
                active={activeItem === "Home"}
                onClick={() => this.props.history.push("/app/dashboard")}
              />
              <Menu.Item
                name="Mass Mailer"
                active={activeItem === "Mass Mailer"}
                onClick={() => this.props.history.push("/app/mass-mailer")}
              />
            </Menu>
          </div>
          <div className="user">
            <div className="user-img">
              <Image src={UserDefault} size="small" circular />
            </div>
            <div className="user-name">
              <Dropdown item text="Admin">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="content-seminar">
          <div className="content-title">
            <h2>Mass Mailer</h2>
            <span style={{ color: "red" }}>
              Mailgun is a free version, so you can't send emails freely
            </span>
            {this.state.errorMessage && (
              <Message negative>
                <Message.Header>{this.state.errorMessage}</Message.Header>
              </Message>
            )}
          </div>
          <div className="content-main">
            <Card>
              <div className="input-wrapper">
                <Form>
                  <Form.Field>
                    <div className="massmailer-title-input">
                      <label>Subject</label>
                    </div>
                    <input
                      placeholder="Subject"
                      name="subject"
                      value={subject}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <div className="massmailer-title-input">
                      <label>Recipient</label>
                      {recipientError ? <p> {recipientError}</p> : ""}
                    </div>
                    <Form.TextArea
                      placeholder="Recipient"
                      name="recipient"
                      value={recipient}
                      onChange={this.handleChange}
                      rows={8}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Group inline>
                      <div className="massmailer-title-input">
                        <label>Content</label>
                        {contentError ? <p> {contentError}</p> : ""}
                      </div>
                      <div className="radio-input">
                        <Form.Radio
                          label="Html"
                          value="html"
                          checked={value === "html"}
                          onChange={this.handleChangeRadio}
                        />
                        <Form.Radio
                          label="Plain"
                          value="text"
                          checked={value === "text"}
                          onChange={this.handleChangeRadio}
                        />
                      </div>
                    </Form.Group>
                    <Form.TextArea
                      placeholder="Content Email"
                      name="content"
                      value={content}
                      onChange={this.handleChange}
                      rows={25}
                    />
                  </Form.Field>
                  <div className="massmailer-submit">
                    <Button type="submit" primary onClick={this.handleSubmit}>
                      Send
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default MassMailer;
