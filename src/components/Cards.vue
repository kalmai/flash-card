<template>
  <div>
        <span
      >{{ loginOrLogout().text
      }}<button v-on:click="logout()">
        {{ loginOrLogout().buttonText }}
      </button></span
    >
    <p v-if="loading">
      <img src="../assets/loading.gif" alt="loading" />
    </p>
    <p>{{this.deckName}}</p>
    <div v-for="card in cards" :key="card.id" class="card">
      <p>{{card.question}}</p>
      <p>{{card.answer}}</p>
      <p>{{card.example}}</p>
      <p>
        <button v-on:click="deleteCard(card.card_id)" v-if="canCrud(card)">delete</button>
      </p>
      <button v-on:click="handleClick(card)" v-if="canCrud(card)">edit</button>
      <form v-on:submit.prevent="updateCard(card)" v-if="card.showCardUpdate" class="editCardForm">
        <div>
        <label for="question">Question:</label>
        <input type="text" v-model="selectedCard.question" />
        </div>
        <div>
        <label for="answer">Answer:</label>
        <input type="text" v-model="selectedCard.answer" />
        </div>
        <div>
        <label for="example">Example:</label>
        <input type="text" v-model="selectedCard.example" />
        </div>
        <input type="submit" />
        <button v-on:click="showUpdateCardFromFlip(card)">cancel</button>
      </form>
    </div>
    <p v-on:click="showNewCardFormFlip()" v-if="canCreateCard()">create a new card</p>
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
      deckName: null
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
        this.deckName = this.$store.state.deckName;
        this.cards = this.$store.state.cards;
        this.$forceUpdate();
        this.loading = false;
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
      let newCard = {
        deck_id: this.$store.state.deckId,
        question: this.newQuestion,
        answer: this.newAnswer,
        example: this.newExample,
        user_id: this.$store.state.userId
      };
      await CardService.createCard(newCard);
      this.showNewCardFormFlip();
      this.retreiveAllCards();
      this.newCard = {};
    },
    canCrud(card){
      return this.$store.state.userId === card.user_id;
    },
    canCreateCard(){
      if(this.$store.state.userId === -1 || this.$store.state.userId !== this.$store.state.deckUserId){
        return false;
      }else{
        return true;
      }
    },
    loginOrLogout() {
      return this.$store.state.userId == -1
        ? { text: "login to create, edit, and store scores ", buttonText: "login" }
        : {
            text: `you are logged in as ${this.$store.state.userName} `,
            buttonText: "logout",
          };
    },
    logout() {
      this.$store.commit("SET_USERNAME", null);
      this.$store.commit("SET_USERID", -1);
      this.$router.push({ name: "Login" });
    }
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
.card {
  background-color: whitesmoke;
  width: 70vw;
  margin: 24px auto;
  padding: 20px;
  box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.5);
}

.editCardForm{
  display: flex;
  flex-direction: column;
  width: 80%;
  justify-content: center;
  align-items: center;
  margin: 25px auto;
}
</style>