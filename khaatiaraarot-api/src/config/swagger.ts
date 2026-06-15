import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Khaatiaraarot API',
      version: '1.0.0',
      description: 'Ecommerce backend API',
    },
    servers: [{ url: '/api/v1', description: 'v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Products', description: 'Product catalogue' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Banners', description: 'Promotional banners' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Orders', description: 'Customer orders' },
      { name: 'Wishlist', description: 'Customer wishlist' },
      { name: 'Rewards', description: 'Loyalty points' },
      { name: 'Coupons', description: 'Coupon validation' },
      { name: 'Admin - Products', description: 'Admin product management' },
      { name: 'Admin - Categories', description: 'Admin category management' },
      { name: 'Admin - Banners', description: 'Admin banner management' },
      { name: 'Admin - Orders', description: 'Admin order management' },
      { name: 'Admin - Inventory', description: 'Inventory management' },
      { name: 'Admin - Rate Plans', description: 'Delivery rate plans' },
      { name: 'Admin - Coupons', description: 'Coupon management' },
      { name: 'Admin - Reports', description: 'Sales & revenue reports' },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
