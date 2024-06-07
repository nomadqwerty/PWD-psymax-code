/**
 * @swagger
 * paths:
 *   /webhooks/checkout:
 *     post:
 *       summary: Subscription webhook handler
 *       description: Subscription webhook handler
 *       operationId: webhookHandler
 *       tags:
 *         - Webhooks
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/WebhookEvent'
 *       responses:
 *           200:
 *             description: Successful
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Message
 *                       example: Webhook event handled successfully
 *           500:
 *             description: Internal server error
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Message
 *                       example: Webhook handler failed
 */

/**
 * @swagger
 * definitions:
 *   WebhookEvent:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437a'
 *       created_at:
 *         type: string
 *         format: date-time
 *         example: '2022-01-01T12:00:00Z'
 *       action:
 *         type: string
 *         enum:
 *           - 'confirmed'
 *           - 'payment_created'
 *           - 'payment_confirmed'
 *           - 'cancelled'
 *           - 'paid'
 *           - 'failed'
 *         example: 'confirmed'
 *       resource_type:
 *         type: string
 *         enum:
 *           - 'mandates'
 *           - 'payments'
 *           - 'subscriptions'
 *         example: 'mandates'
 *       links:
 *         type: object
 *         properties:
 *           mandate:
 *             type: string
 *             example: 'SB123'
 *           payment:
 *             type: string
 *             example: 'SB123'
 *           subscription:
 *             type: string
 *             example: 'SB123'
 *       details:
 *         type: object
 *         properties:
 *           scheme:
 *             type: string
 *             example: 'sepa_core'
 *           reason_code:
 *             type: string
 *             example: 'reason_code'
 *           description:
 *             type: string
 *             example: 'description'
 */
