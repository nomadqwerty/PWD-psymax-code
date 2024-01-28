/**
 * @swagger
 * paths:
 *   /begruendungstexte/getAll:
 *     get:
 *       summary: Get all justifications
 *       tags:
 *         - Begründungstexte
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: The page number for pagination
 *         - in: query
 *           name: pageSize
 *           schema:
 *             type: integer
 *             default: 10
 *           description: The number of items per page
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           description: Search term
 *       responses:
 *         200:
 *           description: Successful
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /begruendungstexte/save:
 *     post:
 *       summary: Save justification
 *       tags:
 *         - Begründungstexte
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   begruendungstexte:
 *                      type: string
 *                      required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /begruendungstexte/update:
 *     put:
 *       summary: Update justification description
 *       tags:
 *         - Begründungstexte
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                      type: string
 *                      required: true
 *                   begruendungstexte:
 *                      type: string
 *                      required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /begruendungstexte/remove/{id}:
 *     delete:
 *       summary: Delete justification
 *       tags:
 *         - Begründungstexte
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the justification to be deleted
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 */
