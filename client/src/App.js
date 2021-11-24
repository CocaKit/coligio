import React, {useContext, useEffect} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";

const App = () => {

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
        <div>
          <LoginForm/>
        </div>
    );
};

export default observer(App);