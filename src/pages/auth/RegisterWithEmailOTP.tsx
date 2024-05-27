import React, { useState } from "react";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../../components/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { requestOTPAction, handleAllowResend, registerWithVerifyOTPAction } from "../../redux/slice/authSlice"
import { AppDispatch, RootState } from '../../redux/store';
import { Link } from "react-router-dom";
import BtnLoading from "../../components/Loading";
import Timer from "../../components/Timer";

type RegisterProps = {}

type registerTypes = {
    email: string,
    password: string,
    name: string,
    confirmPassword: string,
    otp: string
}

const errorValidation = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Password: 8+ characters, 1 letter, 1 number, 1 special character"
        ),
    name: Yup.string().required("Name is required"),
    otp: Yup.string().required("OTP is required"),
    confirmPassword: Yup.string()
        .required("Confirm Password not matching ")
        .oneOf([Yup.ref('password'), null || ""], 'Passwords must match')
})




const RegisterWithEmailOTP: React.FC<RegisterProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [emailEmptyError, setEmailEmptyError] = useState<boolean>(false)

    const [newUser, setNewUser] = useState<registerTypes>({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        otp: ""
    })

    const { loading, error, errorCode } = useSelector((state: RootState) => state.signup);
    const { loading: requestOTPLoading, error: requestOTPError, allowResendOTP, period } = useSelector((state: RootState) => state.requestOTP);

    const { register, handleSubmit, formState: { errors } } = useForm<registerTypes>({ resolver: yupResolver(errorValidation) })
    const handleRegister = () => {

        dispatch(registerWithVerifyOTPAction(newUser))
    }

    const handleResend = () => {
        dispatch(handleAllowResend())
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setNewUser({ ...newUser, [id]: value })
    }


    const handleSendOTP = () => {
        if (!newUser.email) {
            setEmailEmptyError(true)
            return
        }

        dispatch(requestOTPAction(newUser.email))
    }

    return (
        <section className='auth-page' >
            <form onSubmit={handleSubmit(handleRegister)} className='form-style column'>
                <span>
                    <b className='x-large-size' >Start Your Journey Here</b>
                </span>

                <div className='form-group mt-3  ' >
                    <label>Enter your name </label>
                    <input type='text' id='name' placeholder='Enter your name ' {...register('name')}
                        onChange={handleChange}
                        value={newUser.name}
                    />
                    {errors.name && <ErrorMessage message={errors.name.message || ""} />}
                </div>

                <div className='form-group'>
                    <label>Enter email address</label>
                    <span className="flex align-center full-width input-with-btn " >
                        <input type='email' id='email' placeholder='Enter your email address'
                            {...register('email')}
                            onChange={handleChange}
                            value={newUser.email}
                        />
                        <button className="send-otp-btn"
                            disabled={!newUser.email || loading || requestOTPLoading || !allowResendOTP}
                            onClick={handleSendOTP}
                            type="button"
                        >
                            {requestOTPLoading ? <BtnLoading /> : "Send OTP"}
                        </button>
                    </span>
                    {errors.email ? <ErrorMessage message={errors.email.message || ""} /> : emailEmptyError ? <ErrorMessage message={"Please Enter your email."} /> :
                        requestOTPError && <ErrorMessage message={requestOTPError || ""} />
                    }
                </div>

                <div className='form-group  ' >

                    <span className="flex align-center space-between full-width" >
                        <label>Enter OTP</label>
                        {period > 0 && <Timer initialMinutes={period} initialSeconds={0} onResend={handleResend} />}
                    </span>
                    <input type='number' id='otp' placeholder='Enter OTP ' {...register('otp')}
                        value={newUser.otp}
                        onChange={handleChange}
                        maxLength={6}

                    />
                    {errors.otp ? <ErrorMessage message={errors.otp.message || ""} /> : errorCode === 400 && <ErrorMessage message={error || ""} />}
                </div>

                <div className='form-group  ' >
                    <label>Enter Password </label>
                    <input type='password' id='password' placeholder='Enter your password ' {...register('password')}
                        value={newUser.password}
                        onChange={handleChange}
                    />
                    {errors.password && <ErrorMessage message={errors.password.message || ""} />}
                </div>

                <div className='form-group  ' >
                    <label>Confirm Password</label>
                    <input type='password' id='confirmPassword' placeholder='Confirm password' {...register('confirmPassword')}
                        value={newUser.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message || ""} />}
                </div>

                <button disabled={loading} type='submit' className='btn full-width mt-3' >
                    {loading ? <BtnLoading /> : "Signup"}
                </button>

                <span className='flex mt-3 align-center  ' >
                    <p>You already have an account? </p>&nbsp;
                    <Link to='/'>Signin</Link>
                </span>
            </form>
        </section>
    )
}

export default RegisterWithEmailOTP;

