import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import { Button, Form, Radio } from "semantic-ui-react";
import Swal from "sweetalert2";
import "./style.scss";
import "semantic-ui-css/semantic.min.css";

class Registration extends React.Component {
  constructor() {
    super();
    this.state = {
      itemid: "",
      name: "",
      phone: "",
      email: "",
      agency: "",
      option: "",
      proof: "",
      data: [],
      redirect: false,
    };
  }

  componentDidMount() {
    document.title = "Registrasi Seminar";
    this.fetchData();
  }

  showErrorAlert = (err) => {
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
      text: err,
    });
  };

  fetchData = () => {
    fetch(
      process.env.REACT_APP_SERVER +
        "public/seminars/detail/" +
        this.props.match.params.id,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          title: res.data[0].title,
          itemid: res.data[0].itemid,
        });
      })
      .catch((err) => {
        this.showErrorAlert(err);
      });
  };

  // function to handle input
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
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

  // function to handle submit
  handleSubmit = (e) => {
    e.preventDefault();
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
      title: "Registration Participants",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Register",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          process.env.REACT_APP_SERVER +
            "public/seminar/" +
            this.state.itemid +
            "/participants",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status === "success") {
              Swal.fire({
                title: "Good Joob!",
                text: "Registration Successfully",
                type: "success",
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              });
              setTimeout(() => {
                this.props.history.push(
                  "/app/successful-registration/" +
                    this.state.itemid +
                    "/" +
                    res.data.itemid
                );
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

  render() {
    const { name, phone, agency, email, option, proof } = this.state;
    return (
      <React.Fragment>
        <div className="register-bg"> </div>
        <div className="register-wrapper">
          <div className="register-title">
            <h1>Seminar : {this.state.title}</h1>
          </div>
          <div className="register-form">
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>Nama</label>
                <Form.Input
                  placeholder="Nama"
                  type="text"
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
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Asal Instansi / Universitas</label>
                <Form.Input
                  placeholder="Agency"
                  type="text"
                  name="agency"
                  value={agency}
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Nomor WA</label>
                <Form.Input
                  placeholder="Phone"
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Form.Field>Pilihan Bayar</Form.Field>
              <Form.Field>
                <Radio
                  label="Bayar"
                  name="option"
                  value="Pay"
                  checked={option === "Pay"}
                  onChange={this.handleRadio}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Gratis"
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
                Daftar
              </Button>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Registration);
