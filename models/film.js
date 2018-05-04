var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var filmSchema = new mongoose.Schema({
  filmTitle: { type: String, required: [true, 'A film title is required.'],
    unique: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: function(n) {
        return n.length >= 2;
      },
    }
  },

  filmSynopsis: String
});

var film = mongoose.model('film', filmSchema);
filmSchema.plugin(uniqueValidator);

module.exports = film;
