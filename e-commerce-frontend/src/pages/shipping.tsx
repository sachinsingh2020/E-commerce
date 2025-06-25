import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server, type RootState } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {

    const {
        cartItems,
        total,
    } =
        useSelector((state: RootState) => state.cartReducer);

    const { user } = useSelector((state: RootState) => state.userReducer);


    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(saveShippingInfo(shippingInfo));

        try {
            const { data } = await axios.post(
                `${server}/api/v1/payment/create}`,
                // `${server}/api/v1/payment/create?id=${user?._id}`,
                {
                    // items: cartItems,
                    // shippingInfo,
                    // coupon,
                    amount: total,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            navigate("/pay", {
                state: data.clientSecret,
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (cartItems.length <= 0) navigate("/cart");
    }, [cartItems]);

    return (
        <div className="shipping">
            <button
                className="back-button"
                onClick={() => navigate("/cart")}
            ><BiArrowBack /></button>
            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>
                <input type="text" placeholder="Address" name="address" value={shippingInfo.address} onChange={changeHandler} />
                <input type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler} />
                <input type="text" placeholder="State" name="state" value={shippingInfo.state} onChange={changeHandler} />
                <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                    <option value="">Choose Country</option>
                    <option value="india">India</option>
                </select>
                <input type="number" placeholder="Pin Code" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandler} />
                <button type="submit" >Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping
