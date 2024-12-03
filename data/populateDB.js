const dotenv = require('dotenv');
const mongoose = require("mongoose");
dotenv.config();
console.log(process.env.MONGO_URL);

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URL}`);

// Models
const Company = mongoose.model("Company", new mongoose.Schema({
  name: String,
  location: String,
  linkedIn: String,
  emails: [String],
  phoneNumbers: [String],
  comments: String,
  periodicity: String,
}));

const CommunicationMethod = mongoose.model("CommunicationMethod", new mongoose.Schema({
  name: String,
  description: String,
  sequence: Number,
  mandatory: Boolean
}));

// Communication Model
const Communication = mongoose.model("Communication", new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "CommunicationMethod" },
  date: Date,
  notes: String,
}));

// Notification Model
const Notification = mongoose.model("Notification", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  communication: { type: mongoose.Schema.Types.ObjectId, ref: "Communication" },
  type: String, // 'overdue' or 'due today'
  message: String,
}));

// Seed Data
const seedData = async () => {
  await Company.deleteMany();
  await CommunicationMethod.deleteMany();
  await Communication.deleteMany();
  await Notification.deleteMany();

  const companies = [
    {
      name: "SoftTech Solutions",
      location: "Bengaluru",
      linkedIn: "https://linkedin.com/company/softtechsolutions",
      emails: ["info@softtech.com"],
      phoneNumbers: ["+91 9876543210"],
      comments: "High-growth potential.",
      periodicity: "Monthly",
    },
    {
      name: "Future Innovations",
      location: "Hyderabad",
      linkedIn: "https://linkedin.com/company/futureinnovations",
      emails: ["contact@futureinnovations.com"],
      phoneNumbers: ["+91 8765432109"],
      comments: "Excellent R&D client.",
      periodicity: "Bi-weekly",
    },
  ];

  const createdCompanies = await Company.insertMany(companies);

  const communications = [
    { name: 'Email Campaign', description: 'Start an email campaign', sequence: 1, mandatory: true },
    { name: 'Social Media Message', description: 'Send a direct message on social platforms', sequence: 2, mandatory: true },
    { name: 'Virtual Meeting', description: 'Schedule a video call', sequence: 3, mandatory: true },
    { name: 'Physical Meeting', description: 'Visit the company office', sequence: 4, mandatory: false },
  ];

  const createdMethods = await CommunicationMethod.insertMany(communications);

  // Adding communications for companies
  const communicationEntries = [
    {
      company: createdCompanies[0]._id,
      type: createdMethods[0]._id,
      date: new Date('2024-11-30'),
      notes: "Initial email sent to SoftTech Solutions."
    },
    {
      company: createdCompanies[0]._id,
      type: createdMethods[1]._id,
      date: new Date('2024-12-01'),
      notes: "Message on LinkedIn to the marketing team."
    },
    {
      company: createdCompanies[1]._id,
      type: createdMethods[2]._id,
      date: new Date('2024-11-29'),
      notes: "Scheduled a virtual meeting with Future Innovations."
    },
    {
      company: createdCompanies[1]._id,
      type: createdMethods[3]._id,
      date: new Date('2024-12-03'),
      notes: "Planned an in-person meeting at their Hyderabad office."
    },
  ];

  await Communication.insertMany(communicationEntries);

  // Adding notifications for overdue or due communications
  const notifications = [
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id,
      communication: communicationEntries[0]._id,
      type: 'overdue',
      message: 'SoftTech Solutions email communication is overdue.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[1]._id,
      communication: communicationEntries[2]._id,
      type: 'due today',
      message: 'Virtual meeting with Future Innovations is due today.'
    },
  ];

  await Notification.insertMany(notifications);

  console.log("\n\nSeed data populated successfully!");
  mongoose.connection.close();
};

seedData();
