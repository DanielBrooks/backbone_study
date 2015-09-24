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
  },
  showPage: function(name) {
    $('[data-page]').addClass('hidden').filter('[data-page="'+name+'"]').removeClass('hidden');
    $('[data-navbar]')
      .find('[data-link-holder]').removeClass('active')
      .filter('[data-link-holder="'+name+'"]').addClass('active');
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
    editTemplate: _.template($('#note-edit-template').html()),
    events: {
      'click [data-remove-note]': 'removeNote',
      'click [data-edit-note]': 'editNote',
      'click [data-cancel-update]': 'render',
      'click [data-update-note]': 'updateNote'
    },
    initialize: function() {
      this.$el.title = function() {
        return this.find('[data-note-title]');
      };
      this.$el.content = function() {
        return this.find('[data-note-content]');
      };
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'sync', this.render);
      //this.listenTo(this.model, 'invalid', this.invalid);
    },
    render: function() {
      //console.log('render');
      this.$el.removeClass('error').html(this.template(this.model.toJSON()));
      return this;
    },
    removeNote: function() {
      this.model.destroy();
      return false;
    },
    editNote: function() {
      this.$el.html(this.editTemplate(this.model.toJSON()));
      return false;
    },
    updateNote: function() {
      var modelData = {
        title: this.$el.title().val(),
        content: this.$el.content().val()
      },
      validationResult = Validation.note(modelData);

      Helpers.removeError(this.$el);
      if (validationResult.validationError) {
        this.$el.addClass('error');
        this.noteError(validationResult);
      }
      else {
        this.model.save(modelData);
      }
      return false;
    },
    noteError: function(er) {
      console.log('Eddition error');
      var prop;
      for (prop in er) {
        if (prop == 'title') {
          Helpers.showError(this.$el.title(), true, er[prop]);
        }
        else if (prop == 'content') {
          Helpers.showError(this.$el.content(), true, er[prop]);
        }
      }
    }
  });

  var CreateNotePageView = Backbone.View.extend({

    el: '[data-page="home"]',
    events: {
      'click [data-new-note]': 'createNote'
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

  //var dispatcher = _.extend({}, Backbone.Events);

  var Router = Backbone.Router.extend({

    routes: {
      "test2":                 "two",    // #help
      "test3":                 "three",    // #help
      "search/:query":        "search",  // #search/kiwis
      "search/:query/p:page": "search",   // #search/kiwis/p7
      "":                     "index"
    },
    index: function() {
      console.log(1);
      Helpers.showPage('home');
      new CreateNotePageView;
      //new Nav('home');
    },
    two: function() {
      console.log(2);
      Helpers.showPage('two');
      //new Nav('two');
    },
    three: function() {
      console.log(3);
      Helpers.showPage('three');
      //new Nav('three');
    }
    //help: function() {
    //  ...
    //},
    //
    //search: function(query, page) {
    //  ...
    //}

  });
  var router = new Router();
  Backbone.history.start();
  //router.navigate('');

  // app.router.navigate();
  // router.navigate('', {trigger: true});

  //new CreateNotePageView;

});