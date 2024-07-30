/**
 * @swagger
 * paths:
 *  /subscriptions/{userId}/invoices:
 *     get:
 *       summary: Get all invoices by user
 *       tags:
 *         - Subscriptions
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: User id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *           200:
 *             description: Successful
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     invoices:
 *                       type: array
 *                       items:
 *                         $ref: '#/definitions/Invoice'
 *           403:
 *             description: Forbidden
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 403
 *                     message:
 *                       type: string
 *                       example: 'A token is required for authentication'
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /subscriptions/{userId}:
 *     get:
 *       summary: Get subscription by user
 *       tags:
 *         - Subscriptions
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: User id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *           200:
 *             description: Successful
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/definitions/Subscription'
 *           403:
 *             description: Forbidden
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 403
 *                     message:
 *                       type: string
 *                       example: 'A token is required for authentication'
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /subscriptions:
 *     post:
 *       summary: Make a new subscription
 *       tags:
 *         - Subscriptions
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/CreateSubscription'
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
 *                       example: 'Subscription created successfully'
 *           400:
 *             description: Bad request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'Bad request'
 *           403:
 *             description: Forbidden
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 403
 *                     message:
 *                       type: string
 *                       example: 'A token is required for authentication'
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /subscriptions/{userId}/method:
 *     put:
 *       summary: Change payment method
 *       tags:
 *         - Subscriptions
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: User id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/UpdateSubscriptionPaymentMethod'
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
 *                       example: 'Payment method updated successfully'
 *           400:
 *             description: Bad request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'Bad request'
 *           403:
 *             description: Forbidden
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 403
 *                     message:
 *                       type: string
 *                       example: 'A token is required for authentication'
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /subscriptions/{userId}/cancel:
 *     post:
 *       summary: Cancel subscription
 *       tags:
 *         - Subscriptions
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: User id
 *           required: true
 *           schema:
 *             type: string
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
 *                       example: 'Subscription canceled successfully'
 *           403:
 *             description: Forbidden
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 403
 *                     message:
 *                       type: string
 *                       example: 'A token is required for authentication'
 *           500:
 *             description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   Invoice:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437a'
 *       userId:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437b'
 *       createdAt:
 *         type: string
 *         format: date-time
 *         example: '2022-01-01T12:00:00Z'
 *       referenceId:
 *         type: string
 *         example: 'ABC123'
 *       plan:
 *         type: string
 *         enum:
 *           - 'GLOBAL'
 *           - 'GLOBAL_EXTENDED'
 *         example: 'GLOBAL'
 *
 *   Subscription:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437a'
 *       userId:
 *         type: string
 *         example: '5f4a1e2b248eab001c39437b'
 *       statusTracking:
 *         type: string
 *         enum:
 *           - 'TRIAL'
 *           - 'ENDORSED'
 *           - 'SPONSORED'
 *           - 'REWARDED'
 *           - 'SUBSCRIBED'
 *           - 'COMMITTED'
 *           - 'INACTIVE'
 *         example: 'TRIAL'
 *       subscriptionId:
 *         type: string
 *         example: 'SB123'
 *       plan:
 *         type: string
 *         enum:
 *           - 'GLOBAL'
 *           - 'GLOBAL_EXTENDED'
 *         example: 'GLOBAL'
 *       startDate:
 *         type: string
 *         format: date-time
 *         example: '2022-01-01T12:00:00Z'
 *       endDate:
 *         type: string
 *         format: date-time
 *         example: '2022-01-01T12:00:00Z'
 *       lastPaymentDate:
 *         type: string
 *         format: date-time
 *         example: '2022-02-01T14:30:00Z'
 *       status:
 *         type: string
 *         enum:
 *           - 'ACTIVE'
 *           - 'CANCELED'
 *           - 'PAUSED'
 *         example: 'ACTIVE'
 *       paymentMethod:
 *         type: string
 *         enum:
 *           - 'DIRECT_DEBIT'
 *           - 'WIRE_TRANSFER'
 *         example: 'DIRECT_DEBIT'
 *       discount:
 *         type: number
 *         example: 0.5
 *       paidCyclesCount:
 *         type: number
 *         example: 0
 *
 *
 *   CreateSubscription:
 *     type: object
 *     properties:
 *       payment_method:
 *         type: string
 *         enum:
 *           - 'DIRECT_DEBIT'
 *           - 'WIRE_TRANSFER'
 *         example: 'DIRECT_DEBIT'
 *       iban:
 *         type: string
 *         example: 'DE12345678901234567890'
 *       given_name:
 *         type: string
 *         example: 'John'
 *       family_name:
 *         type: string
 *         example: 'Doe'
 *       address_line1:
 *         type: string
 *         example: 'Street 1'
 *       postal_code:
 *         type: string
 *         example: '12345'
 *       city:
 *         type: string
 *         example: 'City'
 *       country_code:
 *         type: string
 *         example: 'DE'
 *       email:
 *         type: string
 *         example: 'john.doe@example.com'
 *       account_holder_name:
 *         type: string
 *         example: 'John Doe'
 *
 *   UpdateSubscriptionPaymentMethod:
 *     type: object
 *     properties:
 *       method:
 *         type: string
 *         enum:
 *           - 'DIRECT_DEBIT'
 *           - 'WIRE_TRANSFER'
 *         example: 'DIRECT_DEBIT'
 */
