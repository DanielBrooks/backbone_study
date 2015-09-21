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
  }
}


$(function() {

  var Note = Backbone.Model.extend({

    defaults: function() {
      return {
        title: 'New title',
        content: 'no content yet'
      }
    },
    validate: function(attrs, options) {
      var errors = false;
      if (attrs.title.length < 3) {
        attrs.title = 'Title can\'t be shorter than 3 symbols.';
        errors = true;
      }
      else {
        delete attrs.title;
      }
      if (!attrs.content.length) {
        attrs.content = 'Note can\'t be blank.';
        errors = true;
      }
      else {
        delete attrs.content;
      }
      if (errors) {
        options.hookError.call(options.view, _.extend(options, {validationError: attrs}));
        return attrs;
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
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    removeNote: function() {
      this.model.destroy();
      return false;
    },
    updateNote: function() {
      var k;

      this.$el.closest('[data-notes-list]').children('li').removeClass('error');

      k = this.model.save({
        title: this.model.get('title').slice(0,2)
      }, {
        wait: true,
        view: this,
        hookError: function(error) {
          console.log(222);
          this.$el.addClass('error');
        }
      });
      return false;
    },
    invalid: function(error) {
      console.log('b>');
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
      //this.listenTo(Notes, 'invalid', this.noteError);

      Notes.fetch();
    },
    noteError: function(error) {
      //console.log('a>');
      var er = error.validationError,
          prop;
      for (prop in er) {
        if (prop == 'title') {
          Helpers.showError(this.$title, true, er[prop]);
        }
        else if (prop == 'content') {
          Helpers.showError(this.$content, true, er[prop]);
        }
      }
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
      Helpers.removeError(this.$noteForm);
      Notes.create({
        title: this.$title.val(),
        content: this.$content.val()
      }, {
        // wait: true - validates data, saves it and only then triggers the "Add" event,
        // so i don't need to check in the addOne method whether the passedModel is valid
        wait: true,
        view: this,
        hookError: function(error) {
          this.noteError(error);
        }
      });
    }

  });

  var App = new AppView;

});