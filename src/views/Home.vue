<template>
  <div>
    <p>
      <span><v-icon :size="15">all_inbox</v-icon></span>
      <span style="font-weight: bold;"> All Articles</span>
      <span v-if="posts.length != 0 && tmpConditions == null"> 　総投稿数：{{ posts.length }} 件</span>
      <span v-if="posts.length != 0 && tmpConditions != null"> 　Hit投稿数：{{ posts.length }} 件  
        <span v-if="tmpConditions.keyword != ''">　[キーワード]{{ this.tmpConditions.keyword }}　</span>
        <span v-if="tmpConditions.hashTag != ''">　[ハッシュタグ]{{ this.tmpConditions.hashTag }}　</span>
        <span v-if="tmpConditions.sex != ''">　[性別]{{ this.tmpConditions.sex }}　</span>
        <span v-if="tmpConditions.age != ''">　[年齢]{{ this.tmpConditions.age }}　</span> 
      </span>
      <v-btn v-if="tmpConditions != null" @click="resetConditions()">条件リセット</v-btn>
    </p>
    <v-data-table
      :headers="headers"
      :items="posts"
      class="elevation-1"
      :search="search"
      hide-actions
      :pagination.sync="pagination"
    >
      <template v-slot:items="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.updated_at|format_date }}</td>
        <td class="text-xs-center">{{ props.item.created_at|format_date }}</td>
        <td class="text-xs-left">{{ props.item.content }}</td>
        <td class="text-xs-right">{{ props.item.ref_count }}</td>
        <td class="text-xs-right">{{ props.item.votes_amount }}</td>
        <td class="text-xs-center">{{ props.item.user_sex|translate_to_jp_sex }}</td>
        <td class="text-xs-center">{{ props.item.user_age|translate_to_jp_age }}</td>
        <td class="text-xs-center">
          <v-icon
            :size="25"
            class="mr-3"
            @click="upArticle(props.item.id)"
          >arrow_upward</v-icon>
        </td>
        <td class="text-xs-center">
          <v-icon
            :size="25"
            class="mr-3"
            v-bind:style="[isMatchFeatureds(props.item.id)?{ 'color': 'yellow' }:{ '': ''}]"
            @click="switchFeatured(isMatchFeatureds(props.item.id),props.item.id)"
          >stars</v-icon>
          <v-icon
            :size="25"
            class="mr-3"
            v-bind:style="[isMatchHotTopics(props.item.id)?{ 'color': 'yellow' }:{ '': ''}]"
            @click="switchHotTopics(isMatchHotTopics(props.item.id),props.item.id)"
          >whatshot</v-icon>
          <v-icon
            :size="25"
            v-bind:style="[isMatchEditorsPicks(props.item.id)?{ 'color': 'yellow' }:{ '': ''}]"
            @click="switchEditorsPick(isMatchHotTopics(props.item.id),props.item.id)"
          >favorite</v-icon>
        </td>
        <td class="text-xs-center">
          <v-icon
            :size="25"
            class="mr-3"
            @click="navigate({ name: 'article', params: { id: props.item.id } })"
          >description</v-icon>
        </td>
        <!-- <td class="text-xs-center">
          <v-icon :size="25" @click="deleteItem(props.item)">visibility</v-icon>
        </td> -->
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <!-- ダイアログ -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn large fab dark color="primary" v-on="on" class="back">
          <v-icon>settings_input_composite</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">条件付き検索</span>
        </v-card-title>
        <v-card-text>
          <div>検索に追加する条件を入力してください（複数条件指定可）</div>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="conditions.keyword" label="検索ワード" hint="入力例）大学生"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="conditions.hashTag" label="ハッシュタグ" hint="入力例）#浮気"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="conditions.sex" 
                  :items="['男性', '女性', 'その他']"
                  label="投稿者の性別"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="conditions.age"
                  :items="['10代前半', '10代後半', '20代前半', '20代後半', '30代前半', '30代後半', '40代前半', '40代後半', '50代前半', '50代後半', '60代前半', '60代後半',]"
                  label="投稿者の性別"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog()">閉じる</v-btn>
          <v-btn color="blue darken-1" flat @click="searchWithConditions()" :disabled="isNotInput()">検索</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import store from "../store";
