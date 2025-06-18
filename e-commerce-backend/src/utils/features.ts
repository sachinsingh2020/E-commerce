import mongoose, { mongo } from "mongoose";

export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017", {
        dbName: "Ecommerce-Application"
    }).then(c => console.log(`DB Connected with Host: ${c.connection.host}`))
        .catch(err => console.error("DB Connection Error:", err));
}