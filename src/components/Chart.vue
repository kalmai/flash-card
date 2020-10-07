<template>
  <div>
    <div v-if="finishedQuiz">
      <span>
        {{ loginOrLogout().text
        }}<button v-on:click="logout()">
          {{ loginOrLogout().buttonText }}
        </button>
      </span>
      <p>
        {{ this.$store.state.deckName }}
      </p>
      <form v-on:change.prevent="getRangeOfScores()">
        custom dates:
        <label for="start">Start: </label>
        <input type="date" v-model="start" />&nbsp;
        <label for="start">End: </label>
        <input type="date" v-model="end" value="2018-07-22" />
      </form>
      <p></p>
      <form v-on:change.prevent="getRangeOfScores(datesBack)">
        preset dates:
        <input
          type="radio"
          id="oneWeek"
          name="range"
          value="7"
          v-model="datesBack"
        />
        <label for="public">one week</label>
        <input
          type="radio"
          id="twoWeeks"
          name="range"
          value="14"
          v-model="datesBack"
        />
        <label for="private">two weeks</label>
        <input
          type="radio"
          id="oneMonth"
          name="range"
          value="30"
          v-model="datesBack"
        />
        <label for="private">one month</label>
        <input
          type="radio"
          id="threeMonths"
          name="range"
          value="90"
          v-model="datesBack"
        />
        <label for="private">three months</label>
      </form>

      <div class="chart">
        <GraphBuilder />
      </div>
      <p>
        current range:
        {{ greetingDate() }}
      </p>
    </div>
    <div v-else>
      <p>
        there is currently no data, please finish a quiz to start tracking
        progress
      </p>
    </div>
  </div>
</template>

<script>
import ScoreService from "@/services/ScoreService.js";
import GraphBuilder from "@/components/Line-Graph-Builder";
export default {
  components: {
    GraphBuilder,
  },
  data() {
    return {
      scores: [],
      start: "",
      end: "",
      xValues: [],
      yValues: [],
      datesBack: 7,
      finishedQuiz: false,
    };
  },
  methods: {
    async getRangeOfScores(buttonRange) {
      if (buttonRange) {
        let now = new Date();
        let dd = String(now.getDate()).padStart(2, "0");
        let mm = String(now.getMonth() + 1).padStart(2, "0");
        let yyyy = now.getFullYear();
        now = yyyy + "-" + mm + "-" + dd;

        let range = new Date();
        range.setDate(range.getDate() - buttonRange);
        let dd2 = String(range.getDate()).padStart(2, "0");
        let mm2 = String(range.getMonth() + 1).padStart(2, "0");
        let yyyy2 = range.getFullYear();
        range = yyyy2 + "-" + mm2 + "-" + dd2;

        this.start = range;
        this.end = now;

        await ScoreService.getScoresFromTo(
          this.$store.state.userId,
          this.$store.state.deckId,
          range,
          now
        ).then((response) => {
          response.data.map((s) => {
            this.xValues.push(s.date_inserted);
            this.yValues.push(s.score);
          });
          this.$store.commit("SET_XVALUES", this.xValues);
          this.$store.commit("SET_YVALUES", this.yValues);
          if (this.xValues[0]) {
            this.finishedQuiz = true;
          }
          this.xValues = [];
          this.yValues = [];
        });
      } else {
        await ScoreService.getScoresFromTo(
          this.$store.state.userId,
          this.$store.state.deckId,
          this.start,
          this.end
        ).then((response) => {
          response.data.map((s) => {
            this.xValues.push(s.date_inserted);
            this.yValues.push(s.score);
          });
          this.$store.commit("SET_XVALUES", this.xValues);
          this.$store.commit("SET_YVALUES", this.yValues);
          if (this.xValues[0]) {
            this.finishedQuiz = true;
          }
          this.xValues = [];
          this.yValues = [];
          this.datesBack = null;
        });
      }
    },
    greetingDate() {
      return this.start ? this.start + " /// " + this.end : "";
    },
    logout() {
      this.$store.commit("SET_USERNAME", null);
      this.$store.commit("SET_USERID", -1);
      this.$router.push({ name: "Login" });
    },
    loginOrLogout() {
      return this.$store.state.userId == -1
        ? {
            text: "login to make decks, cards, and track progress ",
            buttonText: "login",
          }
        : {
            text: `you are logged in as ${this.$store.state.userName} `,
            buttonText: "logout",
          };
    },
  },
  created() {
    this.getRangeOfScores(this.datesBack);
  },
  beforeRouteLeave() {
    this.$store.commit("SET_XVALUES", null);
    this.$store.commit("SET_YVALUES", null);
  },
};
</script>