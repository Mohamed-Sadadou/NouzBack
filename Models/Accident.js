const mongoose = require("mongoose");
const Accident = new mongoose.Schema({
	id_Accident: {
		type: Number,
		required: true,
		unique: true,
		trim: true,
	},
	date: {
		type: String,
		required: true,
	},
	heure: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	cause: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	etatRoute: {
		type: String,
		required: true,
	},
	climat: {
		type: String,
		required: true,
	},
	conducteurs: {
		type: [
			{
				type: {
					immatricule: String,
					nom: String,
					Prenom: String,
					genre: String,
					numTel: String,
				},
			},
		],
	},
	passagers: {
		type: [
			{
				type: {
					nom: String,
					Prenom: String,
					genre: String,
					numTel: String,
				},
			},
		],
	},
	pietons: {
		type: [
			{
				type: {
					nom: String,
					Prenom: String,
					genre: String,
					numTel: String,
				},
			},
		],
	},
});

module.exports = mongoose.model("Accident", Accident);
