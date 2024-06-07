/**
 * @swagger
 * /users/{id}/extend-trial:
 *   put:
 *     tags:
 *       - User
 *     summary: Extend trial phase
 *     description: Extend trial phase
 *     operationId: extendTrialPhase
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 'A token is required for authentication'
 *       404:
 *         description: Not found
 */
