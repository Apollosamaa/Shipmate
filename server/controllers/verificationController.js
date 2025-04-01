import Verification from '../models/VerificationModel.js';
import User from '../models/UserModel.js';

const validateStudentId = (studentId) => {
    const cleanId = studentId.toUpperCase().trim();
    
    // 1. Basic format check - catches 99% of invalid attempts
    if (!/^[A-Z]{3,4}\d{7}$/.test(cleanId)) {
        return { valid: false, error: 'Invalid student ID' };
    }

    // 2. Extract components
    const programCode = cleanId.substring(0, cleanId.length - 7);
    const yy = parseInt(cleanId.substr(-7, 2));
    const mm = parseInt(cleanId.substr(-5, 2));

    // 3. Simple prefix check - B/C/D/F only
    const firstChar = programCode.charAt(0);
    if (!['B','C','D','F'].includes(firstChar)) {
        return { valid: false, error: 'Invalid student ID' };
    }

    // 4. Basic year/month sanity checks
    const currentYearLastTwo = new Date().getFullYear() % 100;
    if (yy < 0 || yy > currentYearLastTwo) {
        return { valid: false, error: 'Invalid student ID' };
    }
    
    if (mm < 1 || mm > 12) {
        return { valid: false, error: 'Invalid student ID' };
    }

    return {
        valid: true,
        data: {
            cleanId,
            programCode,
            intakeYear: 2000 + yy,
            intakeMonth: mm
        }
    };
};

const validateSchoolEmail = (email) => {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();
    return cleanEmail.endsWith('.student@peninsulamalaysia.edu.my');
};

export const verifyStudent = async (req, res) => {
    try {
        // Get Auth0 user ID from the authenticated request
        const auth0Id = req.oidc.user.sub; // Auth0 user ID format like "auth0|123"
        
        // Find the corresponding user in your database
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { studentId, schoolEmail } = req.body;

        // Validate student ID
        const validation = validateStudentId(studentId);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Validate school email
        if (!validateSchoolEmail(schoolEmail)) {
            return res.status(400).json({ 
                error: 'Invalid school email. Must end with .student@peninsulamalaysia.edu.my' 
            });
        }

        // Check if already verified
        const existingVerification = await Verification.findOne({ userId: user._id });
        if (existingVerification) {
            return res.status(400).json({ error: 'User already verified' });
        }

        // Check for duplicate student ID or email
        const duplicateCheck = await Verification.findOne({
            $or: [
                { studentId: validation.data.cleanId },
                ...(schoolEmail ? [{ schoolEmail: schoolEmail.toLowerCase() }] : [])
            ]
        });
        
        if (duplicateCheck) {
            return res.status(400).json({ error: 'Student ID or email already registered' });
        }

        // Create verification record
        const verification = new Verification({
            userId: user._id,
            studentId: validation.data.cleanId,
            programCode: validation.data.programCode,
            intakeYear: validation.data.intakeYear,
            intakeMonth: validation.data.intakeMonth,
            ...(schoolEmail && { schoolEmail: schoolEmail.toLowerCase() })
        });

        await verification.save();

        // Update user's verification status
        await User.findByIdAndUpdate(user._id, { isVerified: true });

        return res.status(201).json({
            message: 'Verification successful',
            verification: {
                studentId: verification.studentId, // Fixed typo: studentId (was "stuentId")
                schoolEmail: verification.schoolEmail,
                verifiedAt: verification.verifiedAt,
                program: verification.programCode // Added this for frontend display
            },
            user: {
                isVerified: true
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const checkVerificationStatus = async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const verification = await Verification.findOne({ userId: user._id });
        
        return res.status(200).json({
            isVerified: user.isVerified,
            verificationData: verification || null
        });

    } catch (error) {
        console.error('Verification status check error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};