import { toast } from 'react-toastify';
import { Auth } from '../firebase';

export const initUser = () => async (dispatch) => {
  Auth.onAuthStateChanged((user) => {
    // Only dispatch event if user is defined
    // Logout will handle nullifying user
    if (user) {
      dispatch({
        type: 'LOGIN',
        payload: user,
      });
    }
  });
};

export const login = (email, password) => async (dispatch) => {
  Auth.signInWithEmailAndPassword(email, password).then((result) => {
    const { user } = result;

    toast.success('You have logged in');

    dispatch({
      type: 'LOGIN',
      payload: user,
    });
  }).catch((ex) => {
    toast.error('Unathorized');
  });
};

export const logout = () => async (dispatch) => {
  Auth.signOut().then(() => {
    toast.success('You have logged out');

    dispatch({
      type: 'LOGOUT',
    });
  });
};