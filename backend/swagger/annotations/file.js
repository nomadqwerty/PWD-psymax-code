/**
 * @swagger
 * paths:
 *   /file/store:
 *     get:
 *       summary: store user file in folder.
 *       tags:
 *         - files
 *       security:
 *         - bearerAuth: []
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /file/create:
 *     get:
 *       summary: create file folder for user.
 *       tags:
 *         - files
 *       security:
 *         - bearerAuth: []
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /file/download:
 *     get:
 *       summary: get user vault and file for decryption and download.
 *       tags:
 *         - files
 *       security:
 *         - bearerAuth: []
 *       responses:
 *           200:
 *             description: Successful
 *           401:
 *             description: Unauthorized
 *           500:
 *             description: Internal server error
 */