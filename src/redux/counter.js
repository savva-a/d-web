const TYPE = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT'
};

// export const addRegisterData = (data) => ({
export const increment = data => ({
  type: TYPE.INCREMENT,
  data
});
// export const addRegisterDataContinue = (data) => ({
export const decrement = () => ({
  type: TYPE.DECREMENT
});

const initialState = {
  count: 0
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.INCREMENT:
      console.log('increment cl', state.count + 1, action.data);
      return {
        ...state,
        count: Number.isInteger(action.data) ? state.count + action.data : state.count + 1
      };
    case TYPE.DECREMENT:
      return {
        count: state.count - 1
        // data: _.merge(state.data, action.data)
      };
    default:
      return state;
  }
};
