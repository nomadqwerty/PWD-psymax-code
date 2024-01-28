const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templatesAppSchema = new Schema({
  templateId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const TemplatesSchema = mongoose.model('templates', templatesAppSchema);

module.exports = { TemplatesSchema };
