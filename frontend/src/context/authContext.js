import React, {
    createContext,
    useEffect,
    useReducer
} from "react";




export const AuthContext =
    createContext();


export const authReducer = (
    state,
    action
) => {

    switch (action.type) {

        case "LOGIN":

            return {
                user: action.payload
            };


        case "LOGOUT":

            return {
                user: null
            };


        default:

            return state;

    }

};


export const AuthContextProvider = ({
    children
}) => {


    const [state, dispatch] =
        useReducer(
            authReducer,
            {
                user: null
            }
        );


    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "user"
            );


        if (storedUser) {

            dispatch({

                type: "LOGIN",

                payload:
                    JSON.parse(
                        storedUser
                    )

            });

        }

    }, []);

    


    return (

        <AuthContext.Provider
            value={{
                ...state,
                dispatch
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};