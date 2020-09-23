import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    decks:[],
    deckId: null,
    cards:[],
    deckName: null,
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
    }
  }
})
