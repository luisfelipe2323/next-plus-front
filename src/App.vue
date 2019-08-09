<template>
  <v-app class="next-app">
    <Loading/>
    <Alert/>
    <Wrapper/>
  </v-app>
</template>
<script>
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';
import Wrapper from './components/Wrapper';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Wrapper,
    Loading,
    Alert
  },
  computed: {
    ...mapGetters('user', ['logged'])
  },
  created () {
    this.$store.dispatch('user/init');
    this.$store.dispatch('app/loading', false);
  }
}
</script>
<style lang="scss">
  html {
    scroll-behavior: smooth;
  }
  .next-app {
    background-color: white;
  }
  h2, h1 {
    margin-bottom: 20px;
  }
  .mb20 { margin-bottom: 20px; }
  .ml0 { margin-left: 0 }
  .pull-right { float: right;}
  .service-intro, .app-box { margin-bottom: 20px; background-color: white; padding: 20px; }
</style>
