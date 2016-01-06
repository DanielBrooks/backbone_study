var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');


var AppActions = {
  //create: function(text) {
  //  AppDispatcher.dispatch({
  //    actionType: TodoConstants.TODO_CREATE,
  //    text: text
  //  });
  //}
  createNote: function(note) {
    delete note.errors;
    console.log('AppActions.createNote > ', note);
    AppDispatcher.dispatch({
      actionType: AppConstants.CREATE_NOTE,
      note: note
    });
  }
};

module.exports = AppActions;