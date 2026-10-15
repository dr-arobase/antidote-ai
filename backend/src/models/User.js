const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis.'],
      trim: true,
      minlength: [2, 'Le nom doit avoir au moins 2 caractères.'],
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères.'],
    },
    email: {
      type: String,
      required: [true, "L'email est requis."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "L'email n'est pas valide."],
    },
    // Le mot de passe est exclu des requêtes par défaut (select: false)
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis.'],
      minlength: [8, 'Le mot de passe doit avoir au moins 8 caractères.'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
