const { Sequelize } = require('sequelize');
require('dotenv').config();

const initDatabase = async () => {
  let sequelize;
    
  try {
    // Create connection using the full database URL
    const dbUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:17200/${process.env.DB_NAME}?ssl-mode=REQUIRED`;
     
    sequelize = new Sequelize(dbUrl, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
     
    await sequelize.authenticate();
    console.log('Connected to MySQL server');

    console.log('Connected to MySQL server');
     
    // Check if the database exists
    const [databases] = await sequelize.query('SHOW DATABASES;');
    const dbName = process.env.DB_NAME || 'defaultdb';
    const dbExists = databases.some(db => db.Database === dbName);
     
    if (!dbExists) {
      await sequelize.query(`CREATE DATABASE ${dbName};`);
      console.log(`Database '${dbName}' created`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
     
    // Switch to the database
    await sequelize.query(`USE ${dbName};`);

    // Create users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student', 'hod') NOT NULL,
        index_number VARCHAR(255),
        level VARCHAR(255),
        phone VARCHAR(255),
        status VARCHAR(255) DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create dues table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        level VARCHAR(255),
        academic_year VARCHAR(255),
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create student_dues table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS student_dues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        due_id INT NOT NULL,
        amount_paid DECIMAL(10,2) DEFAULT 0,
        balance DECIMAL(10,2) NOT NULL,
        status VARCHAR(255) DEFAULT 'Not Paid',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (due_id) REFERENCES dues(id) ON DELETE CASCADE
      )
    `);

    // Create payments table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        due_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_reference VARCHAR(255),
        payment_method VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (due_id) REFERENCES dues(id) ON DELETE CASCADE
      )
    `);

    // Create events table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255),
        content_text TEXT,
        content_url VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create programs table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        duration VARCHAR(255) NOT NULL,
        focus TEXT NOT NULL,
        highlights TEXT NOT NULL,
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create faculties table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS faculties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(255) NOT NULL,
        office VARCHAR(255) NOT NULL,
        image VARCHAR(255) DEFAULT '👨‍🏫',
        bio TEXT NOT NULL,
        qualifications TEXT NOT NULL,
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create partners table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500) NOT NULL,
        website_url VARCHAR(500),
        description TEXT,
        isActive BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_partners_active_sort (isActive, sort_order)
      )
    `);

    console.log('All tables created successfully');
     
    // Insert demo data
    const bcrypt = require('bcryptjs');
      
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await sequelize.query(`
      INSERT IGNORE INTO users (name, email, password, role, status)
      VALUES ('Admin User', 'admin@ict.edu', ?, 'admin', 'active')
    `, { replacements: [adminPassword] });

    // Create HOD user
    const hodPassword = await bcrypt.hash('hod123', 10);
    await sequelize.query(`
      INSERT IGNORE INTO users (name, email, password, role, status)
      VALUES ('Head of Department', 'hod@ict.edu', ?, 'hod', 'active')
    `, { replacements: [hodPassword] });

    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    await sequelize.query(`
      INSERT IGNORE INTO users (name, email, password, role, index_number, level, phone, status)
      VALUES ('John Doe', 'student@ict.edu', ?, 'student', 'ICT/2024/001', 'ICT 200', '0244123456', 'active')
    `, { replacements: [studentPassword] });

    // Create sample dues
    await sequelize.query(`
      INSERT IGNORE INTO dues (title, amount, level, academic_year, description)
      VALUES ('Semester Fees', 500.00, 'ICT 200', '2024/2025', 'Semester fees for ICT 200 students')
    `);

    await sequelize.query(`
      INSERT IGNORE INTO dues (title, amount, level, academic_year, description)
      VALUES ('Lab Fees', 150.00, 'ICT 200', '2024/2025', 'Laboratory usage fees')
    `);

    // Create sample programs
    await sequelize.query(`
      INSERT IGNORE INTO programs (name, duration, focus, highlights)
      VALUES (
        'Bachelor of Technology',
        '4 Years',
        'Comprehensive tech education',
        '["Web Development", "Mobile Apps", "Cloud Computing"]'
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO programs (name, duration, focus, highlights)
      VALUES (
        'Advanced Diploma',
        '3 Years',
        'Practical skill development',
        '["Hands-on Projects", "Industry Mentorship", "Internships"]'
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO programs (name, duration, focus, highlights)
      VALUES (
        'Certification Programs',
        '6-12 Months',
        'Specialized skills',
        '["Quick Upskilling", "Job Ready", "Flexible Schedule"]'
      )
    `);

    // Create sample faculty members
    const sarahQualifications = JSON.stringify(["Ph.D. Computer Science, MIT", "M.S. Software Engineering, Stanford", "B.S. Computer Science, Berkeley"]);
    await sequelize.query(`
      INSERT IGNORE INTO faculties (name, position, specialization, email, phone, office, image, bio, qualifications)
      VALUES (
        'Dr. Sarah Johnson',
        'Head of Department',
        'Artificial Intelligence & Machine Learning',
        'sarah.johnson@ict.edu',
        '+1 (555) 123-4567',
        'ICT Building, Room 301',
        '👩‍💼',
        'Dr. Johnson has over 15 years of experience in AI research and industry applications. She holds a Ph.D. in Computer Science from MIT and has published extensively in top-tier conferences.',
        ?
      )
    `, { replacements: [sarahQualifications] });

    const michaelQualifications = JSON.stringify(["Ph.D. Software Engineering, Carnegie Mellon", "M.S. Computer Science, UC Berkeley", "B.S. Software Engineering, Waterloo"]);
    await sequelize.query(`
      INSERT IGNORE INTO faculties (name, position, specialization, email, phone, office, image, bio, qualifications)
      VALUES (
        'Prof. Michael Chen',
        'Professor of Software Engineering',
        'Full-Stack Development & Cloud Computing',
        'michael.chen@ict.edu',
        '+1 (555) 123-4568',
        'ICT Building, Room 302',
        '👨‍💼',
        'Prof. Chen brings 20 years of industry experience from leading tech companies. He specializes in scalable software architecture and has led development teams at Microsoft and Google.',
        ?
      )
    `, { replacements: [michaelQualifications] });

    const emilyQualifications = JSON.stringify(["Ph.D. Cybersecurity, Purdue", "M.S. Information Security, NYU", "CISSP, CEH, GSEC Certifications"]);
    await sequelize.query(`
      INSERT IGNORE INTO faculties (name, position, specialization, email, phone, office, image, bio, qualifications)
      VALUES (
        'Dr. Emily Rodriguez',
        'Associate Professor',
        'Cybersecurity & Network Administration',
        'emily.rodriguez@ict.edu',
        '+1 (555) 123-4569',
        'ICT Building, Room 303',
        '👩‍💼',
        'Dr. Rodriguez is a cybersecurity expert with extensive experience in government and private sector security implementations. She holds multiple security certifications and has authored several books on network security.',
        ?
      )
    `, { replacements: [emilyQualifications] });

    const davidQualifications = JSON.stringify(["Ph.D. Data Science, Northwestern", "M.S. Statistics, University of Chicago", "B.S. Mathematics, Harvard"]);
    await sequelize.query(`
      INSERT IGNORE INTO faculties (name, position, specialization, email, phone, office, image, bio, qualifications)
      VALUES (
        'Prof. David Kim',
        'Assistant Professor',
        'Data Science & Analytics',
        'david.kim@ict.edu',
        '+1 (555) 123-4570',
        'ICT Building, Room 304',
        '👨‍💼',
        'Prof. Kim combines academic research with practical data science applications. His work in predictive analytics and machine learning has been applied in healthcare, finance, and smart city projects.',
        ?
      )
    `, { replacements: [davidQualifications] });

    const lisaQualifications = JSON.stringify(["Ph.D. Human-Computer Interaction, Georgia Tech", "M.S. Web Development, Full Sail University", "B.S. Graphic Design, RISD"]);
    await sequelize.query(`
      INSERT IGNORE INTO faculties (name, position, specialization, email, phone, office, image, bio, qualifications)
      VALUES (
        'Dr. Lisa Thompson',
        'Senior Lecturer',
        'Web Development & User Experience',
        'lisa.thompson@ict.edu',
        '+1 (555) 123-4571',
        'ICT Building, Room 305',
        '👩‍💼',
        'Dr. Thompson is an expert in modern web technologies and user experience design. She has worked with numerous startups and established companies to create user-centered digital products.',
        ?
      )
    `, { replacements: [lisaQualifications] });

    const jamesQualifications = JSON.stringify(["M.S. Mobile Computing, KTH Stockholm", "B.S. Computer Engineering, ETH Zurich", "Google Developer Expert, Apple Certified Developer"]);
    await sequelize.query(`
      INSERT IGNORE INTO faculties (name, position, specialization, email, phone, office, image, bio, qualifications)
      VALUES (
        'Prof. James Wilson',
        'Lecturer',
        'Mobile App Development & IoT',
        'james.wilson@ict.edu',
        '+1 (555) 123-4572',
        'ICT Building, Room 306',
        '👨‍💼',
        'Prof. Wilson specializes in mobile application development and Internet of Things technologies. He has developed apps with millions of downloads and leads IoT research initiatives.',
        ?
      )
    `, { replacements: [jamesQualifications] });

    // Get student and due IDs for associations
    const [students] = await sequelize.query('SELECT id FROM users WHERE role = "student"');
    const [dues] = await sequelize.query('SELECT id FROM dues');
  
    if (students.length > 0 && dues.length > 0) {
      const studentId = students[0].id;
       
      // Create student dues associations
      for (const due of dues) {
        await sequelize.query(`
          INSERT IGNORE INTO student_dues (student_id, due_id, amount_paid, balance, status)
          VALUES (?, ?, 0, (SELECT amount FROM dues WHERE id = ?), 'Not Paid')
        `, { replacements: [studentId, due.id, due.id] });
      }
    }

    // Create sample partners
    await sequelize.query(`
      INSERT IGNORE INTO partners (name, logo_url, website_url, description, sort_order)
      VALUES (
        'Microsoft',
        'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
        'https://microsoft.com',
        'Technology partner providing software and cloud services',
        1
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO partners (name, logo_url, website_url, description, sort_order)
      VALUES (
        'Google',
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        'https://google.com',
        'Technology partner specializing in search, cloud, and AI technologies',
        2
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO partners (name, logo_url, website_url, description, sort_order)
      VALUES (
        'Amazon',
        'https://www.amazon.com/images/I/11Y5er+qnOL._SX331_BO1,204,203,200_.png',
        'https://amazon.com',
        'E-commerce and cloud computing partner',
        3
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO partners (name, logo_url, website_url, description, sort_order)
      VALUES (
        'Apple',
        'https://www.apple.com/ac/globalnav/7/en_US/images/be150f95-20a5-44fb-868e-6ee0c4da53a0/globalnav_link_image___bkcwn7y7zyeq.png',
        'https://apple.com',
        'Technology partner specializing in mobile devices and software',
        4
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO partners (name, logo_url, website_url, description, sort_order)
      VALUES (
        'IBM',
        'https://www.ibm.com/images/ct-logo-2500x1036-blue-2.png',
        'https://ibm.com',
        'Technology partner in enterprise solutions and AI',
        5
      )
    `);

    await sequelize.query(`
      INSERT IGNORE INTO partners (name, logo_url, website_url, description, sort_order)
      VALUES (
        'Oracle',
        'https://www.oracle.com/asset/web/digital-asset/oracle-logo-2.png',
        'https://oracle.com',
        'Enterprise software and database partner',
        6
      )
    `);

    console.log('Demo data inserted successfully');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@ict.edu / admin123');
    console.log('HOD: hod@ict.edu / hod123');
    console.log('Student: student@ict.edu / student123');

  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(0);
  }
};

initDatabase();