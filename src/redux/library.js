const TYPE = {
  LOADBOOKS: 'LOADBOOKS'
};

// export const addRegisterData = (data) => ({
export const loadBooks = books => ({
  type: TYPE.LOADBOOKS,
  books
});
// export const addRegisterDataContinue = (data) => ({

const initialState = {
  // count: 0
  books: []
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.LOADBOOKS:
      // console.log('increment cl', state.count + 1, action.data);
      return {
        ...state,
        books: action.books
        // count: Number.isInteger(action.data) ? state.count + action.data : state.count + 1
      };
    default:
      return state;
  }
};
