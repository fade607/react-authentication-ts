import exp from "constants";
import React, { useState } from "react";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../../components/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "../../redux/slice/authSlice"
import { AppDispatch, RootState } from '../../redux/store';
import { Link } from "react-router-dom";
import BtnLoading from "../../components/Loading";

type RegisterProps = {}

type registerTypes = {
    email: string,
    password: string,
    name: string,
    confirmPassword: string
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
    confirmPassword: Yup.string()
        .required("Confirm Password not matching ")
        .oneOf([Yup.ref('password'), null || ""], 'Passwords must match')
})

const Register: React.FC<RegisterProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [newUser, setNewUser] = useState<registerTypes>({
        email: "",
        password: "",
        name: "",
        confirmPassword: ""
    })

    const { loading, error } = useSelector((state: RootState) => state.signup);


    const { register, handleSubmit, formState: { errors } } = useForm<registerTypes>({ resolver: yupResolver(errorValidation) })
    const handleRegister = () => {
        dispatch(registerAction(newUser))
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setNewUser({ ...newUser, [id]: value })
    }


    return (
        <section className='auth-page' >
            <form onSubmit={handleSubmit(handleRegister)}

                className='form-style column'>
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
                <div className='form-group  ' >
                    <label>Enter email address</label>
                    <input type='email' id='email' placeholder='Enter your email address ' {...register('email')}
                        onChange={handleChange}
                        value={newUser.email}
                    />
                    {errors.email && <ErrorMessage message={errors.email.message || ""} />}

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
                <button disabled={loading} type='submit' className='btn full-width mt-3' >{loading ? <BtnLoading /> : "Signup"}</button>

                <span className='flex mt-3 align-center  ' >
                    <p>You already have an account? </p>&nbsp;
                    <Link to='/'>Signin</Link>
                </span>
            </form>
        </section>
    )
}

export default Register;

