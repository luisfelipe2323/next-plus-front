/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '/login',
    view: 'Login',
    name: 'login',
    meta: {
      public: true
    }
  },
  {
    path: '/',
    name: 'home',
    view: 'Home'
  }
];
