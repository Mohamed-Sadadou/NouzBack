const mongoose = require("mongoose");
const Accident = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	wilaya: {
		type: String,
		required: true,
	},
	voie: {
		type: String,
		required: true,
	},
	catr: {
		type: String,
		required: true,
	},
	surf: {
		type: String,
		required: true,
	},
	atm: {
		type: String,
		required: true,
	},
	intersec: {
		type: String,
		required: true,
	},
	date_acc: {
		type: String,
		required: true,
	},
	heure_acc: {
		type: String,
		required: true,
	},
	lat: {
		type: Number,
		required: true,
	},
	long: {
		type: Number,
		required: true,
	},
	pietons: {
		type: [
			{
				type: {
					nom: String,
					prenom: String,
					date_naiss: String,
					sexe: String,
					trajet: String,
					grav: String,
				},
			},
		],
	},
	conducteurs: {
		type: [
			{
				type: {
					nom: String,
					prenom: String,
					date_naiss: String,
					sexe: String,
					trajet: String,
					grav: String,
				},
			},
		],
	},
	passagers: {
		type: [
			{
				type: {
					nom: String,
					prenom: String,
					date_naiss: String,
					sexe: String,
					trajet: String,
					grav: String,
				},
			},
		],
	},
	vehicule: {
		type: [
			{
				type: {
					catv: String,
					immatriculation: String,
					choc: String,
					motor: String,
				},
			},
		],
	},
});

module.exports = mongoose.model("Accident", Accident);
