<template>
  <div>
    <p>
      <span><v-icon :size="15">stars</v-icon></span>
      <span style="font-weight: bold;"> Editor's Pick</span>
      <span v-if="editors_picks.length != 0"> 　登録数：{{ editors_picks.length }} 件</span>
    </p>
    <v-data-table
      :headers="headers"
      :items="editors_picks"
      class="elevation-1"
      :search="search"
      hide-actions
      :pagination.sync="pagination"
    >
      <template v-slot:items="props">
        <td class="text-xs-right">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.updated_at|format_date }}</td>
        <td class="text-xs-left">{{ props.item.created_at|format_date }}</td>
        <td class="text-xs-left">{{ props.item.content }}</td>
        <td class="text-xs-right">{{ props.item.ref_count }}</td>
        <td class="text-xs-right">{{ props.item.votes_amount }}</td>
        <td class="text-xs-center">{{ props.item.user_sex|translate_to_jp_sex }}</td>
        <td class="text-xs-center">{{ props.item.user_age|translate_to_jp_age }}</td>
        <td class="text-xs-center">{{ props.item.category|category }}</td>
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
            @click="navigate({ name: 'article', params: { id: props.item.id } })"
          >description</v-icon>
        </td>
        <td class="text-xs-center">
          <v-icon
            :size="25"
            class="mr-3"
            @click="removeArticle(props.item.origin_id)"
          >remove_circle</v-icon>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
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
          sortable: false
        },
        {
          text: "更新日時",
          value: "updated_at",
          align: "center",
          sortable: true
        },
        {
          text: "投稿日時",
          value: "created_at",
          align: "center",
          sortable: true
        },
        {
          text: "投稿内容",
          align: "left",
          sortable: false,
          value: "content",
          width: "450"
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
          width: "150"
        },
        {
          text: "カテゴリー",
          value: "category",
          align: "center",
          sortable: false,
          width: "80"
        },
        {
          text: "アゲ",
          align: "center",
          value: "name",
          sortable: false,
          width: "100"
        },
        {
          text: "閲覧",
          align: "center",
          value: "name",
          sortable: false,
          width: "100"
        },
        {
          text: "登録解除",
          align: "center",
          value: "name",
          sortable: false,
          width: "100"
        }
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
    store.startLoading()
    store.get_ajax_articles("editors_picks?limit=100000", "editors_picks");
    store.$on("GET_AJAX_COMPLETE_EDITORS_PICKS", () => {
      this.editors_picks = store.getEditorsPicks();
      this.pagination.totalItems = this.editors_picks.length - 1;
      store.endLoading()
    });
  },
  methods: {
    navigate: function(to) {
      this.$router.push(to);
    },
    upArticle: function(id) {
      store.post_ajax_articles("articles/up_to_pickup", { id: id })
      .then((res)=>{
        if(res.status == 200){
          store.get_ajax_articles("editors_picks?limit=100000", "editors_picks");
          store.$on("GET_AJAX_COMPLETE_EDITORS_PICKS", () => {
            this.editors_picks = store.getEditorsPicks();
            this.pagination.totalItems = this.editors_picks.length - 1;
          });
        } 
      })
    },
    removeArticle: function(id){
      store.startLoading()
      store.delete_ajax_article("articles/editors_pick/", id)
      .then((res)=>{
        if(res.status == 200){
          store.get_ajax_articles("editors_picks?limit=100000", "editors_picks");
          store.$on("GET_AJAX_COMPLETE_EDITORS_PICKS", () => {
            this.editors_picks = store.getEditorsPicks();
            this.pagination.totalItems = this.editors_picks.length - 1;
          });
        } 
      })
      .finally(()=>{
        store.endLoading()
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