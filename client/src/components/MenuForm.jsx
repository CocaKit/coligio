import React, { Component, useState, useContext } from "react";
import "../styles/LoginForm.css";

import Button from "../UI/Button";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../index";


const LoginForm = () => {


    const [password, setPass] = useState('')
    const {store} = useContext(Context);

    return (
        <div>
            <div className="LoginForm">
                <form className="form">
                    <Link to='/login'>
                    <Button
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Логин
                    </Button>
                    </Link>
                    <Link to='/register'>
                    <Button
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Регистрация
                    </Button>
                    </Link>
                    <Button
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Занятия
                    </Button>

                    <Button
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Запоминание
                    </Button>

                    <Button
                        onClick={()=> {store.logout()} }
                        type="button"
                        color="primary"
                        className="form__custom-button">
                        Выйти из аккаунта
                    </Button>

                </form>
            </div>
        </div>
    );
};

export default observer(LoginForm);