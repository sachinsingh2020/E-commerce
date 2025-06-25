import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast"
import Loader, { Skeleton } from "../components/loader"
import type { CartItem } from "../types/types"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/reducer/cartReducer"

const Home = () => {

    const { data, isLoading, isError } = useLatestProductsQuery("");

    const dispatch = useDispatch();


    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) {
            return toast.error("Out of Stock");
        }

        dispatch(addToCart(cartItem));
        toast.success("Added to Cart");
    }

    if (isError) {
        toast.error("Cannot Fetch the products");
    }
    return (
        <div className="home">

            <section ></section>
            <h1>
                Latest Products
                <Link to="/search" className="findmore">
                    More
                </Link>
            </h1>
            <main>
                {
                    isLoading ? <Skeleton width="80vw" /> :
                        data?.products.map((product) => (
                            <ProductCard key={product._id} productId={product._id} name={product.name} photo={product.photo} price={product.price} stock={product.stock} handler={addToCartHandler} />
                        ))
                }
            </main>
        </div>
    )
}

export default Home
