import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.xValues,
      datasets: [
        {
          label: 'score',
          backgroundColor: '#f87979',
          data: this.yValues
        }
      ]
    }, { responsive: true, maintainAspectRatio: false })
  },
  data() {
    return {
      xValues: this.$store.state.xValues,
      yValues: this.$store.state.yValues
    }
  },
  methods: {
    setCurrentState() {
      this.xValues = this.$store.state.xValues;
      this.yValues = this.$store.state.yValues;
    },
    reRender() {
      this.renderChart({
        labels: this.xValues,
        datasets: [
          {
            label: 'score',
            backgroundColor: '#f87979',
            data: this.yValues
          }
        ]
      }, { responsive: true, maintainAspectRatio: false })
    }
  },
  watch: {
    xValues: () => {
      this.reRender();
      console.log('hey')
    }
  }
}
