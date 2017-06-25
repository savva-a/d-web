import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Image } from 'react-bootstrap';

import * as counterActions from '../../redux/counter';
import * as registerActions from '../../redux/register';
import * as libraryActions from '../../redux/library';
import * as bookViewerActions from '../../redux/bookViewer';
import * as editorActions from '../../redux/editor';

import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import ColoredScrollbars from '../ColoredScrollBar';
import UserLvlModal from '../UserLvlModal';
import Loader from '../Loader';

import staticImages from '../../staticImages';
import words from '../../words';
import API from '../../client-api';
import levenshteinDistance from '../../utils/levenshteinDistance';

import './Viewer.scss';

@connect(
  state => ({ ...state }),
  dispatch => ({ actions: bindActionCreators({
    ...counterActions,
    ...registerActions,
    ...bookViewerActions,
    ...editorActions,
    ...libraryActions
  }, dispatch) })
)

class Viewer extends React.Component {

  static inArray(currentWord, arrayWords) {
    for (let i = 0; i < arrayWords.length; i += 1) {
      if (arrayWords[i] === currentWord) return true;
    }
    return false;
  }

  static getTokensFromFetch(data) {
    const AllLine = [];
    const specCharacter = ['.', ',', ':', '!', '?', '»', '«'];
    // Tokens.forEach((curItem) => {
    data.forEach((curItem) => {
      let currentLineString = '';
      curItem.Tokens.forEach((curToken, index) => {
        if (index === 0) {
          currentLineString = curToken.NormalizedToken;
        } else if (Viewer.inArray(curToken.NormalizedToken, specCharacter)) {
          currentLineString += '';
          currentLineString += curToken.NormalizedToken;
        } else {
          currentLineString += ' ';
          currentLineString += curToken.NormalizedToken;
        }
      });
      AllLine.push({
        Offset: curItem.Offset,
        Len: curItem.Len,
        Line: currentLineString,
        Tokens: curItem.Tokens,
        FirstTry: true
      });
    });
    return AllLine;
  }

