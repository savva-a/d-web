const TYPE = {
  APPLANGUAGE: 'APPLANGUAGE'
};

export const setAppLanguage = appLanguage => ({
  type: TYPE.APPLANGUAGE,
  appLanguage
});

const initialState = {
  appLanguage: 'en'
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.APPLANGUAGE:
      return {
        ...state,
        appLanguage: action.appLanguage
      };
    default:
      return state;
  }
};
