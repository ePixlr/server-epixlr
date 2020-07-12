const mailjet = require ('node-mailjet')

const mailJetClient = mailjet.connect(
    process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY
);

module.exports = mailJetClient;