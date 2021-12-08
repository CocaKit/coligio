import React, {useContext, useEffect} from 'react';
import LoginForm from "./components/LoginForm";
import MenuForm from "./components/MenuForm"
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RegisterForm from "./components/RegisterForm";


const App = ({history}) => {

    const {store} = useContext(Context)
    useEffect(() =>{
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    // if (store.isLoading == false){
    //     return (<div>
    //             Загрузка...
    //         </div>
    //     )
    // }
    return (

                <Routes>
                    <Route exact path='/' element={<MenuForm/>}/>
                    <Route exact path='login' element={<LoginForm/>}/>
                    <Route exact path='register' element={<RegisterForm/>}/>
                </Routes>
    );
};

export default observer(App);