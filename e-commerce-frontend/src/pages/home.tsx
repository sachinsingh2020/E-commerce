import { Link } from "react-router-dom"
import coverImage from "../assets/cover.jpg"
import ProductCard from "../components/product-card"

const Home = () => {

    const addToCartHandler = (productId: string): void => {
        // Logic to add the product to the cart
        console.log(`Product with ID ${productId} added to cart`);
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
                <ProductCard productId="dfaljdfa" name="Macbook" photos={"https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY218_.jpg"} price={1000} stock={10} handler={addToCartHandler} />
            </main>
        </div>
    )
}

export default Home
