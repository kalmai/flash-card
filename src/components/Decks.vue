<template>
  <div>
    <p v-if="loading">
      <img src="../assets/loading.gif" alt="loading"><br />
      loading, may take up to 30 seconds for first request</p>
    <div v-for="deck in decks" :key="deck.id">
      <router-link to="/cards">
        <p v-on:click="setStateDeckId(deck)">{{deck.deck_name}}</p>
      </router-link>
      <p>
        <span v-on:click="deleteDeck(deck.deck_id)">delete</span>
      </p>
      <span v-on:click="nameChangeDeck(deck)">edit</span>
      <form v-on:submit.prevent="updateDeck()" v-if="deck.showUpdate">
        <label for="name">Name:</label>
        <input type="text" v-model="newName" />
        <input type="submit" />
        <button v-on:click="setShowUpdateForm(deck)">cancel</button>
      </form>
    </div>
    <p v-on:click="setShowNewDeckForm()">create a new deck</p>
    <form v-on:submit.prevent="createDeck()" v-if="showNewDeckForm">
      <label for="newDeckName">Name:</label>
      <input type="text" v-model="newDeckName" />
      <input type="submit" />
      <button v-on:click="setShowNewDeckForm()">cancel</button>
    </form>
  </div>
</template>

<script>
import DeckService from "@/services/DeckService";
export default {
  name: "decks",
  data() {
    return {
      decks: [],
      selectedDeck: {},
      newName: "",
      newDeckName: "",
      showNewDeckForm: false,
      loading: true
    };
  },
  methods: {
    retreiveAllCurrentDecks() {
      DeckService.getDecks().then((response) => {
        const addedProp = response.data.map((d) => {
          return {
            ...d,
            showUpdate: false,
          };
        });
        this.$store.commit("SET_DECKS", addedProp);
        this.decks = this.$store.state.decks;
        this.$forceUpdate();
        this.loading = false;
      });
    },
    async deleteDeck(deckId) {
      if (confirm("this will delete all cards in this deck as well")) {
        await DeckService.deleteDeck(deckId);
        this.retreiveAllCurrentDecks();
      }
    },
    nameChangeDeck(deck) {
      this.selectedDeck = {
        deck_id: deck.deck_id,
        deck_name: deck.deck_name,
      };
      deck.showUpdate = !deck.showUpdate;
      this.newName = this.selectedDeck.deck_name;
    },
    async updateDeck() {
      this.selectedDeck.deck_name = this.newName;
      await DeckService.updateDeck(this.selectedDeck);
      this.retreiveAllCurrentDecks();
    },
    async createDeck() {
      await DeckService.createDeck(this.newDeckName);
      this.showNewDeckForm = false;
      this.retreiveAllCurrentDecks();
      this.newDeckName = "";
    },
    setShowNewDeckForm() {
      this.showNewDeckForm = !this.showNewDeckForm;
    },
    setStateDeckId(deck) {
      this.$store.commit("SET_DECK_ID", deck.deck_id);
    },
    setShowUpdateForm(deck){
      deck.showUpdate = !deck.showUpdate;
    }
  },
  created() {
    this.retreiveAllCurrentDecks();
  },
  watch: {
    decks: function () {
      this.decks;
    },
  }
};
</script>

<style>
</style>