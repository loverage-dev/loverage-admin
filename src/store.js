import Vue from 'vue'
import axios from 'axios';

const URL_BASE = 'https://whispering-anchorage-57506.herokuapp.com/api/v1/';

// Vue.js のインスタンス
export default new Vue({
  data: {
    // Jsonデータ格納用
    posts: [],
    post: null
  },
  methods: {
    // Ajax通信でJsonを取得し、特定のプロパティに格納する
    // 取得したら GET_AJAX_COMPLETE で通知する
    get_ajax_articles(url, name) {
      return axios.get(URL_BASE + url)
      .then((res) => {
        Vue.set(this, name, res.data.articles);
        this.$emit('GET_AJAX_COMPLETE');
      });
    },
    get_ajax_article(url, name) {
      return axios.get(URL_BASE + url)
      .then((res) => {
        Vue.set(this, name, res.data.article);
        this.$emit('GET_AJAX_COMPLETE');
      });
    },
    // プロパティ名を指定してデータを取得
    get_data(name) {
      return this.$data[name];
    }
  }
});
