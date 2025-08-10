import express from 'express';
import User from '../backend/User.js';
import { sendOTP } from '../backend/sendEmail.js';
import Task from './Task.js'; // update path as needed


const router = express.Router();

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    console.log(`🔐 Generated OTP: ${otp} for ${email}`);

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP Email
    try {
      await sendOTP(email, otp);
      console.log('✅ OTP email sent');
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError);
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    return res.status(200).json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error('❌ Error in /send-otp route:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert OTPs to string before comparison
    if (String(user.otp) !== String(otp)) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // Ensure expiry check works with Date object
    if (new Date(user.otpExpires).getTime() < Date.now()) {
      return res.status(401).json({ error: 'OTP has expired' });
    }

    // Clear OTP fields after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'OTP verified. Login successful.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
});



//users
router.get('/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-otp -otpExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks by user email
router.post("/tasks/:email", async (req, res) => {
  try {
    const { text, date, status } = req.body;
    const email = req.params.email;

    // Normalize status
    const allowedStatuses = ["in-progress", "completed"];
    let normalizedStatus = "in-progress";
    if (status && allowedStatuses.includes(status.toLowerCase())) {
      normalizedStatus = status.toLowerCase();
    }

    // Ensure user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, role: "User", tasks: [] });
    }

    // If task details provided, add to tasks array
    if (text && date) {
      user.tasks.push({ text, date, status: normalizedStatus });
      await user.save();
    }

    // Return tasks or empty array
    return res.json(user.tasks);

  } catch (err) {
    console.error("Error handling tasks:", err);
    res.status(500).json({ error: "Failed to handle tasks" });
  }
});





export default router;
