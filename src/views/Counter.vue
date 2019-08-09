<template>
  <div class="detector-wrapper">
    <Camera v-on:face="faceDetected" :face="true" :detector="true" class="detector-box"/>
    <v-switch v-model="enter" :label="label" class="detector-type"></v-switch>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import api from '@/plugins/api';
import Camera from '@/components/Camera';
import * as faceapi from 'face-api.js';

export default {
  components : {
    Camera
  },
  data () {
    return {
      enter: true
    };
  },
  computed: {
    label () {
      return this.enter ? 'Detectando entrada' : 'Detectando Salida';
    }
  },
  methods: {
    ...mapActions('app', ['alert', 'loading']),
    async faceDetected (image) {
      console.log('Detectado');
    },
    async init () {
      const self = this;
      const input = document.getElementById('cam-canvas');
      if (input !== undefined) {
        const detections = await faceapi.detectAllFaces(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }));
        console.log('detections', detections);
      } else {
        setTimeout(() => self.init(), 200);
      }
    }
  },
  async mounted () {
    this.init();
    this.loading(false);
  }
};
</script>
<style scoped lang="scss">
  .detector-wrapper {
        position: relative;
    width: 100%;
    height: 100%;
    float: left;
    display: block;
    margin-left: -25px;
    margin-top: -25px;
    .detector-box {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: block;
    }
    .detector-type {
      top: 10px;
      left: 10px;
    }
  }
</style>
