<template>
  <div>
    <div v-if="!showSummary">
      <p>{{this.deckName}}</p>
      <div v-if="!isStarted">
        <button v-on:click="retreiveOneCard(availableCards)">start</button>
      </div>
      <div v-if="isStarted">
        <p>{{availableCards.length}} {{pluralOrNot()}}</p>
        <p>{{randomCard.question}}</p>
        <p v-on:click="toggleAnswer">{{displayAnswer()}}</p>
        <p v-on:click="toggleExample">{{displayExample()}}</p>
        <button v-on:click="correctCardAdd()">correct</button>
        <button v-on:click="wrongCardAdd()">wrong</button>
      </div>
    </div>
    <div v-if="showSummary">
      <p>{{this.deckName}}</p>
      <p>correct</p>
      <div v-for="correctC in correctCards" :key="correctC.id">
        <p>{{correctC.question}}</p>
        <p>{{correctC.answer}}</p>
        <p>{{correctC.example}}</p>
      </div>
      <p>incorrect</p>
      <div v-for="wrongC in wrongCards" :key="wrongC.id">
        <p>{{wrongC.question}}</p>
        <p>{{wrongC.answer}}</p>
        <p>{{wrongC.example}}</p>
      </div>
      <p>enter your username to add score to highscores and proceed to leaderboard, or skip this to view the leaderboard</p>
      <form v-on:submit.prevent="submitScore()">
        <label for="userName">Username:</label>
        <input type="text" v-model="userName" />
        <input type="submit" />
        <button v-on:click="skipSubmission()">skip</button>
      </form>
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
      return this.randomCard;
    },
    filterReadCards(randomCardId) {
      this.availableCards = this.availableCards.filter((c) => {
        return c.card_id != randomCardId;
      });
    },
    correctCardAdd() {
      this.correctCards.push(this.randomCard);
      if (this.availableCards.length == 0) {
        if (confirm("view results")) {
          let divisor = this.correctCards.length + this.wrongCards.length;
          const score = 100 * (this.correctCards.length / divisor);
          this.$store.commit("SET_SCORE", score);
          this.showSummary = true;
        }
      } else if (this.availableCards.length != 0) {
        this.retreiveOneCard(this.availableCards);
      }
    },
    wrongCardAdd() {
      this.wrongCards.push(this.randomCard);
      if (this.availableCards.length == 0) {
        if (confirm("view results")) {
          let divisor = this.correctCards.length + this.wrongCards.length;
          const score = 100 * (this.correctCards.length / divisor);
          this.$store.commit("SET_SCORE", score);
          this.showSummary = true;
        }
      } else if (this.availableCards.length != 0) {
        this.retreiveOneCard(this.availableCards);
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
      if (this.userName) {
        let date = new Date();
        let dd = String(date.getDate()).padStart(2, "0");
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let yyyy = date.getFullYear();

        date = yyyy + "-" + mm + "-" + dd;

        const newScore = {
          deck_id: this.$store.state.deckId,
          user_name: this.userName,
          score: this.$store.state.score,
          date_inserted: date,
        };
        await ScoreService.createScore(newScore);
        await this.$store.commit("SET_USERNAME", this.userName);
        this.$router.push({ name: "DeckLeader" });
      } else {
        alert("you must enter a username to be on the highscores");
      }
    },
    skipSubmission() {
      this.$router.push({ name: "DeckLeader" });
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
</style>