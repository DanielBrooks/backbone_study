Helpers = {
  showError: function($block, isInsert, text) {
    var template = _.template($('#error-template').html())({text: text}).trim();
    if (isInsert) {
      $(template).insertAfter($block);
    }
    else {
      $block.append(template);
    }
  },
  removeError: function($block) {
    if ($block.is('[data-error-text]')) {
      $block.remove();
    }
    else {
      $block.find('[data-error-text]').remove();
    }
  },
  isObjEmpty: function(obj) {
    var prop;
    for (prop in obj) {
      return false;
    }
    return true;
  }
}


Validation = {
  note: function(attrs) {
    var errors = {};

    if (attrs.title.length < 3) {
      errors.title = 'Title can\'t be shorter than 3 symbols.';
    }
    if (!attrs.content.length) {
      errors.content = 'Note can\'t be blank.';
    }
    return this.prepareValidationResult(errors);
  },
  prepareValidationResult: function(obj) {
    if (!Helpers.isObjEmpty(obj)) {
      obj.validationError = true;
    }
    else {
      obj.validationError = false;
    }
    return obj;
  }
}

$(function() {

// saveData method should be written as a Model method in order to overwrite the backbone saving method

/*
у меня есть коллекция, в которую добавляются модели. у модели есть валидация,
которая срабатывает при создании новой модели и при изменении в уже существующей модели.
мне нужно выводить разные сообщения в зависимости какой из случаев вызвал валидацию.
я могу при сохранении модели передавать еще и флаг какой-то, что бы отследить откуда пришло сохранение?



 1. стоит ли использовать метод валидации в самой модели? (и спросить про хук)
 2. на сколько валидный случай, когда справа (NoteView) я заменю на другую вьюху для редактирования,
 а потом снова назад?
 3. где стоит писать основную логику в коллекции или во вьюхе?
*/


  var Note = Backbone.Model.extend({
    defaults: function() {
      return {
        title: 'New title',
        content: 'no content yet'
      }
    }
  });

  var NotesList = Backbone.Collection.extend({
    model: Note,
    localStorage: new Backbone.LocalStorage('notes-backbone')
  });

  var Notes = new NotesList;
  //var note = new Note;


  var NoteView = Backbone.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    template: _.template($('#note-template').html()),
    events: {
      'click [data-remove-note]': 'removeNote',
      'click [data-update-note]': 'updateNote'
    },
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'sync', this.render);
      //this.listenTo(this.model, 'invalid', this.invalid);
    },
    render: function() {
      console.log('render');
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    removeNote: function() {
      this.model.destroy();
      return false;
    },
    /*renderEdit: function() {
      this.renderShow();
    },*/
    updateNote: function() {
      /*return false;
      console.log(this.model.get('title'));
      v = this.model.set({
        title: this.model.get('title').slice(0,4)
      });
      l = this.model.validate(v.toJSON());
      this.model.save();*/
      var l, k, v;

      this.$el.closest('[data-notes-list]').children('li').removeClass('error');

      k = this.model.save({
        title: this.model.get('title').slice(0,2)
      }, {
        view: this,
        invalidCallback: this.invalidCallback.bind(this)
      });
      return false;
    },
    invalidCallback: function(error) {
      console.log(222);
      this.$el.addClass('error');
    }
  });

  var AppView = Backbone.View.extend({

    el: '#notes-wrap',
    events: {
      'click #new-note': 'createNote'
    },
    initialize: function() {
      console.log(1);
      this.$notesList = this.$('[data-notes-list]');
      this.$noteForm = this.$('[data-note-form]');
      this.$title = this.$noteForm.find('[data-note-title]');
      this.$content = this.$noteForm.find('[data-note-content]');
      this.listenTo(Notes, 'add', this.addOne);
      //this.listenTo(Notes, 'invalid', this.invalidCallback);

      Notes.fetch();
    },
    render: function() {
      console.log(2);
    },
    addOne: function(passedModel) {
      console.log(3);
      var view = new NoteView({model: passedModel});
      this.$notesList.append(view.render().el);
    },
    createNote: function(e) {
      var modelData,
          validationResult;

      modelData = {
        title: this.$title.val(),
        content: this.$content.val()
      };

      Helpers.removeError(this.$noteForm);
      validationResult = Validation.note(modelData);

      if (validationResult.validationError) {
        this.noteError(validationResult);
      }
      else {
        Notes.create(modelData, {
          wait: true
        });
      }
      return false;
    },
    noteError: function(er) {
      console.log('Addition error');
      var prop;
      for (prop in er) {
        if (prop == 'title') {
          Helpers.showError(this.$title, true, er[prop]);
        }
        else if (prop == 'content') {
          Helpers.showError(this.$content, true, er[prop]);
        }
      }
    }

  });

  var App = new AppView;

});