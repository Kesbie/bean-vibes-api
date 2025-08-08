const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { upload } = require('../../config/multer');
const { uploadController } = require('../../controllers');
const { uploadValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    upload.array('files', 10, (err) => {
      console.log(err);
    }),
    uploadController.uploadMedia
  );

router
  .route('/:mediaId')
  .get(
    validate(uploadValidation.getMedia),
    uploadController.getMedia
  )
  .delete(
    auth('uploadMedia'),
    validate(uploadValidation.deleteMedia),
    uploadController.deleteMedia
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload media files
 *     description: Upload multiple media files (images, videos) - authenticated users only
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Media files to upload (max 10 files)
 *                 maxItems: 10
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadedFiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *                 totalFiles:
 *                   type: integer
 *                   description: Number of files uploaded
 *               example:
 *                 uploadedFiles:
 *                   - id: "5ebac534954b54139806c120"
 *                     filename: "coffee_shop_123.jpg"
 *                     originalName: "coffee_shop.jpg"
 *                     mimeType: "image/jpeg"
 *                     size: 1024000
 *                     url: "https://uploads.beanvibes.com/coffee_shop_123.jpg"
 *                     uploadedBy: "5ebac534954b54139806c112"
 *                     createdAt: "2020-05-12T16:18:04.793Z"
 *                 totalFiles: 1
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "413":
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 413
 *               message: "File too large"
 */

/**
 * @swagger
 * /upload/{mediaId}:
 *   get:
 *     summary: Get media by ID
 *     description: Get details of a specific media file
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete media file
 *     description: Delete a media file (only by the uploader or admin)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */ 