import { v2 as cloudinary } from 'cloudinary';
import { Redis } from "ioredis";
import mongoose from "mongoose";
import { redis } from "../app.js";
import { Product } from "../models/product.js";
export const findAverageRatings = async (productId) => {
    let totalRating = 0;
    const reviews = await Review.find({ product: productId });
    reviews.forEach((review) => {
        totalRating += review.rating;
    });
    const averateRating = Math.floor(totalRating / reviews.length) || 0;
    return {
        numOfReviews: reviews.length,
        ratings: averateRating,
    };
};
const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
export const uploadToCloudinary = async (files) => {
    const promises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(getBase64(file), (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
    });
    const result = await Promise.all(promises);
    return result.map((i) => ({
        public_id: i.public_id,
        url: i.secure_url,
    }));
};
export const deleteFromCloudinary = async (publicIds) => {
    const promises = publicIds.map((id) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, (error, result) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    });
    await Promise.all(promises);
};
export const connectRedis = (redisURI) => {
    const redis = new Redis(redisURI);
    redis.on("connect", () => console.log("Redis Connected"));
    redis.on("error", (e) => console.log(e));
    return redis;
};
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce-Application"
    }).then(c => console.log(`DB Connected with Host: ${c.connection.host}`))
        .catch(err => console.error("DB Connection Error:", err));
};
export const invalidateCache = async ({ product, order, admin, review, userId, orderId, productId, }) => {
    if (review) {
        await redis.del([`reviews-${productId}`]);
    }
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        await redis.del(productKeys);
    }
    if (order) {
        const ordersKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        await redis.del(ordersKeys);
    }
    if (admin) {
        await redis.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
import { Review } from "../models/review.js";
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
