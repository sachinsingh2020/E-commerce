import { FaPlus } from "react-icons/fa";

type ProductsProps = {
    productId: string;
    photos: string;
    // photos: {
    //     url: string;
    //     public_id: string;
    // }[];
    name: string;
    price: number;
    stock: number;
    handler: (productId: string) => void;
    // handler: (cartItem: CartItem) => string | undefined;
};

const server = "3343543fgjsjksfjgklsfj";


const ProductCard = ({ productId, photos, name, price, stock, handler }: ProductsProps) => {
    return (
        <div className="product-card">
            <img src={`${photos}`} alt={name} />
            {/* <img src={`${server}${photos}`} alt={name} /> */}
            <p>{name}</p>
            <span>₹{price}</span>
            <div>
                <button onClick={() => handler()} >
                    <FaPlus />
                </button>
            </div>
        </div>
    )
}

export default ProductCard
