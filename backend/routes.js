const express = require('express');
const authController = require('./controllers/auth');
const begruendungstexteController = require('./controllers/begruendungstexte');
const userController = require('./controllers/user');
const klientController = require('./controllers/klient');
const arztController = require('./controllers/arzt');
const templatesController = require('./controllers/templates');
const briefController = require('./controllers/brief');
const leistungenController = require('./controllers/leistungen');
const questionnaireController = require('./controllers/questionnaire');
const paymentsController = require('./controllers/payment');

const router = express.Router();

/* Auth */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.delete('/logout', authController.logout);
router.get('/user/get', authController.get);
router.post('/user/save', authController.save);
router.post('/user/twofactor', authController.TwoFaAuth);
router.post('/user/recoveryphrase', authController.validateRecoveryPhrase);
router.post('/user/resetpassword', authController.resetPassword);
router.post('/user/verify', authController.verifySecret);
router.get('/user/text', authController.getSecret);
router.get('/user/text/email', authController.emailSecret);
router.get('/user/twofa/status/:id', authController.getTwoFaStatus);

/* Begruendungstexte */
router.get('/begruendungstexte/getAll', begruendungstexteController.getAll);
router.post('/begruendungstexte/save', begruendungstexteController.save);
router.put('/begruendungstexte/update', begruendungstexteController.update);
router.delete(
  '/begruendungstexte/remove/:id',
  begruendungstexteController.remove
);

/* Klient */
router.get('/klient/getActive', klientController.getActive);
router.get('/klient/getArchived', klientController.getArchived);
router.get('/klient/getNew', klientController.getNew);
router.get('/klient/getAll', klientController.getAll);
router.post('/klient/save', klientController.save);
router.get('/klient/getById/:id', klientController.getById);
router.put('/klient/update', klientController.update);
router.delete('/klient/remove/:id', klientController.remove);
router.post('/klient/getChiffre', klientController.getChiffre);
router.put('/klient/changeStatus', klientController.changeStatus);
router.put(
  '/klient/excludeInQuestionnaire',
  klientController.updateExcludeInQuestionnaire
);

/* Arzt */
router.get('/arzt/getAll', arztController.getAll);

/* Brief */
router.post('/brief/save', briefController.save);

/* Leistungen */
router.get(
  '/leistungen/getAllAbrechnung',
  leistungenController.getAllAbrechnung
);
router.post('/leistungen/saveAbrechnung', leistungenController.saveAbrechnung);
router.get(
  '/leistungen/getAbrechnungById/:id',
  leistungenController.getAbrechnungById
);
router.put(
  '/leistungen/updateAbrechnung',
  leistungenController.updateAbrechnung
);
router.delete(
  '/leistungen/abrechnungRemove/:id',
  leistungenController.abrechnungRemove
);

router.get(
  '/leistungen/getAllTerminplanung',
  leistungenController.getAllTerminplanung
);
router.post(
  '/leistungen/saveTerminplanung',
  leistungenController.saveTerminplanung
);
router.get(
  '/leistungen/getTerminplanungById/:id',
  leistungenController.getTerminplanungById
);
router.put(
  '/leistungen/updateTerminplanung',
  leistungenController.updateTerminplanung
);
router.delete(
  '/leistungen/terminplanungRemove/:id',
  leistungenController.terminplanungRemove
);

router.get(
  '/leistungen/getGlobalPointValue',
  leistungenController.getGlobalPointValue
);
router.put(
  '/leistungen/updateGlobalPointValue',
  leistungenController.updateGlobalPointValue
);

/* Templates */
router.get('/templates/getBriefAll', templatesController.getBriefAll);

/* Questionnaire */
router
  .route('/questionnaires')
  .get(questionnaireController.getAll)
  .post(questionnaireController.save);

// updating many questionnaires assignment options
router.put('/questionnaires/updateMany', questionnaireController.updateMany);

router
  .route('/questionnaires/:id')
  .get(questionnaireController.getOne)
  .put(questionnaireController.update)
  .delete(questionnaireController.remove);

/* QuestionnaireResponse */
router
  .route('/questionnaire-responses')
  .get(questionnaireController.getAllResponses)
  .put(questionnaireController.saveResponse);

router.get(
  '/questionnaire-responses/:accessCode',
  questionnaireController.getOneResponse
);

router.post(
  '/questionnaire-responses/download',
  questionnaireController.downloadResponsePDFs
);

/* Payments */
router.post('/subscriptions', paymentsController.makeSubscription);
router.get('/subscriptions/:userId', paymentsController.getSubscriptionByUser);
router.post(
  '/subscriptions/:userId/cancel',
  paymentsController.cancelSubscription
);
router.get(
  '/subscriptions/:userId/invoices',
  paymentsController.getInvoicesByUser
);
router.put(
  '/subscriptions/:userId/method',
  paymentsController.changePaymentMethod
);

/* Invoices */
router.post(
  '/invoices/:id/download-receipt',
  paymentsController.downloadReceiptPDF
);
router.post(
  '/invoices/download-summary',
  paymentsController.downloadSummaryReceiptPDFs
);

/* User */
router.put('/users/:id/extend-trial', userController.extendTrialPhase);

/* Webhooks */
router.post('/webhooks/checkout', paymentsController.webhookHandler);

module.exports = router;
