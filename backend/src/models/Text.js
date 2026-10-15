const mongoose = require('mongoose');

// Sous-schéma pour chaque erreur détectée
const ErrorSchema = new mongoose.Schema(
  {
    offset: { type: Number, required: true },
    length: { type: Number, required: true },
    message: { type: String, required: true },
    shortMessage: String,
    type: {
      type: String,
      enum: ['spelling', 'grammar', 'style', 'punctuation', 'other'],
      default: 'other',
    },
    suggestions: [String],
    ruleId: String,
  },
  { _id: false }
);

const TextSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      maxlength: 100,
    },
    originalText: {
      type: String,
      required: true,
      maxlength: [20000, 'Le texte ne peut pas dépasser 20 000 caractères.'],
    },
    correctedText: {
      type: String,
      maxlength: [20000, 'Le texte ne peut pas dépasser 20 000 caractères.'],
    },
    language: { type: String, default: 'auto' },
    detectedLanguage: String,
    errorCount: { type: Number, default: 0 },
    errors: [ErrorSchema],
  },
  {
    timestamps: true,
  }
);

// Génère automatiquement un titre à partir des premiers mots du texte
TextSchema.pre('save', function (next) {
  if (!this.title && this.originalText) {
    this.title =
      this.originalText.slice(0, 60) +
      (this.originalText.length > 60 ? '…' : '');
  }
  next();
});

module.exports = mongoose.model('Text', TextSchema);
