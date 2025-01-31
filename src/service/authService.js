import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import sendEmailService from './emailService.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};



// Register user service
export const registerUserService = async (userData) => {
    const { name, email, password, platform, categories, AiPrompt } = userData;

    if (!name || !email || !password) {
        throw new Error('Please fill all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set admin status for specific email
    const isAdmin = email === 'nsevak61@gmail.com';

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        status: true,
        isAdmin,
        categories: userData.categories || "motivation",
        platform:userData.platform || "Email",
        AiPrompt : userData.AiPrompt
    });

    if (user) {

        // Send welcome email
        const welcomeMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Welcome to Savera, ${name}! 🎉</h2>
                <p>Thank you for joining our community. We're excited to have you on board!</p>
                
                <h3 style="color: #34495e;">Your Email Preferences:</h3>
                <ul style="list-style-type: none; padding: 0;">
                    <li>📅 Schedule: 9:00AM</li>
                    <li>🔄 Frequency: daily</li>
                    <li>📝 Categories: ${user.categories}</li>
                </ul>

                <p>You can update your preferences anytime through your account settings.</p>
                

                <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                
                <p style="color: #7f8c8d; font-size: 0.9em;">
                    Best regards,<br>
                    The Savera Team
                </p>
            </div>
        `;

        try {
            await sendEmailService(name, email, welcomeMessage);
            console.log('Welcome email sent successfully');
        } catch (error) {
            console.error('Error sending welcome email:', error);
            // Don't throw error here, as we still want to return user data even if email fails
        }

        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            categories: user.categories,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

// Login user service
export const loginUserService = async (email, password) => {
    if (!email || !password) {
        throw new Error('Please fill all required fields');
    }

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
    }

    return {
        _id: user.id,
        name: user.name,
        email: user.email,
        categories: user.categories,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    };
};


export const getUserDataService = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
