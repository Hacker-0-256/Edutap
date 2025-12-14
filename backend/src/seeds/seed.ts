import { User } from '../models/user.js';
import { School } from '../models/school.js';
import { Parent } from '../models/parent.js';
import { Student } from '../models/student.js';
import { Attendance } from '../models/attendance.js';
import { Device } from '../models/device.js';

// Sample data for seeding the database
const sampleData = {
  schools: [
    {
      name: "Green Valley International School",
      address: "123 Education Street, Academic City",
      phone: "+1-555-0101",
      email: "info@greenvalley.edu",
      openingTime: "08:00",
      closingTime: "15:00"
    },
    {
      name: "Sunrise Elementary School",
      address: "456 Learning Avenue, Knowledge Town",
      phone: "+1-555-0102",
      email: "contact@sunrise.edu",
      openingTime: "08:30",
      closingTime: "14:30"
    }
  ],

  users: [
    // Admin user
    {
      email: "admin@school.edu",
      password: "admin123",
      role: "admin",
      firstName: "System",
      lastName: "Administrator"
    }
  ],

  parents: [
    {
      firstName: "John",
      lastName: "Smith",
      phone: "+1234567890",
      email: "john.smith@email.com",
      address: "123 Parent Street",
      receiveSMS: true
    },
    {
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+1234567891",
      email: "sarah.johnson@email.com",
      address: "456 Family Road",
      receiveSMS: true
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      phone: "+1234567892",
      email: "michael.brown@email.com",
      address: "789 Home Avenue",
      receiveSMS: true
    },
    {
      firstName: "Emily",
      lastName: "Davis",
      phone: "+1234567893",
      email: "emily.davis@email.com",
      address: "321 Parent Lane",
      receiveSMS: true
    }
  ],

  parentUsers: [
    {
      email: "john.smith@email.com",
      password: "parent123",
      role: "parent",
      firstName: "John",
      lastName: "Smith"
    },
    {
      email: "sarah.johnson@email.com",
      password: "parent123",
      role: "parent",
      firstName: "Sarah",
      lastName: "Johnson"
    },
    {
      email: "michael.brown@email.com",
      password: "parent123",
      role: "parent",
      firstName: "Michael",
      lastName: "Brown"
    },
    {
      email: "emily.davis@email.com",
      password: "parent123",
      role: "parent",
      firstName: "Emily",
      lastName: "Davis"
    }
  ],

  students: [
    // Students for Green Valley School
    {
      firstName: "Emma",
      lastName: "Smith",
      studentId: "GV001",
      cardUID: "ABC123456789",
      grade: "5",
      class: "A",
      schoolIndex: 0, // Green Valley School
      parentIndex: 0  // John Smith
    },
    {
      firstName: "Liam",
      lastName: "Smith",
      studentId: "GV002",
      cardUID: "DEF987654321",
      grade: "3",
      class: "B",
      schoolIndex: 0,
      parentIndex: 0
    },
    {
      firstName: "Olivia",
      lastName: "Johnson",
      studentId: "GV003",
      cardUID: "GHI456789123",
      grade: "4",
      class: "A",
      schoolIndex: 0,
      parentIndex: 1
    },
    {
      firstName: "Noah",
      lastName: "Brown",
      studentId: "GV004",
      cardUID: "JKL789123456",
      grade: "2",
      class: "C",
      schoolIndex: 0,
      parentIndex: 2
    },
    // Students for Sunrise School
    {
      firstName: "Ava",
      lastName: "Davis",
      studentId: "SR001",
      cardUID: "MNO321654987",
      grade: "1",
      class: "A",
      schoolIndex: 1, // Sunrise School
      parentIndex: 3  // Emily Davis
    },
    {
      firstName: "William",
      lastName: "Davis",
      studentId: "SR002",
      cardUID: "PQR654987321",
      grade: "3",
      class: "B",
      schoolIndex: 1,
      parentIndex: 3
    }
  ],

  schoolStaff: [
    {
      email: "staff.greenvalley@school.edu",
      password: "staff123",
      role: "school",
      firstName: "Green Valley",
      lastName: "Staff",
      schoolIndex: 0
    },
    {
      email: "staff.sunrise@school.edu",
      password: "staff123",
      role: "school",
      firstName: "Sunrise",
      lastName: "Staff",
      schoolIndex: 1
    }
  ],

  devices: [
    {
      deviceId: "rfid-gate-001",
      name: "Main Entrance RFID Reader",
      deviceType: "rfid_reader",
      location: {
        building: "Main Building",
        floor: "Ground",
        room: "Entrance",
        zone: "main-gate"
      },
      capabilities: ["rfid", "nfc"],
      schoolIndex: 0
    },
    {
      deviceId: "rfid-gate-002",
      name: "Side Entrance RFID Reader",
      deviceType: "rfid_reader",
      location: {
        building: "Annex Building",
        floor: "Ground",
        room: "Side Entrance",
        zone: "side-gate"
      },
      capabilities: ["rfid"],
      schoolIndex: 0
    },
    {
      deviceId: "rfid-gate-003",
      name: "Sunrise Main Gate",
      deviceType: "rfid_reader",
      location: {
        building: "Main Building",
        floor: "Ground",
        room: "Entrance",
        zone: "main-gate"
      },
      capabilities: ["rfid", "nfc"],
      schoolIndex: 1
    }
  ]
};

