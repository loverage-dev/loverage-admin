<template>
  <div class="about">
    <h1>Pickup</h1>
    <div v-if="visuals">
      <v-data-table
        :headers="headers"
        :items="visuals"
        class="elevation-1"
        hide-actions
      >
        <template v-slot:items="props">
          <td class="text-xs-center">{{ getDayOfWeek(props.item.visual_day_of_week_no) }}</td>
          <td class="text-xs-center">{{ getType(props.item.visual_type) }}</td>
          <td class="text-xs-center">{{ props.item.post_id }}</td>
          <td class="text-xs-left">{{ props.item.content }}</td>
          <td class="text-xs-center">{{ props.item.user_sex|translate_to_jp_sex }}</td>
          <td class="text-xs-center">{{ props.item.user_age|translate_to_jp_age }}</td>
          <td class="text-xs-center">{{ props.item.ref_count }}</td>
          <td class="text-xs-center">{{ props.item.votes_amount }}</td>
          <td class="text-xs-center">
            <v-icon
              :size="25"
              class="mr-3"
              @click="navigate({ name: 'article', params: { id: props.item.post_id } })"
            >description</v-icon>
          </td>
          <td class="text-xs-center">
            <v-icon
              :size="25"
              class="mr-3"
              @click="openDialog(props.item)"
            >autorenew</v-icon>
          </td>
        </template>
      </v-data-table>
    </div>
    <!-- ダイアログ -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">設定変更</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <h2>現在設定中の相談</h2>
                <table v-if="tmpPost">
                  <tr>
                    <td>ID:</td>
                    <td>{{ tmpPost.post_id}}</td>
                  </tr>
                  <tr>
                    <td>曜日：</td>
                    <td>{{ getDayOfWeek(tmpPost.visual_day_of_week_no)}}</td>
                  </tr>
                  <tr>
                    <td>相談内容：</td>
                    <td>{{ tmpPost.content}}</td>
                  </tr>
                  <tr>
                    <td>タイプ：</td>
                    <td>{{ getType(tmpPost.visual_type)}}</td>
                  </tr>
                </table>
              </v-flex>
              <v-flex xs12></v-flex>
              <v-flex xs12></v-flex>
              <v-flex xs12>
                <h2>変更後の相談</h2>
                <span>変更先の相談のIDを指定してください。</span>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field hint="For example, 55" type="number" v-model="changedId" label="ID*" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="cancel()">キャンセル</v-btn>
          <v-btn color="blue darken-1" flat @click="update()" :disabled="changedId == ''">変更</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import store from "../store";
import { scrypt } from 'crypto';
export default{
  components: {},
  created: function(){
    this.fetchVisuals()
  },
  methods: {
    fetchVisuals: function(){
      store.startLoading()
      store.get_ajax_articles("visuals", "visuals");
      store.$on("GET_AJAX_COMPLETE_VISUALS", () => {
        this.visuals = store.getVisuals();
        store.endLoading()
      });
    },
    update: function(){
      store.startLoading()
      store.post_ajax_articles(`visuals/${this.tmpPost.visual_id}`, { 
            "visual": {
              "day_of_week_no": this.tmpPost.visual_day_of_week_no,
              "type": this.tmpPost.visual_type,
              "post_id": this.changedId
              }
            })
          .then((res)=>{
            if(res.status == 200){
              this.fetchVisuals()
            }
          })
          .catch((err)=>{
            alert(`ID:${this.changedId}は登録されていません。`)
          })
          .finally(()=>{
            this.changedId = ""
            this.dialog = false
            store.endLoading()
          })
    },
    cancel: function(){
      this.changedId = ""
      this.dialog = false
    },
    openDialog: function(obj){
      this.tmpPost = this.deepCopy(obj)
      console.log(this.tmpPost)
      this.dialog = true
    },
    getType: function(type){
      let jpType = ""
      switch(type){
        case "main":
          jpType = "Key-Visual"
          break;
        case "sub":
          jpType = "Sub-Visual"
          break;
      }
      return jpType
    },
    getDayOfWeek: function(number){
      let jpDOW = ""
      switch(number){
        case 1:
          jpDOW = "月"
          break;
        case 2:
          jpDOW = "火"
          break;
        case 3:
          jpDOW = "水"
          break;
        case 4:
          jpDOW = "木"
          break;
        case 5:
          jpDOW = "金"
          break;
        case 6:
          jpDOW = "土"
          break;
        case 7:
          jpDOW = "日"
          break;
      }
      return jpDOW;
    },
    navigate: function(to) {
      this.$router.push(to);
    },
    deepCopy: function(obj){
      let copy = JSON.parse(JSON.stringify(obj));
      return copy;
    }
  },
  data() {
    return {
      visuals: null,
      dialog: false,
      changedId: "",
      tmpPost: null,
      headers: [
        {
          text: "曜日",
          name: "visual_day_of_week_no",
          value: "visual_day_of_week_no",
          align: "center",
          sortable: true
        },
        {
          text: "type",
          name: "visual_type",
          value: "visual_type",
          align: "center",
          sortable: true
        },
        {
          text: "ID",
          value: "post_id",
          align: "center",
          sortable: false
        },
        {
          text: "投稿内容",
          align: "left",
          sortable: false,
          value: "content",
          width: "450"
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
          text: "閲覧数",
          align: "center",
          value: "ref_count",
          width: "10",
          sortable: false
        },
        {
          text: "投票数",
          align: "center",
          value: "votes_amount",
          width: "10",
          sortable: false
        },
        {
          text: "閲覧",
          align: "center",
          value: "name",
          sortable: false,
          width: "100"
        },
        {
          text: "変更",
          align: "center",
          value: "name",
          sortable: false,
          width: "10"
        }
      ]
    }
  }
}
</script>