  static getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    let sel;
    let range;
    if (typeof window.getSelection !== 'undefined') {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if (typeof document.selection !== 'undefined' && document.selection.type !== 'Control') {
      const textRange = document.selection.createRange();
      const preCaretTextRange = document.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  static spaceBreak(s) {
    const re = /\s* \s*/;
    return s.charAt(0) === ' ' ? s.substr(1).split(re) : s.split(re);
  }

  static scan(str) {
    const values = [];
    const counts = [];
    for (let i = 0, length = str.length; i < length; i += 1) {
      const j = values.indexOf(str[i]);
      if (j < 0) {
        values.push(str[i]);
        counts.push(1);
      } else counts[j] += 1;
    }
    return [values, counts];
  }

  static sentenceAnalysis(currentLine, recognitionObj) {
    const returnObj = recognitionObj;
    returnObj.words = Viewer.spaceBreak(recognitionObj.transcript.replace(/[^A-Za-zА-Яа-яЁё_ ]/g, '').toLowerCase());
    const calculationOfText = Viewer.scan(Viewer.spaceBreak(
      currentLine.replace(/[^A-Za-zА-Яа-яЁё_ ]/g, '').toLowerCase()
    ));
    const totalWords = calculationOfText[1].reduce((sum, current) => sum + current, 0);

    returnObj.words.forEach((currentWord) => {
      for (let i = 0; i < calculationOfText[0].length; i += 1) {
        if (calculationOfText[0][i] === currentWord) {
          calculationOfText[1][i] -= 1;
        }
      }
    });
    const leftover = calculationOfText[1].reduce((sum, current) =>
      sum + current
    , 0);
    returnObj.sentenceСonfidence = (totalWords - leftover) / totalWords;
    return returnObj;
  }

  static agrgtFn(arrayOfTexts) {
    const delay = (value, timeout) =>
      new Promise(resolve => setTimeout(() => resolve(value), timeout));

    const recurFetch = (arrayIn, arrayOut) => {
      if (arrayIn.length === 0) return arrayOut;
      const text = arrayIn[0];
      return fetch('https://api.projectoxford.ai/linguistics/v1.0/analyze', {
        method: 'post',
        headers: {
          // 'Ocp-Apim-Subscription-Key': '3604df3d19f04c83b7e671b35c2e86a7', // old
          // 'Ocp-Apim-Subscription-Key': '7bbc0c73eeef49b38e78c0f684ba2322', // actual
          'Ocp-Apim-Subscription-Key': '108e17ad008b41168ce8c4d183c44cfe', // new
          'Content-Type': 'application/json'
        },
        processData: false,
        body: JSON.stringify({
          language: 'en',
          analyzerIds: [
            // '4fa79af1-f22c-408d-98bb-b7d7aeef7f04',
            '08ea174b-bfdb-4e64-987e-602f85da7f72',
            // '22a6b758-420f-4745-8a3c-46835a67c0d2'
          ],
          text
        })
      })
      .then(val => delay(val, 500))
      .then(result => result.json())
      .then((res) => {
        const nextArrayIn = arrayIn;
        nextArrayIn.shift();
        const nextArrayOut = arrayOut.concat(res);
        return recurFetch(nextArrayIn, nextArrayOut);
      })
      .catch((error) => {
        console.log('777 Request failed', error); // eslint-disable-line no-console
      });
    };
    return recurFetch(arrayOfTexts, []);
  }

  static divideTextByLength(text) {
    const resultArray = text.match(/.{1,65535}/g);
    // const resultArray = text.match(/.{1,650}/g);
    return resultArray;
  }

  constructor(props) {
    super(props);
    this.divideByTokensBigText = this.divideByTokensBigText.bind(this);
    this.speechToTextClick = this.speechToTextClick.bind(this);
    this.toggleRecognition = this.toggleRecognition.bind(this);
    this.saveText = this.saveText.bind(this);
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.speakSentence = this.speakSentence.bind(this);
    this.textToSpeechClick = this.textToSpeechClick.bind(this);
    this.prevSentence = this.prevSentence.bind(this);
    this.nextSentence = this.nextSentence.bind(this);
    this.renderBySentences = this.renderBySentences.bind(this);
    this.renderText = this.renderText.bind(this);
    this.feedbackClick = this.feedbackClick.bind(this);
    this.setUserLevel = this.setUserLevel.bind(this);
    this.decreaseUserLevel = this.decreaseUserLevel.bind(this);
    this.increaseUserLevel = this.increaseUserLevel.bind(this);
    this.showTryAgain = this.showTryAgain.bind(this);
    this.onMount = this.onMount.bind(this);
    this.closeSaveTextModal = this.closeSaveTextModal.bind(this);
    this.handleSaveTextName = this.handleSaveTextName.bind(this);
    this.saveTextFromModal = this.saveTextFromModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showUserLvlModal = this.showUserLvlModal.bind(this);
    this.closeUserLvlModal = this.closeUserLvlModal.bind(this);
    this.calcTimeDiff = this.calcTimeDiff.bind(this);
    this.state = {
      contentEditable: true,
      dividedByTokens: false,
      currentPosition: 0,
      currentSentence: 0,
      showLoader: false,
      showFeedback: false,
      showUserLvlModal: false,
      rate: 1,
      pitch: 1,
      sttIsActive: false,
      ttsIsActive: false,
      wordRecognition: 50,
      sentenceRecognition: 50,
      feedbackText: 'default feedback text',
    };
  }

  componentDidMount() {
    // ///////////////////////////////////////////////////////////////
    const recognition = new window.webkitSpeechRecognition(); // eslint-disable-line new-cap
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      console.log(77, event);
      if (typeof (event.results) === 'undefined') {
        recognition.onend = null;
        recognition.stop();
        return;
      }
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          if (parseFloat(event.results[i][0].confidence) >= parseFloat(this.state.wordRecognition / 100)) {
            this.setState({
              feedbackText: `<p>${event.results[i][0].transcript}</p>`
            });
            const sentence = Viewer.sentenceAnalysis(this.props.bookViewer.sentences[this.state.currentSentence].Line, {
              transcript: event.results[i][0].transcript,
              confidence: event.results[i][0].confidence,
              isFinal: event.results[i].isFinal
            });
            if (sentence.isFinal
              && parseFloat(sentence.sentenceСonfidence) >= parseFloat(this.state.sentenceRecognition / 100)
            ) {
              let origWords = this.props.bookViewer.sentences[this.state.currentSentence].Line;
              origWords = origWords.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
              // .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
              const recogWords = sentence.transcript;
              const origWordsParts = origWords.split(' ');
              const recogWordsParts = recogWords.split(' ');
              const problemWords = [];

              for (let j = 0; j < origWordsParts.length; j += 1) {
                let wordConfidenceStd = 1;
                for (let k = 0; k < recogWordsParts.length; k += 1) {
                  let std = levenshteinDistance(
                    origWordsParts[j].toLowerCase(),
                    recogWordsParts[k].toLowerCase());
                  std /= origWordsParts[k].length;

                  if (std < wordConfidenceStd) {
                    wordConfidenceStd = std;
                  }
                }
                 // eslint-disable-next-line no-console
                console.log('wordConfidenceStd', wordConfidenceStd, origWordsParts[j]);

                if (wordConfidenceStd > (this.state.sentenceRecognition / 100)) {
                  this.props.actions.addProblemWord(origWordsParts[j]);
                  problemWords.push(origWordsParts[j]);
                } else {
                  this.props.actions.increaseSuccessWord();
                }
              }
              console.log('problemWords', problemWords); // eslint-disable-line no-console
              this.setState({ feedbackText: '' });
              this.nextSentence();
              if (this.props.bookViewer.sentences[this.state.currentSentence].FirstTry) {
                // если прочли с первой попытки, то увеличить счетчик прочтений с первой попытки
                this.props.actions.firstTrySentence();
                console.log('first try reading');
                this.props.actions.secondTrySentence(this.state.currentSentence);
              }
            } else {
              this.showTryAgain();
              // прочитано не с первой попытки
              this.props.actions.secondTrySentence(this.state.currentSentence);
            }
          } else {
            this.showTryAgain();
            this.props.actions.secondTrySentence(this.state.currentSentence);
          }
        } else {
          this.setState({
            feedbackText: `<p>${event.results[i][0].transcript}</p>`
          });
          if (parseFloat(event.results[i][0].confidence) >= parseFloat(this.state.wordRecognition / 100)) {
            let isSentenceСonfidence = false;

            const sentence = Viewer.sentenceAnalysis(this.props.bookViewer.sentences[this.state.currentSentence].Line, {
              transcript: event.results[i][0].transcript,
              confidence: event.results[i][0].confidence,
              isFinal: event.results[i].isFinal
            });
            if (parseFloat(sentence.sentenceСonfidence) >= parseFloat(this.state.sentenceRecognition / 100)) {
              isSentenceСonfidence = true;
            }
            if (sentence.isFinal && isSentenceСonfidence) {
              this.nextSentence();
              if (this.props.bookViewer.sentences[this.state.currentSentence].FirstTry) {
                // если прочли с первой попытки, то увеличить счетчик прочтений с первой попытки
                this.props.actions.firstTrySentence();
                this.props.actions.secondTrySentence(this.state.currentSentence);
              }
              isSentenceСonfidence = false;
            }
          }
        }
      }
    };

