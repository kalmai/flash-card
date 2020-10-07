import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    decks:[],
    deckId: null,
    cards:[],
    deckName: null,
    score: null,
    userName: null,
    userId: -1,
    deckUserId: null,
    xValues: [],
    yValues: []
  },
  mutations: {
    SET_DECKS(state, decks){
      this.state.decks = decks;
    },
    SET_DECK_ID(state,newDeckId){
      this.state.deckId = newDeckId;
    },
    SET_CARDS(state, cards){
      this.state.cards = cards;
    },
    SET_DECK_NAME(state, deck){
      this.state.deckName = deck.deck_name;
    },
    SET_SCORE(state,score){
      this.state.score = score;
    },
    SET_USERNAME(state, userName){
      this.state.userName = userName;
    },
    SET_USERID(state,userId){
      this.state.userId = userId;
    },
    SET_DECK_USER_ID(state,deck){
      this.state.deckUserId = deck.user_id;
    },
    SET_XVALUES(state,xValues){
      this.state.xValues = xValues;
    },
    SET_YVALUES(state,yValues){
      this.state.yValues = yValues;
    }
  }
})
