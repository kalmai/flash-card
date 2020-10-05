import axios from 'axios';

// const url = "https://flash-card-zrk.herokuapp.com";
const url = "http://localhost:8080/";

export default {
    login(userName){
        return axios.get(`${url}/login/${userName}`);
    },
    createUser(newUser){
        return axios.post(`${url}/create-user/${newUser}`);
    },
    updateDeck(userId){
        return axios.delete(`${url}/delete-user/${userId}`);
    }
}