    recognition.onstart = () => {
      this.onMount('feedbackText', '');
      console.log('onstart'); // eslint-disable-line no-console
    };

    recognition.onend = () => {
      console.log('onend'); // eslint-disable-line no-console
      this.onMount('sttIsActive', false);
    };

    recognition.onspeechend = () => {
      console.log('Speech has stopped being detected'); // eslint-disable-line no-console
    };

    recognition.onerror = (event) => {
      this.onMount('sttIsActive', false);
      if (event.error === 'no-speech') {
        const state = this.state;
        state.recognition.stop();
        const diff = this.calcTimeDiff(this.state.sttDateOn);
        console.log('enabled during ', diff, 'ms');
        this.speakSentence();
        console.log(event.error); // eslint-disable-line no-console
      }
      if (event.error === 'audio-capture') {
        console.log(event.error); // eslint-disable-line no-console
      }
      if (event.error === 'not-allowed') {
        console.log(event.error); // eslint-disable-line no-console
      }
    };

    this.onMount('recognition', recognition);
    // //////////////////////////////////////////////////////////////////
    if (this.props.bookViewer.book._id) {
      let progress = {};
      if (localStorage.DooBeeBookProgress) {
        progress = JSON.parse(localStorage.DooBeeBookProgress);
      }
      if (progress[this.props.bookViewer.book._id]) {
        this.onMount('currentPosition', progress[this.props.bookViewer.book._id]);
        const el = this.currentText;
        if (el.setSelectionRange !== undefined) {
          el.setSelectionRange(this.state.currentPosition, this.state.currentPosition);
        }
        // text scroll
        const totalTextLenght = this.props.bookViewer.book.text.length;
        const offset = (this.currentText.clientHeight * (progress[this.props.bookViewer.book._id] / totalTextLenght)) -
                       (0.25 * this.currentText.parentElement.clientHeight);
        this.currentText.parentElement.scrollTop = offset;
      }
    }
    this.onMount('fileName', this.props.bookViewer.book.name);
  }

  componentWillUnmount() {
    this.state.recognition.stop();
    window.speechSynthesis.cancel();
  }

  onMount(key, value) {
    this.setState({
      [key]: value
    });
  }

  setCurrentPosition() {
    const pos = Viewer.getCaretCharacterOffsetWithin(this.currentText);
    this.setState({
      currentPosition: pos
    });
  }

  setUserLevel(e) {
    this.setState({
      wordRecognition: parseInt(e.target.value, 10),
      sentenceRecognition: parseInt(e.target.value, 10)
    });
  }

  prevSentence() {
    if (!this.props.bookViewer.sentences) {
      return;
    }
    if (this.state.currentSentence > 0) {
      const currentPosition = this.props.bookViewer.sentences[(this.state.currentSentence - 1)].Offset + 1;
      let currentSentence = this.state.currentSentence;
      currentSentence -= 1;
      this.setState({
        currentPosition,
        currentSentence
      });
      this.renderBySentences(this.props.bookViewer.sentences, currentPosition);

      const fullheight = this.currentText.clientHeight;
      const currentHeight = this.currentText.children[currentSentence].offsetTop;
      const screenHeight = this.currentText.parentElement.clientHeight;
      if ((fullheight - currentHeight) > 0.7 * screenHeight) {
        // this.currentText.parentElement.scrollTop -= this.currentText.children[currentSentence].offsetHeight;
        const totalTextLenght = this.props.bookViewer.book.text.length;
        const offset = (this.currentText.clientHeight * (currentPosition / totalTextLenght)) -
                       (0.25 * this.currentText.parentElement.clientHeight);
        this.currentText.parentElement.scrollTop = offset;
      }
      let progress = {};
      if (localStorage.DooBeeBookProgress) {
        progress = JSON.parse(localStorage.DooBeeBookProgress);
      }
      const bookId = this.props.bookViewer.book._id;
      progress[bookId] = currentPosition;
      localStorage.setItem('DooBeeBookProgress', JSON.stringify({ ...progress }));
    }
  }

  nextSentence() {
    if (!this.props.bookViewer.sentences) {
      return;
    }
    const len = this.props.bookViewer.sentences.length - 1;
    if (this.state.currentSentence < len) {
      const currentPosition = this.props.bookViewer.sentences[(this.state.currentSentence + 1)].Offset + 1;
      let currentSentence = this.state.currentSentence;
      currentSentence += 1;
      this.setState({
        currentPosition,
        currentSentence
      });
      this.renderBySentences(this.props.bookViewer.sentences, currentPosition);

      if (this.currentText.children[currentSentence].offsetTop > (this.currentText.parentElement.offsetHeight / 3)) {
        // this.currentText.parentElement.scrollTop += this.currentText.children[currentSentence + 1].offsetHeight;
        const totalTextLenght = this.props.bookViewer.book.text.length;
        const offset = (this.currentText.clientHeight * (currentPosition / totalTextLenght)) -
                       (0.25 * this.currentText.parentElement.clientHeight);
        this.currentText.parentElement.scrollTop = offset;
      }

      let progress = {};
      if (localStorage.DooBeeBookProgress) {
        progress = JSON.parse(localStorage.DooBeeBookProgress);
      }
      const bookId = this.props.bookViewer.book._id;
      progress[bookId] = currentPosition;
      localStorage.setItem('DooBeeBookProgress', JSON.stringify({ ...progress }));
    }
  }

  feedbackClick() {
    this.setState({
      showFeedback: !this.state.showFeedback
    });
  }

  calcTimeDiff(date) {
    const sttDateOff = Date.now();
    this.props.actions.addReadingTime(sttDateOff - date);
    return sttDateOff - date;
  }

  textToSpeechClick() {
    if (!this.state.dividedByTokens) {
      this.divideByTokensBigText(this.currentText.innerText)
      .then(() => {
        this.renderBySentences(this.props.bookViewer.sentences, this.state.currentPosition);

        this.speakSentence();
      });
    } else {
      this.speakSentence();
    }
  }

  speakSentence() {
    if (this.state.sttIsActive) {
      this.setState({
        sttIsActive: false
      });
      this.state.recognition.stop();
      const diff = this.calcTimeDiff(this.state.sttDateOn);
      console.log('enabled during ', diff, 'ms');
    }
    if (this.state.ttsIsActive) {
      window.speechSynthesis.cancel();
      this.setState({
        ttsIsActive: false
      });
      return;
    }

    const msg = new SpeechSynthesisUtterance();
    msg.lang = this.props.config.textLanguage;
    msg.text = this.props.bookViewer.sentences[this.state.currentSentence].Line;
    msg.volume = parseFloat(1); // 0 to 1
    msg.rate = this.state.rate;
    msg.pitch = this.state.pitch;

    msg.onstart = () => {
      this.setState({
        ttsIsActive: true
      });
    };

    msg.onend = () => {
      this.setState({
        ttsIsActive: false
      });
      this.props.actions.increaseComputerReadingCount();
      console.log(this.props.bookViewer.statistics.listenCnt);
      this.toggleRecognition();
    };
    window.speechSynthesis.speak(msg);
  }

  saveTextFromModal() {
    const data = {
      session: this.props.auth.session,
      text: this.currentText.innerText,
      name: this.props.bookViewer.book.name,
      book: this.props.bookViewer.book._id
    };
    API.call('book/save', data)
    .then((result) => {
      this.closeSaveTextModal();
      this.props.actions.getBook(result.data);
      this.setState({
        dividedByTokens: false
      });
    });
  }

  saveText() {
    const data = {
      session: this.props.auth.session,
      text: this.currentText.innerText,   //
      name: this.props.bookViewer.book.name,
      book: this.props.bookViewer.book._id
    };
    API.call('book/save', data)
    .then((result) => {
      this.props.actions.editText(result.data.text);
      this.setState({
        dividedByTokens: false
      });
    });
  }

  speechToTextClick() {
    if (!('webkitSpeechRecognition' in window)) {
      this.currentText.innerHTML = `<p id="info_upgrade">Web Speech API is not supported by this browser.
      Upgrade to <a href="//www.google.com/chrome">Chrome</a>
      version 25 or later.</p>`;
      this.currentText.contentEditable = false;
      return;
    }
    if (!this.state.dividedByTokens) {
      this.divideByTokensBigText(this.currentText.innerText)
      .then(() => {
        this.toggleRecognition();
      });
    } else {
      this.toggleRecognition();
    }
  }

  toggleRecognition() {
    if (this.state.ttsIsActive) {
      this.setState({
        ttsIsActive: false
      });
      window.speechSynthesis.cancel();
    }
    if (this.state.sttIsActive) {
      const diff = this.calcTimeDiff(this.state.sttDateOn);
      console.log('enabled during ', diff, 'ms');
      this.state.recognition.stop();
      this.setState({
        sttIsActive: false,
        contentEditable: true,
      });
    } else {
      this.state.recognition.lang = this.props.config.textLanguage;
      try {
        this.state.recognition.start();
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
      this.setState({
        sttIsActive: true,
        sttDateOn: Date.now(),
        contentEditable: false,
      });
      this.renderBySentences(this.props.bookViewer.sentences, this.state.currentPosition);
    }
  }

  divideByTokensBigText(text) {
    this.setState({
      showLoader: true
    });
    return Viewer.agrgtFn(Viewer.divideTextByLength(text))
    .then((results) => {
      // concat arrays
      let totalResults = [];
      results.forEach((item) => {
        totalResults = totalResults.concat(item.result);
      });
      return totalResults;
    })
    .then((_result) => {
      // add offset
      const result = _result;
      let groupOffset = 0;
      for (let i = 1; i < result.length; i += 1) {
        if (result[i].Offset === 0) {
          groupOffset += result[i - 1].Offset;
        }
        result[i].Offset += (groupOffset + 1);
      }
      return result;
    })
    .then((result) => {
      const state = this.state;
      state.showLoader = false;
      state.contentEditable = false;
      state.dividedByTokens = true;
      this.setState(state);
      let progress = {};
      if (localStorage.DooBeeBookProgress) {
        progress = JSON.parse(localStorage.DooBeeBookProgress);
      }
      this.props.actions.addSentences(Viewer.getTokensFromFetch(result));
      if (progress[this.props.bookViewer.book._id]) {
        // const currentPosition = progress[this.props.bookViewer.book._id];
        // const idx = this.props.bookViewer.sentences.findIndex(item => item.Offset === (currentPosition - 1));
        // this.setState({
        //   currentSentence: idx
        // });
        const el = this.currentText;
        if (el.setSelectionRange !== undefined) {
          el.setSelectionRange(this.state.currentPosition, this.state.currentPosition);
        }
      }
    })
    .catch((error) => {
      console.log('Request failed', error); // eslint-disable-line no-console
    });
  }

  showTryAgain() {
    this.setState({
      feedbackText: '',
      sttIsActive: false,
      showTryAgain: true
    });
    this.state.recognition.stop();
    setTimeout(() => {
      this.state.recognition.start();
      this.setState({
        feedbackText: '',
        sttIsActive: true,
        sttDateOn: Date.now(),
        showTryAgain: false
      });
    }, 1000);
  }

  decreaseUserLevel() {
    const state = this.state;
    if (parseInt(state.wordRecognition, 10) > 5 && parseInt(state.sentenceRecognition, 10) > 5) {
      state.wordRecognition = parseInt(state.wordRecognition, 10) - 5;
      state.sentenceRecognition = parseInt(state.sentenceRecognition, 10) - 5;
    } else {
      state.wordRecognition = 0;
      state.sentenceRecognition = 0;
    }
    this.setState({
      state
    });
  }

  increaseUserLevel() {
    const state = this.state;
    if (parseInt(state.wordRecognition, 10) < 95 && parseInt(state.sentenceRecognition, 10) < 95) {
      state.wordRecognition = parseInt(state.wordRecognition, 10) + 5;
      state.sentenceRecognition = parseInt(state.sentenceRecognition, 10) + 5;
    } else {
      state.wordRecognition = 100;
      state.sentenceRecognition = 100;
    }
    this.setState({
      state
    });
  }

  handleSaveTextName(e) {
    const book = this.props.bookViewer.book;
    book.name = e.target.value;
    this.props.actions.getBook(book);
  }

  showModal() {
    this.props.actions.showSaveTextModal(true);
  }

  closeSaveTextModal() {
    this.props.actions.showSaveTextModal(false);
  }

  showUserLvlModal() {
    this.setState({
      showUserLvlModal: true
    });
  }

  closeUserLvlModal() {
    this.setState({
      showUserLvlModal: false
    });
  }

  renderBySentences(AllLine, textPointer) {
    let formatterText = AllLine.map((curItem, n) => {
      if (textPointer > curItem.Offset && textPointer > curItem.Offset + curItem.Len) {
        return `<span class="light-grey-comment">${curItem.Line}</span>`;
      }
      if (curItem.Offset <= textPointer && textPointer <= (curItem.Offset + curItem.Len)) {
        this.setState({
          currentSentence: n
        });
        return `<span class="black-comment">${curItem.Line}</span>`;
      }
      return `<span class="gray-comment">${curItem.Line}</span>`;
    });
    formatterText = formatterText.join(' ');
    this.currentText.innerHTML = formatterText;
  }

  renderText(AllLine) {
    let formatterText = AllLine.map(curItem => `<span class="black-comment">${curItem.Line}</span>`);
    formatterText = formatterText.join(' ');
    this.currentText.innerHTML = formatterText;
  }

  render() {
    const LN = this.props.config.appLanguage;
    // console.log(this.props.config);
    /* list of languages
    "ar-SA"
    "cs-CZ"
    "da-DK"
    "de-DE"
    "el-GR"
    "en"
    "en-AU"
    "en-GB"
    "en-IE"
    "en-IN"
    "en-US"
    "en-ZA"
    "es-AR"
    "es-ES"
    "es-MX"
    "es-US"
    "fi-FI"
    "fr-CA"
    "fr-FR"
    "he-IL"
    "hi-IN"
    "hu-HU"
    "id-ID"
    "it-IT"
    "ja-JP"
    "ko-KR"
    "nb-NO"
    "nl-BE"
    "nl-NL"
    "pl-PL"
    "pt-BR"
    "pt-PT"
    "ro-RO"
    "ru-RU"
    "sk-SK"
    "sv-SE"
    "th-TH"
    "tr-TR"
    "zh-CN"
    "zh-HK"
    "zh-TW"
    */
    return (
      <div className="component-container">
        <HeaderComponent imgName="openBookWhite" show={false} />
        <ColoredScrollbars className="viewer-page">
          <Loader show={this.state.showLoader} />
          <div style={{ marginRight: '30px', display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '150px', margin: '0 10px' }}>
              <label htmlFor="rate">rate {this.state.rate}</label>
              <input
                type="range"
                max={3.6}
                min={0.5}
                step="0.05"
                defaultValue="1"
                id="rate"
                onChange={(e) => { this.setState({ rate: e.target.value }); }}
              />
            </div>
            <div style={{ width: '150px', margin: '0 10px' }}>
              <label htmlFor="pitch">pitch {this.state.pitch}</label>
              <input
                type="range"
                max={2}
                min={0}
                step="0.01"
                defaultValue="1"
                id="pitch"
                onChange={(e) => { this.setState({ pitch: e.target.value }); }}
              />
            </div>
            <div> current lang: {this.props.config.textLanguage}</div>
          </div>
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            ref={(c) => { this.currentText = c; }}
            contentEditable={this.state.contentEditable}
            onClick={this.setCurrentPosition}
            onKeyUp={this.setCurrentPosition}
            dangerouslySetInnerHTML={{ __html: this.props.bookViewer.book.text }} // eslint-disable-line react/no-danger
            className="main-viewer"
            style={{ fontSize: this.props.config.textSize, lineHeight: this.props.config.lineSpacing }}
          />
        </ColoredScrollbars>
        <div
          className="feedback-separator"
          style={{ display: this.state.showFeedback ? 'flex' : 'none' }}
        />
        <div
          className="feedback-box"
          style={{ display: this.state.showFeedback ? 'flex' : 'none' }}
        >
          <span
            className="feedback"
            dangerouslySetInnerHTML={{ __html: this.state.feedbackText }} // eslint-disable-line react/no-danger
          />
        </div>
        <img
          alt="try again"
          src={staticImages.tryAgain}
          className="try-again"
          style={{ display: this.state.showTryAgain ? 'inherit' : 'none' }}
        />
        <Modal
          dialogClassName="save-text-modal-dialog"
          show={this.props.editor.showModal}
          onHide={this.closeSaveTextModal}
        >
          <div className="text-save-modal">
            <Image
              src={staticImages.iconCloseCircled}
              height="40"
              width="40"
              alt="copyPaste"
              onClick={this.closeSaveTextModal}
              className="text-save-modal__close"
            />
            <span
              className="text-save-modal__title"
            >
              {words.saveTextModal[LN]}
            </span>
            <input
              placeholder={words.fileSavePlaceholder[LN]}
              defaultValue={this.props.bookViewer.book.name}
              onChange={this.handleSaveTextName}
              className="text-save-modal__input"
            />
            <Image
              src={staticImages.saveIconGreen}
              alt="OK"
              height="48"
              className="text-save-modal__submit"
              onClick={this.saveTextFromModal}
            />
            <Image
              src={staticImages.doobee3}
              height="40"
              className="text-save-modal__logo"
            />
          </div>
        </Modal>
        <UserLvlModal
          show={this.state.showUserLvlModal}
          onHide={this.closeUserLvlModal}
        />
        <FooterComponent
          active
          speechToText={this.speechToTextClick}
          saveText={this.showModal}
          textToSpeech={this.textToSpeechClick}
          nextSentence={this.nextSentence}
          prevSentence={this.prevSentence}
          sttIsActive={this.state.sttIsActive}
          ttsIsActive={this.state.ttsIsActive}
          feedback={this.feedbackClick}
          feedbackIsActive={this.state.showFeedback}
          showUserLvlModal={this.showUserLvlModal}
          setUserLevel={this.setUserLevel}
          increaseUserLevel={this.increaseUserLevel}
          decreaseUserLevel={this.decreaseUserLevel}
          userLevelValue={this.state.wordRecognition}
        />
      </div>
    );
  }
}

