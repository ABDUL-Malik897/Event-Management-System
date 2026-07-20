import React, {
    useRef,
    useState
} from "react";

import toast from "react-hot-toast";

import API from "../api/api";

import useAuthContext
    from "../hooks/useAuthContext";

import "./ProfileAvatar.css";


const ProfileAvatar = ({
    className = ""
}) => {

    const {
        user,
        dispatch
    } = useAuthContext();


    const fileInputRef =
        useRef(null);


    const [
        uploading,
        setUploading
    ] = useState(false);


    // ==========================================
    // OPEN FILE PICKER
    // ==========================================

    const handleAvatarClick = () => {

        if (uploading) {
            return;
        }


        fileInputRef.current
            ?.click();

    };


    // ==========================================
    // UPLOAD PROFILE PICTURE
    // ==========================================

    const handleFileChange =
        async (e) => {

            const file =
                e.target.files?.[0];


            if (!file) {
                return;
            }


            // ==========================================
            // VALIDATE FILE TYPE
            // ==========================================

            const allowedTypes = [

                "image/jpeg",

                "image/png",

                "image/webp"

            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                toast.error(
                    "Please select a JPG, JPEG, PNG or WEBP image"
                );


                e.target.value =
                    "";


                return;

            }


            // ==========================================
            // VALIDATE FILE SIZE
            // MAXIMUM 5 MB
            // ==========================================

            const maxFileSize =
                5 * 1024 * 1024;


            if (
                file.size >
                maxFileSize
            ) {

                toast.error(
                    "Profile picture must be less than 5 MB"
                );


                e.target.value =
                    "";


                return;

            }


            try {

                setUploading(
                    true
                );


                // ==========================================
                // CREATE FORM DATA
                // ==========================================

                const formData =
                    new FormData();


                formData.append(

                    "profilePic",

                    file

                );


                // ==========================================
                // SEND IMAGE TO BACKEND
                // BACKEND UPLOADS IT TO CLOUDINARY
                // ==========================================

                const response =
                    await API.put(

                        "/profile/picture",

                        formData

                    );


                // ==========================================
                // GET CLOUDINARY URL
                // ==========================================

                const profilePic =
                    response.data
                        .profilePic;


                if (!profilePic) {

                    throw new Error(
                        "Profile picture URL was not returned"
                    );

                }


                // ==========================================
                // UPDATE AUTH USER
                // ==========================================

                const updatedUser = {

                    ...user,

                    profilePic

                };


                // ==========================================
                // UPDATE LOCAL STORAGE
                // ==========================================

                localStorage.setItem(

                    "user",

                    JSON.stringify(
                        updatedUser
                    )

                );


                // ==========================================
                // UPDATE AUTH CONTEXT
                // ==========================================

                dispatch({

                    type:
                        "LOGIN",

                    payload:
                        updatedUser

                });


                // ==========================================
                // SUCCESS MESSAGE
                // ==========================================

                toast.success(

                    response.data
                        .message ||

                    "Profile picture updated successfully"

                );


            } catch (error) {

                console.error(

                    "Profile Picture Upload Error:",

                    error

                );


                toast.error(

                    error.response
                        ?.data
                        ?.message ||

                    error.message ||

                    "Unable to update profile picture"

                );


            } finally {

                setUploading(
                    false
                );


                e.target.value =
                    "";

            }

        };


    // ==========================================
    // CLOUDINARY PROFILE PICTURE URL
    // ==========================================

    const profilePictureUrl =
        user?.profilePic ||
        null;


    // ==========================================
    // USER INITIAL
    // ==========================================

    const userInitial =

        user
            ?.username
            ?.charAt(0)
            ?.toUpperCase() ||

        user
            ?.email
            ?.charAt(0)
            ?.toUpperCase() ||

        "U";


    return (

        <div

            className={
                `profile-avatar-wrapper ${className}`
            }

        >


            {/* ==========================================
                PROFILE AVATAR
            ========================================== */}

            <button

                type="button"

                className="profile-avatar-button"

                onClick={
                    handleAvatarClick
                }

                disabled={
                    uploading
                }

                title={

                    uploading

                        ? "Uploading..."

                        : "Change profile picture"

                }

            >


                {

                    uploading

                        ? (

                            <span className="profile-avatar-loading">

                                ...

                            </span>

                        )

                        : profilePictureUrl

                            ? (

                                <img

                                    src={
                                        profilePictureUrl
                                    }

                                    alt={

                                        user?.username

                                            ? `${user.username}'s profile`

                                            : "Profile"

                                    }

                                    className="profile-avatar-image"

                                />

                            )

                            : (

                                <span className="profile-avatar-letter">

                                    {
                                        userInitial
                                    }

                                </span>

                            )

                }


            </button>


            {/* ==========================================
                HIDDEN FILE INPUT
            ========================================== */}

            <input

                ref={
                    fileInputRef
                }

                type="file"

                accept=
                    "image/jpeg,image/png,image/webp"

                onChange={
                    handleFileChange
                }

                className="profile-avatar-input"

            />


        </div>

    );

};


export default ProfileAvatar;