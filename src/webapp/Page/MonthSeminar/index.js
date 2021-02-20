import React, { Component, Fragment } from "react";
import {
  Menu,
  Card,
  Image,
  Dropdown,
  Button,
  Table,
  Icon,
  Pagination,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import moment from "moment";
import { UserDefault } from "../../assets";

class MonthSeminar extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      item: [],
      AscTitleData: [],
      DescTitleData: [],
      AscDateData: [],
      DescDateData: [],
      TitleSort: true,
      DateSort: true,
      ActivePage: 1,
      totalPages: "",
      totalDocs: "",
      activeItem: "Home",
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  componentDidMount() {
    document.title = "Seminara | Seminar";
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
    // Get Data
    this.fetchData(1);
  }

  // function to get data from API
  fetchData = (page) => {
    const cookies = new Cookies();
    const token = cookies.get("jwt");
    fetch(process.env.REACT_APP_SERVER + "seminars/month/" + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          data: res.data.result.docs,
          totalPages: res.data.result.totalPages,
          totalDocs: res.data.result.totalDocs,
          AscTitleData: res.AscTitleData.result.docs,
          DescTitleData: res.DescTitleData.result.docs,
          AscDateData: res.AscDateData.result.docs,
          DescDateData: res.DescDateData.result.docs,
          item: res.data.result.docs,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: err,
        });
      });
  };

  handlePageChage = (e, { activePage }) => {
    this.setState({ activePage });
    if (this.state.keyword) {
      this.fetchSearch(activePage, this.state.keyword);
    } else {
      this.fetchData(activePage);
    }
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

  // fucntion to handle delete
  handleDelete = (id) => {
    const cookies = new Cookies();
    const token = cookies.get("jwt");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    Swal.fire({
      title: "Deleting Seminar",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(process.env.REACT_APP_SERVER + "seminars/" + id, {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.status === "Success") {
                Swal.fire({
                  title: "Good Joob!",
                  text: "Seminar Successfully Deleted",
                  type: "success",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 3000,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancel",
            "Cancel deleted seminar",
            "error"
          );
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: err,
        });
      });
  };

  // function to handle registration
  handleRegistration = (id) => {
    const el = document.createElement("textarea");
    el.value = process.env.REACT_APP_URL + "app/registration/" + id;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    Swal.fire({
      title: "Successful Copy Link!",
      text: "Want to go to that link?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, go to the link",
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.history.push("/app/registration/" + id);
      }
    });
  };

  handleSortTitle = (sort) => {
    this.setState({
      TitleSort: !sort,
    });
    if (sort) {
      this.setState({
        item: this.state.AscTitleData,
      });
    } else {
      this.setState({
        item: this.state.DescTitleData,
      });
    }
  };

  handleSortDate = (sort) => {
    this.setState({
      DateSort: !sort,
    });
    if (sort) {
      this.setState({
        item: this.state.AscDateData,
      });
    } else {
      this.setState({
        item: this.state.DescDateData,
      });
    }
  };

  render() {
    const {
      activeItem,
      data,
      ActivePage,
      totalPages,
      totalDocs,
      TitleSort,
      DateSort,
      item,
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
                    <Dropdown.Item onClick={() => this.handleLogout()}>
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
                <a href="/app/dashboard">Seminar</a> / This Month
              </h2>
              <Button
                primary
                onClick={() => this.props.history.push("/app/seminar/add")}
              >
                Add Seminar
              </Button>
            </div>
            <div className="content-main">
              <Card>
                <div className="seminar-table-wrapper">
                  <Table celled fixed singleLine>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell
                          onClick={() => this.handleSortTitle(TitleSort)}
                        >
                          {" "}
                          <Icon name="sort" />
                          Title
                        </Table.HeaderCell>
                        <Table.HeaderCell
                          onClick={() => this.handleSortDate(DateSort)}
                        >
                          <Icon name="sort" />
                          Date
                        </Table.HeaderCell>
                        <Table.HeaderCell>Start Hour</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Registration Link</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {item.map((item, index) => (
                        <Table.Row key={index + 1}>
                          <Table.Cell>{item.title}</Table.Cell>
                          <Table.Cell>
                            {moment(item.date, "YYYY-MM-DD").format("LL")}
                          </Table.Cell>
                          <Table.Cell>{item.starthour}</Table.Cell>
                          <Table.Cell>
                            <Icon
                              link
                              bordered
                              inverted
                              color="yellow"
                              name="edit outline"
                              onClick={() =>
                                this.props.history.push(
                                  "/app/seminar/update/" + item._id
                                )
                              }
                            />

                            <Icon
                              link
                              bordered
                              inverted
                              color="green"
                              name="zoom-in"
                              onClick={() =>
                                this.props.history.push(
                                  "/app/seminar/detail/" + item._id
                                )
                              }
                            />

                            <Icon
                              link
                              bordered
                              inverted
                              color="red"
                              name="delete"
                              onClick={() => {
                                this.handleDelete(item.itemid);
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Icon
                              link
                              bordered
                              inverted
                              color="blue"
                              name="registered"
                              onClick={() => this.handleRegistration(item._id)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                  <div className="detail-data">
                    {" "}
                    <h3>Total : {totalDocs}</h3>
                    <div className="pagination">
                      {item.length ? (
                        <p>
                          {" "}
                          {
                            <Pagination
                              ActivePage={ActivePage}
                              ellipsisItem={{
                                content: <Icon name="ellipsis horizontal" />,
                                icon: true,
                              }}
                              firstItem={{
                                content: <Icon name="angle double left" />,
                                icon: true,
                              }}
                              lastItem={{
                                content: <Icon name="angle double right" />,
                                icon: true,
                              }}
                              prevItem={{
                                content: <Icon name="angle left" />,
                                icon: true,
                              }}
                              nextItem={{
                                content: <Icon name="angle right" />,
                                icon: true,
                              }}
                              onPageChange={this.handlePageChage}
                              totalPages={totalPages}
                            />
                          }
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="help">
                    <div className="help-row">
                      <Icon
                        link
                        bordered
                        inverted
                        color="yellow"
                        name="edit outline"
                      />
                      <p>: To Edit Data</p>
                    </div>
                    <div className="help-row">
                      <Icon
                        link
                        bordered
                        inverted
                        color="green"
                        name="zoom-in"
                      />
                      <p> : For Detailed Data (or View Participants)</p>
                    </div>
                    <div className="help-row">
                      <Icon link bordered inverted color="red" name="delete" />
                      <p>: To Delete Data</p>
                    </div>
                    <div className="help-row">
                      <Icon
                        link
                        bordered
                        inverted
                        color="blue"
                        name="registered"
                      />
                      <p>
                        : For Participant Registration (Link is Copied
                        Automatically)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MonthSeminar;
