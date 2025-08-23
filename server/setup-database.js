const { createConnection, executeQuery } = require('./database/connection');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    // Create deals table
    const createDealsTable = `
      CREATE TABLE IF NOT EXISTS deals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        stage ENUM('New', 'In Progress', 'Won', 'Lost') DEFAULT 'New',
        value DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        close_date DATE,
        description TEXT,
        INDEX idx_name (name),
        INDEX idx_company (company),
        INDEX idx_stage (stage),
        INDEX idx_value (value),
        INDEX idx_created_at (created_at),
        INDEX idx_close_date (close_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await executeQuery(createDealsTable);
    console.log('✅ Deals table created successfully');
    
    // Check if table has data
    const [existingDeals] = await executeQuery('SELECT COUNT(*) as count FROM deals');
    
    if (existingDeals.count === 0) {
      console.log('🌱 Seeding deals table with sample data...');
      
      const sampleDeals = [
        {
          name: 'Enterprise Software License',
          contact_name: 'John Smith',
          company: 'TechCorp Inc.',
          stage: 'Won',
          value: 50000.00,
          close_date: '2024-01-15',
          description: 'Annual enterprise software license renewal for 500 users'
        },
        {
          name: 'Cloud Migration Project',
          contact_name: 'Sarah Johnson',
          company: 'Global Solutions Ltd.',
          stage: 'In Progress',
          value: 125000.00,
          close_date: '2024-03-30',
          description: 'Complete cloud infrastructure migration for enterprise client'
        },
        {
          name: 'Mobile App Development',
          contact_name: 'Mike Chen',
          company: 'StartupXYZ',
          stage: 'New',
          value: 75000.00,
          close_date: '2024-06-15',
          description: 'Custom mobile application development for iOS and Android'
        },
        {
          name: 'Data Analytics Platform',
          contact_name: 'Emily Davis',
          company: 'DataFlow Systems',
          stage: 'Lost',
          value: 200000.00,
          close_date: '2024-02-28',
          description: 'Advanced data analytics and visualization platform'
        },
        {
          name: 'Cybersecurity Audit',
          contact_name: 'Robert Wilson',
          company: 'SecureNet Corp.',
          stage: 'In Progress',
          value: 45000.00,
          close_date: '2024-04-15',
          description: 'Comprehensive cybersecurity assessment and audit services'
        },
        {
          name: 'API Integration Services',
          contact_name: 'Lisa Thompson',
          company: 'ConnectAPI Solutions',
          stage: 'New',
          value: 35000.00,
          close_date: '2024-07-01',
          description: 'Third-party API integration and custom connector development'
        },
        {
          name: 'Training Program',
          contact_name: 'David Brown',
          company: 'LearnTech Academy',
          stage: 'Won',
          value: 25000.00,
          close_date: '2024-01-30',
          description: 'Employee training program for new software implementation'
        },
        {
          name: 'Maintenance Contract',
          contact_name: 'Jennifer Lee',
          company: 'MaintainPro Services',
          stage: 'In Progress',
          value: 18000.00,
          close_date: '2024-05-15',
          description: 'Annual maintenance and support contract renewal'
        },
        {
          name: 'Consulting Services',
          contact_name: 'Alex Rodriguez',
          company: 'ConsultCorp',
          stage: 'New',
          value: 95000.00,
          close_date: '2024-08-30',
          description: 'Strategic IT consulting for digital transformation'
        },
        {
          name: 'Hardware Upgrade',
          contact_name: 'Maria Garcia',
          company: 'Hardware Solutions',
          stage: 'Lost',
          value: 75000.00,
          close_date: '2024-03-15',
          description: 'Complete hardware infrastructure upgrade project'
        }
      ];
      
      for (const deal of sampleDeals) {
        await executeQuery(`
          INSERT INTO deals (name, contact_name, company, stage, value, close_date, description)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [deal.name, deal.contact_name, deal.company, deal.stage, deal.value, deal.close_date, deal.description]);
      }
      
      console.log(`✅ Seeded ${sampleDeals.length} sample deals successfully`);
    } else {
      console.log('ℹ️  Deals table already contains data, skipping seeding');
    }
    
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
