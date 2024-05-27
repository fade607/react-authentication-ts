import React, { CSSProperties } from "react";
import { BeatLoader } from "react-spinners";


type btnloading = {

}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const BtnLoading: React.FC<btnloading> = () => {
    return (
        <BeatLoader
            color={"#ffffff"}
            loading={true}
            cssOverride={override}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    )
}

export default BtnLoading;