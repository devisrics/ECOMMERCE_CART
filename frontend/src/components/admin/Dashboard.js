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
        <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
  {/* Sidebar */}
  <div style={{ width: "220px" }}>
    <Sidebar />
  </div>

  {/* Main Content */}
  <div
    style={{
      flex: 1,
      padding: "30px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h2 style={{ marginBottom: "25px", color: "#333" }}>Dashboard</h2>

    {/* Total Amount */}
    <div style={{ marginBottom: "30px" }}>
      <div className="card text-white bg-primary text-center">
        <div className="card-body card-font-size">
          Total Amount
          <br />
          <strong>${totalAmount}</strong>
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      {/* Products */}
      <div className="card text-white bg-success text-center">
        <div className="card-body card-font-size">
          Products
          <br />
          <strong>{products.length}</strong>
        </div>
        <Link className="card-footer text-white text-decoration-none" to="/admin/products">
          View Details <i className="fa fa-angle-right"></i>
        </Link>
      </div>

      {/* Orders */}
      <div className="card text-white bg-danger text-center">
        <div className="card-body card-font-size">
          Orders
          <br />
          <strong>{adminOrders.length}</strong>
        </div>
        <Link className="card-footer text-white text-decoration-none" to="/admin/orders">
          View Details <i className="fa fa-angle-right"></i>
        </Link>
      </div>

      {/* Users */}
      <div className="card text-white bg-info text-center">
        <div className="card-body card-font-size">
          Users
          <br />
          <strong>{users.length}</strong>
        </div>
        <Link className="card-footer text-white text-decoration-none" to="/admin/users">
          View Details <i className="fa fa-angle-right"></i>
        </Link>
      </div>

      {/* Out of Stock */}
      <div className="card text-dark bg-warning text-center">
        <div className="card-body card-font-size">
          Out of Stock
          <br />
          <strong>{outOfStock}</strong>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}