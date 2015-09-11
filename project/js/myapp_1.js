$(function() {

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
      'click [data-remove-note]': 'removeNote'
    },
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    removeNote: function() {
      this.model.destroy();
      return false;
    }
  });

  var AppView = Backbone.View.extend({

    el: '#notes-wrap',
    events: {
      'click #new-note': 'createNote'
    },
    initialize: function() {
      console.log(1);
      this.notesList = this.$('[data-notes-list]');
      this.$noteForm = this.$('[data-note-form]');
      this.$title = this.$noteForm.find('[data-note-title]');
      this.$content = this.$noteForm.find('[data-note-content]');
      this.listenTo(Notes, 'add', this.addOne);

      Notes.fetch();
    },
    render: function() {
      console.log(2);
    },
    addOne: function(passedModel) {
      console.log(3);
      var view = new NoteView({model: passedModel});
      this.notesList.append(view.render().el);
    },
    createNote: function(bb) {
      var validation = this.newNoteValidation();
      if (validation) {
        Notes.create(validation);
      }
    },
    newNoteValidation: function() {
      var note = {
            title: undefined,
            content: undefined
          },
          $title = this.$title,
          $titleBlock = $title.closest('.form-group'),
          $content = this.$content,
          $contentBlock = $content.closest('.form-group');

      if ($title.val().length > 3) {
        note.title = $title.val();
        $titleBlock.removeClass('has-error');
      }
      else {
        $titleBlock.addClass('has-error');
      }

      if ($content.val().length) {
        note.content = $content.val();
        $contentBlock.removeClass('has-error');
      }
      else {
        $contentBlock.addClass('has-error');
      }
      return this.validateData(note);
    },
    validateData: function(obj) {
      var prop;
      for (prop in obj) {
        if (typeof(obj[prop]) == 'undefined') {
          return false;
        }
      }
      return obj;
    }

  });

  var App = new AppView;

});