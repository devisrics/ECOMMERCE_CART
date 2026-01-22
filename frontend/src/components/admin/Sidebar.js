import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">

                    <li>
                        <Link to="/admin/dashboard">
                            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                        </Link>
                    </li>

                    <li>
                        <NavDropdown
                            title={<span><i className="fa fa-product-hunt me-2"></i> Product</span>}
                            id="product-dropdown"
                        >
                            <NavDropdown.Item onClick={() => navigate('/admin/products')}>
                                <i className="fa fa-shopping-basket me-2"></i> All Products
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/products/create')}>
                                <i className="fa fa-plus me-2"></i> Create Product
                            </NavDropdown.Item>
                        </NavDropdown>
                    </li>

                    <li>
                        <Link to="/admin/orders">
                            <i className="fa fa-shopping-basket me-2"></i> Orders
                        </Link>
                    </li>

                    <li>
                        <Link to="/admin/users">
                            <i className="fa fa-users me-2"></i> Users
                        </Link>
                    </li>

                    <li>
                        <Link to="/admin/reviews">
                            <i className="fa fa-star me-2"></i> Reviews
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    )
}
