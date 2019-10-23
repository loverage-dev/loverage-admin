<template>
  <div>
    <h2>相談</h2>
    <div v-if="post">
      <table>
        <tr>
          <td><v-btn color="primary" size="large" type="block" @click="editPost" v-bind:class="{ accent: editting }"><span v-if="!editting">編集</span><span v-if="editting">編集取消</span></v-btn></td>
          <td><v-btn class="success" size="large" type="block" @click="updatePost" v-bind:disabled="!editting">更新</v-btn></td>
          <td><v-btn class="error" @click="deletePost">削除</v-btn></td>
          <td>
            <v-btn flat @click="goToWeb">
              <v-avatar :size="25" color="grey lighten-5">
                <img src="../assets/logo.png" alt="avatar">
              </v-avatar>　実際の投稿ページを確認
            </v-btn>
          </td>
        </tr>
      </table>
      <table class="article">
        <tr>
          <td class="row-title">日付</td>
          <td>投稿日：{{ post.post.created_at|format_date }}</td>
          <td>最終更新日：{{ post.post.updated_at|format_date }}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="row-title">投稿者</td>
          <td colspan="2">
            性別：
            <select v-model="post.post.user_sex" style="width:40%;" v-bind:class="{ normal: editting }" :disabled="!editting">
              <option value="m">男性</option>
              <option value="f">女性</option>
              <option value="o">その他</option>
            </select>
          </td>
          <td colspan="2">年代：
            <select v-model="post.post.user_age" style="width:40%;"  v-bind:class="{ normal: editting }" :disabled="!editting">
              <option value="e_10s">10代前半</option>
              <option value="l_10s">10代後半</option>
              <option value="e_20s">20代前半</option>
              <option value="l_20s">20代後半</option>
              <option value="e_30s">30代前半</option>
              <option value="l_30s">30代後半</option>
              <option value="e_40s">40代前半</option>
              <option value="l_40s">40代後半</option>
              <option value="e_50s">50代前半</option>
              <option value="l_50s">50代後半</option>
              <option value="e_60s">60代前半</option>
              <option value="l_60s">60代後半</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="row-title">選択肢</td>
          <td colspan="2">①：<input type="text" v-model="post.post.opt1" style="width:90%;" v-bind:class="{ normal: editting }" :disabled="!editting"></td>
          <td colspan="2">②：<input type="text" v-model="post.post.opt2" style="width:90%;" v-bind:class="{ normal: editting }" :disabled="!editting"></td>
        </tr>
        <tr>
          <td class="row-title">カテゴリー</td>
          <td colspan="4">
            <select v-model="post.post.category_id" style="width:40%;"  v-bind:class="{ normal: editting }" :disabled="!editting">
              <option value="null" v-if="post.post.category_id == null">(未設定)</option>
              <option v-bind:value="category.id" v-for="category in categoryList" v-bind:key="category.id">{{ category.name }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="row-title">相談内容</td>
          <td colspan="4">
            <textarea class="text-content"  v-bind:class="{ normal: editting }" :disabled="!editting" v-model="post.post.content" style="width:100%;"></textarea>
          </td>
        </tr>
        <tr>
          <td class="row-title">ハッシュタグ</td>
          <td v-if="editting">
            <input placeholder="#浮気" type="text" v-model="newTag" class="normal" v-bind:class="{ disabled: !editting }" :disabled="!editting" style="border:1px solid black">
            <button class="disabled" v-bind:class="{ addTag: editting }" :disabled="!editting" style="width:40px;" @click="addTag()">追加</button>
          </td>
          <td colspan="3">
            <div v-for="(tag, index) in post.post.tag_list" v-bind:key="index">
              <button v-if="editting">
                <v-icon
                  :size="15"
                  @click="deleteTag(index)"
                >close</v-icon></button>　#{{ tag }}
              </div>
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="row-title">投票結果</td>
          <td>閲覧数：{{ post.post.ref_count }}</td>
          <td>投票数：{{ post.post.votes_amount }}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colspan="4" v-if="post.post.votes_amount > 0">
            <div class="container">
              <div class="inner_container chart">
                <div>By Gender</div>
                <div class="container">
                  <div style="width: 300px">
                    <span>{{ post.post.opt1 }} ( {{ post.votes.opt1_selected.amount }}/{{post.post.votes_amount}} )</span>
                    <PieChart class="pieChart" v-if="post.votes.opt1_selected.amount > 0 && pieChartData1.datasets" :data="pieChartData1" :options="pieChartOptions1" />
                    <div v-if="post.votes.opt1_selected.amount == 0 && pieChartData1.datasets">投票なし</div>
                  </div>
                  <div style="width: 300px">
                    <span>{{ post.post.opt2 }} ( {{ post.votes.opt2_selected.amount }}/{{post.post.votes_amount}} )</span>
                    <PieChart class="pieChart" v-if="post.votes.opt2_selected.amount > 0 && pieChartData2.datasets" :data="pieChartData2" :options="pieChartOptions2" />
                    <div v-if="post.votes.opt2_selected.amount == 0 && pieChartData1.datasets">投票なし</div>
                  </div>
                </div>
              </div>
              <div class="inner_container chart">
                <div>By Age</div>
                <BarChart class="item1 barChart" v-if="barChartData.datasets" :data="barChartData" :options="barChartOptions" />
              </div>
            </div>
          </td>
        </tr>
      </table>
      <br>
      <hr>
      <br>
      <h2>コメント</h2>
      <p>コメント数：{{ post.comments.contents.length }} 件</p>
      <table class="comments" v-if="post.comments.contents.length > 0">
        <tr>
          <th>投稿日</th>
          <th>選択</th>
          <th>コメント</th>
          <th>属性</th>
          <th colspan="3">操作</th>
        </tr>
        <tr v-for="(c, index) in post.comments.contents" v-bind:key="index">
          <td>{{ c.created_at|format_date  }}</td>
          <td>{{ getOptContent(c.selected_opt) }}</td>
          <td class="comment-content">
            <textarea ref="txtComment" v-model="c.content" v-bind:readonly="true" style="width:100%;" class="disabled">
          </textarea></td>
          <td>{{c.user_age|translate_to_jp_age }}・{{c.user_sex|translate_to_jp_sex}}</td>
          <td class="action"><button class="btn primary" ref="btnEditComment" @click="editComment(index)">編集</button></td>
          <td class="action"><button class="btn btn-desabled" ref="btnUpdateComment" @click="updateComment(c, index)" disabled>更新</button></td>
          <td class="action"><button class="btn btn-delete" ref="btnDeleteComment" @click="deleteComment(c, index)">削除</button></td>
        </tr>
      </table>
    </div>
    <!-- ダイアログ -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">確認</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <span v-if="action == 'updatePost'">相談内容を更新しても本当にいいですか？</span>
                <span v-if="action == 'deletePost'">相談を削除しても本当にいいですか？</span>
                <span v-if="action == 'updateComment'">コメント内容を更新しても本当にいいですか？</span>
                <span v-if="action == 'deleteComment'">コメントを削除しても本当にいいですか？</span>
              </v-flex>
            </v-layout>
          </v-container>
          <small v-if="action == 'updatePost' || action == 'updateComment'">*[OK]を押すと更新処理が実行されます。</small>
          <small v-if="action == 'deletePost' || action == 'deleteComment'">*[OK]を押すと削除処理が実行されます。</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogCancel">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="dialogOk">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  created() {
    this.fetchCategoryList()
    this.fetchArticle()
  },
  watch: {
    $route: function(to, from) {
      this.fetchCategoryList()
      this.fetchArticle();
    }
  },
  computed:{
    editting: function(){
      return this.isEditting
    }
  },
  methods: {
    goToWeb: function(){
      let url = `https://www.loverage.jp/article/${ this.$route.params.id }`
      window.open(url, '_blank')
    },
    fetchCategoryList(){
      //カテゴリーリスト取得
      store.get_ajax_category_list('category_list')
      .then((res)=>{
        if(res.status == 200){
          this.categoryList = res.data.categories
        }
      })
      .catch((err)=>{
        alert("カテゴリーが取得できませんでした。")
      })
    },
    fetchArticle: function(){
      store.startLoading()
      let id = this.$route.params.id
      // Json取得
      store.get_ajax_article(`articles/${ id }`, "post");
      // Json取得後に呼び出される
      store.$on("GET_AJAX_COMPLETE_POST", () => {
        this.post = store.getPost();
        this.tmpPost = this.deepCopy(this.post.post);
        this.tmpComments = this.deepCopy(this.post.comments.contents);
        this.setBarChartData()
        this.setPieChartData()
        this.isEditting = false
        store.endLoading()
      });
    },
    addTag: function(){
      let hTag = ""
      if(this.newTag.startsWith("#") || this.newTag.startsWith("＃")){
        hTag = this.newTag.slice(1)
      }else{
        hTag = this.newTag.trim()
      }
      this.post.post.tag_list.push(hTag)
      this.newTag = ""
    },
    deleteTag: function(index){
      this.post.post.tag_list.splice(index, 1);
    },
    dialogOk: function(){

      switch(this.action){
        case "updatePost":
          store.post_ajax_articles(`articles/${this.post.post.id}/update`, { 
            "post": {
              "age": this.post.post.user_age,
              "sex": this.post.post.user_sex,
              "content": this.post.post.content,
              "opt1": this.post.post.opt1,
              "opt2": this.post.post.opt2,
              "img_base64": this.post.post.img_base64,
              "tag_list": this.post.post.tag_list,
              "category_id": this.post.post.category_id
              }
            })
          .then((res)=>{
            if(res.status == 200){
              this.fetchArticle();
            } 
          })
          break;
        case "deletePost":
          store.delete_ajax_article("articles/", this.post.post.id)
          .then((res)=>{
            if(res.status == 200){
              this.$router.push({ name: 'home' })
            }
          })
          break;
        case "updateComment":
          store.post_ajax_articles(`comments/${this.post.comments.contents[this.indexComment].origin_id}`, { 
            "comment": {
              "age": this.post.comments.contents[this.indexComment].user_age,
              "sex": this.post.comments.contents[this.indexComment].user_sex,
              "content": this.post.comments.contents[this.indexComment].content,
              "icon_id": this.post.comments.contents[this.indexComment].icon_id,
              "selected_opt": this.post.comments.contents[this.indexComment].selected_opt,
              "post_id": this.post.comments.contents[this.indexComment].post_id
              }
            })
          .then((res)=>{
            if(res.status == 200){
              this.fetchArticle();
              this.editComment(this.indexComment)
            } 
          })
          break;
        case "deleteComment":
          store.delete_ajax_article("comments/", this.post.comments.contents[this.indexComment].origin_id)
          .then((res)=>{
            if(res.status == 200){
              this.fetchArticle();
            }
          })
          break;
      }
      this.action = ""
      this.dialog = false;
      this.fetchArticle();
    },
    dialogCancel: function(){
      this.action = ""
      this.dialog = false;
    },
    deepCopy: function(obj){
      let copy = JSON.parse(JSON.stringify(obj));
      return copy;
    },
    editPost: function(){
      if(!this.isEditting){
        this.isEditting = true
      }else{
        this.isEditting = false
        this.post.post = this.deepCopy(this.tmpPost)
      }
    },
    updatePost: function(){
      this.action = "updatePost"
      this.dialog = true
    },
    deletePost: function(){
      this.action = "deletePost"
      this.dialog = true
    },
    editComment: function(index){
      if(this.$refs.txtComment[index].readOnly == true){
        this.resetEditComment()
        this.$refs.txtComment[index].readOnly = false
        this.$refs.txtComment[index].className = "normal"
        this.$refs.btnEditComment[index].innerHTML = "取消"
        this.$refs.btnEditComment[index].className = "btn accent"
        this.$refs.btnUpdateComment[index].disabled = false
        this.$refs.btnUpdateComment[index].className = "btn update"
      }else{
        this.resetEditComment()
      }
    },
    resetEditComment: function(){
        this.$refs.txtComment.forEach((element,i) =>{
          element.value = this.tmpComments[i].content
          element.readOnly = true
          this.$refs.btnEditComment[i].innerHTML = "編集"
          this.$refs.btnEditComment[i].className = "btn primary"
          this.$refs.txtComment[i].className = "disabled"
          this.$refs.btnUpdateComment[i].disabled = true
          this.$refs.btnUpdateComment[i].className = "btn btn-desabled"
        })
    },
    updateComment: function(comment, index){
      this.action = "updateComment"
      this.indexComment = index;
      this.dialog = true
    },
    deleteComment: function(comment,index){
      this.action = "deleteComment"
      this.indexComment = index;
      this.dialog = true
    },
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
      tmpPost: null,
      tmpComments: null,
      isEditting: false,
      indexComment: 0,
      action: "",
      newTag: "",
      categoryList: null,
      dialog: false,
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
.text-content{
  min-width: 800px;
  min-height: 100px;
}
.row-title{
  background-color: antiquewhite;
  color: black;
  text-align: center;
}
table.article td{
  width: 120px;
  padding: 2px;
}
table.comments th{
  width: 150px;
  padding: 2px;
  text-align: left;
  background-color: antiquewhite;
  color: black;
}
table.comments td{
  width: 160px;
  padding: 2px;
  border:1px solid white;
}
table.comments td.comment-content{
  width: 580px;
  padding: 2px;
}
table.comments td.action{
  width: 60px;
  padding: 5px;
}
.btn{
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
  color: black;
}
.btn-delete{
  background-color: coral
}
.btn-desabled{
  background-color: gray;
}
.normal{
  background-color:whitesmoke;
  color:black;
}
.back{
  background-color: aqua;
}
.update{
  background-color:chartreuse;
}
.addTag{
  background-color: mediumseagreen;
}
</style>