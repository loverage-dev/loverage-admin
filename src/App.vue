<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="./assets/logo.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Loverage管理MENU</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click="navigate(item.to)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>loverage</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-md-and-up">
        <v-btn flat>
          <v-avatar :size="40" color="grey lighten-5">
            <img src="./assets/post_message.png" alt="avatar">
          </v-avatar>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>
          <v-avatar :size="25" color="grey lighten-5">
            <img src="./assets/logo.png" alt="avatar">
          </v-avatar>　Go To Loverage WebSite
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-md-and-up">
        <v-btn flat>
          <v-avatar :size="40" color="grey lighten-5">
            <img src="./assets/logo.png" alt="avatar">
          </v-avatar>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods:{
    navigate: function(name){
      this.$router.push({ name: name })
    }
  },
  data() {
    return {
      drawer: null,
      items: [
        { title: "All Aricles", icon: "all_inbox", to: 'home' },
        { title: "Featured", icon: "stars", to: 'featured' },
        { title: "HotTopic", icon: "whatshot", to: "hottopic" },
        { title: "Editors Pick", icon: "favorite", to: "editors_pick" },
        { title: "Pickups", icon: "today", to: "pickup" }
      ]
    };
  }
};
</script>
