<template>
  <div>
    <div v-if="!showSummary">
      <p>{{ this.deckName }}</p>
      <div v-if="!isStarted">
        <button v-on:click="retreiveOneCard(availableCards)">start</button>
      </div>
      <div v-if="isStarted" class="quizCards">
        <p>{{ availableCards.length }} {{ pluralOrNot() }}</p>
        <p>{{ randomCard.question }}</p>
        <p v-on:click="toggleAnswer">{{ displayAnswer() }}</p>
        <p v-on:click="toggleExample">{{ displayExample() }}</p>
        <button v-on:click="correctCardAdd()">correct</button>
        <button v-on:click="wrongCardAdd()">wrong</button>
      </div>
    </div>
    <div v-if="showSummary">
      <p>{{ this.deckName }}</p>
      <p>correct</p>
      <div v-for="correctC in correctCards" :key="correctC.id" class="correctCards">
        <p>{{ correctC.question }}</p>
        <p>{{ correctC.answer }}</p>
        <p>{{ correctC.example }}</p>
      </div>
      <p>incorrect</p>
      <div v-for="wrongC in wrongCards" :key="wrongC.id" class="wrongCards">
        <p>{{ wrongC.question }}</p>
        <p>{{ wrongC.answer }}</p>
        <p>{{ wrongC.example }}</p>
      </div>
      <button v-on:click="retakeQuiz()">retake quiz</button>
      <p>your score was {{Math.floor(this.$store.state.score)}}% out of {{this.$store.state.cards.length}} {{pluralOrNon()}}</p>
      <button v-on:click="viewLeaderBoard()">view leaderboard</button>
    </div>
  </div>
</template>

<script>
import CardService from "@/services/CardService";
import ScoreService from "@/services/ScoreService.js";
export default {
  data() {
    return {
      availableCards: [],
      correctCards: [],
      wrongCards: [],
      storedCards: [],
      randomCard: {},
      isStarted: false,
      showSummary: false,
      deckName: null,
      userName: null,
      score: null,
    };
  },
  methods: {
    retreiveAllCards() {
      CardService.getCards().then((response) => {
        const addProps = response.data.map((c) => {
          return {
            ...c,
            hideAnswer: true,
            hideExample: true,
          };
        });
        this.$store.commit("SET_CARDS", addProps);
        this.availableCards = this.$store.state.cards;
        this.deckName = this.$store.state.deckName;
        this.$forceUpdate();
      });
    },
    retreiveOneCard(availableCards) {
      this.isStarted = true;
      this.randomCard =
        availableCards[(availableCards.length * Math.random()) | 0];
      this.filterReadCards(this.randomCard.card_id);
      this.$forceUpdate();
      return this.randomCard;
    },
    filterReadCards(randomCardId) {
      this.availableCards = this.availableCards.filter((c) => {
        return c.card_id != randomCardId;
      });
    },
    correctCardAdd() {
      this.correctCards.push(this.randomCard);
      if (this.availableCards.length === 0) {
        let divisor = this.$store.state.cards.length;
        const score = 100 * (this.correctCards.length / divisor);
        this.$store.commit("SET_SCORE", score);
        this.submitScore();
        this.showSummary = true;
        this.$forceUpdate();
      } else if (this.availableCards.length !== 0) {
        this.retreiveOneCard(this.availableCards);
        this.$forceUpdate();
      }
    },
    wrongCardAdd() {
      this.wrongCards.push(this.randomCard);
      if (this.availableCards.length === 0) {
        let divisor = this.$store.state.cards.length;
        const score = 100 * (this.correctCards.length / divisor);
        this.$store.commit("SET_SCORE", score);
        this.submitScore();
        this.showSummary = true;
        this.$forceUpdate();
      } else if (this.availableCards.length !== 0) {
        this.retreiveOneCard(this.availableCards);
        this.$forceUpdate();
      }
    },
    pluralOrNot() {
      return this.availableCards.length == 1
        ? "card remaining"
        : "cards remaining";
    },
    displayAnswer() {
      return this.randomCard.hideAnswer == true
        ? "show answer"
        : this.randomCard.answer;
    },
    toggleAnswer() {
      this.randomCard.hideAnswer = !this.randomCard.hideAnswer;
    },
    displayExample() {
      return this.randomCard.hideExample == true
        ? "show example"
        : this.randomCard.example;
    },
    toggleExample() {
      this.randomCard.hideExample = !this.randomCard.hideExample;
    },
    async submitScore() {
      if (this.$store.state.userName) {
        let date = new Date();
        let dd = String(date.getDate()).padStart(2, "0");
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let yyyy = date.getFullYear();

        date = yyyy + "-" + mm + "-" + dd;

        const newScore = {
          deck_id: this.$store.state.deckId,
          user_id: this.$store.state.userId,
          score: this.$store.state.score,
          date_inserted: date,
        };
        await ScoreService.createScore(newScore);
        // this.$router.push({ name: "DeckLeader" });
      }
    },
    retakeQuiz() {
      alert(`your score was ${this.$store.state.score}%`);
      this.availableCards = this.$store.state.cards;
      this.wrongCards = [];
      this.correctCards = [];
      this.showSummary = false;
      this.isStarted = false;
    },
    viewLeaderBoard() {
      this.$router.push({ name: "DeckLeader" });
    },
    pluralOrNon() {
      return this.$store.state.cards.length === 1 ? "card" : "cards";
    },
  },
  created() {
    this.retreiveAllCards();
  },
  watch: {
    availableCards: function () {
      this.availableCards;
    },
  },
};
</script>

<style>
.quizCards{
  background-color: whitesmoke;
  width: 70vw;
  margin: 24px auto;
  padding: 20px;
  box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.5);
}

.correctCards{
  background-color: rgb(120, 255, 86);
  width: 70vw;
  margin: 24px auto;
  padding: 20px;
  box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.5);
}

.wrongCards{
  background-color: rgb(255, 95, 67);
  width: 70vw;
  margin: 24px auto;
  padding: 20px;
  box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.5);
}
</style>