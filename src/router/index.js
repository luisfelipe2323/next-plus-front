// Lib imports
import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import paths from './paths';
import store from '@/store';

Vue.use(Router);
Vue.use(Meta);

function route (path, view, name, meta) {
  return {
    name: name || view,
    path,
    meta,
    component: (resovle) => import(
      `@/views/${view}.vue`
    ).then(resovle)
  };
}

// Create a new router
const router = new Router({
  mode: 'history',
  routes: paths.map(path => route(path.path, path.view, path.name, path.meta)).concat([
    { path: '*', redirect: '/' }
  ]),
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  store.dispatch('app/loading', true);
  to = to || {};
  const meta = to.meta || {};
  const logged = (store.getters['user/logged'] === true);
  const pass = (meta.public === true) || logged;
  if ((to.name === 'login') && logged) {
    next({ name: 'home' });
  } else {
    if (pass) {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});

export default router;
