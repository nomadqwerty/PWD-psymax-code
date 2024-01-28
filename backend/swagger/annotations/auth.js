/**
 * @swagger
 * paths:
 *   /register:
 *     post:
 *       summary: Register a user
 *       description: Register a new user
 *       tags:
 *         - Authentication
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                   - email
 *                   - password
 *                   - confirmPassword
 *                   - inviteCode
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                 password:
 *                   type: string
 *                   description: User's password
 *                 confirmPassword:
 *                   type: string
 *                   description: Re-enter password
 *                 inviteCode:
 *                   type: string
 *                   description: Referral code if any
 *       responses:
 *         200:
 *           description: Successful registration
 *         400:
 *           description: Bad request
 *         500:
 *           description: Internal server error
 *
 *   /login:
 *     post:
 *       summary: User login
 *       description: Log in as an existing user
 *       tags:
 *         - Authentication
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   required: true
 *                 password:
 *                   type: string
 *                   description: User's password
 *                   required: true
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /logout:
 *     delete:
 *       summary: User Logout
 *       description: If the user logs out
 *       tags:
 *         - Authentication
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Successful
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /user/get:
 *     get:
 *       summary: Get user details
 *       tags:
 *         - Kontoeinstellungen
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Successful
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /user/save:
 *     post:
 *       summary: Save user details
 *       tags:
 *         - Kontoeinstellungen
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Anrede:
 *                   type: string
 *                   required: true
 *                 Titel:
 *                   type: string
 *                 Vorname:
 *                   type: string
 *                   required: true
 *                 Nachname:
 *                   type: string
 *                   required: true
 *                 Geburtsdatum:
 *                   type: string
 *                   required: true
 *                 Telefon:
 *                   type: string
 *                   required: true
 *                 Website:
 *                   type: string
 *                   required: true
 *                 Berufsbezeichnung:
 *                   type: string
 *                   required: true
 *                 Praxistitel:
 *                   type: string
 *                 Praxisbezeichnung:
 *                   type: string
 *                 Praxisbeschreibung:
 *                   type: string
 *                 Logo:
 *                   type: string
 *                 Primaerfarbe:
 *                   type: string
 *                 Strasse_und_Hausnummer:
 *                   type: string
 *                   required: true
 *                 Ort:
 *                   type: string
 *                   required: true
 *                 Land:
 *                   type: string
 *                   required: true
 *                 Steuernummer:
 *                   type: string
 *                   required: true
 *                 PLZ:
 *                   type: string
 *                   required: true
 *                 Bankname:
 *                   type: string
 *                   required: true
 *                 BIC:
 *                   type: string
 *                   required: true
 *                 IBAN:
 *                   type: string
 *                   required: true
 *                 invoiceEmail:
 *                   type: string
 *                 StandardSalesTax:
 *                   type: string
 *                 password:
 *                   type: string
 *                 confirmPassword:
 *                   type: string
 *                 Authentifizierungscode:
 *                   type: string
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 *
 *   /saveLogo:
 *     post:
 *       summary: Save Praxis logo
 *       tags:
 *          - Kontoeinstellungen
 *       security:
 *          - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                  logo:
 *                     type: string
 *                     format: binary
 *                  deleteFile:
 *                     type: string
 *       responses:
 *         200:
 *           description: Success
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal server error
 */
