import Vue from 'vue'
import axios from 'axios';

// const URL_BASE = 'https://whispering-anchorage-57506.herokuapp.com/api/v1/';
// const URL_BASE = 'https://limitless-crag-46636.herokuapp.com/api/v1/';
const URL_BASE = 'http://localhost:4000/api/v1/';

// Vue.js のインスタンス
export default new Vue({
  data: {
    // Jsonデータ格納用
    posts: [],
    featureds: [],
    hot_topics: [],
    editors_picks: [],
    post: null
  },
  methods: {
    // Ajax通信でJsonを取得し、特定のプロパティに格納する
    // 取得したら GET_AJAX_COMPLETE で通知する
    get_ajax_articles(url, name) {
      return axios.get(URL_BASE + url)
      .then((res) => {
        Vue.set(this, name, res.data.articles);
        switch(name){
          case 'posts':
            this.$emit('GET_AJAX_COMPLETE_POSTS');
            break;
          case 'featureds':
              this.$emit('GET_AJAX_COMPLETE_FEATUREDS');
            break;
          case 'hot_topics':
              this.$emit('GET_AJAX_COMPLETE_HOT_TOPICS');
            break;
          case 'editors_picks':
              this.$emit('GET_AJAX_COMPLETE_EDITORS_PICKS');
            break;
        }
      });
    },
    get_ajax_article(url, name) {
      return axios.get(URL_BASE + url)
      .then((res) => {
        Vue.set(this, name, res.data.article);
        this.$emit('GET_AJAX_COMPLETE_POST');
      });
    },
    post_ajax_articles(url, data){
      return axios.post(URL_BASE + url, data)
    },
    delete_ajax_article(url, id){
      console.log(URL_BASE + url + id)
      return axios.delete(URL_BASE + url + id)
    },
    getPost() {
      return this.post;
    },
    getPosts() {
      return this.posts;
    },
    getFeatureds() {
      return this.featureds;
    },
    getHotTopics() {
      return this.hot_topics;
    },
    getEditorsPicks() {
      return this.editors_picks;
    }
  }
});
