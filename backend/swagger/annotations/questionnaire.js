/**
 * @swagger
 * tags:
 *   name: Questionnaire
 *   description: Endpoints for managing questionnaires
 */

/**
 * @swagger
 * /questionnaires:
 *   get:
 *     summary: Get all questionnaires
 *     tags: [Questionnaire]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 questionnaires:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Questionnaire'
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Daten nicht gefunden
 */

/**
 * @swagger
 * /questionnaires/{id}:
 *   get:
 *     summary: Get a questionnaire by ID
 *     tags: [Questionnaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the questionnaire
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 questionnaire:
 *                   $ref: '#/definitions/Questionnaire'
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Daten nicht gefunden
 */

/**
 * @swagger
 * /questionnaires:
 *   post:
 *     summary: Create a new questionnaire
 *     tags: [Questionnaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateQuestionnaire'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 questionnaire:
 *                   $ref: '#/definitions/Questionnaire'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /questionnaires/{id}:
 *   put:
 *     summary: Update a questionnaire by ID
 *     tags: [Questionnaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the questionnaire
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateQuestionnaire'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Questionnaire updated
 *                 questionnaire:
 *                   $ref: '#/definitions/Questionnaire'
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Questionnaire created!
 *                 questionnaire:
 *                   $ref: '#/definitions/Questionnaire'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /questionnaires:
 *   put:
 *     summary: Update multiple questionnaires
 *     tags: [Questionnaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionnaires:
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/CreateQuestionnaire'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Questionnaires updated
 *                 questionnaires:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Questionnaire'
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Daten nicht gefunden
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /questionnaires/{id}:
 *   delete:
 *     summary: Delete a questionnaire by ID
 *     tags: [Questionnaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the questionnaire
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Daten gelöscht
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Daten nicht gefunden
 */

/**
 * @swagger
 * /questionnaire-responses:
 *   get:
 *     summary: Get all questionnaire responses
 *     tags: [Questionnaire]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 responses:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/QuestionnaireResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /questionnaire-responses/{accessCode}:
 *   get:
 *     summary: Get a questionnaire response by access code
 *     tags: [Questionnaire]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 responses:
 *                  $ref: '#/definitions/QuestionnaireResponse'
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Daten nicht gefunden
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /questionnaire-responses:
 *   post:
 *     summary: Save a questionnaire response
 *     tags: [Questionnaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateQuestionnaireResponse'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Response saved!
 *                 response:
 *                   $ref: '#/definitions/QuestionnaireResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * definitions:
 *   Questionnaire:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: '5f4a1e2b248eab001c394376'
 *       userId:
 *         type: string
 *         example: '5f4a1e2b248eab001c394377'
 *       name:
 *         type: string
 *         example: 'Klient Satisfaction Survey'
 *       questions:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             question:
 *               type: string
 *               example: 'Der Vortrag behandelte das Themengebiet vollständig.'
 *             isRecoded:
 *               type: boolean
 *               example: false
 *             isRating:
 *               type: boolean
 *               example: true
 *             fragetext:
 *               type: string
 *               example: 'Möchten Sie uns noch etwas mitteilen?'
 *       randomizeQuestions:
 *         type: boolean
 *         example: false
 *       scale:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: 'nie'
 *             value:
 *               type: number
 *               example: 1
 *       fillingFrequency:
 *         type: string
 *         enum:
 *           - 'daily'
 *           - 'weekly'
 *           - 'biWeekly'
 *           - 'monthly'
 *           - 'quarterly'
 *         example: 'monthly'
 *       allocatedTo:
 *         type: string
 *         enum:
 *           - 'allClients'
 *           - 'newClients'
 *           - 'manual'
 *           - 'unallocated'
 *         example: 'unallocated'
 *       clientsAssigned:
 *         type: array
 *         items:
 *           type: string
 *           example: '5f4a1e2b248eab001c394378'
 *       creationDate:
 *         type: string
 *         format: date-time
 *         example: '2022-01-01T12:00:00Z'
 *   CreateQuestionnaire:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: 'Klient Satisfaction Survey'
 *       questions:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             question:
 *               type: string
 *               example: 'How satisfied are you with your work environment?'
 *             isRecoded:
 *               type: boolean
 *               example: false
 *             isRating:
 *               type: boolean
 *               example: true
 *             fragetext:
 *               type: string
 *               example: 'Möchten Sie uns noch etwas mitteilen?'
 *       randomizeQuestions:
 *         type: boolean
 *         example: false
 *       scale:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: 'nie'
 *             value:
 *               type: number
 *               example: 1
 *
 *   QuestionnaireResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: '5f4a1e2b248eab001c394379'
 *       questionnaire:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             example: '5f4a1e2b248eab001c39437a'
 *           name:
 *             type: string
 *             example: 'Klient Satisfaction Survey'
 *           creationDate:
 *             type: string
 *             format: date-time
 *             example: '2022-01-01T12:00:00Z'
 *       klient:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             example: '5f4a1e2b248eab001c39437b'
 *           Vorname:
 *             type: string
 *             example: 'John'
 *           Nachname:
 *             type: string
 *             example: 'Doe'
 *           Chiffre:
 *             type: string
 *             example: 'ABC123'
 *       user:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             example: '5f4a1e2b248eab001c39437c'
 *       accessCode:
 *         type: string
 *         example: 'ABC123'
 *       isCompleted:
 *         type: boolean
 *         example: true
 *       responses:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             questionId:
 *               type: number
 *               example: 1
 *             answer:
 *               type: string
 *               example: 'Satisfied'
 *       dateSubmitted:
 *         type: string
 *         format: date-time
 *         example: '2022-02-01T14:30:00Z'
 *   CreateQuestionnaireResponse:
 *     type: object
 *     properties:
 *       questionnaire:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437a'
 *       klient:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437b'
 *       user:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437c'
 *       accessCode:
 *         type: string
 *         example: 'ABC-123-DEF'
 *       responses:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             questionId:
 *               type: number
 *               example: 1
 *             answer:
 *               type: string
 *               example: 'Satisfied'
 */
