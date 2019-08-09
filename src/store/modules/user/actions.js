import api from '@/plugins/api';

export default {
  init ({ commit }) {
    try {
      let user = localStorage.user || null;
      let token = localStorage.token || null;
      if (user !== null) {
        commit('user', JSON.parse(user));
      }
      if (token !== null) {
        commit('token', token);
      }
      if (user && token) {
        commit('logged', true);
      }
    } catch (e) {
      logout({ commit });
    } 
  },
  async login ({ commit }, token) {
    const result = await api.request({ method: 'POST', url: 'login', data: { token }});
    setUser({ commit }, result.user);
    setToken({ commit }, result.token);
    commit('logged', true);
  },
  setToken,
  setUser,
  logout
};

function logout ({ commit }) {
  commit('user', null);
  commit('token', null);
  commit('logged', false);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function setToken ({ commit }, token) {
  localStorage.token = token;
  commit('token', token);
}

function setUser ({ commit }, user) {
  localStorage.user = JSON.stringify(user);
  commit('user', user);
}