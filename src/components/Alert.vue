<template>
  <v-dialog v-model="alert.show" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ alert.title }}
        </v-card-title>
        <v-card-text v-html="alert.message"></v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="alert.show = false">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState('app', ['alert'])
  }
};
</script>