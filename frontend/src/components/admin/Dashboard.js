import Sidebar from "./Sidebar";
import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from "react";
import { getAdminProducts } from "../../actions/productActions";
import {getUsers} from '../../actions/userActions'
import {adminOrders as adminOrdersAction} from '../../actions/orderActions'
import { Link } from "react-router-dom";

export default function Dashboard () {
    const { products = [] } = useSelector( state => state.productsState);
    const { adminOrders = [] } = useSelector( state => state.orderState);
    const { users = [] } = useSelector( state => state.userState);
    const dispatch = useDispatch();
    let outOfStock = 0;

    if (products.length > 0) {
        products.forEach( product => {
            if( product.stock === 0  ) {
                outOfStock = outOfStock + 1;
            }
        })
    }

    let totalAmount = 0;
    if (adminOrders.length > 0) {
        adminOrders.forEach( order => {
            totalAmount += order.totalPrice
        })
    }

    useEffect( () => {
       dispatch(getAdminProducts);
       dispatch(getUsers);
       dispatch(adminOrdersAction)
    }, [])


    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: "220px" }}>
            <Sidebar />
        </div>

        {/* Main Content */}
        <div
            style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px",
            }}
        >
            <h1 className="my-4">Dashboard</h1>

            {/* Total Amount Card */}
            <div style={{ width: "100%", maxWidth: "900px", marginBottom: "30px" }}>
            <div className="card text-white bg-primary o-hidden h-100 text-center">
                <div className="card-body card-font-size">
                Total Amount<br />
                <b>${totalAmount}</b>
                </div>
            </div>
            </div>

            {/* Cards Row */}
            <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "900px",
                gap: "20px",
            }}
            >
            {/* Products */}
            <div style={{ flex: "1 1 200px" }} className="card text-white bg-success o-hidden h-100 text-center">
                <div className="card-body card-font-size">
                Products<br /> <b>{products.length}</b>
                </div>
                <Link className="card-footer text-white" to="/admin/products">
                View Details <i className="fa fa-angle-right"></i>
                </Link>
            </div>

            {/* Orders */}
            <div style={{ flex: "1 1 200px" }} className="card text-white bg-danger o-hidden h-100 text-center">
                <div className="card-body card-font-size">
                Orders<br /> <b>{adminOrders.length}</b>
                </div>
                <Link className="card-footer text-white" to="/admin/orders">
                View Details <i className="fa fa-angle-right"></i>
                </Link>
            </div>

            {/* Users */}
            <div style={{ flex: "1 1 200px" }} className="card text-white bg-info o-hidden h-100 text-center">
                <div className="card-body card-font-size">
                Users<br /> <b>{users.length}</b>
                </div>
                <Link className="card-footer text-white" to="/admin/users">
                View Details <i className="fa fa-angle-right"></i>
                </Link>
            </div>

            {/* Out of Stock */}
            <div style={{ flex: "1 1 200px" }} className="card text-white bg-warning o-hidden h-100 text-center">
                <div className="card-body card-font-size">
                Out of Stock<br /> <b>{outOfStock}</b>
                </div>
            </div>
            </div>
        </div>
        </div>

    )
}