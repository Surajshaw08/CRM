# CRM Deals Module

A full-stack CRM deals management system with advanced search, filtering, and analytics capabilities.

## 🚀 Features

### Frontend (React + MUI + Framer Motion)
- **Modern UI**: Clean, responsive interface built with Material-UI components
- **Advanced Search**: Search deals by name, contact, or company
- **Smart Filtering**: Filter by stage, value range, and date ranges
- **Smooth Animations**: Beautiful transitions powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Statistics**: Live dashboard with deal metrics and KPIs
- **Pagination**: Efficient handling of large datasets

### Backend (Express + MySQL)
- **RESTful API**: Clean, well-structured endpoints for all CRUD operations
- **Advanced Querying**: Efficient search and filtering with MySQL optimization
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Rate limiting, CORS protection, and input sanitization
- **Database Optimization**: Proper indexing for performance

## 🏗️ Architecture

```
CMS/
├── server/                 # Backend Express server
│   ├── database/          # Database connection and queries
│   ├── routes/            # API endpoints
│   └── setup-database.js  # Database initialization
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   └── public/            # Static assets
└── package.json           # Root package configuration
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **mysql2** - MySQL driver with promises
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Date-fns** - Date manipulation

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to root
cd ..
```

### 2. Database Setup

#### Option A: Using the setup script (Recommended)
```bash
npm run setup-db
```

#### Option B: Manual setup
1. Create a MySQL database named `cms_deals`
2. Update database credentials in `server/database/connection.js` if needed
3. Run the server to auto-create tables

### 3. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cms_deals
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Schema

The system automatically creates the following table structure:

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
);
```

## 📱 API Endpoints

### Deals
- `GET /api/deals` - Get all deals with search/filtering
- `GET /api/deals/:id` - Get specific deal
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Statistics
- `GET /api/deals/stats/summary` - Get deal statistics

### Query Parameters
- `search` - Text search across name, contact, company
- `stage` - Filter by deal stage
- `minValue` / `maxValue` - Value range filtering
- `startDate` / `endDate` - Date range filtering
- `page` / `limit` - Pagination
- `sortBy` / `sortOrder` - Sorting options

## 🎯 Key Features Explained

### Search & Filtering
- **Text Search**: Searches across deal name, contact name, and company
- **Stage Filtering**: Filter by deal stage (New, In Progress, Won, Lost)
- **Value Range**: Set minimum and maximum deal values
- **Date Range**: Filter by creation date or close date
- **Combined Filters**: All filters work together for precise results

### Performance Optimizations
- **Database Indexing**: Strategic indexes on frequently queried fields
- **Connection Pooling**: Efficient database connection management
- **Pagination**: Server-side pagination for large datasets
- **Query Optimization**: Efficient SQL queries with proper JOINs

### User Experience
- **Responsive Design**: Mobile-first approach with Material-UI
- **Smooth Animations**: Framer Motion for delightful interactions
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages and validation

## 🧪 Testing the Application

1. **Create a Deal**: Navigate to "New Deal" and fill out the form
2. **Search & Filter**: Use the search bar and advanced filters
3. **View Details**: Click on any deal card to see full information
4. **Edit/Delete**: Test CRUD operations on deals
5. **Responsive**: Test on different screen sizes

## 📊 Sample Data

The system comes with 10 sample deals covering various industries and stages:
- Enterprise software licenses
- Cloud migration projects
- Mobile app development
- Data analytics platforms
- Cybersecurity audits
- And more...

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Controlled cross-origin access
- **Helmet Security**: Security headers and protection

## 🚀 Deployment

### Production Considerations
1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Set up proper CORS origins
4. Configure SSL/HTTPS
5. Set up environment-specific variables

### Docker Support (Future Enhancement)
```dockerfile
# Example Docker configuration
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MySQL is running
   - Check database credentials
   - Ensure database exists

2. **Port Already in Use**
   - Change ports in configuration
   - Kill existing processes

3. **Dependencies Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Getting Help

- Check the console for error messages
- Verify all prerequisites are installed
- Ensure database is properly configured

## 🎉 What's Next?

This CRM Deals module provides a solid foundation for:
- **User Authentication**: Add login/signup functionality
- **Role-based Access**: Different permission levels
- **Advanced Analytics**: Charts and reporting
- **Email Notifications**: Deal updates and reminders
- **File Attachments**: Documents and contracts
- **Integration APIs**: Connect with other business tools

---

**Built with ❤️ using modern web technologies**
