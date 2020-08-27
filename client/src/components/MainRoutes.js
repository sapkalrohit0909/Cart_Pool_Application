import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

import Login from './User/Login';
import Register from './User/Register';

import Admin from './Admin/Manage';
import ManageStores from './Store/ManageStores';
import ManageProducts from './Store/ManageProducts';
import ManagePools from './Pooler/ManagePools';

import MyPool from './Pooler/MyPool';
import PoolerStore from './Pooler/GetStoreProducts'
import Cart from './Shopping/Cart';
import ManageOrder from './Shopping/ManageOrder';
import PickUp from './Shopping/PickUp';
import PickUpOption from './Orders/PickUpOption';
import Message from './Pooler/Message';

import DeliveringOrders from './Orders/DeliveringOrders';
import OrdersInDelivery from './Orders/OrdersInDelivery';
import PendingUserOrders from './Orders/PendingUserOrders';
import PickedUpOrders from './Orders/PickedUpOrders';
import UserPickedUpOrders from './Orders/UserPickedUpOrders';

class MainRoutes extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={Navbar} />
                <Route path="/admin" component={Admin} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/stores" component={ManageStores} />
                <Route path="/products" component={ManageProducts} />
                <Route path="/mypool" component={MyPool} />
                <Route path="/pools" component={ManagePools} />
                <Route path="/poolstores" component={PoolerStore} />
                <Route path="/cart" component={Cart} />
                <Route path="/order" component={ManageOrder} />
                <Route path="/message" component={Message} />
                <Route path="/pickup" component={PickUp} />
                <Route path="/pickup-option" component={PickUpOption} />

                <Route path="/delivering-orders" component={DeliveringOrders} />
                <Route path="/orders-in-delivery" component={OrdersInDelivery} />
                <Route path="/pending-user-orders" component={PendingUserOrders} />
                <Route path="/picked-up-orders" component={PickedUpOrders} />
                <Route path="/user-picked-up-orders" component={UserPickedUpOrders} />
            </div>
        )
    }
}

export default MainRoutes;