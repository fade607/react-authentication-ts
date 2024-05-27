import React from "react";


interface ErrorMessageProps {
    message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {

    return (
        <span className="error-message flex align-center  " >
            <span className="material-symbols-outlined small-size  ">
                error
            </span>
            <p>{message}</p>
        </span>
    )

}


export default ErrorMessage