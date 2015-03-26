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
    tagName: 'div',
    template: _.template($('#note-template').html()),
    events: {
      'click a': 'removeNote'
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
    }
  });

  var AppView = Backbone.View.extend({

    el: '#notes-wrap',
    events: {
      'click #new-note': 'createNote'
    },
    initialize: function() {
      console.log(1);

      this.listenTo(Notes, 'add', this.addOne);

      Notes.fetch();
    },
    render: function() {
      console.log(2);
    },
    addOne: function(passedModel) {
      console.log(3);
      var view = new NoteView({model: passedModel});
      this.$el.append(view.render().el);
    },
    createNote: function() {
      Notes.create({
        title: 'test title',
        content: 'some test content'
      });
    }

  });

  var App = new AppView;

});