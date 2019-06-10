<template>
  <div>
    <p>
      <span><v-icon :size="15">all_inbox</v-icon></span>
      <span style="font-weight: bold;"> All Articles</span>
      <span v-if="posts.length != 0"> 　総投稿数：{{ posts.length - 1 }} 件</span>
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
        <td class="text-xs-right">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.updated_at|format_date }}</td>
        <td class="text-xs-left">{{ props.item.created_at|format_date }}</td>
        <td class="text-xs-left">{{ props.item.content }}</td>
        <td class="text-xs-right">{{ props.item.ref_count }}</td>
        <td class="text-xs-right">{{ props.item.votes_amount }}</td>
        <td class="text-xs-center">{{ props.item.user_sex|translate_to_jp_sex }}</td>
        <td class="text-xs-center">{{ props.item.user_age|translate_to_jp_age }}</td>
        <td class="text-xs-center">
          <v-icon
            :size="25"
            class="mr-3"
            v-bind:style="[isMatchFeatureds(props.item.id)?{ 'color': 'yellow' }:{ '': ''}]"
            @click="navigate({ name: 'article', params: { id: props.item.id } })"
          >stars</v-icon>
          <v-icon
            :size="25"
            class="mr-3"
            v-bind:style="[isMatchHotTopics(props.item.id)?{ 'color': 'yellow' }:{ '': ''}]"
            @click="navigate({ name: 'edit-form', params: { id: props.item.id } })"
          >whatshot</v-icon>
          <v-icon
            :size="25"
            v-bind:style="[isMatchEditorsPicks(props.item.id)?{ 'color': 'yellow' }:{ '': ''}]"
            @click="deleteItem(props.item)"
          >favorite</v-icon>
        </td>
        <td class="text-xs-center">
          <v-icon
            :size="25"
            class="mr-3"
            @click="navigate({ name: 'article', params: { id: props.item.id } })"
          >description</v-icon>
          <v-icon
            :size="25"
            class="mr-3"
            @click="navigate({ name: 'edit-form', params: { id: props.item.id } })"
          >edit</v-icon>
          <v-icon
            :size="25"
            @click="deleteItem(props.item)"
          >delete</v-icon>
        </td>
        <td class="text-xs-center">
          <v-icon :size="25" @click="deleteItem(props.item)">visibility</v-icon>
          <!-- <v-icon class="mr-1" @click="deleteItem(props.item)">visibility_off</v-icon> -->
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn large fab dark color="primary" v-on="on" class="back">
          <v-icon>settings_input_composite</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
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
          text: "グループ",
          align: "center",
          value: "name",
          sortable: false,
          width: "180"
        },
        {
          text: "閲覧/編集/削除",
          align: "center",
          value: "name",
          sortable: false,
          width: "180"
        },
        {
          text: "表示/非表示",
          align: "center",
          value: "name2",
          sortable: false
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
    // Json取得
    store.get_ajax_articles("articles?limit=100000", "posts");
    // Json取得後に呼び出される
    store.$on("GET_AJAX_COMPLETE_POSTS", () => {
      this.posts = store.getPosts();
      this.pagination.totalItems = this.posts.length - 1;
    });

  },
  methods: {
    navigate: function(to) {
      this.$router.push(to);
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