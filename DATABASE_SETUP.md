# Database Setup Guide

## Prerequisites

1. **MySQL Server** (8.0 or higher) must be installed and running
2. **Node.js** (16 or higher) must be installed
3. **npm** or **yarn** package manager

## Quick Setup (Recommended)

### 1. Automatic Setup
```bash
# Run the setup script
npm run setup-db
```

This will:
- Create the database if it doesn't exist
- Create the deals table with proper structure
- Seed the database with sample data
- Set up all necessary indexes

### 2. Manual Setup

#### Step 1: Create Database
```sql
CREATE DATABASE cms_deals;
USE cms_deals;
```

#### Step 2: Create Table
```sql
CREATE TABLE deals (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Step 3: Insert Sample Data
```sql
INSERT INTO deals (name, contact_name, company, stage, value, close_date, description) VALUES
('Enterprise Software License', 'John Smith', 'TechCorp Inc.', 'Won', 50000.00, '2024-01-15', 'Annual enterprise software license renewal for 500 users'),
('Cloud Migration Project', 'Sarah Johnson', 'Global Solutions Ltd.', 'In Progress', 125000.00, '2024-03-30', 'Complete cloud infrastructure migration for enterprise client'),
('Mobile App Development', 'Mike Chen', 'StartupXYZ', 'New', 75000.00, '2024-06-15', 'Custom mobile application development for iOS and Android');
```

## Configuration

### Database Connection Settings

Update the database connection in `server/database/connection.js`:

```javascript
const dbConfig = {
  host: 'localhost',        // Your MySQL host
  user: 'root',            // Your MySQL username
  password: '',            // Your MySQL password
  database: 'cms_deals',   // Database name
  port: 3306               // MySQL port
};
```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cms_deals
DB_PORT=3306
```

## Troubleshooting

### Common Issues

1. **Access Denied Error**
   - Verify MySQL user has proper permissions
   - Check if password is correct
   - Ensure user can create databases

2. **Connection Refused**
   - Verify MySQL service is running
   - Check if port 3306 is correct
   - Ensure firewall allows connections

3. **Database Not Found**
   - Run the setup script again
   - Check if database name is correct
   - Verify user has CREATE DATABASE permission

### Verification

Test the connection:
```bash
# Test database connection
cd server
node -e "
const mysql = require('mysql2/promise');
const config = require('./database/connection');
config.createConnection().then(() => console.log('✅ Connected!')).catch(console.error);
"
```

## Sample Data

The system comes with 10 sample deals covering:
- Software licenses
- Cloud projects
- Mobile development
- Data analytics
- Cybersecurity
- Training programs
- Maintenance contracts
- Consulting services
- Hardware upgrades
- API integrations

## Performance Notes

- **Indexes**: All frequently queried fields are indexed
- **Connection Pooling**: Efficient connection management
- **Query Optimization**: Optimized SQL queries for performance
- **Pagination**: Server-side pagination for large datasets

## Security Considerations

- **Parameterized Queries**: Protection against SQL injection
- **Input Validation**: Server-side validation
- **Connection Security**: Secure database connections
- **Access Control**: Proper user permissions

---

For additional help, check the main README.md file or create an issue in the repository.
