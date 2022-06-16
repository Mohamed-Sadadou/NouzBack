const router = require("express").Router();
//*********************************************************************************/
const Util = require("../Controller/Utilisateur.Controller");
const Chek = require("../middleware/auth.middleware");
//*********************************************************************************/
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
  //U20220527778509
  //U20220527259083
//************************************* La creation des Comptes *******************************************************************************/
//------------- creer compte client ---------------------------------------------------
router.post("/CreeCompte", Util.CreeCompte);
//************************************* Les fonctionnalite de base de connection **************************************************************/
//------------- pour se connecter -----------------------------------------------------
router.post("/Connection", Util.SeConnecter);
//------------- pour se deconnecter ---------------------------------------------------
router.get("/Deconnection", Util.Deconnection);
//---------------------------------------
router.post("/Modifi", Util.Modifi);
//---------------------------------------
router.get("/RecupDonneesUser", Util.RecupDonneesUser);
//------------- pour modifier nom d'utilisateur ---------------------------------------
router.post("/Compte/Modifiernom", Util.Modifinom);
//------------- pour modifier prenom d'utilisateur ------------------------------------
router.post("/Compte/Modifierprenom", Util.ModifiUserprenom);
//------------- pour modifier type d'utilisateur ------------------------------------
router.post("/Compte/Modifiertype", Util.ModifiUsertype);
//------------- pour modifier password ------------------------------------------------
router.post("/Compte/Modifierpassword", Util.ModifiUserpassword);
//***********************************************************************************************/
//***********************************************************************************************/
router.get("/GetAllUsers", Util.getAllUsers);
//************************************* pour renvoyer un seul utilisateur ***********************/
router.get("/Compte", Util.getUser);
// recherche
router.post("/User", Util.getUser2);
//*********************************************************************************************************************************************/
// ajout d'un accident
router.post("/AjoutAccident", Util.AjoutAccident);
// modifier un accident
router.post("/ModifiAccident", Util.ModifiAccident);
// afficher un accident
router.post("/Accident", Util.Accident);
// afficher tout les accident
router.get("/Accidents", Util.Accidents);
// rechercher un accident filtrer
router.post("/AccidentF", Util.AccidentF);
router.post("/AccidentF2", Util.AccidentF2);
// supprimer un accident filtrer
router.post("/SuppAccident", Util.SuppAccident);
/*
router.post("/statType",Util.statType);
router.post("/statCause",Util.statCause);
router.get("/statdate",Util.statdate);
*/
module.exports = router;