// Generate sample attendance records for the past week
function generateSampleAttendance(students: any[], schoolId: string) {
  const attendanceRecords = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) { // Last 7 days
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Randomly select some students to have attendance records
    const attendingStudents = students
      .filter(student => student.schoolId.toString() === schoolId)
      .filter(() => Math.random() > 0.3); // 70% attendance rate

    for (const student of attendingStudents) {
      const arrivalTime = new Date(date);
      arrivalTime.setHours(8 + Math.floor(Math.random() * 2), // 8-10 AM
                          0 + Math.floor(Math.random() * 60), // Random minutes
                          0, 0);

      attendanceRecords.push({
        studentId: student._id,
        schoolId: schoolId,
        type: 'check-in',
        timestamp: arrivalTime,
        date: date.toISOString().split('T')[0],
        deviceId: 'rfid-gate-001',
        deviceLocation: 'Main Entrance',
        smsNotificationSent: true
      });
    }
  }

  return attendanceRecords;
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await School.deleteMany({});
    await Parent.deleteMany({});
    await Student.deleteMany({});
    await Attendance.deleteMany({});
    await Device.deleteMany({});

    // Create schools
    console.log('🏫 Creating schools...');
    const createdSchools = [];
    for (const schoolData of sampleData.schools) {
      const school = await School.create(schoolData);
      createdSchools.push(school);
      console.log(`  ✓ Created school: ${school.name}`);
    }

    // Create admin user
    console.log('👨‍💼 Creating admin user...');
    const adminUser = await User.create(sampleData.users[0]);
    console.log(`  ✓ Created admin: ${adminUser.email}`);

    // Create school staff users
    console.log('👨‍🏫 Creating school staff users...');
    const createdStaff = [];
    for (const staffData of sampleData.schoolStaff) {
      const school = createdSchools[staffData.schoolIndex];
      const staff = await User.create({
        ...staffData,
        schoolId: school._id
      });
      createdStaff.push(staff);
      console.log(`  ✓ Created staff: ${staff.email} for ${school.name}`);
    }

    // Create parents
    console.log('👨‍👩‍👧 Creating parents...');
    const createdParents = [];
    for (const parentData of sampleData.parents) {
      const parent = await Parent.create(parentData);
      createdParents.push(parent);
      console.log(`  ✓ Created parent: ${parent.firstName} ${parent.lastName}`);
    }

    // Create parent users
    console.log('👨‍👩‍👧 Creating parent users...');
    for (let i = 0; i < sampleData.parentUsers.length; i++) {
      const parentUserData = sampleData.parentUsers[i];
      const parent = createdParents[i];
      await User.create({
        ...parentUserData,
        parentId: parent._id
      });
      console.log(`  ✓ Created parent user: ${parentUserData.email}`);
    }

    // Create students
    console.log('👨‍🎓 Creating students...');
    const createdStudents = [];
    for (const studentData of sampleData.students) {
      const school = createdSchools[studentData.schoolIndex];
      const parent = createdParents[studentData.parentIndex];

      const student = await Student.create({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        studentId: studentData.studentId,
        cardUID: studentData.cardUID,
        grade: studentData.grade,
        class: studentData.class,
        schoolId: school._id,
        parentId: parent._id
      });

      createdStudents.push(student);
      console.log(`  ✓ Created student: ${student.firstName} ${student.lastName} (${student.studentId})`);
    }

    // Create devices
    console.log('🔧 Creating IoT devices...');
    for (const deviceData of sampleData.devices) {
      const school = createdSchools[deviceData.schoolIndex];
      const device = await Device.create({
        ...deviceData,
        schoolId: school._id,
        status: 'online',
        apiKey: `api-key-${deviceData.deviceId}`,
        secretKey: `secret-key-${deviceData.deviceId}`,
        batteryLevel: 85 + Math.floor(Math.random() * 15), // 85-100%
        signalStrength: 70 + Math.floor(Math.random() * 30), // 70-100%
        stats: {
          totalScans: Math.floor(Math.random() * 1000) + 500,
          successfulScans: 0,
          failedScans: 0,
          uptime: Math.floor(Math.random() * 720) + 100, // 100-820 hours
          lastReset: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Within last 30 days
        }
      });

      // Update successful scans
      device.stats.successfulScans = Math.floor(device.stats.totalScans * 0.98); // 98% success rate
      device.stats.failedScans = device.stats.totalScans - device.stats.successfulScans;
      await device.save();

      console.log(`  ✓ Created device: ${device.name} (${device.deviceId})`);
    }

    // Generate sample attendance records
    console.log('📊 Generating sample attendance records...');
    for (const school of createdSchools) {
      const attendanceRecords = generateSampleAttendance(createdStudents, school._id.toString());
      for (const record of attendanceRecords) {
        await Attendance.create(record);
      }
      console.log(`  ✓ Created ${attendanceRecords.length} attendance records for ${school.name}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@school.edu');
    console.log('  Password: admin123');
    console.log('\nSchool Staff:');
    console.log('  Green Valley: staff.greenvalley@school.edu / staff123');
    console.log('  Sunrise: staff.sunrise@school.edu / staff123');
    console.log('\nParents:');
    console.log('  john.smith@email.com / parent123');
    console.log('  sarah.johnson@email.com / parent123');
    console.log('  michael.brown@email.com / parent123');
    console.log('  emily.davis@email.com / parent123');

    console.log('\n📊 Sample Data Summary:');
    console.log(`  Schools: ${createdSchools.length}`);
    console.log(`  Staff: ${createdStaff.length}`);
    console.log(`  Parents: ${createdParents.length}`);
    console.log(`  Students: ${createdStudents.length}`);
    console.log(`  Devices: ${sampleData.devices.length}`);
    console.log(`  Attendance Records: Generated for past 7 days`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeder if this file is executed directly
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(__filename);

// Run seeder directly
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-attendance';
console.log('🔗 Attempting to connect to MongoDB at:', mongoUri);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log('📡 Connected to MongoDB successfully');
    return seedDatabase();
  })
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error.message);
    console.error('💡 Make sure MongoDB is running and accessible at:', mongoUri);
    console.error('💡 On Windows, you can start MongoDB with: net start MongoDB');
    console.error('💡 Or install and run MongoDB as a service');
    process.exit(1);
  });