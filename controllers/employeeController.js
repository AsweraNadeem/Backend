const Employee = require('../modals/Employee'); // Ensure folder name is correct (models vs modals)

// Helper: Convert buffer to Base64 string for Vercel compatibility
const getBase64Image = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        
        // 1. Check if image exists in memory buffer
        if (!req.file) {
            return res.status(400).json({ message: "Image is required", success: false });
        }

        const imageData = getBase64Image(req.file);

        // 2. Dynamic import for nanoid
        const { nanoid } = await import('nanoid');

        // 3. Validation Logic
        if (!name || !email || !mobile || !designation || !gender || !course) {
            return res.status(400).json({ message: "All text fields are required", success: false });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters", success: false });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format", success: false });
        }

        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ message: "Mobile number must be 10 digits", success: false });
        }

        // 4. Duplicate Checks
        const existingEmployee = await Employee.findOne({ $or: [{ email }, { mobile }] });
        if (existingEmployee) {
            return res.status(400).json({ 
                message: existingEmployee.email === email ? "Email already exists" : "Mobile number already exists", 
                success: false 
            });
        }

        // 5. Create Record
        await Employee.create({
            id: nanoid(8),
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image: imageData,
            user: req.user._id
        });

        res.status(201).json({ message: "Employee Added successfully", success: true });

    } catch (error) {
        console.error("Add Error:", error);
        res.status(500).json({ message: "Failed to add New Employee", error: error.message, success: false });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const empId = req.params.id || req.query.id;

        const employee = await Employee.findById(empId);
        if (!employee) return res.status(404).json({ message: "Employee not found", success: false });

        // Update image only if a new file is uploaded
        let image = employee.image;
        if (req.file) {
            image = getBase64Image(req.file);
        }

        // Validation for email uniqueness (excluding self)
        if (email && email !== employee.email) {
            const emailExists = await Employee.findOne({ email, _id: { $ne: empId } });
            if (emailExists) return res.status(400).json({ message: "Email already exists", success: false });
        }

        // NOTE: fs.unlinkSync removed - Vercel is stateless/read-only
        await Employee.findByIdAndUpdate(empId, { 
            name, email, mobile, designation, gender, course, image 
        }, { new: true });

        res.status(200).json({ message: "Employee updated successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: "Failed to update employee", error: error.message, success: false });
    }
};

exports.getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Fetched successfully", employees, success: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch employees", error: error.message, success: false });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found", success: false });
        res.status(200).json({ employee, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error finding employee", error: error.message, success: false });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Employee not found", success: false });
        
        // NOTE: fs.unlinkSync removed - no local files to delete
        res.status(200).json({ message: "Employee deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed", error: error.message, success: false });
    }
};
