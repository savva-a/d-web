const TYPE = {
  GETBOOK: 'GETBOOK',
  ADDSENTENCES: 'ADDSENTENCES',
  FIRSTTRYSENTENCE: 'FIRSTTRYSENTENCE',
  SECONDTRYSENTENCE: 'SECONDTRYSENTENCE',
  ADDPROBLEMWORD: 'ADDPROBLEMWORD',
  ADDREADINGTIME: 'ADDREADINGTIME',
  INCREASESUCCESSWORD: 'INCREASESUCCESSWORD',
  INCREASELISTENCOUNT: 'INCREASELISTENCOUNT',
  EDITTEXT: 'EDITTEXT'
};

export const getBook = book => ({
  type: TYPE.GETBOOK,
  book
});

export const editText = text => ({
  type: TYPE.EDITTEXT,
  text
});

export const addSentences = sentences => ({
  type: TYPE.ADDSENTENCES,
  sentences
});

export const firstTrySentence = () => ({
  type: TYPE.FIRSTTRYSENTENCE,
});

export const secondTrySentence = idx => ({
  type: TYPE.SECONDTRYSENTENCE,
  idx
});

export const addProblemWord = word => ({
  type: TYPE.ADDPROBLEMWORD,
  word
});

export const increaseSuccessWord = word => ({
  type: TYPE.INCREASESUCCESSWORD,
  word
});

export const addReadingTime = readingTime => ({
  type: TYPE.ADDREADINGTIME,
  readingTime
});

export const increaseComputerReadingCount = () => ({
  type: TYPE.INCREASELISTENCOUNT
});

const initialState = {
  statistics: {
    firstTrySentence: 0,
    problemWords: [],
    successWords: 0,
    readingTime: 0, // in ms
    listenCnt: 0,
  },
  book: { text: 'Open book from library.' }
};

export default (_state = initialState, action = {}) => {
  const state = { ..._state };
  switch (action.type) {
    case TYPE.GETBOOK:
      return {
        ...state,
        book: action.book
      };
    case TYPE.ADDSENTENCES:
      return {
        ...state,
        sentences: action.sentences
      };
    case TYPE.FIRSTTRYSENTENCE:
      state.statistics.firstTrySentence += 1;
      return {
        ...state,
      };
    case TYPE.SECONDTRYSENTENCE: {
      const idx = action.idx;
      if (state.sentences[idx]) {
        state.sentences[idx].FirstTry = false;
      }
      return {
        ...state,
      };
    }
    case TYPE.EDITTEXT:
      state.book.text = action.text;
      return {
        ...state
      };
    case TYPE.ADDPROBLEMWORD: {
      const problemWords = state.statistics.problemWords;
      if (problemWords.length > 0) {
        const ind = state.statistics.problemWords.findIndex(item => (item.word === action.word));
        if (ind > -1) {
          problemWords[ind].cnt += 1;
        } else {
          problemWords.push({ word: action.word, cnt: 1 });
        }
      } else {
        problemWords.push({ word: action.word, cnt: 1 });
      }
      return {
        ...state
      };
    }
    case TYPE.INCREASESUCCESSWORD: {
      state.statistics.successWords += 1;
      return {
        ...state
      };
    }
    case TYPE.ADDREADINGTIME: {
      state.statistics.readingTime += action.readingTime;
      return {
        ...state
      };
    }
    case TYPE.INCREASELISTENCOUNT: {
      state.statistics.listenCnt += 1;
      return {
        ...state
      };
    }
    default:
      return state;
  }
};
