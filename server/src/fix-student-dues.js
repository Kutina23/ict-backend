const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'department_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Import models
const { User } = require('./src/models/User');
const { Due } = require('./src/models/Due');
const { StudentDue } = require('./src/models/StudentDue');

// Helper function to get matching dues for a student level
const getMatchingDuesForLevel = (studentLevel) => {
  return Due.findAll().then(dues => {
    return dues.filter(due => {
      const dueLevel = due.level.toLowerCase();
      const studentLevelLower = studentLevel.toLowerCase();
      
      // Exact match
      if (dueLevel === studentLevelLower) {
        return true;
      }
      
      // For ICT levels, match base level (e.g., ICT 300 matches ICT 300)
      if (studentLevelLower.startsWith('ict ')) {
        return dueLevel === studentLevelLower;
      }
      
      // For B-Tech levels, match exact level (e.g., B-Tech 300 matches B-Tech 300)
      if (studentLevelLower.startsWith('b-tech ')) {
        return dueLevel === studentLevelLower;
      }
      
      // For Top Up levels, match exact level (e.g., Top Up 300 matches Top Up 300)
      if (studentLevelLower.startsWith('top up ')) {
        return dueLevel === studentLevelLower;
      }
      
      return false;
    });
  });
};

// Helper function to assign dues to a student
const assignDuesToStudent = async (studentId, studentLevel) => {
  const matchingDues = await getMatchingDuesForLevel(studentLevel);
  let assignedCount = 0;
  
  for (const due of matchingDues) {
    // Check if this student already has this due assigned
    const existingStudentDue = await StudentDue.findOne({
      where: {
        student_id: studentId,
        due_id: due.id
      }
    });
    
    // Only create if it doesn't exist
    if (!existingStudentDue) {
      await StudentDue.create({
        student_id: studentId,
        due_id: due.id,
        amount_paid: 0,
        balance: due.amount,
        status: 'Not Paid',
      });
      assignedCount++;
      console.log(`✅ Assigned due "${due.title}" (${due.level}) to student ID: ${studentId}`);
    } else {
      console.log(`⏭️  Student ID: ${studentId} already has due "${due.title}"`);
    }
  }
  
  return assignedCount;
};

async function fixStudentDues() {
  try {
    console.log('🔧 Starting to fix student dues assignments...\n');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');
    
    // Get all students
    const students = await User.findAll({ where: { role: 'student' } });
    console.log(`📚 Found ${students.length} students\n`);
    
    // Get all dues
    const dues = await Due.findAll();
    console.log(`💰 Found ${dues.length} dues\n`);
    
    let totalAssigned = 0;
    let totalStudentsProcessed = 0;
    
    // Process each student
    for (const student of students) {
      totalStudentsProcessed++;
      console.log(`👤 Processing Student ${totalStudentsProcessed}/${students.length}: ${student.name} (${student.level})`);
      
      const assignedCount = await assignDuesToStudent(student.id, student.level);
      totalAssigned += assignedCount;
      
      if (assignedCount === 0) {
        console.log(`ℹ️  No new dues assigned for ${student.name}\n`);
      } else {
        console.log(`🎯 Assigned ${assignedCount} new dues to ${student.name}\n`);
      }
    }
    
    console.log('🎉 Dues assignment completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total students processed: ${totalStudentsProcessed}`);
    console.log(`   - Total new dues assigned: ${totalAssigned}`);
    console.log(`   - Total dues in system: ${dues.length}\n`);
    
    // Show breakdown by level
    console.log('📈 Dues breakdown by level:');
    const levelCounts = {};
    for (const due of dues) {
      levelCounts[due.level] = (levelCounts[due.level] || 0) + 1;
    }
    
    Object.entries(levelCounts).forEach(([level, count]) => {
      console.log(`   - ${level}: ${count} due(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing student dues:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔒 Database connection closed.');
  }
}

// Run the script
fixStudentDues();