import mergeDeep from '../utils/mergeDeep';

const TYPE = {
  SIGNIN: 'SIGNIN',
  UNSIGN: 'UNSIGN'
};

export const userAuth = session => ({
  type: TYPE.SIGNIN,
  session
});

export const userUnsign = () => ({
  type: TYPE.UNSIGN
});

const initialState = {};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.SIGNIN:
      mergeDeep(state, action.session);
      return {
        ...state,
      };
    case TYPE.UNSIGN:
      return {
        // ...state,
        // session: null
      };
    default:
      return state;
  }
};
