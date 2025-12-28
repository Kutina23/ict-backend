const { sequelize } = require('./config/database');
const { User, Due, StudentDue } = require('./models');

async function addICT300Dues() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully\n');

    // Check if ICT 300 dues already exist
    const existingDues = await Due.findAll({ where: { level: 'ICT 300' } });
    
    if (existingDues.length > 0) {
      console.log('ICT 300 dues already exist:');
      existingDues.forEach(due => {
        console.log(`- ${due.title}: GH₵ ${due.amount}`);
      });
      console.log('No action needed.\n');
      return;
    }

    console.log('Creating ICT 300 level dues...');

    // Create Semester Fees for ICT 300
    const semesterFees = await Due.create({
      title: 'Semester Fees',
      amount: 600.00,
      level: 'ICT 300',
      academic_year: '2024/2025',
      description: 'General semester fees for all ICT 300 students'
    });
    console.log(`✓ Created: ${semesterFees.title} - GH₵ ${semesterFees.amount}`);

    // Create Project Fees for ICT 300
    const projectFees = await Due.create({
      title: 'Project Fees',
      amount: 200.00,
      level: 'ICT 300',
      academic_year: '2024/2025',
      description: 'Final year project fees for ICT 300 students'
    });
    console.log(`✓ Created: ${projectFees.title} - GH₵ ${projectFees.amount}`);

    // Find all ICT 300 students and assign these dues
    const ict300Students = await User.findAll({ 
      where: { 
        role: 'student', 
        level: 'ICT 300' 
      } 
    });

    console.log(`\nFound ${ict300Students.length} ICT 300 student(s)`);

    for (const student of ict300Students) {
      console.log(`Assigning dues to: ${student.name}`);
      
      // Assign Semester Fees
      await StudentDue.create({
        student_id: student.id,
        due_id: semesterFees.id,
        amount_paid: 0,
        balance: semesterFees.amount,
        status: 'Not Paid',
      });
      console.log(`  ✓ Assigned: ${semesterFees.title}`);

      // Assign Project Fees
      await StudentDue.create({
        student_id: student.id,
        due_id: projectFees.id,
        amount_paid: 0,
        balance: projectFees.amount,
        status: 'Not Paid',
      });
      console.log(`  ✓ Assigned: ${projectFees.title}`);
    }

    console.log('\n✅ ICT 300 dues successfully created and assigned!');
    console.log('\nICT 300 students can now view their dues in the student dashboard.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

addICT300Dues();