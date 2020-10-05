<template>
  <div>
        <span
      >{{ loginOrLogout().text
      }}<button v-on:click="logout()">
        {{ loginOrLogout().buttonText }}
      </button></span
    >
    <table class="quizScoreTable">
      <tr>
        <th>rank</th>
        <th>user</th>
        <th>score</th>
      </tr>
      <tr v-for="s in scores" :key="s.id">
        <td>{{s.rank}}</td>
        <td>{{concealName(s)}}</td>
        <td>{{roundDownScore(s)}}%</td>
      </tr>
      <p>*** other usernames are concealed</p>
      <p
        v-if="!this.userName"
      >your score was {{Math.floor(this.$store.state.score)}}% out of {{this.$store.state.cards.length}} {{pluralOrNon()}}</p>
      <button v-on:click="retakeQuiz()">retake quiz</button>
    </table>
  </div>
</template>

<script>
import ScoreService from "@/services/ScoreService.js";
export default {
  data() {
    return {
      scores: [],
      userName: null,
      rank:1
    };
  },
  methods: {
    async getTopTen() {
      await ScoreService.getTopTen().then((response) => {
        const addedRank = response.data.map((s)=>{
          return{
            ...s,
            rank: this.rank++
          };
        })
        this.scores = addedRank;
        this.$forceUpdate();
      });
    },
    concealName(s) {
      return this.userName === s.user_name ? s.user_name : "***";
    },
    roundDownScore(s) {
      return Math.floor(s.score);
    },
    retakeQuiz() {
      this.$router.push({ name: "Quiz" });
    },
    pluralOrNon() {
      return this.$store.state.cards.length === 1 ? "card" : "cards";
    },
    getUserNameFromState() {
      this.userName = this.$store.state.userName;
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
    this.getUserNameFromState();
    this.getTopTen();
  }
};
</script>


<style>
.quizScoreTable{
  margin: 0 auto;
}

.quizScoreTable > tr {
  display: flex;
  justify-content: space-between;
}
</style>