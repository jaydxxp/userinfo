const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    exportUsers
} = require('./user.controller');

router.get('/', getUsers);
router.get('/export', exportUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
