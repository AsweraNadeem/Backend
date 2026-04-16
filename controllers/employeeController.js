const Employee = require('../modals/Employee'); // Ensure this matches your folder: models vs modals
const fs = require('fs');
const path = require('path');

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const image = req.file?.path || "";

        // Dynamic import for nanoid to prevent ERR_REQUIRE_ESM on Vercel
        const { nanoid } = await import('nanoid');

        // Check required fields
        if (!name || !email || !mobile || !designation || !gender || !course || !image) {
            return res.status(400).json({
                message: "All fields (name, email, mobile, designation, gender, course, image) are required"
            });
        }

        // Name validation
        if (name.trim().length < 3) {
            return res.status(400).json({
                message: "Name must be at least 3 characters long"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Mobile validation (10-digit numeric)
        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({
                message: "Mobile number must be 10 digits"
            });
        }

        // Check duplicates
        const existingEmail = await Employee.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        const existingMobile = await Employee.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({ message: "Mobile number already exists" });
        }

        await Employee.create({
            id: nanoid(8),
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image: image || "",
            user: req.user._id
        });

        res.status(201).json({
            message: "Employee Added successfully",
            success: true
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to add New Employee",
            error: error.message,
            success: false
        });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const empId = req.params.id || req.query.id;

        if (!empId) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        const employee = await Employee.findById(empId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const image = req.file?.path || employee.image;

        // Validation logic for updates
        if (email) {
            const existingEmail = await Employee.findOne({ email, _id: { $ne: empId } });
            if (existingEmail) return res.status(400).json({ message: "Email already exists" });
        }

        // Handle old image deletion (Note: This may not work on Vercel's temporary filesystem)
        if (req.file && employee.image) {
            const imagePath = path.join(__dirname, '../', employee.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Employee.findByIdAndUpdate(empId, { name, email, mobile, designation, gender, course, image });

        res.status(200).json({
            message: "Employee data updated successfully",
            success: true
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to update employee data",
            error: error.message,
            success: false
        });
    }
};

exports.getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json({
            message: "Employee fetched successfully",
            employees: employees
        });
    } catch (error) {
        res.status(400).json({ message: "failed to fetch employee", error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const empId = req.params.id || req.query.id;
        if (!empId) {
            return res.status(400).json({ message: "employee Id is required", success: false });
        }
        const employee = await Employee.findById(empId);
        res.status(200).json({
            message: "Employee details fetched successfully",
            employee,
            success: true
        });
    } catch (error) {
        res.status(400).json({ message: "Failed to find employee", error: error.message, success: false });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const empId = req.params.id || req.query.id;
        const employee = await Employee.findById(empId);
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (employee.image) {
            const imagePath = path.join(__dirname, '../', employee.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Employee.findByIdAndDelete(empId);
        res.status(200).json({ message: "Employee deleted successfully", success: true });
    } catch (error) {
        res.status(400).json({ message: "Employee deletion failed", error: error.message, success: false });
    }
};
