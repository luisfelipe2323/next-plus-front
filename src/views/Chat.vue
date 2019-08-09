<template>
  <v-container fill-height fluid>
    <v-layout column>
      <v-flex elevation-2 md12 class="service-intro">
            <h2>Chat Serverless</h2>
            <p>Web-Sockets serverless administrados por AWS</p>
            <p>Traductor y detección de idioma por parte de Google Cloud</p>
            <p>Voz a través de AWS Polly</p>
      </v-flex>
      <v-flex elevation-2 md12 v-if="messages.length !== 0" class="mb20">
        <v-layout row md12 wrap>
          <v-flex md12>
            <v-list two-line subheader>
              <v-list-tile v-for="item in messages" :key="item.id" avatar>
                <v-list-tile-avatar>
                  <v-avatar>
                    <v-img :src="item.avatar" alt="avatar"/>
                  </v-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.author }} ({{ item.email }})</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon @click="voice(item)" :disabled="item.checking === true">
                    <v-icon color="grey lighten-1">volume_up</v-icon>
                  </v-btn>
                  <v-btn v-if="item.links.length === 2" icon @click="translate(item)">
                    <v-icon color="grey lighten-1">translate</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex md12>
        <v-layout row md12 wrap>
          <v-flex md12>
            <v-textarea solo v-model="message" label="Mensaje"></v-textarea>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex md12>
        <v-layout row md12 wrap>
          <v-flex md12>
            <v-btn class="ml0" color="info" @click="addMessage">Enviar</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import awsIot from 'aws-iot-device-sdk';
import api from '@/plugins/api';
import uuidv4 from 'uuid/v4';


export default {
  components : {
    
  },
  data () {
    return {
      client: null,
      topic: null,
      messages: [],
      message: '',
      items: []
    };
  },
  computed: {
    ...mapGetters('user', ['avatar', 'email', 'name'])
  },
  methods: {
    ...mapActions('app', ['loading', 'audioFile']),
    onPhoto (data) {
      this.showPhoto = false;
    },
    onConnect () {
      this.client.subscribe(this.topic);
    },
    onMessage (topic, message) {
      this.messages.push(JSON.parse(message));
      setTimeout(() => window && window.scrollTo && window.scrollTo(0,1000000), 0);  
    },
    onClose (a) {
      console.log('cerrada', a);
    },
    async initChat () {
      const { topic, iotEndpoint, region, accessKey, secretKey, sessionToken } = await api.request({ url: 'chat/connect'});
      const connect = {
        region: region,
        protocol: 'wss',
        accessKeyId: accessKey,
        secretKey: secretKey,
        sessionToken: sessionToken,
        port: 443,
        host: iotEndpoint.replace(`.iot.${region}`,`-ats.iot.${region}`)
      };
      this.topic = topic;
      this.client = awsIot.device(connect);
      this.client.on('connect', this.onConnect.bind(this));
      this.client.on('message', this.onMessage.bind(this));            
      this.client.on('close', this.onClose.bind(this));
      this.client.on('error', (e) => {
        console.log('peta', e);
      });
    },
    async voice (message) {
      if (message.links.length === 0) {
        message.checking = true;
        const links = await api.request({ method: 'POST', data: message, url: 'voice'});
        message.links.push(...links);
        message.checking = false;
      }
      this.audioFile(message.links[0]);
    },
    translate (message) {
      if (message.links.length === 2) {
        this.audioFile(message.links[1]);
      }
    },
    addMessage () {
      if (this.message !== '') {
        const id = uuidv4();
        const author = this.name;
        const avatar = this.avatar;
        const email = this.email;
        const text = this.message;
        const links = [];
        const message = { text, email, author, avatar, id, links }; // add nombre, email y avatar
        this.client.publish(this.topic, JSON.stringify(message));
        this.message = '';
      }
    }
  },
  beforeDestroy () {

  },
  async mounted () {
    await this.initChat();
    this.loading(false);
  }  
};
</script>
<style>
  .mb20 { margin-bottom: 20px; }
  .ml0 { margin-left: 0 }
  .service-intro { margin-bottom: 20px; background-color: white; padding: 20px; }
</style>
