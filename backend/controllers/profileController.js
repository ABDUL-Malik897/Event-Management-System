import User from "../models/User.js";

import cloudinary
    from "../config/cloudinary.js";


// ==========================================
// UPDATE PROFILE PICTURE
// ==========================================

export const updateProfilePicture =
    async (req, res) => {

        try {

            // ==========================================
            // CHECK IMAGE
            // ==========================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please select a profile picture"

                });

            }


            // ==========================================
            // UPLOAD IMAGE TO CLOUDINARY
            // ==========================================

            const uploadResult =
                await new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        const uploadStream =
                            cloudinary
                                .uploader
                                .upload_stream(

                                    {

                                        folder: "EventHub/uploads/profile-pictures",
                                        resource_type:
                                            "image",

                                        transformation: [

                                            {

                                                width:
                                                    500,

                                                height:
                                                    500,

                                                crop:
                                                    "fill",

                                                gravity:
                                                    "face"

                                            }

                                        ]

                                    },

                                    (
                                        error,
                                        result
                                    ) => {

                                        if (error) {

                                            reject(
                                                error
                                            );

                                        } else {

                                            resolve(
                                                result
                                            );

                                        }

                                    }

                                );


                        uploadStream.end(
                            req.file.buffer
                        );

                    }
                );


            // ==========================================
            // UPDATE USER IN DATABASE
            // ==========================================

            const user =
                await User.findByIdAndUpdate(

                    req.user._id,

                    {

                        profilePic:
                            uploadResult.secure_url

                    },

                    {

                        new: true,

                        runValidators: true

                    }

                ).select(
                    "-password"
                );


            // ==========================================
            // USER NOT FOUND
            // ==========================================

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            return res.status(200).json({

                success: true,

                message:
                    "Profile picture updated successfully",

                profilePic:
                    user.profilePic,

                user

            });


        } catch (error) {

            console.error(

                "Update Profile Picture Error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to update profile picture"

            });

        }

    };