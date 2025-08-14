import express from 'express';
import User from '../backend/User.js';
import { sendOTP } from '../backend/sendEmail.js';
import Task from './Task.js'; // update path as needed


const router = express.Router();

router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;

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
      user = new User({ email, name });  // save name on new user
    } else if (name && user.name !== name) {
      // Optionally update the name if different
      user.name = name;
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


router.get('/users', async (req, res) => {
  try {
    const usersWithProjects = await User.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'email',
          foreignField: 'userEmail',
          as: 'tasks'
        }
      },
      {
        $project: {
          otp: 0,
          otpExpires: 0,
          __v: 0
        }
      }
    ]);

    res.json(usersWithProjects);
  } catch (error) {
    console.error('Error fetching users with tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/tasks/weekly/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { weekDates, tableData } = req.body;
    // weekDates: ["2025-08-12", "2025-08-13", ...]
    // tableData: { KPI: [8,8,8,8,8], AUM: [2,3,4,5,6] }

    if (!Array.isArray(weekDates) || weekDates.length === 0) {
      return res.status(400).json({ error: "weekDates is required" });
    }

    // Prepare and upsert tasks for each day
    const bulkOps = weekDates.map((date, index) => ({
      updateOne: {
        filter: { userEmail: email, date },
        update: {
          userEmail: email,
          date,
          projects: [
            { project: "KPI", hours: Number(tableData.KPI[index] || 0) },
            { project: "AUM", hours: Number(tableData.AUM[index] || 0) }
          ]
        },
        upsert: true
      }
    }));

    await Task.bulkWrite(bulkOps);

    res.json({ message: "Weekly data saved successfully" });
  } catch (err) {
    console.error("Error saving weekly data:", err);
    res.status(500).json({ error: "Failed to save weekly data" });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-otp -otpExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a task
router.post('/tasks/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { project, date, hours } = req.body;

    if (!project || !date || hours == null) {
      return res.status(400).json({ error: 'Project, date, and hours are required' });
    }

    const hrsNum = Number(hours);
    if (isNaN(hrsNum) || hrsNum < 0) {
      return res.status(400).json({ error: 'Hours must be a non-negative number' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find task doc for user+date
    let task = await Task.findOne({ userEmail: email, date });

    if (task) {
      // Check if project already exists in projects array
      const projectIndex = task.projects.findIndex(p => p.project === project);
      if (projectIndex !== -1) {
        // Update hours for existing project
        task.projects[projectIndex].hours = hrsNum;
      } else {
        // Add new project entry
        task.projects.push({ project, hours: hrsNum });
      }
    } else {
      // Create new task document for date
      task = new Task({
        userEmail: email,
        date,
        projects: [{ project, hours: hrsNum }],
      });
    }

    await task.save();

    // Return all tasks for this user after insert/update
    const tasks = await Task.find({ userEmail: email }).sort({ date: 1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error adding/updating task:', err);
    res.status(500).json({ error: 'Failed to add/update task' });
  }
});


// GET tasks by email
router.get('/tasks/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const tasks = await Task.find({ userEmail: email }).sort({ date: 1 });
    if (!tasks) return res.status(404).json({ error: 'Tasks not found' });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

router.put("/tasks/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { project, date, hours } = req.body;

    // Validate inputs
    if (!project || !date) {
      return res.status(400).json({ error: "Project and date are required" });
    }

    const hrsNum = Number(hours);
    if (hours !== undefined && (isNaN(hrsNum) || hrsNum < 0)) {
      return res.status(400).json({ error: "Hours must be a non-negative number" });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find task
    const task = await Task.findOne({ userEmail: email, date });
    if (!task) {
      return res.status(404).json({ error: "Task not found for given date" });
    }

    // Update matching project
    const projectEntry = task.projects.find(
      (p) => p.project.trim().toLowerCase() === project.trim().toLowerCase()
    );
    if (!projectEntry) {
      return res.status(404).json({ error: "Project entry not found in task" });
    }

    projectEntry.hours = hrsNum;
    await task.save();

    // Always return array of tasks
    const tasks = await Task.find({ userEmail: email }).sort({ date: -1, createdAt: -1 });
    res.json(Array.isArray(tasks) ? tasks : [tasks]);

  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

export default router;
