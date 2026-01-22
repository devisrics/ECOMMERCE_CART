import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts } from "../../actions/productActions";
import { clearError, clearProductDeleted } from "../../slices/productSlice";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";

export default function ProductList() {
    const { products = [], loading = true, error } = useSelector(state => state.productsState);
    const { isProductDeleted, error: productError } = useSelector(state => state.productState);
    const dispatch = useDispatch();
    const [deletingProductId, setDeletingProductId] = useState(null);

    const setProducts = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Price', field: 'price', sort: 'asc' },
                { label: 'Stock', field: 'stock', sort: 'asc' },
                { label: 'Actions', field: 'actions', sort: 'asc' },
            ],
            rows: products.map(product => ({
                id: product._id,
                name: product.name,
                price: `$${product.price.toFixed(2)}`,
                stock: product.stock,
                actions: (
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button
                            onClick={() => deleteHandler(product._id)}
                            className="btn btn-danger py-1 px-2 ml-2"
                            disabled={deletingProductId === product._id}
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
        setDeletingProductId(id);
        dispatch(deleteProduct(id));
    };

    useEffect(() => {
        if (error || productError) {
            toast.error(error || productError, {
                position: 'bottom-center',
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        if (isProductDeleted) {
            toast.success('Product Deleted Successfully!', {
                position: 'bottom-center',
                onOpen: () => dispatch(clearProductDeleted())
            });
            setDeletingProductId(null);
        }

        dispatch(getAdminProducts());
    }, [dispatch, error, productError, isProductDeleted]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Product List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setProducts()}
                            bordered
                            striped
                            hover
                            className="px-3"
                        />
                    }
                </Fragment>
            </div>
        </div>
    );
}
