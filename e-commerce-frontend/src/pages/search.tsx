import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product-card";

const Search = () => {
    // const searchQuery = useSearchParams()[0];
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [maxPrice, setMaxPrice] = useState(100000);
    const [category, setCategory] = useState("");
    // const [category, setCategory] = useState(searchQuery.get("category") || "");
    const [page, setPage] = useState(1);

    const addToCartHandler = (productId: string): void => {
        // Logic to add the product to the cart
    }

    const isPrevPage = page > 1;
    const isNextPage = page < 4;

    return (
        <div
            className="product-search-page"
        >
            <aside>
                <h2>Filters</h2>
                <div>
                    <h4>Sort</h4>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">Select</option>
                        <option value="asc">Price: (Low to High)</option>
                        <option value="dsc">Price: (High to Low)</option>
                    </select>
                </div>

                <div>
                    <h4>Max Price: {maxPrice || ""}</h4>
                    <input type="range" min="0" max="100000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />

                </div>

                <div>
                    <h4>Category</h4>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select</option>
                        <option value="">All</option>
                        <option value="">Sample 1</option>
                        <option value="">Sample 2</option>
                    </select>
                </div>
            </aside>
            <main>
                <h1>Products</h1>
                <input type="text" placeholder="Search by name...." value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className="search-product-list">
                    <ProductCard productId="dfaljdfa" name="Macbook" photos={"https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY218_.jpg"} price={1000} stock={10} handler={addToCartHandler} />
                </div>
                <article>
                    <button
                        disabled={!isPrevPage}
                        onClick={() => setPage((prev) => Math.max(prev - 1))}
                    >Prev</button>
                    <span>{page} of {4}</span>
                    <button
                        disabled={!isNextPage}
                        onClick={() => setPage((prev) => Math.max(prev + 1))}
                    >Next</button>
                </article>
            </main>
        </div>
    )
}

export default Search