export default {
  components: {},
  data() {
    return {
      dialog: false,
      search: "",
      tmpConditions: null,
      conditions: {
        keyword: "",
        hashTag: "",
        age: "",
        sex: ""
      },
      pagination: {
        rowsPerPage: 14,
        descending: true,
        sortBy: "updated_at",
        totalItems: 20
      },
      headers: [
        {
          text: "ID",
          value: "id",
          align: "center",
          sortable: false,
          width: "10"
        },
        {
          text: "更新日時",
          value: "updated_at",
          align: "center",
          sortable: true,
          width: "140"
        },
        {
          text: "投稿日時",
          value: "created_at",
          align: "center",
          sortable: true,
          width: "140"
        },
        {
          text: "投稿内容",
          align: "left",
          sortable: false,
          value: "content"
        },
        {
          text: "閲覧数",
          align: "center",
          value: "ref_count",
          sortable: true,
          width: "10",
          sortable: true
        },
        {
          text: "投票数",
          align: "center",
          value: "votes_amount",
          sortable: true,
          width: "10",
          sortable: true
        },
        {
          text: "性別",
          value: "user_sex",
          align: "center",
          sortable: false,
          width: "80"
        },
        {
          text: "年代",
          value: "user_age",
          align: "center",
          sortable: false,
          width: "110"
        },
        {
          text: "アゲ",
          align: "center",
          sortable: false,
          width: "30"
        },
        {
          text: "グループ設定",
          align: "center",
          value: "name",
          sortable: false,
          width: "180"
        },
        {
          text: "記事詳細",
          align: "center",
          value: "name",
          sortable: false,
          width: "50"
        }
        // ,
        // {
        //   text: "表示/非表示",
        //   align: "center",
        //   value: "name2",
        //   sortable: false
        // }
      ],
      posts: [],
      featureds: [],
      hot_topics: [],
      editors_picks: []
    };
  },
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  created() {
    store.get_ajax_articles("featureds?limit=100000", "featureds");
    store.$on("GET_AJAX_COMPLETE_FEATUREDS", () => {
      this.featureds = store.getFeatureds();
    });
    store.get_ajax_articles("hot_topics?limit=100000", "hot_topics");
    store.$on("GET_AJAX_COMPLETE_HOT_TOPICS", () => {
      this.hot_topics = store.getHotTopics();
    });
    store.get_ajax_articles("editors_picks?limit=100000", "editors_picks");
    store.$on("GET_AJAX_COMPLETE_EDITORS_PICKS", () => {
      this.editors_picks = store.getEditorsPicks();
    });
    this.getArticles();
  },
  methods: {
    isNotInput(){
      if(
        this.conditions.keyword == "" && 
        this.conditions.hashTag == "" && 
        this.conditions.age == "" && 
        this.conditions.sex == ""){
          return true
        }else{
          return false
        }
    },
    resetConditions(){
      this.resetSearchForm()
      this.getArticles()
    },
    resetSearchForm(){
      this.conditions.keyword = ""
      this.conditions.hashTag = ""
      this.conditions.age = ""
      this.conditions.sex = ""
    },
    closeDialog(){
      this.dialog = false
      this.resetSearchForm()
    },
    searchWithConditions(){
      this.dialog = false
      let query = ""
      if(this.conditions.keyword != ""){ query += `&keyword=${ this.conditions.keyword.trim() }`}
      if(this.conditions.hashTag != ""){ query += `&tag=${ this.getHashTag()}`}
      if(this.conditions.age != ""){ query += `&age=${ this.getAgeKey() }` }
      if(this.conditions.sex != ""){ query += `&sex=${ this.getSexKey() }`}
      store.get_ajax_articles(`articles?limit=100000${ query }`, "posts");
      // Json取得後に呼び出される
      store.$on("GET_AJAX_COMPLETE_POSTS", () => {
        this.posts = store.getPosts();
        this.pagination.totalItems = this.posts.length - 1;
        this.tmpConditions = this.deepCopy(this.conditions)
      });
    },
    getHashTag(){
      let hTag = ""
      if (this.conditions.hashTag.startsWith("#")){
        hTag = this.conditions.hashTag.slice(1)
      }else{
        hTag = this.conditions.hashTag
      }
      hTag = hTag.trim()
      return hTag
    },
    getSexKey(){
      let key = ""
      switch(this.conditions.sex){
        case "男性":
          key = "m"
          break;
        case "女性":
          key = "f"
          break;
        case "その他":
          key = "o"
          break;
      }
      return key
    },
    getAgeKey(){
      let key = ""
      switch(this.conditions.age){
        case "10代前半":
          key = "e_10s"
          break;
       case "10代後半":
          key = "l_10s"
          break;
        case "20代前半":
          key = "e_20s"
          break;
       case "20代後半":
          key = "l_20s"
          break;
        case "30代前半":
          key = "e_30s"
          break;
       case "30代後半":
          key = "l_30s"
          break;
        case "40代前半":
          key = "e_40s"
          break;
       case "40代後半":
          key = "l_40s"
          break;
        case "50代前半":
          key = "e_50s"
          break;
       case "50代後半":
          key = "l_50s"
          break;
        case "60代前半":
          key = "e_60s"
          break;
       case "60代後半":
          key = "l_60s"
          break;
       }
      return key
    },
    isMatchFeatureds(id) {
      const target = store.featureds.find((p) => {return (p.id == id)});
      return (target !== undefined) 
    },
    isMatchHotTopics(id) {
      const target = store.hot_topics.find((p) => {return (p.id == id)});
      return (target !== undefined) 
    },
    isMatchEditorsPicks(id) {
      const target = store.editors_picks.find((p) => {return (p.id == id)});
      return (target !== undefined) 
    },
    getFeaturedId(postId){
      let target = store.featureds.find((p) => {return (p.id == postId)});
      return target.origin_id
    },
    getHotTopicId(postId){
      let target = store.hot_topics.find((p) => {return (p.id == postId)});
      return target.origin_id
    },
    getEditorsPickId(postId){
      let target = store.editors_picks.find((p) => {return (p.id == postId)});
      return target.origin_id
    },
    navigate: function(to) {
      this.$router.push(to);
    },
    deepCopy: function(obj){
      let copy = JSON.parse(JSON.stringify(obj));
      return copy;
    },
    getArticles: function(){
      store.startLoading()
      store.get_ajax_articles("articles?limit=100000", "posts");
        // Json取得後に呼び出される
        store.$on("GET_AJAX_COMPLETE_POSTS", () => {
          this.posts = store.getPosts();
          this.pagination.totalItems = this.posts.length - 1;
          this.tmpConditions = null;
          store.endLoading()
        });
    },
    upArticle: function(id) {
      store.post_ajax_articles("articles/up_to_pickup", { id: id })
      .then((res)=>{
        if(res.status == 200){
          this.getArticles();
        } 
      })
    },
    switchFeatured(registarFlag, id){
      if(registarFlag){
        let featuredId = this.getFeaturedId(id);
        this.removeFromFeatured(featuredId);
      }else{
        this.registerToFeatured(id);
      }
    },
    switchHotTopics(registarFlag, id){
      if(registarFlag){
        let hotTopicId = this.getHotTopicId(id);
        this.removeFromHotTopic(hotTopicId);
      }else{
        this.registerToHotTopic(id);
      }
    },
    switchEditorsPick(registarFlag, id){
      if(registarFlag){
        let editorsPickId = this.getEditorsPickId(id);
        this.removeFromEditorsPick(editorsPickId);
      }else{
        this.registerToEditorsPick(id);
      }
    },
    registerToFeatured(id){
      store.post_ajax_articles("articles/featured", 
        {	
          "featured" : {
		        "post_id" : id,
            "keyword" : ""
          } 
        }
      )
      .then((res)=>{
        if(res.status == 201){
          store.get_ajax_articles("featureds?limit=100000", "featureds");
          store.$on("GET_AJAX_COMPLETE_FEATUREDS", () => {
            this.featureds = store.getFeatureds();
            this.getArticles();
          });
        } 
      })
    },
    removeFromFeatured(id){
      store.delete_ajax_article("articles/featured/", id)
      .then((res)=>{
        if(res.status == 200){
            store.get_ajax_articles("featureds?limit=100000", "featureds");
            store.$on("GET_AJAX_COMPLETE_FEATUREDS", () => {
            this.featureds = store.getFeatureds();
            this.getArticles();
          })
        }
      })
    },
    registerToHotTopic(id){
      store.post_ajax_articles("articles/hot_topic", 
        {	
          "hot_topic" : {
		        "post_id" : id,
            "keyword" : ""
          } 
        }
      )
      .then((res)=>{
        if(res.status == 201){
          store.get_ajax_articles("hot_topics?limit=100000", "hot_topics");
          store.$on("GET_AJAX_COMPLETE_HOT_TOPICS", () => {
            this.hot_topics = store.getHotTopics();
            this.getArticles();
          });
        } 
      })
    },
    removeFromHotTopic(id){
      store.delete_ajax_article("articles/hot_topic/", id)
      .then((res)=>{
        if(res.status == 200){
            store.get_ajax_articles("hot_topics?limit=100000", "hot_topics");
            store.$on("GET_AJAX_COMPLETE_HOT_TOPICS", () => {
            this.hot_topics = store.getHotTopics();
            this.getArticles();
          })
        }
      })
    },
    registerToEditorsPick(id){
      store.post_ajax_articles("articles/editors_pick", 
        {	
          "editors_pick" : {
		        "post_id" : id,
            "keyword" : ""
          } 
        }
      )
      .then((res)=>{
        if(res.status == 201){
          store.get_ajax_articles("editors_picks?limit=100000", "editors_picks");
          store.$on("GET_AJAX_COMPLETE_EDITORS_PICKS", () => {
            this.editors_picks = store.getEditorsPicks();
            this.getArticles();
          });
        } 
      })
    },
    removeFromEditorsPick(id){
      store.delete_ajax_article("articles/editors_pick/", id)
      .then((res)=>{
        if(res.status == 200){
            store.get_ajax_articles("editors_picks?limit=100000", "editors_picks");
            store.$on("GET_AJAX_COMPLETE_EDITORS_PICKS", () => {
            this.editors_picks = store.getEditorsPicks();
            this.getArticles();
          })
        }
      })
    }
  }
};
</script>

<style scoped>
.back {
 position: fixed !important;
 bottom: 30px !important;
 right: 50px !important;
 opacity: 0.9;
}
</style>