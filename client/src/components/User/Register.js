import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Col } from 'react-bootstrap';
import base from '../../config/baseUrl';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      nickName: "",
      email: "",
      password: "",
      street: "",
      city: "",
      state: "",
      zip: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const credential = {
      name: this.state.name,
      nickName: this.state.nickName,
      email: this.state.email,
      password: this.state.password,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip
    }

    axios.post(base.serverURI +'/user/register', credential)
      .then(res => {
        if (res.status === 200) {
          alert('Registration success, please check your email!');
          this.props.history.push('/login');
        }
      }).catch((err) => {
        alert(err.response.data.message);
      });
  }

  render() {

    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <h2>Create account</h2>
          <Form.Group controlId="formUsername">
            <Form.Label>Screen name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              minLength="3"
              maxLength="30"
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              name="nickName"
              minLength="3"
              maxLength="30"
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="At least 6 characters"
              minLength="6"
              maxLength="16"
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Form.Group controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control
              placeholder="1234 Main St"
              name="street"
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                onChange={this.handleChange}
                required />
            </Form.Group>
            <Form.Group as={Col}
              controlId="formGridCity">
              <Form.Label>State</Form.Label>
              <Form.Control
                name="state"
                onChange={this.handleChange}
                required />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                name="zip"
                onChange={this.handleChange}
                minLength="5"
                maxLength="5"
                required />
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            Register
          </Button>
          <div>Already have an account? <Link to="/login">Login</Link></div><br />
        </Form>
      </div>
    )

  }
}

export default Register;
