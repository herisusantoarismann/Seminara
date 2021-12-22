import React, { Component, Fragment } from "react";
import {
  Menu,
  Card,
  Image,
  Dropdown,
  Form,
  Input,
  Button,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import moment from "moment";
import { UserDefault } from "../../assets";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      partner: "",
      speaker: "",
      moderator: "",
      date: "",
      starthour: "",
      durationMinutes: "",
      quota: "",
      activeItem: "Home",
      authenticate: false,
    };

    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    document.title = "Seminara | Update Seminar";
    const cookies = new Cookies();
    const authenticate = cookies.get("jwt");
    // User authentication
    if (authenticate) {
      this.setState({
        authenticate: true,
      });
    } else {
      sessionStorage.setItem("isLogin", false);
      this.props.history.push("/app/");
    }
    this.fetchData();
  }

  // function to get data from API
  fetchData = () => {
    const cookies = new Cookies();
    const token = cookies.get("jwt");
    fetch(
      process.env.REACT_APP_SERVER +
        "seminars/detail/" +
        this.props.match.params.id,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          title: res.data.title,
          partner: res.data.partner,
          speaker: res.data.speaker,
          moderator: res.data.moderator,
          date: moment(res.data.date).format("yyyy-MM-DD"),
          starthour: res.data.starthour,
          durationMinutes: res.data.durationMinutes,
          quota: res.data.quota,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  // function to handle active tab
  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  // function to handle logout
  handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("jwt");
    this.props.history.push("/app/");
  };

  // function to handle input
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  // function to handle submit
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.quota > 1000) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Quota exceeded!",
      });
    } else {
      const cookies = new Cookies();
      Swal.fire({
        title: "Updating Seminar",
        text: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Update",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(
            process.env.REACT_APP_SERVER +
              "seminars/" +
              this.props.match.params.id,
            {
              method: "PUT",
              body: JSON.stringify({
                title: this.state.title,
                partner: this.state.partner,
                speaker: this.state.speaker,
                moderator: this.state.moderator,
                date: this.state.date,
                starthour: this.state.starthour,
                durationMinutes: this.state.durationMinutes,
                quota: this.state.quota,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: cookies.get("jwt"),
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.status === "Success") {
                Swal.fire({
                  title: "Good Joob!",
                  text: "Seminar Saved Successfully",
                  type: "success",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 3000,
                });
                setTimeout(() => {
                  this.goBack();
                }, 3000);
              }
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: err,
              });
            });
        }
      });
    }
  };

  // function to back previous page
  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {
      activeItem,
      title,
      partner,
      speaker,
      moderator,
      date,
      starthour,
      durationMinutes,
      quota,
    } = this.state;
    return (
      <Fragment>
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
              <h2>
                <a href="/app/dashboard">Seminar</a> / Update
              </h2>
            </div>
            <div className="content-main">
              <Card>
                <div className="add-input-wrapper">
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Title</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Title"
                          name="title"
                          value={title}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Partner</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Partner"
                          name="partner"
                          type="text"
                          value={partner}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Speaker</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Speaker"
                          name="speaker"
                          type="text"
                          value={speaker}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Moderator</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Moderator"
                          name="moderator"
                          type="text"
                          value={moderator}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Date</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          type="date"
                          name="date"
                          value={date}
                          onChange={this.handleChange}
                          width={4}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Start Hours</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Start Hour"
                          name="starthour"
                          type="time"
                          value={starthour}
                          onChange={this.handleChange}
                          width={4}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Duration (minutes)</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Duration"
                          name="durationMinutes"
                          value={durationMinutes}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </Form.Field>
                    <Form.Field inline>
                      <div className="add-input-title">
                        <label>Quota (maks 1000)</label>
                      </div>
                      <div className="add-input-place">
                        <Form.Input
                          placeholder="Quota"
                          name="quota"
                          value={quota}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </Form.Field>
                    <div className="add-seminar-submit">
                      <Button type="submit" primary>
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Home;
