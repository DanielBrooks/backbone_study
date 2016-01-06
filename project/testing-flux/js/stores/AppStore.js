var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _notes = [];

function create(note) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  note.id = id;
  _notes.push(note);
}

var AppStore = assign({}, EventEmitter.prototype, {
  getAllNotes: function() {
    return _notes;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(payload) {
  console.log('AppStore > ', payload);
  switch (payload.actionType) {
    case AppConstants.CREATE_NOTE:
      create(payload.note);
      AppStore.emitChange();
      break;
    default:
  }
  //return true;
});

module.exports = AppStore;