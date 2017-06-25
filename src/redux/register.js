// import _ from 'lodash';
import mergeDeep from '../utils/mergeDeep';

const TYPE = {
  ADD_REGISTER_DATA: 'ADD_REGISTER_DATA',
  ADD_REGISTER_DATA_CONTINUE: 'ADD_REGISTER_DATA_CONTINUE'
};

export const addRegisterData = data => ({
  type: TYPE.ADD_REGISTER_DATA,
  data
});

export const addRegisterDataContinue = data => ({
  type: TYPE.ADD_REGISTER_DATA_CONTINUE,
  data
});

const initialState = {
  data: null
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.ADD_REGISTER_DATA:
      return {
        ...state,
        data: action.data
      };
    case TYPE.ADD_REGISTER_DATA_CONTINUE:
      return {
        data: mergeDeep(state.data, action.data)
        // data: _.merge(state.data, action.data)
      };
    default:
      return state;
  }
};
