<template>
  <div>
    <p v-if="loading">
      <img src="../assets/loading.gif" alt="loading" />
    </p>
    <div v-for="card in cards" :key="card.id">
      <p>{{card.question}}</p>
      <p>{{card.answer}}</p>
      <p>{{card.example}}</p>
      <p>
        <span v-on:click="deleteCard(card.card_id)" v-if="!(card.deck_id == 1)">delete</span>
      </p>
      <span v-on:click="handleClick(card)" v-if="!(card.deck_id == 1)">edit</span>
      <form v-on:submit.prevent="updateCard(card)" v-if="card.showCardUpdate">
        <label for="question">Question:</label>
        <input type="text" v-model="selectedCard.question" />
        <label for="answer">Answer:</label>
        <input type="text" v-model="selectedCard.answer" />
        <label for="example">Example:</label>
        <input type="text" v-model="selectedCard.example" />
        <input type="submit" />
        <button v-on:click="showUpdateCardFromFlip(card)">cancel</button>
      </form>
    </div>
    <p v-on:click="showNewCardFormFlip()" v-if="!(this.$store.state.deckId == 1)">create a new card</p>
    <form v-on:submit.prevent="createCard()" v-if="showNewCardForm">
      <label for="newQuestion">Question:</label>
      <input type="text" v-model="newQuestion" />
      <label for="newAnswer">Answer:</label>
      <input type="text" v-model="newAnswer" />
      <label for="newExample">Example:</label>
      <input type="text" v-model="newExample" />
      <input type="submit" />
      <button v-on:click="showNewCardFormFlip()">cancel</button>
    </form>
  </div>
</template>

<script>
import CardService from "@/services/CardService";
export default {
  data() {
    return {
      cards: [],
      selectedCard: {},
      newQuestion: "",
      newAnswer: "",
      newExample: "",
      showNewCardForm: false,
      loading: true,
    };
  },
  methods: {
    showNewCardFormFlip() {
      this.showNewCardForm = !this.showNewCardForm;
    },
    showUpdateCardFromFlip(card) {
      card.showCardUpdate = !card.showCardUpdate;
    },
    retreiveAllCards() {
      CardService.getCards().then((response) => {
        const addedProps = response.data.map((c) => {
          return {
            ...c,
            showCardUpdate: false,
          };
        });
        this.$store.commit("SET_CARDS", addedProps);
        this.cards = this.$store.state.cards;
        this.$forceUpdate();
        this.loading = !this.loading;
      });
    },
    async deleteCard(cardId) {
      if (confirm("this will permanentely delete this card, are you sure?")) {
        await CardService.deleteCard(cardId);
        this.retreiveAllCards();
      }
    },
    handleClick(card) {
      this.selectedCard = {
        deck_id: card.deck_id,
        card_id: card.card_id,
        question: card.question,
        answer: card.answer,
        example: card.example,
      };
      card.showCardUpdate = !card.showCardUpdate;
    },
    async updateCard(card) {
      await CardService.updateCard(this.selectedCard);
      card.showCardUpdate = !card.showCardUpdate;
      this.retreiveAllCards();
    },
    async createCard() {
      const newCard = {
        deck_id: this.$store.state.deckId,
        question: this.newQuestion,
        answer: this.newAnswer,
        example: this.newExample,
      };
      await CardService.createCard(newCard);
      this.showNewCardFormFlip();
      this.retreiveAllCards();
      this.newCard = {};
    },
  },
  created() {
    this.retreiveAllCards();
  },
  watch: {
    cards: function () {
      this.cards;
    },
  },
};
</script>

<style>
</style>