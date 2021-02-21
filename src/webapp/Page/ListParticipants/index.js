import React, { Component, Fragment } from "react";
import {
  Menu,
  Card,
  Image,
  Dropdown,
  Button,
  Table,
  Icon,
  Modal,
  Form,
  Input,
  Pagination,
  Transition,
  Radio,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./style.scss";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import moment from "moment";
import { UserDefault } from "../../assets";
export class ListParticipants extends Component {
  constructor() {
    super();
    this.state = {
      _id: "",
      itemid: "",
      title: "",
      partner: "",
      speaker: "",
      moderator: "",
      date: "",
      starthour: "",
      durationMinutes: "",
      modalOpen: false,
      modalEdit: false,
      openProof: false,
      data: [],
      item: [],
      AscData: [],
      DescData: [],
      idParticipants: "",
      name: "",
      phone: "",
      agency: "",
      email: "",
      proof: "",
      option: "",
      ActivePage: 1,
      totalPages: "",
      totalDocs: "",
      NameSort: true,
      activeItem: "Home",
    };
  }

  componentDidMount() {
    document.title = "Seminara | Detail";
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
    this.fetchData(1);
  }

  // function to handle input
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  // function to get data from API
  fetchData = (page) => {
    const cookies = new Cookies();
    const token = cookies.get("jwt");
    fetch(
      process.env.REACT_APP_SERVER +
        "seminars/detail/" +
        this.props.match.params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        fetch(
          process.env.REACT_APP_SERVER +
            "seminar/" +
            res.data.itemid +
            "/participants/" +
            page,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.setState({
              data: res.data.result.docs,
              totalPages: res.data.result.totalPages,
              totalDocs: res.data.result.totalDocs,
              AscData: res.AscData.result.docs,
              DescData: res.DescData.result.docs,
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
        this.setState({
          _id: res.data._id,
          itemid: res.data.itemid,
          title: res.data.title,
          partner: res.data.partner,
          speaker: res.data.speaker,
          moderator: res.data.moderator,
          date: res.data.date,
          starthour: res.data.starthour,
          durationMinutes: res.data.durationMinutes,
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

  // fucntion to handle delete
  handleDelete = (idseminar, id) => {
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
      title: "Deleting Participant",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          process.env.REACT_APP_SERVER +
            "seminar/" +
            idseminar +
            "/participants/" +
            id,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status === "success") {
              Swal.fire({
                title: "Good Joob!",
                text: "Participant Successfully Deleted",
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
    });
  };

  // function to handle submit add
  handleSubmit = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    const formData = new FormData();
    const nameProof =
      this.state.agency.replace(/\s/g, "") + this.state.name.replace(/\s/g, "");
    formData.append("name", this.state.name);
    formData.append("email", this.state.email);
    formData.append("agency", this.state.agency);
    formData.append("phone", this.state.phone);
    formData.append("option", this.state.option);
    formData.append("proof", this.state.proof);
    formData.append("nameProof", nameProof);
    Swal.fire({
      title: "Adding Participants",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          process.env.REACT_APP_SERVER +
            "seminar/" +
            this.state.itemid +
            "/participants",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: cookies.get("jwt"),
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status === "success") {
              Swal.fire({
                title: "Good Joob!",
                text: "Participants Saved Successfully",
                type: "success",
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              });
              setTimeout(() => {
                this.setState({
                  setOpen: false,
                });
                window.location.reload();
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
  };

  // function to handle submit edit
  handleSubmitEdit = (e, idseminar, id) => {
    e.preventDefault();
    const cookies = new Cookies();
    const formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("email", this.state.email);
    formData.append("agency", this.state.agency);
    formData.append("phone", this.state.phone);
    formData.append("option", this.state.option);
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
            "seminar/" +
            idseminar +
            "/participants/" +
            id,
          {
            method: "PUT",
            body: formData,
            headers: {
              Authorization: cookies.get("jwt"),
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status === "success") {
              Swal.fire({
                title: "Good Joob!",
                text: "Seminar Saved Successfully",
                type: "success",
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              });
              setTimeout(() => {
                this.setState({
                  modalEdit: false,
                });
                window.location.reload();
              }, 3000);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  // function to handle logout
  handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("jwt");
    this.props.history.push("/app/");
  };

  handlePageChange = (e, { activePage }) => {
    this.setState({ activePage });
    if (this.state.keyword) {
      this.fetchSearch(activePage, this.state.keyword);
    } else {
      this.fetchData(activePage);
    }
  };

  handleSortName = (sort) => {
    this.setState({
      NameSort: !sort,
    });
    if (sort) {
      this.setState({
        item: this.state.AscData,
      });
    } else {
      this.setState({
        item: this.state.DescData,
      });
    }
  };

  // function to handle radio
  handleRadio = (e, { value }) => {
    this.setState({
      option: value,
    });
  };

  // function to handle image
  handleImage = (e) => {
    this.setState({
      proof: e.target.files[0],
    });
  };

  render() {
    const {
      activeItem,
      _id,
      title,
      partner,
      speaker,
      moderator,
      date,
      starthour,
      durationMinutes,
      modalOpen,
      modalEdit,
      openProof,
      name,
      phone,
      agency,
      email,
      proof,
      option,
      data,
      item,
      itemid,
      ActivePage,
      totalPages,
      totalDocs,
      NameSort,
      idParticipants,
    } = this.state;
    return (
      <div>
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
                  <a href="/app/dashboard ">Seminar</a> / {title} / Participants
                </h2>
              </div>
              <div className="content-main">
                <Card>
                  <div className="seminar-table-wrapper">
                    <div className="detail-seminar">
                      <table>
                        <tr>
                          <td>Title</td>
                          <td>:</td>
                          <td>{title}</td>
                        </tr>
                        <tr>
                          <td>Partner</td>
                          <td>:</td>
                          <td>{partner}</td>
                        </tr>
                        <tr>
                          <td>Speaker</td>
                          <td>:</td>
                          <td>{speaker}</td>
                        </tr>
                        <tr>
                          <td>Moderator</td>
                          <td>:</td>
                          <td>{moderator}</td>
                        </tr>
                        <tr>
                          <td>Date</td>
                          <td>:</td>
                          <td> {moment(date, "YYYY-MM-DD").format("LL")}</td>
                        </tr>
                        <tr>
                          <td>Start Hour</td>
                          <td>:</td>
                          <td>{starthour}</td>
                        </tr>
                        <tr>
                          <td>Duration (Minutes)</td>
                          <td>:</td>
                          <td>{durationMinutes}</td>
                        </tr>
                      </table>
                      <div className="seminar-detail btn">
                        <div>
                          <Button
                            icon="edit outline"
                            size="tiny"
                            color="yellow"
                            content="Edit"
                            onClick={() =>
                              this.props.history.push(
                                "/app/seminar/update/" + _id
                              )
                            }
                          />
                          <Button
                            icon="trash"
                            size="tiny"
                            color="red"
                            content="Delete"
                            onClick={() => {
                              this.handleDelete(_id);
                            }}
                          />
                        </div>
                        <div className="seminar-detail btn add-participants">
                          <Button
                            icon="add"
                            size="tiny"
                            color="blue"
                            content="Add Participants"
                            onClick={() =>
                              this.setState({
                                modalOpen: true,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <Table celled fixed singleLine>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell
                            onClick={() => this.handleSortName(NameSort)}
                          >
                            <Icon name="sort" />
                            Name
                          </Table.HeaderCell>
                          <Table.HeaderCell>Email</Table.HeaderCell>
                          <Table.HeaderCell>Agency</Table.HeaderCell>
                          <Table.HeaderCell>Phone</Table.HeaderCell>
                          <Table.HeaderCell>Action</Table.HeaderCell>
                          <Table.HeaderCell>Proof</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {item.map((item, index) => (
                          <Table.Row key={index + 1}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.email}</Table.Cell>
                            <Table.Cell>{item.agency}</Table.Cell>
                            <Table.Cell>{item.phone}</Table.Cell>
                            <Table.Cell>
                              <Button
                                icon="edit"
                                size="mini"
                                color="yellow"
                                onClick={() =>
                                  this.setState({
                                    itemid: item.seminaritemid,
                                    idParticipants: item.itemid,
                                    name: item.name,
                                    phone: item.phone,
                                    email: item.email,
                                    agency: item.agency,
                                    option:item.option,
                                    modalEdit: true,
                                  })
                                }
                              />

                              <Icon
                                link
                                bordered
                                inverted
                                color="red"
                                name="delete"
                                onClick={() => {
                                  this.handleDelete(
                                    item.seminaritemid,
                                    item.itemid
                                  );
                                }}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Icon
                                link
                                bordered
                                inverted
                                name="image"
                                onClick={() => {
                                  this.setState({
                                    proof:
                                      process.env.REACT_APP_URL_ASSETS +
                                      item.proof,
                                    openProof: true,
                                    option: item.option,
                                  });
                                }}
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
                                onPageChange={this.handlePageChange}
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
                          color="red"
                          name="delete"
                        />
                        <p>: To Delete Data</p>
                      </div>
                      <div className="help-row">
                        <Icon link bordered inverted name="image outline" />
                        <p>: To Show Proof of Payment</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <Transition.Group open={modalEdit} animation="fly up" duration={800}>
            {modalEdit && (
              <Modal
                open={modalEdit}
                closeIcon
                onClose={() =>
                  this.setState({
                    modalEdit: false,
                  })
                }
                closeOnDimmerClick={false}
              >
                <Modal.Header>Edit Participants</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Form
                      onSubmit={(e) =>
                        this.handleSubmitEdit(e, itemid, idParticipants)
                      }
                    >
                      <Form.Field>
                        <label>Name</label>
                        <Form.Input
                          placeholder="Name"
                          name="name"
                          value={name}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Email</label>
                        <Form.Input
                          placeholder="Email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Agency</label>
                        <Form.Input
                          placeholder="Agency"
                          name="agency"
                          value={agency}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Phone</label>
                        <Form.Input
                          placeholder="Phone"
                          name="phone"
                          value={phone}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>Option Pay</Form.Field>
                      <Form.Field>
                        <Radio
                          label="Pay"
                          name="option"
                          value="Pay"
                          checked={option === "Pay"}
                          onChange={this.handleRadio}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="Free"
                          name="option"
                          value="Free"
                          checked={option === "Free"}
                          onChange={this.handleRadio}
                        />
                      </Form.Field>
                      <Button type="submit" primary>
                        Submit
                      </Button>
                    </Form>
                  </Modal.Description>
                </Modal.Content>
              </Modal>
            )}
          </Transition.Group>
          <Transition.Group open={modalOpen} animation="fly up" duration={800}>
            {modalOpen && (
              <Modal
                open={modalOpen}
                closeIcon
                onClose={() =>
                  this.setState({
                    modalOpen: false,
                  })
                }
                closeOnDimmerClick={false}
              >
                <Modal.Header>Participants</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Form onSubmit={this.handleSubmit}>
                      <Form.Field>
                        <label>Name</label>
                        <Form.Input
                          placeholder="Name"
                          name="name"
                          value={name}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Email</label>
                        <Form.Input
                          placeholder="Email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Agency</label>
                        <Form.Input
                          placeholder="Agency"
                          name="agency"
                          value={agency}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Phone</label>
                        <Form.Input
                          placeholder="Phone"
                          name="phone"
                          value={phone}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Field>
                      <Form.Field>Option Pay</Form.Field>
                      <Form.Field>
                        <Radio
                          label="Pay"
                          name="option"
                          value="Pay"
                          checked={option === "Pay"}
                          onChange={this.handleRadio}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="Free"
                          name="option"
                          value="Free"
                          checked={option === "Free"}
                          onChange={this.handleRadio}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Bukti</label>
                        <Form.Input
                          type="file"
                          name="proof"
                          onChange={this.handleImage}
                          required
                        />
                      </Form.Field>
                      <Button type="submit" primary>
                        Submit
                      </Button>
                    </Form>
                  </Modal.Description>
                </Modal.Content>
              </Modal>
            )}
          </Transition.Group>
          <Transition.Group open={openProof} animation="fly up" duration={800}>
            {openProof && (
              <Modal
                open={openProof}
                closeIcon
                onClose={() =>
                  this.setState({
                    openProof: false,
                  })
                }
                closeOnDimmerClick={false}
              >
                <Modal.Header>Proof ({option})</Modal.Header>
                <Modal.Content>
                  <Image src={proof} fluid />
                </Modal.Content>
              </Modal>
            )}
          </Transition.Group>
        </Fragment>
      </div>
    );
  }
}

export default ListParticipants;
