<script>
import { Bar, mixins } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ["data", "options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.data, this.options);
  }
}
</script>

<style scoped>
</style>