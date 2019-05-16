export default (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return action.payload;
    case 'LOGOUT':
      localStorage.setItem('user', null);
      window.location.reload();
      return null;
    default:
      return state;
  }
};