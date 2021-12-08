import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {API_URL} from "../http";



export default class Store {
    user = {} ;
    isAuth = false;
    isLoading = false;
    constructor() {
        makeAutoObservable(this);

    }

    setAuth(isAuth) {
        this.isAuth =isAuth;
    }

    setLoading(isLoading) {
        this.isLoading =isLoading;
    }

    setUser(user){
        this.user = user;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            return e;
        }
    }

    async registration(username,email, password) {
        try {
            const response = await AuthService.registration(username,email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            return e;
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response)
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            return e;
        }
    }

    async checkAuth(){
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true});
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            return e;
        } finally {
            this.setLoading(false);
        }
    }
}