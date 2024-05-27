import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from '../../components/ErrorMessage';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { signinAction } from '../../redux/slice/authSlice'
import { Link } from 'react-router-dom';
import BtnLoading from '../../components/Loading';

interface LoginPageProps { }

type LoginFormInputs = {
    email: string,
    password: string
}

const errorValidation = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required")
})

const LoginPage: React.FC<LoginPageProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, errorCode } = useSelector((state: RootState) => state.signin);
    const [user, setUser] = useState<LoginFormInputs>({
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setUser({ ...user, [id]: value })
    }

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({ resolver: yupResolver(errorValidation) })

    const handleLogin = () => {
        dispatch(signinAction(user))
    }

    return (
        <section className='auth-page' >


            <form
                onSubmit={handleSubmit(handleLogin)}
                className='form-style column'
            >
                <span>
                    {/* <h2>👋 Welcome Back</h2> */}
                    <b className='x-large-size' >Sign in to your account</b>
                </span>

                <div className='form-group mt-3 ' >
                    <label>Email Address</label>
                    <input type='text' id='email' placeholder='Enter your email address ' {...register('email')}
                        value={user.email}
                        onChange={handleChange}
                        className={`${errorCode === 404 ? 'input-error' : ''}`}
                    />

                    {errors.email ? <ErrorMessage message={errors.email.message || ""} /> : errorCode === 404 && <ErrorMessage message={error || ""} />}
                </div>

                <div className='form-group' >
                    <label>Password</label>
                    <input type='password' id='password' {...register('password')} placeholder='Enter your password'
                        value={user.password}
                        onChange={handleChange}
                        className={`${errorCode === 400 ? 'input-error' : ''}`}
                    />
                    {errors.password ? <ErrorMessage message={errors.password?.message || ""} /> : errorCode === 400 && <ErrorMessage message={error || ""} />}
                </div>

                <button disabled={loading} type='submit' className='btn full-width mt-3' >{loading ? <BtnLoading /> : "Signin"}</button>

                <span className='flex mt-3 align-center  ' >
                    <p>Don’t have an account yet? </p>&nbsp;
                    <Link to='/register-with-otp'>Signup</Link>
                </span>
                <Link to='/forgot-password'>Forgot password?</Link>
            </form>
        </section>
    );
};

export default LoginPage;