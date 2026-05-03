const Announcement = require("../modals/Announcement");

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, priority } = req.body;
    const announcement = await Announcement.create({ title, message, priority });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    // Only fetch announcements from the last 7 days or top 5 latest
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
