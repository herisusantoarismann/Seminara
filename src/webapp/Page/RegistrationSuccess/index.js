import React from "react";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import "./style.scss";

class RegistrationSuccess extends React.Component {
  constructor() {
    super();
    this.state = {
      item: [],
    };
  }

  componentDidMount() {
    document.title = "Registrasi Sukses";
    this.fetchData();
    this.fetchSeminar();
  }

  // function to get data from API
  fetchData = () => {
    fetch(
      process.env.REACT_APP_SERVER +
        "public/seminars/" +
        this.props.match.params.idseminar +
        "/participants/" +
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
          item: res.data[0],
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  // function to get data from API
  fetchSeminar = () => {
    fetch(
      process.env.REACT_APP_SERVER +
        "public/seminars/detail/" +
        this.props.match.params.idseminar,
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

  render() {
    const { item, title } = this.state;
    return (
      <React.Fragment>
        <div className="register-bg"></div>
        <div className="registersuccess-wrapper">
          <div className="registersuccess-title">
            <h1>Registrasi Sukses!</h1>
          </div>
          <div className="registersuccess-form">
            <table>
              <tr>
                <td className="label">Nama Seminar</td>
                <td>:</td>
                <td>{title}</td>
              </tr>
              <tr>
                <td className="label">Data Peserta</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="label">Nama</td>
                <td>:</td>
                <td>{item.name}</td>
              </tr>
              <tr>
                <td className="label">Email</td>
                <td>:</td>
                <td>{item.email}</td>
              </tr>
              <tr>
                <td className="label">Agency</td>
                <td>:</td>
                <td>{item.agency}</td>
              </tr>
              <tr>
                <td className="label">Nomor HP</td>
                <td>:</td>
                <td>{item.phone}</td>
              </tr>
            </table>
            <div className="registersuccess-code">
              <h2>{item.itemid}</h2>
              <p>
                * <i>Tolong dicatat untuk bukti registrasi</i>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(RegistrationSuccess);
