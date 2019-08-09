<template>
  <v-container fill-height fluid>
    <v-layout column>
      <v-flex elevation-2 xs12 class="app-box">
          <h2>Ocr</h2>
          <ul>
            <li>Lectura de textos con Google Cloud Vision</li>
            <li>Traducción de textos con Google Translator</li>
            <li>Lectura de los textos con AWS Polly</li>
            <li>Detección de entidades dentro de posibles textos con Google Natural Language</li>
          </ul>
      </v-flex>
      <v-flex elevation-2 xs12 class="app-box" v-if="!showCamera">
        <v-layout row xs12 wrap>
          <v-flex xs12>
            <v-img :src="image"/>
          </v-flex>
        </v-layout>
        <v-layout row xs12 wrap>
          <v-flex xs12>
            <v-btn v-if="links.length > 0" icon @click="voice()">
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
        <v-layout row xs12 wrap v-if="info.length" class="mb20">
          <v-flex xs12>
            <h3>Google Cloud Vision</h3>
            <p>De la imagen se ha obtenido la siguiente información: {{ infoText }}</p>
          </v-flex>
          <v-flex xs12>
            <v-avatar size="50" color="grey lighten-4" v-for="icon in info.filter(i => i.icon)" :key="icon.term">
              <v-img :src="icon.icon" alt="avatar"/>
            </v-avatar>
          </v-flex>
        </v-layout>
        <v-layout row xs12 wrap v-if="text">
          <v-flex xs12>
            <h3>Google Natural Language</h3>
            <p>En la imagen aparecía el siguiente texto: {{ text.text }}</p>
          </v-flex>
          <v-flex xs12 v-if="entities.length">
            <h4>De él se obtiene la siguiente información</h4>
            <ul>
              <li v-for="ent in entities" :key="ent.name">
                {{ ent.term }}: entidad del tipo {{ ent.type }}. <a v-if="ent.link" target="_blank" :href="ent.link">Wikipedia</a>
              </li>
            </ul>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex elevation-2 xs12 v-if="showCamera" class="app-box">
        <v-layout row xs12 wrap>
          <v-flex xs12>
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
      links: [],
      text: null,
      info: [],
      infoText: '',
      entities: []
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
      try {
        const data = { image };
        const result = await api.request({ method: 'POST', url: '/image', data });
        await Promise.all([ this.showInfo (result.info), this.showText(result.links, result.text)]);
      } catch (e) {
        console.log('error', e);
        this.alert('Ha ocurrido un error');
      }
      // 413af85c7d8f4df7a3101e2ace153e13
      // secret 3c88d34bef91403d837a07b320dc7c8e
      this.showCamera = false;
      this.loading(false);
    },
    async showInfo (info = []) {
      this.info.splice(0, this.info.length);
      this.infoText = '';
      if (info.length) {
        const terms = info.join(', ');
        const url = `icon?terms=${terms}`;
        this.info.push(... await api.request({ url }));
        this.infoText = terms;
      }
    },
    async showText (links, text) {
      const self = this;
      this.links.splice(0, this.links.length);
      this.entities.splice(0, this.entities.length);
      if (links !== undefined && links.length) {
        this.links.push(...links);
      }
      if (text !== undefined) {
        const types = ['PERSON', 'LOCATION', 'ORGANIZATION', 'WORK_OF_ART'];
        if (text && text.entities && text.entities.length) {        
          text.entities.forEach(ent => {
            if (types.includes(ent.type)) {
              const item = { term: ent.name, type: ent.type };
              if (ent.metadata && ent.metadata.wikipedia_url) {
                item.link = ent.metadata.wikipedia_url;
              }
              self.entities.push(item);
            }
          });
        }
        this.text = text;
      } else {
        this.text = null;
      }
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
  h3, h4 { margin: 20px 0; }
</style>
