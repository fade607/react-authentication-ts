import React, { useEffect } from "react";
import { logoutAction } from "../../redux/slice/authSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getUserDetailsAction } from '../../redux/slice/appSlice'

interface HomePageProps { }

const Home: React.FC<HomePageProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, email, name } = useSelector((state: RootState) => state.userDetails)


    useEffect(() => {
        dispatch(getUserDetailsAction())
    }, [])


    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <section>
            <div className="flex center column" >
                <img src="../images/welcome-img.webp"
                    alt="welcome"
                    className="welcome-img"
                />
                <span className="mt-2 column flex align-center " >
                    <h1  >Hello, {name} </h1>
                    <b>Welcome to the application.</b>

                </span>
                <button className="btn mt-3 flex align-center gap-1"
                    onClick={() => dispatch(logoutAction())}
                >
                    <span className="material-symbols-outlined">
                        logout
                    </span>
                    <b >Logout</b>

                </button>
            </div>
        </section>
    )
}

export default Home