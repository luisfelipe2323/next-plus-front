<template>
  <v-container fill-height fluid>
    <v-layout column>
      <v-flex elevation-2 md12 class="app-box">
          <h2>Login Reconocimiento Facial</h2>
          <p>Rekognition: servicio de detección facial de AWS</p>
          <p><strong>NO</strong> es una solución productiva</p>
      </v-flex>
      <v-flex elevation-2 md12 class="app-box" v-if="!showCamera">
        <v-layout row md12 wrap>
          <v-flex md12>
            <p class="mb20">Para añadir su foto, pulse sobre el botón "Fotologin"</p>
            <v-btn color="blue" @click="startCamera" class="mb20">
              Fotologin
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex elevation-2 md12 v-if="showCamera" class="app-box">
        <v-layout row md12 wrap>
          <v-flex md12>
            <Camera :face="true" v-on:face="faceDetected"/>
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
      showCamera: false
    };
  },
  methods: {
    ...mapActions('app', ['loading', 'alert']),
    startCamera () {
      this.showCamera = true;
    },
    async faceDetected (image) {
      this.loading(true);
      const data = { image };
      await api.request({ method: 'POST', url: '/login/add', data });
      this.showCamera = false;
      this.loading(false);
      this.alert('Imagen añadida. Desconecte y pruebe a hacer login facial');
    }
  },
  async mounted () {
    this.loading(false);
  }  
};
</script>
<style>

</style>
