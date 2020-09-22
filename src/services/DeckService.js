import axios from 'axios';

const url = "https://flash-card-zrk.herokuapp.com";
// const url = "http://localhost:8080/";

export default {
    createDeck(deckName){
        return axios.post(`${url}/create-deck/${deckName}`);
    },
    getDecks(){
        return axios.get(`${url}/decks`);
    },
    updateDeck(deck){
        return axios.post(`${url}/update-deck`,deck);
    },
    deleteDeck(deckId){
        return axios.delete(`${url}/delete-deck/${deckId}`);
    }
}