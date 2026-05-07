const User = require('./user.model');
const { Parser } = require('json2csv');

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const query = {};

        
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }


        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;
        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / limit),
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, location, gender, profile } = req.body;

  
        if (!firstName || firstName.length < 2) {
            return res.status(400).json({ success: false, message: 'First name must be at least 2 characters' });
        }
        if (!lastName || lastName.length < 2) {
            return res.status(400).json({ success: false, message: 'Last name must be at least 2 characters' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
        }
        if (!location) {
            return res.status(400).json({ success: false, message: 'Location is required' });
        }
        if (!gender) {
            return res.status(400).json({ success: false, message: 'Gender is required' });
        }
        if (!profile) {
            return res.status(400).json({ success: false, message: 'Profile selection is required' });
        }

        console.log('Creating user with data:', req.body);
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, location } = req.body;


        if (firstName && firstName.length < 2) {
            return res.status(400).json({ success: false, message: 'First name must be at least 2 characters' });
        }
        if (lastName && lastName.length < 2) {
            return res.status(400).json({ success: false, message: 'Last name must be at least 2 characters' });
        }
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
            }
        }
        if (phoneNumber) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phoneNumber)) {
                return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
            }
        }
        if (location === '') {
            return res.status(400).json({ success: false, message: 'Location cannot be empty' });
        }

        console.log('Updating user with data:', req.body);
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const exportUsers = async (req, res) => {
    try {
        const users = await User.find({});
        const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'location', 'gender', 'profile', 'status', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    exportUsers
};
