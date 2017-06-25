const TYPE = {
  EDITTEXT: 'EDITTEXT',
  SHOWMODAL: 'SHOWMODAL'
};

export const editText = text => ({
  type: TYPE.EDITTEXT,
  text
});

export const showSaveTextModal = showModal => ({
  type: TYPE.SHOWMODAL,
  showModal
});

const initialState = {
  text: '',
  showModal: false
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.EDITTEXT:
      return {
        ...state,
        text: action.text
      };
    case TYPE.SHOWMODAL:
      return {
        ...state,
        showModal: action.showModal
      };
    default:
      return state;
  }
};
