/**
 * @swagger
 * paths:
 *   /vault/server:
 *     get:
 *       summary: Get server vault for encryption process
 *       tags:
 *         - Vaults
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
 *   /vault/user/:userId:
 *     get:
 *       summary: Get user vault by user id
 *       tags:
 *         - Vaults
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
 *   /vault/user:
 *     post:
 *       summary: create new user vault
 *       tags:
 *         - Vaults
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
 *   /vault/user/update:
 *     post:
 *       summary: update user update-vault
 *       tags:
 *         - Vaults
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
 *   /vault/user/update/main:
 *     post:
 *       summary: update user main vault
 *       tags:
 *         - Vaults
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
 *   /vault/user/update/archive:
 *     post:
 *       summary: update user archive vault
 *       tags:
 *         - Vaults
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
 *   /vault/user/status:
 *     get:
 *       summary: Get user vault status
 *       tags:
 *         - Vaults
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