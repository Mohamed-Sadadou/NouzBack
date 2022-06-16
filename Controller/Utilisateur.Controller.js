const UserModel = require("../Models/Utilisateur.Model");
const Accident = require("../Models/Accident");
//**************************************************/
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const maxAge = 24 * 60 * 60 * 100;
const CODE = "Token_secret_Accident";
function createdate() {
	var date = Date.now();
	var d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;
	return [year, month, day].join("");
}
const CodifieIdUser = () => {
	return ["U", createdate(), Math.floor(Math.random() * 1000000)].join("");
};
const CodifieIdAccident = () => {
	return Math.floor(Math.random() * 1000000);
};
//***************** creer un jeton adapté ************************************************************************************/
const createToken = (id) => {
	return jwt.sign({ userId: id }, CODE, { expiresIn: maxAge });
};
module.exports.CreeCompte = async (req, res) => {
	console.log("on affiche le req  ", req.body);
	const id_user = CodifieIdUser();
	const { mdp, nom, prenom, type } = req.body;
	console.log("id_user : ", id_user, " nomUtilisateur : ", nom, " mdp : ", mdp);

	bcrypt
		.hash(mdp, 10)
		.then((hash) => {
			console.log("le mdp: ", hash);
			const user = new UserModel({
				id_user,
				mdp: hash,
				nom,
				prenom,
				type,
			});
			user
				.save()
				.then(async () => {
					console.log("utilisateur creer on le connect !! ", id_user);
					await UserModel.findOne({ id_user: id_user })
						.then((user) => {
							console.log("utilisateur : !!", user);
							if (!user) {
								return res
									.status(201)
									.json({ error: "Utilisateur non trouvé !" });
							}
							bcrypt
								.compare(req.body.mdp, user.mdp)
								.then((valid) => {
									if (!valid) {
										return res
											.status(202)
											.json({ error: "Mot de passe incorrect !" });
									}
									const token = createToken(user._id);
									console.log("CONNECTER");
									res.cookie("jwt", token, { httpOnly: true, maxAge });
									res.cookie("id_user", id_user.replace(/ /g, ""), {
										httpOnly: true,
										maxAge,
									});
									res.cookie("nom", user.nom, {
										httpOnly: true,
										maxAge,
									});
									res.cookie("prenom", user.prenom, { httpOnly: true, maxAge });
									res.cookie("type", user.type, {
										httpOnly: true,
										maxAge,
									});
									console.log("les cookies sont fait");
									res.status(200).json({
										user: user._id,
										id_user: req.body.id_user,
									});
								})
								.catch((error) => res.status(500).json({ error }));
						})
						.catch((error) => res.status(500).json({ error }));
				})
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
module.exports.SeConnecter = async function SeConnecter(req, res) {
	await UserModel.findOne({ id_user: req.body.id_user })
		.then((user) => {
			if (!user) {
				return res.status(201).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.mdp, user.mdp)
				.then((valid) => {
					if (!valid) {
						return res.status(202).json({ error: "Mot de passe incorrect !" });
					}
					const token = createToken(user._id);
					console.log("CONNECTER");
					console.log("nos cookies : ", token, "--", req.body.id_user, "---");
					res.cookie("jwt", token, { httpOnly: true, maxAge });
					res.cookie("id_user", req.body.id_user.replace(/ /g, ""), {
						httpOnly: true,
						maxAge,
					});
					res.cookie("nom", user.nom, { httpOnly: true, maxAge });
					res.cookie("prenom", user.prenom, { httpOnly: true, maxAge });
					res.cookie("type", user.type, { httpOnly: true, maxAge });
					res.status(200).json({
						user: user._id,
						id_user: req.body.id_user,
						nom: user.nom,
						prenom: user.prenom,
						type: user.type,
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
module.exports.Deconnection = (req, res) => {
	console.log("ON va se deconnecter");
	res.cookie("jwt", "", { maxAge: 1 });
	res.cookie("id_user", "", { maxAge: 1 });
	res.cookie("nom", "", { maxAge: 1 });
	res.cookie("prenom", "", { maxAge: 1 });
	res.cookie("type", "", { maxAge: 1 });
	res.status(200).json("/Deconnected");
};
module.exports.RecupDonneesUser = (req, res, next) => {
	const token = req.cookies.jwt;
	console.log("On recupe les données !!!");
	console.log("on chek ce token :", token);
	if (token) {
		jwt.verify(token, CODE, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				res.cookies("jwt", "", { maxAge: 1 });
				console.log("on va retourné 201");
				next();
				res.status(201).json();
			} else {
				console.log(
					"on va send la request et les context !!! " +
						"id:" +
						decodedToken.userId
				);
				res.status(200).json({
					id: decodedToken.userId,
					id_user: req.cookies.id_user,
					nom: req.cookies.nom,
					prenom: req.cookies.prenom,
					type: req.cookies.type,
				});
			}
		});
	} else {
		console.log("mauvais token");
		res.status(201).json({ error: "Utilisateur Non connecté !" });
	}
};
module.exports.getAllUsers = async (req, res) => {
	const users = await UserModel.find().select("-mdp");
	res.status(200).json(users);
};
module.exports.getUser = (req, res) => {
	const token = req.cookies.jwt;
	console.log("on chek ce token :", token);
	if (token) {
		jwt.verify(token, CODE, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				res.cookies("jwt", "", { maxAge: 1 });
				next();
			} else {
				console.log("on chek ce token :", decodedToken.userId);
				UserModel.findById(decodedToken.userId, (err, docs) => {
					if (!err) res.status(200).json(docs);
					else console.log(" on a un souci : " + err);
				}).select("-mdp");
			}
		});
	} else {
		console.log("mauvais token");
		res.locals.user = null;
		return res.status(404).json({ error: "ta pas le droit frere" });
	}
};
module.exports.getUser2 = (req, res) => {
	UserModel.find({ id_user: req.body.id_user }, (err, docs) => {
		if (!err) res.status(200).json(docs);
		else console.log(" on a un souci : " + err);
	}).select("-mdp");
};
module.exports.Modifi = async (req, res) => {
	const queryObj = {};
	queryObj[req.body.what] = req.body.val;
	console.log("on est la avec : ", queryObj);
	try {
		await UserModel.findOneAndUpdate(
			{ id_user: req.body.id_user },
			{ $set: queryObj },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)
			.then(() => {
				console.log("---- ok ----");
				return res.status(200).json({ message: "olk" });
			})
			.catch((err) => {
				console.log("yeeeeeeeeew");
			});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.Modifinom = async (req, res) => {
	try {
		await UserModel.findOneAndUpdate(
			{ id_user: req.body.id_user },
			{ $set: { nom: req.body.nom } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
			(err, docs) => {
				if (!err) {
					console.log("---- ok ----");
					return res.status(200).json(docs);
				} else {
					return res.status(500).send({ message: err });
				}
			}
		);
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.ModifiUserpassword = async (req, res) => {
	console.log(req.body.id_user);

	console.log("on fait le try de modifie password");
	const salt = await bcrypt.genSalt();
	req.body.mdp = await bcrypt.hash(req.body.mdp, salt);

	try {
		await UserModel.findOneAndUpdate(
			{ id_user: req.body.id_user },
			{ $set: { mdp: req.body.mdp } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
			(err, docs) => {
				if (!err) {
					console.log("ok");
					return res.status(200).json(docs);
				} else return res.status(500).send({ message: err });
			}
		);
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.ModifiUserprenom = async (req, res) => {
	try {
		await UserModel.findOneAndUpdate(
			{ id_user: req.body.id_user },
			{ $set: { prenom: req.body.prenom } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
			(err, docs) => {
				if (!err) {
					console.log("---- ok ----");
					return res.status(200).json(docs);
				} else {
					return res.status(500).send({ message: err });
				}
			}
		);
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.ModifiUsertype = async (req, res) => {
	try {
		await UserModel.findOneAndUpdate(
			{ id_user: req.body.id_user },
			{ $set: { type: req.body.type } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
			(err, docs) => {
				if (!err) {
					console.log("---- ok ----");
					return res.status(200).json(docs);
				} else {
					return res.status(500).send({ message: err });
				}
			}
		);
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.SupprimeUser = async (req, res) => {
	try {
		await UserModel.remove({ id_user: req.body.id_user }).exec();
		res.status(200).json({ message: "Suppression effectuer avec succes. " });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.AjoutAccident = async (req, res) => {
	console.log("on affiche le req  ", req.body);

	const {
		id,
		wilaya,
		voie,
		catr,
		surf,
		atm,
		intersec,
		date_acc,
		heure_acc,
		lat,
		long,
		pietons,
		conducteurs,
		passagers,
		vehicule,
	} = req.body;
	const acc = new Accident({
		id,
		wilaya,
		voie,
		catr,
		surf,
		atm,
		intersec,
		date_acc,
		heure_acc,
		lat,
		long,
		pietons,
		conducteurs,
		passagers,
		vehicule,
	});
	acc
		.save()
		.then(() => res.status(201).json({ message: "Accident créé !" }))
		.catch((error) => res.status(400).json({ error }));
};
module.exports.ModifiAccident = async (req, res) => {
	const queryObj = {};
	queryObj[req.body.what] = req.body.val;
	console.log("on est la avec : ", queryObj);
	try {
		await Accident.findOneAndUpdate(
			{ id: req.body.id },
			{ $set: queryObj },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)
			.then(() => {
				console.log("---- ok ----");
				return res.status(200).json({ message: "olk" });
			})
			.catch((err) => {
				console.log("yeeeeeeeeew");
			});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.Accident = async (req, res) => {
	Accident.find({ id: req.body.id }, (err, docs) => {
		if (!err) res.status(200).json(docs);
		else console.log(" on a un souci : " + err);
	});
};
module.exports.Accidents = async (req, res) => {
	const acc = await Accident.find();
	res.status(200).json(acc);
};
module.exports.AccidentF = async (req, res) => {
	const queryObj = {};
	queryObj[req.body.what] = req.body.val;
	Accident.find(queryObj, (err, docs) => {
		if (!err) res.status(200).json(docs);
		else console.log(" on a un souci : " + err);
	});
};
module.exports.AccidentF2 = async (req, res) => {
	const queryObj = req.body.queryObj;
	Accident.find(queryObj, (err, docs) => {
		if (!err) res.status(200).json(docs);
		else console.log("  on a un souci : " + err);
	});
};
module.exports.SuppAccident = async (req, res) => {
	try {
		await Accident.remove({ id: req.body.id }).exec();
		res.status(200).json({ message: "Suppression effectuer avec succes. " });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
/*
module.exports.statType = async (req, res) => {
	var resp = {
		type1: 0,
		type2: 0,
		type3: 0,
		type4: 0,
		type5: 0,
	};
	console.log("les types ", req.body.types);
	const queryObj = {};
	queryObj["type"] = req.body.types[0];
	Accident.find(queryObj, (err, docs) => {
		if (!err) {
			console.log(docs.length);
			resp.type1 = docs.length;
			console.log(resp);
			const queryObj1 = {};
			queryObj1["type"] = req.body.types[1];
			Accident.find(queryObj1, (err, docs) => {
				if (!err) {
					console.log(docs.length);
					resp.type2 = docs.length;
					console.log(resp);
					const queryObj2 = {};
					queryObj2["type"] = req.body.types[2];
					Accident.find(queryObj2, (err, docs) => {
						if (!err) {
							console.log(docs.length);
							resp.type2 = docs.length;
							console.log(resp);
							const queryObj3 = {};
							queryObj3["type"] = req.body.types[3];
							Accident.find(queryObj3, (err, docs) => {
								if (!err) {
									console.log(docs.length);
									resp.type3 = docs.length;
									console.log(resp);
									const queryObj4 = {};
									queryObj4["type"] = req.body.types[4];
									Accident.find(queryObj4, (err, docs) => {
										if (!err) {
											console.log(docs.length);
											resp.type4 = docs.length;
											console.log(resp);
											console.log("la response : ", resp);
											res.status(200).json(resp);
										} else console.log("  on a un souci : " + err);
									});
								} else console.log("  on a un souci : " + err);
							});
						} else console.log("  on a un souci : " + err);
					});
				} else console.log("  on a un souci : " + err);
			});
		} else console.log("  on a un souci : " + err);
	});
};
module.exports.statCause = async (req, res) => {
	var resp = {
		cause1: 0,
		cause2: 0,
		cause3: 0,
		cause4: 0,
		cause5: 0,
	};
	console.log("les causes ", req.body.causes);
	const queryObj = {};
	queryObj["cause"] = req.body.causes[0];
	Accident.find(queryObj, (err, docs) => {
		if (!err) {
			console.log(docs.length);
			resp.cause1 = docs.length;
			console.log(resp);
			const queryObj1 = {};
			queryObj1["cause"] = req.body.causes[1];
			Accident.find(queryObj1, (err, docs) => {
				if (!err) {
					console.log(docs.length);
					resp.cause2 = docs.length;
					console.log(resp);
					const queryObj2 = {};
					queryObj2["cause"] = req.body.causes[2];
					Accident.find(queryObj2, (err, docs) => {
						if (!err) {
							console.log(docs.length);
							resp.cause2 = docs.length;
							console.log(resp);
							const queryObj3 = {};
							queryObj3["cause"] = req.body.causes[3];
							Accident.find(queryObj3, (err, docs) => {
								if (!err) {
									console.log(docs.length);
									resp.cause3 = docs.length;
									console.log(resp);
									const queryObj4 = {};
									queryObj4["cause"] = req.body.causes[4];
									Accident.find(queryObj4, (err, docs) => {
										if (!err) {
											console.log(docs.length);
											resp.cause4 = docs.length;
											console.log(resp);
											console.log("la response : ", resp);
											res.status(200).json(resp);
										} else console.log("  on a un souci : " + err);
									});
								} else console.log("  on a un souci : " + err);
							});
						} else console.log("  on a un souci : " + err);
					});
				} else console.log("  on a un souci : " + err);
			});
		} else console.log("  on a un souci : " + err);
	});
};
module.exports.statdate = async (req, res) => {
	const acc = await Accident.find();
	var resp = {
		janvier: 0,
		mars: 0,
		mai: 0,
		juillet: 0,
		septembre: 0,
		novembre: 0,
	};
	await acc.forEach((a) => {
		console.log("iteration");
		if (a.date.substring(5, 7) === "01") {
			resp.janvier++;
		}
		if (a.date.substring(5, 7) === "03") {
			resp.mars++;
		}
		if (a.date.substring(5, 7) === "05") {
			resp.mai++;
		}
		if (a.date.substring(5, 7) === "07") {
			resp.juillet++;
		}
		if (a.date.substring(5, 7) === "09") {
			resp.septembre++;
		}
		if (a.date.substring(5, 7) === "11") {
			resp.novembre++;
		}
	});
	console.log(resp);
	res.status(200).json(resp);
};
*/