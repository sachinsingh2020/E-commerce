import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";


export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {

        const { name, price, stock, category, description = "this is temporary description" } = req.body;

        console.log({ name, price, stock, category, description });
        // const photos = req.files as Express.Multer.File[] | undefined;
        const photo = req.file;

        if (!photo) return next(new ErrorHandler("Please add Photo", 400));

        // if (!photos) return next(new ErrorHandler("Please add Photo", 400));

        // if (photos.length < 1)
        //     return next(new ErrorHandler("Please add atleast one Photo", 400));

        // if (photos.length > 5)
        //     return next(new ErrorHandler("You can only upload 5 Photos", 400));

        if (!name || !price || !stock || !category || !description) {
            rm(photo.path, () => {
                console.log("deleted");
            })
            return next(new ErrorHandler("Please enter All Fields", 400));
        }

        // Upload Here

        // const photosURL = await uploadToCloudinary(photos);


        const product = await Product.create({
            name,
            price,
            description,
            stock,
            category: category.toLowerCase(),
            photo: photo?.path,
            // photos: photosURL,
        });

        invalidateCache({ product: true, admin: true });

        return res.status(201).json({
            success: true,
            message: "Product Created Successfully",
            product
        });
    }
);


export const getlatestProducts = TryCatch(async (req, res, next) => {
    // let products;

    // products = await redis.get("latest-products");
    let products;

    if (myCache.has("latest-products")) {
        products = JSON.parse(myCache.get("latest-products") as string);
    } else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }

    // if (products) products = JSON.parse(products);
    // else {
    //     products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    //     await redis.setex("latest-products", redisTTL, JSON.stringify(products));
    // }



    return res.status(200).json({
        success: true,
        products,
    });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;

    // categories = await redis.get("categories");

    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories") as string);
    } else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories))
    }

    // if (categories) categories = JSON.parse(categories);
    // else {
    //     categories = await Product.distinct("category");
    //     await redis.setex("categories", redisTTL, JSON.stringify(categories));
    // }

    return res.status(200).json({
        success: true,
        categories,
    });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;

    // products = await redis.get("all-products");

    if (myCache.has("all-products")) {
        products = JSON.parse(myCache.get("all-products") as string);
    } else {
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }

    // if (products) products = JSON.parse(products);
    // else {
    //     products = await Product.find({});
    //     await redis.setex("all-products", redisTTL, JSON.stringify(products));
    // }
    return res.status(200).json({
        success: true,
        products,
    });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    const key = `product-${id}`;

    // product = await redis.get(key);
    // if (product) product = JSON.parse(product);
    // else {
    //     product = await Product.findById(id);
    //     if (!product) return next(new ErrorHandler("Product Not Found", 404));

    //     await redis.setex(key, redisTTL, JSON.stringify(product));
    // }

    if (myCache.has(key)) {
        product = JSON.parse(myCache.get(key) as string);
    } else {
        product = await Product.findById(id);
        if (!product) return next(new ErrorHandler("Product Not Found", 404));
        myCache.set(key, JSON.stringify(product));
    }


    return res.status(200).json({
        success: true,
        product,
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
    console.log("sachin");
    const { id } = req.params;
    const { name, price, stock, category, description = "this is temporary decription" } = req.body;
    // const photos = req.files as Express.Multer.File[] | undefined;

    console.log({ name, price, stock, category, description });
    const photo = req.file;

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    // if (photos && photos.length > 0) {
    //     const photosURL = await uploadToCloudinary(photos);

    //     const ids = product.photos.map((photo) => photo.public_id);

    //     await deleteFromCloudinary(ids);

    //     product.photos = photosURL;
    // }

    if (photo) {
        rm(product.photo!, () => {
            console.log("deleted");
        });
        product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (description) product.description = description;

    await product.save();

    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });


    return res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
    });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    // const ids = product.photos.map((photo) => photo.public_id);

    // await deleteFromCloudinary(ids);

    rm(product.photo!, () => {
        console.log("Product Photo Deleted");
    });

    await product.deleteOne();

    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });

    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
});

export const getAllProducts = TryCatch(
    async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
        const { search, sort, category, price } = req.query;

        const page = Number(req.query.page) || 1;

        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

        const skip = (page - 1) * limit;

        const baseQuery: BaseQuery = {
            // name: {
            //     $regex: search,
            //     $options: "i",
            // },
            // price: {
            //     $lte: Number(price),
            // },
            // category
        }

        if (search) {
            baseQuery.name = {
                $regex: search,
                $options: "i",
            }
        }

        if (price) {
            baseQuery.price = {
                $lte: Number(price)
            }
        }

        if (category) {
            baseQuery.category = category;
        }

        const productPromise = Product.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip);

        const [products, filteredOnlyProduct] = await Promise.all([
            productPromise,
            Product.find(baseQuery)
        ])


        const totalPage = Math.ceil(filteredOnlyProduct.length / limit);


        // let products;
        // let totalPage;

        // const key = `products-${search}-${sort}-${category}-${price}-${page}`;

        // const cachedData = await redis.get(key);
        // if (cachedData) {
        //     const data = JSON.parse(cachedData);
        //     totalPage = data.totalPage;
        //     products = data.products;
        // } else {
        //     // 1,2,3,4,5,6,7,8
        //     // 9,10,11,12,13,14,15,16
        //     // 17,18,19,20,21,22,23,24
        //     const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        //     const skip = (page - 1) * limit;

        //     const baseQuery: BaseQuery = {};

        //     if (search)
        //         baseQuery.name = {
        //             $regex: search,
        //             $options: "i",
        //         };

        //     if (price)
        //         baseQuery.price = {
        //             $lte: Number(price),
        //         };

        //     if (category) baseQuery.category = category;

        //     const productsPromise = Product.find(baseQuery)
        //         .sort(sort && { price: sort === "asc" ? 1 : -1 })
        //         .limit(limit)
        //         .skip(skip);

        //     const [productsFetched, filteredOnlyProduct] = await Promise.all([
        //         productsPromise,
        //         Product.find(baseQuery),
        //     ]);

        //     products = productsFetched;
        //     totalPage = Math.ceil(filteredOnlyProduct.length / limit);

        //     await redis.setex(key, 30, JSON.stringify({ products, totalPage }));
        // }

        return res.status(200).json({
            success: true,
            products,
            totalPage,
        });
    }
);

