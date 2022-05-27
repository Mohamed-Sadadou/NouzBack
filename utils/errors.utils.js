module.exports.signUpErrors = (err) => {
    let errors = { IDF: '', MDP: '' }

    if (err.message.includes('idf')) errors.IDF = 'IDF Incorrect ou deja pris';
    if (err.message.includes('mdp')) errors.IDF = 'mot de passe  Incorrect ou deja pris';

    return errors
}

module.exports.creeErr = (err) => {
    console.log('je suis dans utils')
    let errors = { IDF: '', MDP: '', email: '' }
    if (err.message.includes('idf')) {
        if (err.message.includes('duplicate key')) { errors.IDF = 'IDF Deja existant'; }
        errors.IDF = 'IDF Incorrect ';
    }
    if (err.message.includes('mdp')){ errors.MDP = 'mot de passe Incorrect';}
    if (err.message.includes('email')) {console.log("mailincoorect");errors.email = 'Email Incorrect';}

    if(err.code == 11000) errors.IDF='IDF deja existant'

    return errors;

}