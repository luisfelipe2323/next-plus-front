<template>
  <div>
    <v-toolbar fixed app clipped-right v-if="logged && !fullsize">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title class="logo">
        <img :src="logo">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="logout">
        <span class="mr-2">Salir</span>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" fixed app v-if="logged && !fullsize">
      <v-list>
        <v-list-tile v-for="item in items" :key="item.name" @click="goTo(item)">
          <v-list-tile-avatar>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex class="mb-footer">
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer fixed app class="footer" v-if="!fullsize">
      <span>Cloud Demo | BBVA Next Technologies</span>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <span>&copy; 2019</span>
    </v-footer>
  </div>
</template>
<script>

import logo from '@/assets/next.png';
import { mapState } from 'vuex';

export default {
  components: {
  },
  data () {
    return {
      logo,
      drawer: null,
      left: false,
      items: []
    }
  },
  computed: {
    name () {
      return this.$store.getters['user/name'];
    },
     ...mapState('user', ['logged']),
    fullsize () {
      const meta = this.$route.meta || {};
      return meta.fullsize || false;
    }
  },
  methods : {
    logout () {
      this.$store.dispatch('user/logout');
      this.$router.push({ name: 'login' });
    },
    goTo (item) {
      this.$router.push({ name: item.name });
    }
  },
  watch: {
    logged (val) {
      if (val === false) {
        this.$router.push({ name: 'login' });
      }
    }
  },
};
</script>
<style scoped lang="scss">
.logo {
  img {
    height: 44px;
    margin-top: 10px;
  }
}
.footer {
  padding: 10px;
}
.mbfooter {
  margin-bottom: 30px;
}
</style>
