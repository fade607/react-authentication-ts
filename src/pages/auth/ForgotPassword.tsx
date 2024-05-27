import React, { useState } from 'react'
import * as Yup from 'yup';
import Timer from "../../components/Timer";
import BtnLoading from "../../components/Loading";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from '../../redux/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../../components/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordStep1Action, handleAllowResend, updatePasswordStep2Action } from '../../redux/slice/authSlice'

type ForgotPasswordProps = {}
type updatePasswordTypes = {
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
}



const errorValidation = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Password: 8+ characters, 1 letter, 1 number, 1 special character"
        ),
    otp: Yup.string().required("OTP is required"),
    confirmPassword: Yup.string()
        .required("Confirm Password not matching ")
        .oneOf([Yup.ref('password'), null || ""], 'Passwords must match')
})


const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
    const [emailEmptyError, setEmailEmptyError] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();

    const loading = false

    const [updatePassword, setUpdatePassword] = useState<updatePasswordTypes>({
        email: "",
        password: "",
        confirmPassword: "",
        otp: ""
    })

    const { error, errorCode } = useSelector((state: RootState) => state.signup);
    const { loading: requestOTPLoading, error: requestOTPError, allowResendOTP, period } = useSelector((state: RootState) => state.requestOTP);
    const { register, handleSubmit, formState: { errors } } = useForm<updatePasswordTypes>({ resolver: yupResolver(errorValidation) })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setUpdatePassword({ ...updatePassword, [id]: value })
    }

    const handleResend = () => {
        dispatch(handleAllowResend())
    };


    const handleSendOTP = () => {
        if (!updatePassword.email) {
            setEmailEmptyError(true)
            return
        }

        dispatch(changePasswordStep1Action(updatePassword.email))
    }

    const handleUpdate = () => {

        dispatch(updatePasswordStep2Action(updatePassword))
    }


    return (
        <section className='auth-page' >
            <form
                onSubmit={handleSubmit(handleUpdate)}
                className='form-style column'
            >
                <span>
                    <b className='x-large-size' >Update your password</b>
                </span>

                <div className='form-group  ' >
                    <label>Enter email address</label>
                    <span className="flex align-center full-width input-with-btn " >
                        <input type='email' id='email' placeholder='Enter your email address'
                            {...register('email')}
                            onChange={handleChange}
                            value={updatePassword.email}
                        />
                        <button className="send-otp-btn"
                            disabled={!updatePassword.email || loading || requestOTPLoading || !allowResendOTP}
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
                        value={updatePassword.otp}
                        onChange={handleChange}
                        maxLength={6}

                    />
                    {errors.otp ? <ErrorMessage message={errors.otp.message || ""} /> : errorCode === 400 && <ErrorMessage message={error || ""} />}
                </div>

                <div className='form-group  ' >
                    <label>Enter New Password </label>
                    <input type='password' id='password' placeholder='Enter your new password ' {...register('password')}
                        value={updatePassword.password}
                        onChange={handleChange}
                    />
                    {errors.password && <ErrorMessage message={errors.password.message || ""} />}
                </div>

                <div className='form-group  ' >
                    <label>Confirm New Password</label>
                    <input type='password' id='confirmPassword' placeholder='Confirm new password' {...register('confirmPassword')}
                        value={updatePassword.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message || ""} />}
                </div>

                <button disabled={loading} type='submit' className='btn full-width mt-3' >{loading ? <BtnLoading /> : "Submit"}</button>

            </form>
        </section>
    )
}

export default ForgotPassword;  