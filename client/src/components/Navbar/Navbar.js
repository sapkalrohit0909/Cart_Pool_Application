import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {
    Collapse, Navbar, NavbarToggler,
    Nav, NavItem, NavLink, Spinner
} from 'reactstrap';
import * as Cookies from "js-cookie";
let userRole = Cookies.get('role');
let google = Cookies.get('google');

class NavbarPage extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    handleLogout = () => {
        Cookies.remove('role', { path: '/' });
        Cookies.remove('token', { path: '/' });
        this.props.history.push('/login');
        window.location.reload();
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        let main = null;
        if (userRole === 'ADMIN') {
            main = (
                <div>
                    <Navbar color="light" light expand="md">
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/admin">Admin Homepage</NavLink>
                            </NavItem>
                        </Nav>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/admin">Admin</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/" onClick={this.handleLogout}>Logout</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            );
        } else if (userRole === 'POOLER') {
            main = (
                <div>
                    <Navbar color="light" light expand="md">
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/pools">Pooler Homepage</NavLink>
                            </NavItem>
                        </Nav>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/pools">Pool Details</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/poolstores">Search Store</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/cart">Cart</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/order">Order</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/message">Message</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/" onClick={this.handleLogout}>Logout</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            );
        } else {
            main = (
                <div>
                    <Navbar color="light" light expand="md">
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/">CartShare </NavLink>
                            </NavItem>
                        </Nav>
                        <div>
                            <Spinner type="grow" color="primary" />
                            <Spinner type="grow" color="secondary" />
                            <Spinner type="grow" color="success" />
                            <Spinner type="grow" color="danger" />
                            <Spinner type="grow" color="warning" />
                            <Spinner type="grow" color="info" />
                            <Spinner type="grow" color="light" />
                            <Spinner type="grow" color="dark" />
                            <Spinner color="primary" />
                            <Spinner color="secondary" />
                            <Spinner color="success" />
                            <Spinner color="danger" />
                            <Spinner color="warning" />
                            <Spinner color="info" />
                            <Spinner color="light" />
                            <Spinner color="dark" />
                        </div>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/login">Login </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/register">Register</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            )
        }

        let redirect = null;
        if (google) {
            if (window.location.href.toString() === 'http://localhost:3000/oauth2/redirect?error=Looks%20like%20you%27re%20signed%20up%20with%20local%20account.%20Please%20use%20your%20local%20account%20to%20login.#') {
                alert('You have already registered in our system by your email, please login with your local credentials');
                Cookies.remove('google', { path: '/' });
                window.location.reload();
            } else {
                let location = window.location.href.toString().replace('http://localhost:3000/oauth2/redirect?token=', '');
                Cookies.set('token', location.substring(0, location.length - 1), { path: '/' });
                Cookies.set('role', 'POOLER', { path: '/' });
                Cookies.remove('google', { path: '/' });
                window.location.reload();
            }
        } else if (userRole === 'ADMIN') {
            redirect = <Redirect to="/admin" />
        } else if (userRole === 'POOLER') {
            redirect = <Redirect to="/pools" />
        } else {
            redirect = <Redirect to="/login" />
        }
        return (
            <div>
                {main}
                {redirect}
            </div>
        )
    }
}

export default NavbarPage;