import multer from "multer";


// ==========================================
// MULTER MEMORY STORAGE
// ==========================================

const storage =
    multer.memoryStorage();


// ==========================================
// IMAGE FILE FILTER
// ==========================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );

    }

};


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


export default upload;