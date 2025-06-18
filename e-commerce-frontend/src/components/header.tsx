import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const user = { _id: "user", role: "admin" }; // Mock user data, replace with actual user state management

const Header = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = () => {
        // Implement logout logic here
        setIsOpen(false);
    }
    return (
        <nav className="header">
            <Link onClick={() => setIsOpen(false)} to="/" >HOME</Link>
            <Link onClick={() => setIsOpen(false)} to="/search"><FaSearch /></Link>
            <Link onClick={() => setIsOpen(false)} to="/cart"><FaShoppingBag /></Link>

            {
                user?._id ? (
                    <>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                        ><FaUser /></button>
                        <dialog open={isOpen}>
                            <div>
                                {
                                    user.role === "admin" && (
                                        <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">Admin</Link>
                                    )
                                }
                                <Link onClick={() => setIsOpen(false)} to="/orders">Orders</Link>
                                <button onClick={() => setIsOpen(false)}><FaSignOutAlt /></button>
                            </div>
                        </dialog>
                    </>

                ) : (
                    <Link to="/login"><FaSignInAlt /></Link>
                )
            }
        </nav>
    )
}

export default Header;
