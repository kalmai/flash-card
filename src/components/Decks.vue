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
      <br />loading, may take up to 30 seconds for first request
    </p>
    <div v-else>
      <div v-for="deck in decks" :key="deck.id">
        <div class="eachDeck">
          <p>
            {{ deck.deck_name }}
            <router-link to="/cards">
              <a v-on:click="setStateDeckId(deck)">view cards</a>
            </router-link>
            &nbsp;
            <router-link to="/quiz">
              <a v-on:click="setStateDeckId(deck)">take quiz</a>
            </router-link>
          </p>
          <button v-on:click="nameChangeDeck(deck)" v-if="canEditDelete(deck)">
            edit
          </button>
          <form
            v-on:submit.prevent="updateDeck(findUpdateDeck(deck))"
            v-if="findUpdateDeck(deck)"
          >
            <label for="name">Name:</label>
            <input type="text" v-model="findUpdateDeck(deck).deck_name" />
            <input
              type="radio"
              id="public"
              name="visibility"
              value="true"
              v-model="findUpdateDeck(deck).is_public"
            />
            <label for="public">public</label>
            <input
              type="radio"
              id="private"
              name="visibility"
              value="false"
              v-model="findUpdateDeck(deck).is_public"
            />
            <label for="private">private</label>
            <input type="submit" />
            <button v-on:click="setShowUpdateForm(deck)">cancel</button>
          </form>
          <p>
            <button
              v-on:click="deleteDeck(deck.deck_id)"
              v-if="canEditDelete(deck)"
            >
              delete
            </button>
          </p>
        </div>
      </div>
      <button v-on:click="setShowNewDeckForm()" v-if="canCreate()">
        create a new deck
      </button>
      <form v-on:submit.prevent="createDeck()" v-if="showNewDeckForm">
        <label for="newDeckName">Name:</label>
        <input type="text" v-model="newDeckName" />
        <input
          type="radio"
          id="public"
          name="visibility"
          value="true"
          v-model="newPublicPrivate"
        />
        <label for="public">public</label>
        <input
          type="radio"
          id="private"
          name="visibility"
          value="false"
          v-model="newPublicPrivate"
        />
        <label for="private">private</label>
        <input type="submit" />
        <button v-on:click="setShowNewDeckForm()">cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import DeckService from "@/services/DeckService";
export default {
  name: "decks",
  data() {
    return {
      decks: [],
      newName: "",
      newDeckName: "",
      showNewDeckForm: false,
      loading: true,
      newPublicPrivate: null,
      inProgressDeckList: [],
    };
  },
  methods: {
    retreiveAllCurrentDecks() {
      DeckService.getDecks().then((response) => {
        this.$store.commit("SET_DECKS", response.data);
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
      if (this.inProgressDeckList.every((d) => deck.deck_id !== d.deck_id)) {
        this.inProgressDeckList.push({ ...deck });
      } else {
        this.setShowUpdateForm(deck);
      }
    },
    async updateDeck(deck) {
      await DeckService.updateDeck(deck);
      this.retreiveAllCurrentDecks();
      this.$forceUpdate();
    },
    async createDeck() {
      let newDeck = {
        user_id: this.$store.state.userId,
        deck_name: this.newDeckName,
        is_public: this.newPublicPrivate,
      };
      await DeckService.createDeck(newDeck)
        .then(() => {
          this.showNewDeckForm = false;
          this.retreiveAllCurrentDecks();
          newDeck = {};
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setShowNewDeckForm() {
      this.showNewDeckForm = !this.showNewDeckForm;
    },
    async setStateDeckId(deck) {
      await this.$store.commit("SET_DECK_ID", deck.deck_id);
      await this.$store.commit("SET_DECK_NAME", deck);
      await this.$store.commit("SET_DECK_USER_ID", deck);
      this.$forceUpdate();
    },
    setShowUpdateForm(deck) {
      this.inProgressDeckList = this.inProgressDeckList.filter(
        (d) => deck.deck_id !== d.deck_id
      );
    },
    logout() {
      this.$store.commit("SET_USERNAME", null);
      this.$store.commit("SET_USERID", -1);
      this.$router.push({ name: "Login" });
    },
    loginOrLogout() {
      return this.$store.state.userId == -1
        ? { text: "you're logged in as a guest ", buttonText: "login" }
        : {
            text: `you are logged in as ${this.$store.state.userName} `,
            buttonText: "logout",
          };
    },
    canEditDelete(deck) {
      return this.$store.state.userId == deck.user_id ? true : false;
    },
    canCreate() {
      return this.$store.state.userId !== -1;
    },
    findUpdateDeck(deck) {
      return this.inProgressDeckList.find((d) => d.deck_id === deck.deck_id);
    },
  },
  created() {
    this.retreiveAllCurrentDecks();
  },
  watch: {
    decks: function () {
      this.decks;
    },
  },
};
</script>

<style>
.eachDeck {
  background-color: whitesmoke;
  width: 70vw;
  margin: 24px auto;
  padding: 20px;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.5);
}
</style>