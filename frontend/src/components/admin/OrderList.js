import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState);
    const dispatch = useDispatch();
    const [deletingOrderId, setDeletingOrderId] = useState(null);

    const setOrders = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Number of Items', field: 'noOfItems', sort: 'asc' },
                { label: 'Amount', field: 'amount', sort: 'asc' },
                { label: 'Status', field: 'status', sort: 'asc' },
                { label: 'Actions', field: 'actions', sort: 'asc' },
            ],
            rows: adminOrders.map(order => ({
                id: order._id,
                noOfItems: order.orderItems.length,
                amount: `$${order.totalPrice.toFixed(2)}`,
                status: (
                    <p style={{ color: order.orderStatus.includes('Processing') ? 'red' : 'green' }}>
                        {order.orderStatus}
                    </p>
                ),
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button
                            onClick={() => deleteHandler(order._id)}
                            className="btn btn-danger py-1 px-2 ml-2"
                            disabled={deletingOrderId === order._id}
                        >
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            }))
        };
        return data;
    };

    const deleteHandler = (id) => {
        setDeletingOrderId(id);
        dispatch(deleteOrder(id));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-center',
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        if (isOrderDeleted) {
            toast.success('Order Deleted Successfully!', {
                position: 'bottom-center',
                onOpen: () => dispatch(clearOrderDeleted())
            });
            setDeletingOrderId(null);
        }

        dispatch(adminOrdersAction());
    }, [dispatch, error, isOrderDeleted]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Order List</h1>
                {loading ? <Loader /> :
                    <MDBDataTable
                        data={setOrders()}
                        bordered
                        striped
                        hover
                        className="px-3"
                    />
                }
            </div>
        </div>
    );
}
