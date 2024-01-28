/**
 * @swagger
 * paths:
 *   /klient/getActive:
 *     get:
 *       summary: Get all Active klients
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: The page number for pagination (default is 1)
 *          - in: query
 *            name: pageSize
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: The number of items per page (default is 10)
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 *
 *   /klient/getArchived:
 *     get:
 *       summary: Get all Active klients
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: The page number for pagination (default is 1)
 *          - in: query
 *            name: pageSize
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: The number of items per page (default is 10)
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 *
 *   /klient/getNew:
 *     get:
 *       summary: Get all new klients
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: The page number for pagination (default is 1)
 *          - in: query
 *            name: pageSize
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: The number of items per page (default is 10)
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 *
 *   /klient/getAll:
 *     get:
 *       summary: Get all klients
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 *
 *   /klient/save:
 *     post:
 *       summary: Save klient
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   required: true
 *                 Chiffre:
 *                   type: string
 *                   required: true
 *                 Anrede:
 *                   type: string
 *                   required: true
 *                 Titel:
 *                   type: string
 *                   required: true
 *                 Firma:
 *                   type: string
 *                   required: true
 *                 Vorname:
 *                   type: string
 *                   required: true
 *                 Nachname:
 *                   type: string
 *                   required: true
 *                 Strasse_und_Hausnummer:
 *                   type: string
 *                   required: true
 *                 PLZ:
 *                   type: string
 *                   required: true
 *                 Ort:
 *                   type: string
 *                   required: true
 *                 Land:
 *                   type: string
 *                   required: true
 *                 Telefonnummer:
 *                   type: string
 *                   required: true
 *                 Diagnose:
 *                   type: array
 *                   required: true
 *                 Geburtsdatum:
 *                   type: string
 *                   required: true
 *                 ArztAnrede:
 *                   type: string
 *                   required: true
 *                 ArztTitel:
 *                   type: string
 *                   required: true
 *                 ArztEmail:
 *                   type: string
 *                   required: true
 *                 ArztVorname:
 *                   type: string
 *                   required: true
 *                 ArztNachname:
 *                   type: string
 *                   required: true
 *                 ArztStrasse_und_Hausnummer:
 *                   type: string
 *                   required: true
 *                 ArztPLZ:
 *                   type: string
 *                   required: true
 *                 ArztOrt:
 *                   type: string
 *                   required: true
 *                 ArztLand:
 *                   type: string
 *                   required: true
 *                 ArztTelefonnummer:
 *                   type: string
 *                   required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /klient/getById/{id}:
 *     get:
 *       summary: Get klient by id (For edit)
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the klient
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /klient/update:
 *     put:
 *       summary: Update klient
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   required: true
 *                 email:
 *                   type: string
 *                   required: true
 *                 Anrede:
 *                   type: string
 *                   required: true
 *                 Titel:
 *                   type: string
 *                 Firma:
 *                   type: string
 *                   required: true
 *                 Vorname:
 *                   type: string
 *                   required: true
 *                 Nachname:
 *                   type: string
 *                   required: true
 *                 Strasse_und_Hausnummer:
 *                   type: string
 *                   required: true
 *                 PLZ:
 *                   type: string
 *                   required: true
 *                 Ort:
 *                   type: string
 *                   required: true
 *                 Land:
 *                   type: string
 *                   required: true
 *                 Telefonnummer:
 *                   type: string
 *                   required: true
 *                 Diagnose:
 *                   type: array
 *                   required: true
 *                 Geburtsdatum:
 *                   type: string
 *                   required: true
 *                 ArztAnrede:
 *                   type: string
 *                   required: true
 *                 ArztTitel:
 *                   type: string
 *                 ArztEmail:
 *                   type: string
 *                   required: true
 *                 ArztVorname:
 *                   type: string
 *                   required: true
 *                 ArztNachname:
 *                   type: string
 *                   required: true
 *                 ArztStrasse_und_Hausnummer:
 *                   type: string
 *                   required: true
 *                 ArztPLZ:
 *                   type: string
 *                   required: true
 *                 ArztOrt:
 *                   type: string
 *                   required: true
 *                 ArztLand:
 *                   type: string
 *                   required: true
 *                 ArztTelefonnummer:
 *                   type: string
 *                   required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /klient/remove/{id}:
 *     delete:
 *       summary: Delete klient
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the klient to be deleted
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /klient/getChiffre:
 *     post:
 *       summary: Get Chiffre for a klient
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Vorname:
 *                   type: string
 *                   required: true
 *                 Nachname:
 *                   type: string
 *                   required: true
 *                 Geburtsdatum:
 *                   type: string
 *                   required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /klient/changeStatus:
 *     put:
 *       summary: Change status of klients
 *       tags:
 *         - Klient:innen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: string
 *                   required: true
 *                   description: Array of Klient IDs to update
 *                 status:
 *                   type: number
 *                   required: true
 *                   description: New status to set for the klients
 *       responses:
 *         200:
 *           description: Success
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal server error
 */
