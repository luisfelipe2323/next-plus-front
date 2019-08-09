export default {
    name (state) {
        const user = state.user;
        return user ? user.name : '';
    },
    user (state) {
        return state.user;
    },
    token (state) {
        return state.token;
    },
    logged (state) {
        return state.logged;
    },
    email (state) {
        const user = state.user;
        return user ? user.email : '';
    },
    avatar (state) {
        const user = state.user;
        return user ? user.avatar : ''; 
    }
};
  