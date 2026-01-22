import { Fragment, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import { MDBDataTable } from 'mdbreact';
import { useDispatch, useSelector } from 'react-redux';
import { userOrders as userOrdersAction } from '../../actions/orderActions';
import { Link } from 'react-router-dom';

export default function UserOrders() {
    const dispatch = useDispatch();

    const { userOrders = [] } = useSelector(state => state.orderState);

    useEffect(() => {
        dispatch(userOrdersAction());
    }, [dispatch]);

    const setOrders = () => {
        const data = {
            columns: [
                { label: "Order ID", field: "id", sort: "asc" },
                { label: "Number of Items", field: "numOfItems", sort: "asc" },
                { label: "Amount", field: "amount", sort: "asc" },
                { label: "Status", field: "status", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" }
            ],
            rows: []
        };

        userOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems?.length ?? 0,
                amount: `$${order.totalPrice ?? 0}`,
                status: order.orderStatus?.includes("Delivered") ? (
                    <p style={{ color: "green" }}>{order.orderStatus}</p>
                ) : (
                    <p style={{ color: "red" }}>{order.orderStatus}</p>
                ),
                actions: (
                    <Link to={`/order/${order._id}`} className="btn btn-primary">
                        <i className="fa fa-eye"></i>
                    </Link>
                )
            });
        });

        return data;
    };

    return (
        <Fragment>
            <MetaData title="My Orders" />
            <h1 className="mt-5">My Orders</h1>
            <MDBDataTable
                className="px-3"
                bordered
                striped
                hover
                data={setOrders()}
            />
        </Fragment>
    );
}
