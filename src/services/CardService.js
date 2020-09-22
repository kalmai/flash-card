import axios from 'axios';
import store from '../store';

const url = "https://flash-card-zrk.herokuapp.com";
// const url = "http://localhost:8080/";

export default {
    createCard(card){
        return axios.post(`${url}/create-card`,card);
    },
    getCards(){
        return axios.get(`${url}/cards/${store.state.deckId}`);
    },
    updateCard(cardUpdate){
        return axios.post(`${url}/update-card`,cardUpdate);
    },
    deleteCard(cardId){
        return axios.delete(`${url}/delete-card/${cardId}`);
    }
}