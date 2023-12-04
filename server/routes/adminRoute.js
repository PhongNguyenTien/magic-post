const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


// create new admin [POST] username / password / phone
router.post('/admin', adminController.createAdmin);
router.get('/adminPending', adminController.getAdminPending);

router.get(
  '/admin_collection/:zip_code',
  adminController.getAdminByCollectionId,
);

// transaction
router.get(
  '/admin_transaction/:zip_code',
  adminController.getAdminByTransactionId,
);
router.delete("/admin/:id", adminController.deletePendingAdmin);

module.exports = router;
