import axios from 'axios';
import store from '@/store';
const baseURL = process.env.VUE_APP_API;

export default class Api {
    static async request ({ method = 'GET', data = false, url }) {
        const token = store.getters['user/token'];
        const config = {
            url,
            method,
            baseURL,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }
        if (data !== false) {
            config.data = data;
        }
        try {
            const result = await axios.request(config);
            return result.data.data;
        } catch (e) {
            if (e.response) {
              switch (e.response.status) {
                case 401:
                    store.dispatch('user/logout');
                    return false;
                case 403:
                    store.dispatch('user/logout');
                    store.dispatch('app/alert', { show: true, message: 'Acceso no autorizado', title: '¡Error!' });
                    throw new Error('Acceso no autorizado');
              }
            }
            store.dispatch('app/alert', { show: true, message: 'Se ha producido un error', title: '¡Error!' });
            return false;
        }
    }
}
