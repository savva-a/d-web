const TYPE = {
  APPLANGUAGE: 'APPLANGUAGE',
  TEXTLANGUAGE: 'TEXTLANGUAGE',
  TEXTSIZE: 'TEXTSIZE',
  TEXTLINESPACING: 'TEXTLINESPACING',
  TOGGLELOADER: 'TOGGLELOADER'
};

export const setAppLanguage = appLanguage => ({
  type: TYPE.APPLANGUAGE,
  appLanguage
});

export const setTextLanguage = textLanguage => ({
  type: TYPE.TEXTLANGUAGE,
  textLanguage
});

export const setTextFontSize = textSize => ({
  type: TYPE.TEXTSIZE,
  textSize
});

export const setTextLineSpacing = lineSpacing => ({
  type: TYPE.TEXTLINESPACING,
  lineSpacing
});

export const setLoader = showLoader => ({
  type: TYPE.TOGGLELOADER,
  showLoader
});

const initialState = {
  appLanguage: 'en',
  textLanguage: 'en-US',
  textSize: '24px',
  lineSpacing: '1.5',
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.APPLANGUAGE:
      return {
        ...state,
        appLanguage: action.appLanguage
      };
    case TYPE.TEXTLANGUAGE:
      return {
        ...state,
        textLanguage: action.textLanguage
      };
    case TYPE.TEXTSIZE:
      return {
        ...state,
        textSize: action.textSize
      };
    case TYPE.TEXTLINESPACING:
      return {
        ...state,
        lineSpacing: action.lineSpacing
      };
    case TYPE.TOGGLELOADER:
      return {
        ...state,
        showLoader: action.showLoader
      };
    default:
      return state;
  }
};
