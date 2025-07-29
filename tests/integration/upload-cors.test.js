const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Upload CORS', () => {
  describe('GET /uploads/*', () => {
    test('should allow cross-origin requests to uploads directory', async () => {
      const res = await request(app)
        .get('/uploads/test-image.jpg')
        .set('Origin', 'https://example.com')
        .expect(httpStatus.OK);

      expect(res.headers['access-control-allow-origin']).toBe('*');
      expect(res.headers['access-control-allow-methods']).toContain('GET');
      expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
    });

    test('should handle OPTIONS preflight requests for uploads', async () => {
      const res = await request(app)
        .options('/uploads/test-image.jpg')
        .set('Origin', 'https://example.com')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(httpStatus.OK);

      expect(res.headers['access-control-allow-origin']).toBe('*');
      expect(res.headers['access-control-allow-methods']).toContain('GET');
      expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
      expect(res.headers['access-control-max-age']).toBe('86400');
    });

    test('should allow requests from configured frontend URL', async () => {
      const res = await request(app)
        .get('/uploads/test-image.jpg')
        .set('Origin', process.env.FRONTEND_URL || 'http://localhost:3000')
        .expect(httpStatus.OK);

      expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    test('should allow requests with no origin', async () => {
      const res = await request(app)
        .get('/uploads/test-image.jpg')
        .expect(httpStatus.OK);

      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });
}); 