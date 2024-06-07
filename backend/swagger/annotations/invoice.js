/**
 * @swagger
 * paths:
 *   /invoices/{id}/download-receipt:
 *     post:
 *       summary: Download summary receipt PDFs
 *       tags:
 *         - Invoices
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Invoice ID
 *           required: true
 *           type: string
 *       responses:
 *           200:
 *             description: Successful
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 200
 *                     message:
 *                       type: string
 *                       example: 'Export successful'
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           base64Pdf:
 *                             type: string
 *                             example: 'xMK932z+CWjDD4hX6N6dwwEmCw5jrqUuhfSLHhUJI8s='
 *                           fileName:
 *                             type: string
 *                             example: 'psymax-order-ABC123.pdf'
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
 *   /invoices/download-summary:
 *     post:
 *       summary: Download receipt PDF
 *       tags:
 *         - Invoices
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/DownloadSummaryReceiptPDFs'
 *       responses:
 *           200:
 *             description: Successful
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     status_code:
 *                       type: number
 *                       example: 200
 *                     message:
 *                       type: string
 *                       example: 'Export successful'
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           base64Pdf:
 *                             type: string
 *                             example: 'xMK932z+CWjDD4hX6N6dwwEmCw5jrqUuhfSLHhUJI8s='
 *                           fileName:
 *                             type: string
 *                             example: 'psymax-order-ABC123.pdf'
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
 *   DownloadSummaryReceiptPDFs:
 *     type: object
 *     properties:
 *       invoiceIds:
 *         type: array
 *         items:
 *           type: string
 *         example: ['ABC123', 'DEF456']
 */
