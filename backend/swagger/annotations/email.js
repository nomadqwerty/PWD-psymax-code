/**
 * @swagger
 * paths:
 *   /email/send:
 *     post:
 *       summary: Send Email
 *       tags:
 *          - Email
 *       security:
 *          - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                  KlientId:
 *                     type: string
 *                  Briefvorlage:
 *                     type: string
 *                  Betreff:
 *                     type: string
 *                  Inhalt:
 *                     type: string
 *                  attachments:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *                     description: upload files using the "Add item" button
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 */
