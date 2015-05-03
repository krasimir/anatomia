var t = require('templates');
var _ = require('lodash');
var client = require('./data/client');
var QuestionData = require('./data/QuestionData')();
var State = require('./QuestionnaireState');
var fly = require('./helpers/flyTransition');
var flyLeft = require('./helpers/flyTransitionLeft');
var fade = require('./helpers/fadeTransition');
var processors = require('./helpers/processors');

var QUESTION_TYPES = require('./data/QuestionTypes');

module.exports = Ractive.extend({
  template: t('templates/aaa/results-questionnaire.html'),
  components: {
    Field: require('../common/Field')
  },
  data: {
    showMotivationText: false,
    question: null,
    field: false,
    noMoreQuestions: false,
    buttonsState: {
      isTheFirstOne: true,
      back: true,
      next: true,
      skip: true,
      isSkippedAllowed: true
    },
    currentQuestion: null,
    questionsIndex: 0,
    state: new State(),
    stateItems: null,
    errorMessage: false
  },
  transitions: {
    fly: fly,
    flyLeft: flyLeft,
    fade: fade
  },
  onrender: function() {
    var self = this;
    var state = self.get('state');
    
    function showQuestion(question) {
      self.set('errorMessage', false);
      if(!question) {
        self.set('noMoreQuestions', true);
        self.fire('no-more-questions');
      } else {
        // make sure that there is an id for every question
        // it is used to go back and forward
        if(typeof question.id === 'undefined') {
          var index = self.get('questionsIndex');
          question.id = 'q' + index;
          self.set('questionsIndex', index + 1);
        }

        var fieldDefaultValue = state.value(question);
        var fieldData = QuestionData.toWidgetData(question, fieldDefaultValue);
        var submitOnEnter = typeof question.submitOnEnter === 'undefined' ? true : question.submitOnEnter;

        self.set('currentQuestion', question);

        // setting buttons' state
        var bState = self.get('buttonsState');
        bState.isSkippedAllowed = question.skipping !== undefined ? question.skipping : true;
        if(state.isFirstQuestion(question.id)) {
          bState.isTheFirstOne = true;
          bState.skip = false;
          bState.back = false;
        } else {
          bState.isTheFirstOne = false;
          if(bState.isSkippedAllowed) {
            bState.skip = true;
            bState.next = false;
          } else {
            bState.skip = false;
            bState.next = true;
          }
          bState.back = true;
        }

        self.set({
          buttonsState: bState,
          field: fieldData,
          noMoreQuestions: false
        }, function() {
          self.transitions.fly = fly;
          state.pushItem({ question: question }, 'itemsShown');
          self.fire('question-shown', state, question.id);
          var widget = field ? field.findComponent('Widget') : false;
          if(widget) { 
            field.findComponent('Widget').focus();
          }
        });

        // make sure that there is Field component on the page
        var field = self.findComponent('Field');
        if(!field) { return; }

        // managing the Field component
        field.on({
          '*.enter': function() {
            if(submitOnEnter) {
              setTimeout(submit, 100);
            }
          }
        });
        field.observe('field.value', function(value) {
          if(value && value !== '') {
            self.set({
              'buttonsState.next': true,
              'buttonsState.skip': false
            });
          } else {
            if(self.get('buttonsState.isSkippedAllowed')) {
              field.makeValid();
              self.set({
                'buttonsState.next': false,
                'buttonsState.skip': true
              });
            }
          }
        }, { init: false });
      }
    }
    function makeRequest() {
      var cell = client.GenerateNextQuestion().get(self.get('user'));
      cell.filter({ state: 'success' }).watch(function(val) {
        self.set('loading', false, function() {
          showQuestion(val.result);
        });
      });
      cell.filter({ state: 'error' }).watch(function() {
        self.set('loading', false, function() {
          self.fire('error', { message: 'Broken GenerateNextQuestion request.' });
          self.set('errorMessage', true);
        });
      });
    }
    function addAnswers(answersData) {
      if(!Array.isArray(answersData)) { answersData = [answersData]; }

      var isNewAnswer = true;
      // if the user is answering on an already given question
      // we are clearing all the others after
      var id = currentQuestionId();
      if(state.exists(id)) {
        isNewAnswer = false;
        self.get('user').setPatiendData(_.map(state.clearAfter(id), function(a) {
          return a.answer;
        }));
      }

      // adding a new answer to the list
      var user = self.get('user');
      var currentQuestion = self.get('currentQuestion');
      _.forEach(answersData, function(a) {
        // the static questions should not be attached to the user's state
        // they are only meant to be used with processors
        if(!a.Id.IsStaticQuestion) {
          user.push('state.PatientData', a);
        }
        // updating the questionnaire state
        state.pushItem({
          answer: a,
          question: currentQuestion
        });
      });
      user.incrementAnswered();
      if(isNewAnswer) {
        var isSkipPressed = answersData[0].Confidence === 2;
        var eventName = isSkipPressed ? 'Question Skipped' : 'Question Answered';
        self.fire('track', {
          eventName: self.get('pageName') + ' - ' + eventName,
          properties: {
            SessionId: self.get('user').get('state.SessionId'),
            PageName: self.get('pageName'),
            NumOfAnswers: state.length(),
            QuestionConceptId: currentQuestion.Parts[0].Id.ConceptId,
            QuestionName: currentQuestion.Parts[0].Id.Name
          }
        });
      }
      self.set('field', null, function() {
        self.set('loading', true, function() {
          if(currentQuestion.processor && processors[currentQuestion.processor]) {
            processors[currentQuestion.processor](
              self.get('user'),
              currentQuestion,
              answersData,
              makeRequest
            );
          } else {
            makeRequest();
          }
          self.fire('changed', state);
        });
      });
    }
    function submit(e, skip) {
      var field = self.findComponent('Field');
      if(!skip) { field.validationCheck(); }
      if(field.get('isValid') || skip) {

        var questionParts = self.get('currentQuestion.Parts');
        // 2 means skipping, 3 means "I don't know" (Unknonw)
        var Confidence = skip ? 2 : 0;

        // Any of many question
        if(questionParts.length > 1) {
          var checked = self.get('field.value');
          var answersToAdd = [];
          _.forEach(questionParts, function(part) {
            var selected = false;
            _.forEach(checked, function(Name) {
              if(part.Id.Name === Name) {
                selected = true;
              }
            });
            if(selected) { // checked
              answersToAdd.push({
                Id: part.Id,
                Value: QuestionData.YesAnswerIndex(part),
                Confidence: Confidence
              });
            } else if(skip) { // skip button is pressed
              answersToAdd.push({
                Id: part.Id,
                Value: null,
                Confidence: Confidence
              });
            } else if(Array.isArray(checked) && checked.length === 0) { // none of the above
              answersToAdd.push({
                Id: part.Id,
                Value: QuestionData.NoAnswerIndex(part),
                Confidence: Confidence
              });
            }
          });
          addAnswers(answersToAdd);

        // One of many
        } else if(questionParts[0].ValueType === QUESTION_TYPES.OneOfMany || questionParts[0].ValueType === QUESTION_TYPES.Boolean) {
          addAnswers({
            Id: self.get('currentQuestion').Parts[0].Id,
            Value: skip ? null : questionParts[0].Possible.indexOf(self.get('field.value')),
            Confidence: Confidence
          });

        // The other types of questions
        } else {
          var question = self.get('currentQuestion').Parts[0];
          addAnswers({
            Id: question.Id,
            Value: skip ? null : QuestionData.formatAnswer(question, self.get('field.value')),
            Confidence: Confidence
          });
        }

      }
    }
    function back() {
      var previousQuestion = state.previousQuestion(currentQuestionId());
      if(previousQuestion) {
        self.transitions.fly = flyLeft;
        self.set('field', null, function() {
          showQuestion(previousQuestion);
        });
      }
    }
    function forward() {
      var nextQuestion = state.nextQuestion(currentQuestionId());
      if(nextQuestion) {
        self.set('field', null, function() {
          showQuestion(nextQuestion);
        });
      }
    }
    function exact(id) {
      var exactQuestion = state.question(id);
      if(exactQuestion) {
        self.transitions.fly = state.lessThen(id, currentQuestionId()) ? fly : flyLeft;
        self.set('field', null, function() {
          showQuestion(exactQuestion);
          var position = state.questionIndex(id);
          self.fire('track', {
            eventName: 'Results - Previous response opened',
            properties: {
              SessionId: self.get('user').get('state.SessionId'),
              PageName: 'Results',
              QuestionConceptId: exactQuestion.Parts[0].Id.ConceptId,
              QuestionName: exactQuestion.Parts[0].Id.Name,
              QuestionPosition: (position.index + 1) + ' of ' + position.all
            }
          });
        });
      }
    }

    // Utility functions
    function currentQuestionId() {
      return self.get('currentQuestion').id;
    }

    self.on({
      submit: submit,
      back: back,
      forward: forward,
      'Widget.radio-clicked': submit,
      'show-question': exact,
    });

    // if the component appears with predefined answers
    if(self.get('state').length() > 0) {
      self.set('questionsIndex', self.get('state').length());
    }

    makeRequest();

  }
});