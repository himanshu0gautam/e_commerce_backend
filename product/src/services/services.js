import dotenv from "dotenv"
// import ImageKit from '@imagekit/nodejs'
import ImageKit from "imagekit";
import sharp from "sharp"

dotenv.config()

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

async function uploadImage(file) {
    try {

        if (!file) {
            throw new Error("no file provided ")
        }

        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error("Only jpg and png formats are allowed")
        }

        const maxSizeMB = 5;
        if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`File too large. Max allowed size is ${maxSizeMB}MB.`);
        }

        const compressedBuffer = await sharp(file.buffer)    // sharp(file.buffer) → image ka binary data use karta hai
            .resize({ width: 1500, withoutEnlargement: true })         // → agar image 1500px se badi hai to resize karega                           
            .jpeg({ quality: 80 })                                     //→ 80% quality par JPEG me compress karega
            .toBuffer()                                               // → final compressed image memory buffer return karta hai

        const uploadfile = await imagekit.upload({
            file: compressedBuffer,
            fileName: "fileName",
            folder: "/products",
        });

        const transformedUrl = imagekit.url({
            path: uploadfile.filePath,
            transformation: [
                {
                    width: 400,
                    height: 300,
                    crop: "maintain_ratio",
                    quality: 80,
                    format: "jpeg",
                },
            ],
        });

        return {
            success: true,
            original_url: uploadfile.url,
            optimized_url: transformedUrl, 
            fileId: uploadfile.fileId,
            name: uploadfile.name,
            type: uploadfile.fileType,
            size: uploadfile.size,
        };

    } catch (error) {
        console.error("Image upload failed:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }

}

export { uploadImage }


//    const res =  new Promise((resolve, reject) => {
//         imagekit.upload({
//             file: file.buffer, // required
//             fileName: "file name",
//             folder: "/producsts",
//         })
//             .then(response => {
//                 resolve(response);
//             }   )
//             .catch(error => {
//                 reject(error);
//             });
//    });
//    return res