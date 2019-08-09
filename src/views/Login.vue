<template>
  <LoginScreen/>
</template>

<script>
import LoginScreen from '@/components/LoginScreen';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    LoginScreen
  },
  watch: {
    logged (val) {
      if (val === true) {
        this.$router.push({ name: 'home' });
      }
    }
  },
  methods: {
    ...mapActions('app', ['loading'])
  },
  computed: {
    ...mapState('user', ['logged'])
  },
  created () {
    if (this.logged === true) {
      this.$router.push({ name: 'home' });
    } else {
      this.loading(false);
    }
  }
};
</script>
<style lang="scss">
</style>
