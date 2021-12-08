import React, { Component, useState, useContext } from "react";
import "../styles/LoginForm.css";
import CustomInput from "../UI/CustomInput";
import Button from "../UI/Button";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
const LoginForm = () => {

    const [email,setEmail] = useState('')
    const [password, setPass] = useState('')
    const [username, setUser] = useState('')
    const {store} = useContext(Context);
    function registration() {
        store.registration(username,email,password)

    }


    return (
        <div>
            <div className="LoginForm">
                <form className="form">
                    <CustomInput
                        value={email}
                        handleChange={e => setEmail(e.target.value)}
                        formControlProps={{
                            fullWidth: true
                        }}
                        id="email"
                        labelText="Email"
                        type="email"
                    />
                    <CustomInput
                        value={username}
                        handleChange={e => setUser(e.target.value)}
                        labelText="Username"
                        id="username"
                        formControlProps={{
                            fullWidth: true
                        }}
                        type="text"
                    />
                    <CustomInput
                        value={password}
                        handleChange={e => setPass(e.target.value)}
                        labelText="Password"
                        id="password"
                        formControlProps={{
                            fullWidth: true
                        }}

                        type="password"
                    />

                    <Link to="/">
                    <Button
                        onClick={()=> {
                                registration()

                        } }
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Register
                    </Button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default observer(LoginForm);