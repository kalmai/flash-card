import axios from 'axios';
import store from '../store';

const url = "https://flash-card-zrk.herokuapp.com";
// const url = "http://localhost:8080/";

export default {
    createDeck(deck){
        return axios.post(`${url}/create-deck/`,deck);
    },
    getDecks(){
        return axios.get(`${url}/decks/${store.state.userId}`);
    },
    updateDeck(deck){
        return axios.post(`${url}/update-deck`,deck);
    },
    deleteDeck(deckId){
        return axios.delete(`${url}/delete-deck/${deckId}`);
    }
}