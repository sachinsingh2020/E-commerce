import multer from "multer";
const storage = multer.diskStorage({});
export const singleUpload = multer({ storage }).single("photo");
