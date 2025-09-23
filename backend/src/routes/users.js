const express = require('express');
const { getAllUsers, updateUserRole, validateRoleUpdate } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(auth);
router.use(generalLimiter);
router.use(authorize(['admin']));

router.get('/', getAllUsers);
router.put('/:id/role', validateRoleUpdate, updateUserRole);

module.exports = router;
