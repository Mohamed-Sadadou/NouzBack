const mongoose = require("mongoose");
const UtilisateurSchema = new mongoose.Schema({
	id_user: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	mdp: {
		type: String,
		required: true,
	},
	nom: {
		type: String,
		required: true,
	},
	prenom: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Utilisateurs", UtilisateurSchema);
