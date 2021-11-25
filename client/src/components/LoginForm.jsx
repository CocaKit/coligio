import React, { Component, useState, useContext } from "react";
import "../styles/LoginForm.css";
import CustomInput from "../UI/CustomInput";
import Button from "../UI/Button";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm = () => {

    const [email,setEmail] = useState('')
    const [password, setPass] = useState('')
    const {store} = useContext(Context);



    return (
        <div>
            <div className="LoginForm">
                <form className="form">
                   <input
                       type="email"
                       value={email}
                       onChange={e => setEmail(e.target.value)}/>
                    <input
                        value={password}
                        onChange={e => setPass(e.target.value)}
                        type="password"
                    />

                    <Button
                        onClick={()=> store.login(email,password)}
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Log in
                    </Button>

                    <Button
                        onClick={()=> store.registration(email,password)}
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Register
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default observer(LoginForm);