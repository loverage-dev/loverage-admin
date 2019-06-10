<template>
  <div class="about">
    <h1>Article</h1>
    <div v-if="post">
      <p>投稿者の性別：{{ post.post.user_sex|translate_to_jp_sex }}</p>
      <p>投稿者の年代：{{ post.post.user_age|translate_to_jp_age }}</p>
      <p>投稿内容：{{ post.post.content }}</p>
      <p>選択肢１：{{ post.post.opt1 }}</p>
      <p>選択肢２：{{ post.post.opt2 }}</p>
      <p>作成日：{{ post.post.created_at|format_date }}</p>
      <p>更新日：{{ post.post.updated_at|format_date }}</p>
      <p>閲覧数：{{ post.post.ref_count }}</p>
      <p>回答数：{{ post.post.votes_amount }}</p>
    </div>
  </div>
</template>

<script>
import store from "../store";
export default {
  components: {},
  mounted: function(){
    let id = this.$route.params.id
    // Json取得
    store.get_ajax_article(`articles/${ id }`, "post");
    // Json取得後に呼び出される
    store.$on("GET_AJAX_COMPLETE_POST", () => {
      this.post = store.getPost();
      console.log(this.post)
    });
  },
  data: function(){
    return {
      post: null
    }
  }
}
</script>
