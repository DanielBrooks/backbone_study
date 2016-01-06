var Validation = {
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
    if (!this.isObjEmpty(obj)) {
      obj.validationError = true;
    }
    else {
      obj.validationError = false;
    }
    return obj;
  },
  isObjEmpty: function(obj) {
    var prop;
    for(prop in obj) {
      return false;
    }
    return true;
  }
}

module.exports = Validation;