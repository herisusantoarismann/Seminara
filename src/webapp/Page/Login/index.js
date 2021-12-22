import React, { Component } from "react";
import { Card, Form, Button, Image, Message } from "semantic-ui-react";
import { Logo } from "../../assets";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import "semantic-ui-css/semantic.min.css";
import "./style.scss";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
      authenticate: true,
      LoginFail: false,
    };

    window.onbeforeunload = (e) => {
      sessionStorage.clear();
    };
  }

  componentDidMount() {
    document.title = "Seminara | Login";

    // Check login to display message "login First"
    if (sessionStorage.getItem("isLogin") === "false") {
      this.setState({
        authenticate: false,
      });
    }
  }

  //function validation
  validate = () => {
    let UserError;
    let PassError;

    if (!this.state.username) {
      UserError = "Username harus diisi!";
    }

    if (!this.state.password) {
      PassError = "Password harus diisi!";
    }

    if (UserError || PassError) {
      this.setState({ usernameError: UserError, passwordError: PassError });
      return false;
    }

    return true;
  };

  // function to handle input
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  // function to handle submit login
  handleSubmit = (e) => {
    const isValid = this.validate();
    if (isValid) {
      fetch(process.env.REACT_APP_SERVER + "admin/login", {
        method: "POST",
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.token === undefined) {
            this.setState({
              LoginFail: true,
            });
          } else {
            const cookies = new Cookies();
            cookies.set("jwt", res.token, { path: "/" });
            sessionStorage.setItem("isLogin", true);
            this.props.history.push("/app/dashboard");
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Something went wrong!",
            text: err,
          });
          console.log(err);
        });
    }
  };

  render() {
    const { username, password, usernameError, passwordError } = this.state;
    return (
      <div className="login-wrapper">
        <div className="login-logo">
          <Image src={Logo} alt="logo" />
        </div>
        <div className="login-title">
          <h2>Sign in to RuangSeminar</h2>
          {/* Displays a message if not logged in */}
          {!this.state.authenticate && (
            <Message negative>
              <p>Silahkan Login Terlebih dahulu</p>
            </Message>
          )}
          {/* Displays a message if login fails */}
          {this.state.LoginFail && (
            <Message negative>
              <p>Username atau Password Salah</p>
            </Message>
          )}
        </div>
        <Card>
          <div className="login-input">
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>
                  <h4>Username</h4>
                </label>
                <input
                  placeholder="Username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                />
                {/* If the input is empty */}
                {usernameError ? (
                  <Message negative>
                    <p>{usernameError}</p>
                  </Message>
                ) : (
                  ""
                )}
              </Form.Field>
              <Form.Field>
                <Form.Group inline>
                  <label>
                    <h4>Password</h4>
                  </label>
                  <div className="login-forgot">
                    <a href="/login">Forgot password?</a>
                  </div>
                </Form.Group>
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                />
                {/* If the input is empty */}
                {passwordError ? (
                  <Message negative>
                    <p>{passwordError}</p>
                  </Message>
                ) : (
                  ""
                )}
              </Form.Field>
              <div className="login-submit">
                <Button type="submit" primary>
                  Sign in
                </Button>
              </div>
            </Form>
          </div>
        </Card>
        <Card>
          <div className="login-create">
            <p>
              Don't have an account?{" "}
              <a href="/login">Create an account here.</a>
            </p>
          </div>
        </Card>
      </div>
    );
  }
}
