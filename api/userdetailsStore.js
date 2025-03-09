const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    res.json({
        message: 'Form details received',
        data: { name, email, phone },
    });
});

module.exports = router;