Viewer.propTypes = {
  actions: React.PropTypes.shape({
    editText: React.PropTypes.func,
    addSentences: React.PropTypes.func,
    showSaveTextModal: React.PropTypes.func,
    getBook: React.PropTypes.func,
    addProblemWord: React.PropTypes.func,
    increaseSuccessWord: React.PropTypes.func,
    firstTrySentence: React.PropTypes.func,
    secondTrySentence: React.PropTypes.func,
    addReadingTime: React.PropTypes.func,
    increaseComputerReadingCount: React.PropTypes.func,
  }),
  auth: React.PropTypes.shape({
    session: React.PropTypes.string
  }),
  config: React.PropTypes.shape({
    textLanguage: React.PropTypes.string,
    lineSpacing: React.PropTypes.string,
    textSize: React.PropTypes.string,
    appLanguage: React.PropTypes.string,
  }),
  editor: React.PropTypes.shape({
    showModal: React.PropTypes.bool
  }),
  bookViewer: React.PropTypes.shape({
    statistics: React.PropTypes.shape({
      problemWords: React.PropTypes.array,
      listenCnt: React.PropTypes.number,
    }),
    book: React.PropTypes.shape({
      text: React.PropTypes.string,
      name: React.PropTypes.string,
      _id: React.PropTypes.string
    }),
    sentences: React.PropTypes.array
  })
};
Viewer.defaultProps = {
  actions: {},
  auth: { session: '' },
  config: {
    textLanguage: 'en',
    lineSpacing: '1.5',
    textSize: '24px',
    appLanguage: 'en',
  },
  bookViewer: {
    book: {
      text: 'default text',
      name: 'default name',
      _id: 'default _id',
    },
    sentences: []
  },
  editor: {
    showModal: false
  }
};

export default Viewer;
