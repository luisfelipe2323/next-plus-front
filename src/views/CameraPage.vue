<template>
  <v-container fill-height fluid>
    <v-layout column>
      <v-flex elevation-2 md12 class="app-box">
          <h2>Funcionalidades con Cámaraa</h2>
          <ul>
            <li>Varias APIs de Google Cloud y AWS nos ofrecen diversas funcionalidades</li>
          </ul>
      </v-flex>
      <v-flex elevation-2 md12 class="app-box" v-if="!showCamera">
        <v-layout row md12 wrap>
          <v-flex md12>
            <v-img :src="image"/>
          </v-flex>
        </v-layout>
        <v-layout row md12 wrap>
          <v-flex md12>
            <v-btn icon @click="voice()">
              <v-icon color="blue">volume_up</v-icon>
            </v-btn>
            <v-btn v-if="links.length === 2" icon @click="translate()">
              <v-icon color="blue">translate</v-icon>
            </v-btn>
            <v-btn icon @click="showCamera = true" class="pull-right">
              <v-icon color="blue">camera_alt</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex elevation-2 md12 v-if="showCamera" class="app-box">
        <v-layout row md12 wrap>
          <v-flex md12>
            <Camera v-on:photo="photo"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import api from '@/plugins/api';
import Camera from '@/components/Camera';


export default {
  components : {
    Camera
  },
  data () {
    return {
      showCamera: true,
      image: '',
      links: []
    };
  },
  methods: {
    ...mapActions('app', ['loading', 'alert', 'audioFile']),
    startCamera () {
      this.showCamera = true;
    },
    async photo (image) {
      this.loading(true);
      this.image = image;
      const data = { image };
      const result = await api.request({ method: 'POST', url: '/ocr', data });
      this.links.splice(0,this.links.length);
      this.links.push(...result.links);
      this.showCamera = false;
      this.loading(false);
    },
    async voice () {
      this.audioFile(this.links[0]);
    },
    translate () {
      if (this.links.length === 2) {
        this.audioFile(this.links[1]);
      }
    },
  },
  async mounted () {
    this.loading(false);
  }  
};
</script>
<style>

</style>
