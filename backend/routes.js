const express = require('express');
const authController = require('./controllers/auth');
const begruendungstexteController = require('./controllers/begruendungstexte');
const klientController = require('./controllers/klient');
const arztController = require('./controllers/arzt');
const templatesController = require('./controllers/templates');
const briefController = require('./controllers/brief');
const leistungenController = require('./controllers/leistungen');

const router = express.Router();

/* Auth */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.delete('/logout', authController.logout);
router.get('/user/get', authController.get);
router.post('/user/save', authController.save);

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

module.exports = router;
