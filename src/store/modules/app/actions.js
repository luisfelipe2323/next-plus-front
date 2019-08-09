export default {
  loading ({ commit }, loading) {
    commit('loading', loading);
  },
  alert ({ commit }, alert) {
    if (typeof alert === 'string') {
      alert = { message: alert, title: '¡Aviso!', show: true };
    }
    commit('alert', alert);
  }
};
