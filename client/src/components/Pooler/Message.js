import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import * as Cookies from "js-cookie";
import '../../App.css';
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            user: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    sendMessage = (e) => {
        e.preventDefault();
        const data = {
            receiver: this.state.user,
            message: this.state.message
        }

        axios.post(base.serverURI+'/api/message/sendmessage', data, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('Message sent successfully!');
                    document.getElementById("reset").reset();
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    render() {
        return (
            <Form onSubmit={this.sendMessage.bind(this)} className="login-form" id="reset">
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label><strong>Receiver</strong></Form.Label>
                    <Form.Control
                        type="text"
                        name="user"
                        onChange={this.handleChange}
                        placeholder="Charles"
                        required />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows="3"
                        name="message"
                        placeholder="Hello!"
                        onChange={this.handleChange}
                        required />
                </Form.Group>
                <Button variant="primary" type="submit">Send</Button>
            </Form>
        )
    }
}

export default Message;