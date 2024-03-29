import { set, toggle } from '@/utils/vuex';

export default {
  toggleLoading: toggle('loading'),
  loading: set('loading'),
  alert: set('alert')
};
