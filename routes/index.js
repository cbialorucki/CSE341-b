const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const app = express();
const accountController = require('../controllers/account');
const productController = require('../controllers/products');

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        baseURL: process.env.BASE_URL,
        clientID: process.env.AUTH0_CLIENT_ID,
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
        secret: process.env.AUTH0_SECRET
    })
);

//[PUBLIC](GET) View All Product Listings
app.get('/products', productController.getAll);

//[PUBLIC](GET) View Details of One Product
app.get('/products/:id', productController.getOne);

//[PRIVATE](POST) Upload Product Listing
app.post('/products', requiresAuth(), productController.listProduct);

//[PRIVATE](PUT) Update Product Listing
app.put("/products/:id", requiresAuth(), productController.updateProduct);

//[PRIVATE](DELETE) Delete Product Listing
app.delete("/products/:id", requiresAuth(), productController.deleteProduct);

//[PRIVATE](GET) View Account Details
app.get('/account', requiresAuth(), accountController.viewAccount);

//[PRIVATE](DELETE) View Account Details
app.delete('/account', requiresAuth(), accountController.deleteAccount);

module.exports = app;