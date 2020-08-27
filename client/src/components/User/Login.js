import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap'
import '../../App.css';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({ [e.target.type]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let credential = {
      email: this.state.email,
      password: this.state.password
    }
    this.verifyUser(credential);
  }

  verifyUser = (data) => {
    axios.post(base.serverURI + '/auth/login', data)
      .then(res => {
        if (res.status === 200) {
          Cookies.set('token', res.data.webToken, { path: '/' });
          Cookies.set('role', res.data.role, { path: '/' });
          window.location.reload();
        }
      }).catch((err) => {
        alert(err.response.data.message);
      });
  }

  handleGoogleSSO = (e) => {
    window.location.replace(base.serverURI + '/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect');
    Cookies.set('google', 'Google', { path: '/' });
  }

  render() {

    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <h2>Login</h2>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email" value={this.state.email}
              onChange={this.handleChange}
              required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
                </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="At least 6 characters"
              minLength="6"
              maxLength="16"
              value={this.state.password}
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Button variant="primary" type="submit">Login</Button>
          <div>New? <Link to="/register">Create account</Link></div>
          <Button variant="warning" type="submit" onClick={this.handleGoogleSSO.bind(this)}>Google</Button>
        </Form>
      </div>
    )
  }
}

export default Login;