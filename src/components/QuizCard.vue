<template>
  <div>
    <div v-if="!showSummary">
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
    </div>
  </div>
</template>

<script>
import CardService from "@/services/CardService";
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