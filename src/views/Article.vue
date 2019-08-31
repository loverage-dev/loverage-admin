<template>
  <div>
    <h1>Article</h1>
    <div v-if="post">
      <p>gender：{{ post.post.user_sex|translate_to_jp_sex }}</p>
      <p>age：{{ post.post.user_age|translate_to_jp_age }}</p>
      <p>content：{{ post.post.content }}</p>
      <p>opt1：{{ post.post.opt1 }}</p>
      <p>opt2：{{ post.post.opt2 }}</p>
      <p>created_at：{{ post.post.created_at|format_date }}</p>
      <p>updated_at：{{ post.post.updated_at|format_date }}</p>
      <p>views：{{ post.post.ref_count }}</p>
      <p>votes：{{ post.post.votes_amount }}</p>
      <div class="container" v-if="post.post.votes_amount > 0">
        <div class="inner_container chart">
          <div>By Age</div>
          <BarChart class="item1 barChart" v-if="barChartData.datasets" :data="barChartData" :options="barChartOptions" />
        </div>
        <div class="inner_container chart">
          <div>By Gender</div>
          <div class="container">
            <div style="width: 300px">
              <span>{{ post.post.opt1 }}</span>
              <PieChart class="pieChart" v-if="post.votes.opt1_selected.amount > 0 && pieChartData1.datasets" :data="pieChartData1" :options="pieChartOptions1" />
              <div v-if="post.votes.opt1_selected.amount == 0 && pieChartData1.datasets">投票なし</div>
            </div>
            <div style="width: 300px">
              <span>{{ post.post.opt2 }}</span>
              <PieChart class="pieChart" v-if="post.votes.opt2_selected.amount > 0 && pieChartData2.datasets" :data="pieChartData2" :options="pieChartOptions2" />
              <div v-if="post.votes.opt2_selected.amount == 0 && pieChartData1.datasets">投票なし</div>
            </div>
          </div>
        </div>
      </div>
      <p>comments</p>
      <ul v-for="c in post.comments.contents" v-bind:key="c.origin_id">
        <li>{{ c.created_at|format_date  }}  --->  {{ getOptContent(c.selected_opt) }} 「{{c.content}}」 ({{c.user_age|translate_to_jp_age }}・{{c.user_sex|translate_to_jp_sex}}) </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from "../store";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";

export default {
  components: {
    BarChart,
    PieChart
  },
  mounted: function(){
    let id = this.$route.params.id
    // Json取得
    store.get_ajax_article(`articles/${ id }`, "post");
    // Json取得後に呼び出される
    store.$on("GET_AJAX_COMPLETE_POST", () => {
      this.post = store.getPost();
      console.log(this.post)
      this.setBarChartData()
      this.setPieChartData()
    });
  },
  methods: {
    getOptContent: function(opt){
      let optContent = ""
      switch(opt){
        case "opt1":
          optContent = this.post.post.opt1
          break
        case "opt2":
          optContent = this.post.post.opt2
          break
      }
      return optContent
    },
    setPieChartData: function(){
      if(this.post){
        this.pieChartData1.datasets = 
        [
          {
            label: this.post.post.opt1,
            backgroundColor: [ "#00D8FF", "#E46651", "#41B883"],
            data: [
                this.post.votes.opt1_selected.sex.votes_by_m,
                this.post.votes.opt1_selected.sex.votes_by_f,
                this.post.votes.opt1_selected.sex.votes_by_o
              ]
          }
        ]
        this.pieChartData2.datasets = 
        [
          {
            label: this.post.post.opt2,
            backgroundColor: [ "#00D8FF", "#E46651", "#41B883"],
            data: [
          this.post.votes.opt2_selected.sex.votes_by_m,
          this.post.votes.opt2_selected.sex.votes_by_f,
          this.post.votes.opt2_selected.sex.votes_by_o
              ]
          }
        ]
      }
    },
    setBarChartData: function(){
      if(this.post){
        let arryOpt1Selected = [
          this.post.votes.opt1_selected.age.e_10s,
          this.post.votes.opt1_selected.age.l_10s,
          this.post.votes.opt1_selected.age.e_20s,
          this.post.votes.opt1_selected.age.l_20s,
          this.post.votes.opt1_selected.age.e_30s,
          this.post.votes.opt1_selected.age.l_30s,
          this.post.votes.opt1_selected.age.e_40s,
          this.post.votes.opt1_selected.age.l_40s,
          this.post.votes.opt1_selected.age.e_50s,
          this.post.votes.opt1_selected.age.l_50s,
          this.post.votes.opt1_selected.age.e_60s,
          this.post.votes.opt1_selected.age.l_60s
        ]
        let arryOpt2Selected = [
          this.post.votes.opt2_selected.age.e_10s,
          this.post.votes.opt2_selected.age.l_10s,
          this.post.votes.opt2_selected.age.e_20s,
          this.post.votes.opt2_selected.age.l_20s,
          this.post.votes.opt2_selected.age.e_30s,
          this.post.votes.opt2_selected.age.l_30s,
          this.post.votes.opt2_selected.age.e_40s,
          this.post.votes.opt2_selected.age.l_40s,
          this.post.votes.opt2_selected.age.e_50s,
          this.post.votes.opt2_selected.age.l_50s,
          this.post.votes.opt2_selected.age.e_60s,
          this.post.votes.opt2_selected.age.l_60s
        ]
        this.barChartData.datasets = [
          {
            label: this.post.post.opt1,
            backgroundColor: '#f87979',
            data: arryOpt1Selected
          },
          {
            label: this.post.post.opt2,
            backgroundColor: '#3D5B96',
            data: arryOpt2Selected
          }
        ]
      }
    }
  },
  data: function(){
    return {
      post: null,
      barChartData: {
        labels: [
          '10代前半', 
          '10代後半', 
          '20代前半', 
          '20代後半', 
          '30代前半', 
          '30代後半', 
          '40代前半', 
          '40代後半', 
          '50代前半', 
          '50代後半', 
          '60代前半', 
          '60代後半'],
        datasets: null
      },
      barChartOptions: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            categoryPercentage: 1,
            barPercentage: 0.5
          }],
          yAxes: [{
            stacked: true
          }]
        }
      },
      pieChartData1: {
        labels: ["male", "female", "other"],
        datasets: null
      },
      pieChartData2: {
        labels: ["male", "female", "other"],
        datasets: null
      },
      pieChartOptions1: {
        title: {
          display: true
        }
      },
      pieChartOptions2: {
        title: {
          display: true
        }
      }
    }
  }
}
</script>
<style scoped>
.container{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px 0px;
  padding: 0px;
}
.inner_conteiner{
  display: flex;
  flex-direction: column;
  /* justify-content:space-between; */
}
.barChart {
  max-height: 500px;
  min-width: 500px;
}
.pieChart {
  width: 280px;
  height: 300px;
}
.chart {
  border: double 1px #ffffff;
  border-radius: 10px;
  padding: 5px;
  margin-right: 10px;
}
</style>