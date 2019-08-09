<template>
  <v-layout align-center justify-center column fill-height>
      <v-flex xs12 sm6 md4 login v-if="!showCamera">
        <v-img :src="logo" class="grey lighten-2"/>
        <h1>Cloud Demo</h1>
        <v-btn color="info" @click="googleLogin">Acceder con tu cuenta @BBVA</v-btn>
      </v-flex>
    </v-layout>
</template>

<script>
import Vue from 'vue';
import logo from '@/assets/next.jpg';
import { mapActions } from 'vuex';


export default {
  components: {
  },
  data () {
    return {
      logo
    }
  },
  methods: {
    ...mapActions('app', ['loading', 'alert']),
    ...mapActions('user', ['login', 'logout']),
    async finishLogin (info) {
      const token = info.Zi.id_token;
      const user = info.w3;
      await this.login(token);
    },
    async googleLogin () {
      try {
        this.loading(true);
        const auth2 = await Vue.GoogleAuth;
        let info = auth2.currentUser.get();
        if (info.Zi === null) {
          info = await auth2.signIn();
        }
        await this.finishLogin(info);
      } catch (e) {
        this.logout();
        this.alert('Acceso no válido');
      }
      this.loading(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  min-width: 400px;
  text-align: center;
  padding: 40px;
  border: 4px solid #00366a;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #0000002b;
  background-color: white;
}
h1 {
  margin-top: 50px;
  margin-bottom: 50px;
  color: #00366a;
}
.facial {
  margin-top: 10px;
}
</style>
