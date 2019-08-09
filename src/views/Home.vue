<template>
  <v-container fill-height fluid>
    <v-layout column>
      <v-flex elevation-2 md12 class="app-box">
          <h1>BBVA Next Technologies</h1>
          <h2>Cloud Demo</h2>
          <v-layout row>
            <v-flex xs12 class="img-wr">
              <v-img src="https://cdn-images-1.medium.com/max/1200/1*R_6b5_hhtocYqNHn6dhZPQ.jpeg"/>
            </v-flex>
          </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';


export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters('user', ['avatar', 'email', 'name'])
  },
  methods: {
    ...mapActions('app', ['loading']),
  },
  async mounted () {
    this.loading(false);
  }  
};
</script>
<style></style>
