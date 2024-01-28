/**
 * @swagger
 * paths:
 *   /leistungen/getAllAbrechnung:
 *     get:
 *       summary: Get all leistungen für die Abrechnung
 *       tags:
 *         - Leistungen
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
 *   /leistungen/saveAbrechnung:
 *     post:
 *       summary: Save leistungen für die Abrechnung
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Leistung:
 *                   type: string
 *                   required: true
 *                 GopNr:
 *                   type: string
 *                   required: true
 *                 Punktwert:
 *                   type: number
 *                   required: true
 *                 Leistungsbeschreibung:
 *                   type: string
 *                   required: true
 *                 Standardanzahl:
 *                   type: number
 *                   required: true
 *                 Standardfaktor:
 *                   type: number
 *                   required: true
 *                 Betrag:
 *                   type: number
 *                   required: true
 *                 ManuellerBetrag:
 *                   type: number
 *                   required: true
 *                 Umsatzsteuerwahl:
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
 *   /leistungen/getAbrechnungById/{id}:
 *     get:
 *       summary: Get Abrechnung leistungen by id (For edit)
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the leistungen
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
 *   /leistungen/updateAbrechnung:
 *     put:
 *       summary: Update Abrechnung leistungen
 *       tags:
 *         - Leistungen
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
 *                 Leistung:
 *                   type: string
 *                   required: true
 *                 GopNr:
 *                   type: string
 *                   required: true
 *                 Punktwert:
 *                   type: number
 *                   required: true
 *                 Leistungsbeschreibung:
 *                   type: string
 *                   required: true
 *                 Standardanzahl:
 *                   type: number
 *                   required: true
 *                 Standardfaktor:
 *                   type: number
 *                   required: true
 *                 Betrag:
 *                   type: number
 *                   required: true
 *                 ManuellerBetrag:
 *                   type: number
 *                   required: true
 *                 Umsatzsteuerwahl:
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
 *   /leistungen/abrechnungRemove/{id}:
 *     delete:
 *       summary: Delete Abrechnung leistungen
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the leistungen to be deleted
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
 *   /leistungen/getAllTerminplanung:
 *     get:
 *       summary: Get all leistungen für die Terminplanung
 *       tags:
 *         - Leistungen
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
 *   /leistungen/saveTerminplanung:
 *     post:
 *       summary: Save leistungen für die Terminplanung
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Leistung:
 *                   type: string
 *                   required: true
 *                 Dauer:
 *                   type: string
 *                   required: true
 *                 Kosten:
 *                   type: number
 *                   required: true
 *                 Beschreibung:
 *                   type: string
 *                   required: true
 *                 Umsatzsteuerwahl:
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
 *   /leistungen/getTerminplanungById/{id}:
 *     get:
 *       summary: Get Terminplanung leistungen by id (For edit)
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the leistungen
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
 *   /leistungen/updateTerminplanung:
 *     put:
 *       summary: Update Terminplanung leistungen
 *       tags:
 *         - Leistungen
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
 *                 Leistung:
 *                   type: string
 *                   required: true
 *                 Dauer:
 *                   type: string
 *                   required: true
 *                 Kosten:
 *                   type: number
 *                   required: true
 *                 Beschreibung:
 *                   type: string
 *                   required: true
 *                 Umsatzsteuerwahl:
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
 *   /leistungen/terminplanungRemove/{id}:
 *     delete:
 *       summary: Delete Terminplanung leistungen
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the leistungen to be deleted
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
 *   /leistungen/getGlobalPointValue:
 *     get:
 *       summary: Get Globaler Punktwert value
 *       tags:
 *         - Leistungen
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
 *   /leistungen/updateGlobalPointValue:
 *     put:
 *       summary: Update Globaler Punktwert value
 *       tags:
 *         - Leistungen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 value:
 *                   type: number
 *                   required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 */
