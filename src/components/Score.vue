<template>
  <div>
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