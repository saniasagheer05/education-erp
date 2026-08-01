// controllers/authController.js
// Handles login for both students (Library ID + password) and
// admins (email + password), issuing a signed JWT on success.

const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const {
  validateStudentLogin,
  validateAdminLogin,
} = require("../utils/validators");

/**
 * @route   POST /api/auth/student/login
 * @desc    Authenticate a student using Library ID + password
 * @access  Public
 * @body    { libraryId: string, password: string }
 */
const studentLogin = asyncHandler(async (req, res) => {
  const { libraryId, password } = req.body;

  const errors = validateStudentLogin({ libraryId, password });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const student = await Student.findByLibraryId(libraryId.trim());

  if (!student) {
    return res.status(401).json({
      success: false,
      message: "Invalid Library ID or password",
    });
  }

  if (student.status !== "Active") {
    return res.status(403).json({
      success: false,
      message: `Account is ${student.status.toLowerCase()}. Contact the registrar's office.`,
    });
  }

  const isMatch = await bcrypt.compare(password, student.password_hash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid Library ID or password",
    });
  }

  const token = generateToken({
    id: student.id,
    role: "student",
    libraryId: student.library_id,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: student.id,
        libraryId: student.library_id,
        name: `${student.first_name} ${student.last_name}`,
        role: "student",
      },
    },
  });
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Authenticate an admin using email + password
 * @access  Public
 * @body    { email: string, password: string }
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const errors = validateAdminLogin({ email, password });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const admin = await Admin.findByEmail(email.trim().toLowerCase());

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken({
    id: admin.id,
    role: "admin",
    email: admin.email,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    },
  });
});

module.exports = {
  studentLogin,
  adminLogin,
};
