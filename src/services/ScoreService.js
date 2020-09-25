import axios from 'axios';
import store from '../store';

const url = "https://flash-card-zrk.herokuapp.com";
// const url = "http://localhost:8080/";

export default {
    createScore(score){
        return axios.post(`${url}/create-score`, score);
    },
    getUserScores(userName){
        return axios.get(`${url}/decks/${userName}`);
    },
    getTopTen(){
        return axios.get(`${url}/leaderboard/${store.state.deckId}`);
    }
}