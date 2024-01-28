/**
 * @swagger
 * paths:
 *   /brief/save:
 *     post:
 *       summary: Save Brief History
 *       tags:
 *         - Brief
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
 *                   description: Selected klient or doctor's id.
 *                   required: true
 *                 Templete:
 *                   type: string
 *                   description: The template id for the brief.
 *                 Betreff:
 *                   type: string
 *                   description: The subject of the brief.
 *                   required: true
 *                 Inhalt:
 *                   type: string
 *                   description: The content of the brief in HTML format.
 *                   required: true
 *                 Unterschriftsfeld1:
 *                   type: string
 *                   description: The content of the first signature field.
 *                   required: true
 *                 Unterschriftsfeld2:
 *                   type: string
 *                   description: The content of the second signature field.
 *                   required: true
 *                 OptionSelected:
 *                   type: number
 *                   description: The selected option. 1 - download pdf, 2 - Email, 3 - Download and Email
 *                   required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 */
