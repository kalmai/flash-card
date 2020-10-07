<template>
  <div>
    <line-chart :chart-data="datasetsfull" class="chart" />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
export default {
  components: {
    LineChart,
  },
  computed: {
    datasetsfull() {
      return {
        labels: this.$store.state.xValues,
        datasets: [
          {
            label: "avg score",
            backgroundColor: "#f87979",
            data: this.$store.state.yValues,
          },
        ],
      };
    },
  },
};
</script>

<style>
.chart {
  width: 500px;
  height: auto;
  margin: 0 auto;
}
</style>