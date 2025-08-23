const express = require('express');
const { executeQuery } = require('../database/connection');
const router = express.Router();

// GET /api/deals - Get all deals with search and filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      stage,
      minValue,
      maxValue,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    let whereConditions = [];
    let queryParams = [];
    let offset = (page - 1) * limit;

    // Search functionality
    if (search) {
      whereConditions.push(`
        (name LIKE ? OR contact_name LIKE ? OR company LIKE ?)
      `);
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Stage filter
    if (stage && stage !== 'all') {
      whereConditions.push('stage = ?');
      queryParams.push(stage);
    }

    // Value range filter
    if (minValue !== undefined && minValue !== '') {
      whereConditions.push('value >= ?');
      queryParams.push(parseFloat(minValue));
    }
    if (maxValue !== undefined && maxValue !== '') {
      whereConditions.push('value <= ?');
      queryParams.push(parseFloat(maxValue));
    }

    // Date range filter
    if (startDate) {
      whereConditions.push('created_at >= ?');
      queryParams.push(startDate);
    }
    if (endDate) {
      whereConditions.push('created_at <= ?');
      queryParams.push(endDate + ' 23:59:59');
    }

    // Build WHERE clause
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Validate sort parameters
    const allowedSortFields = ['name', 'contact_name', 'company', 'stage', 'value', 'created_at', 'close_date'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Count total records for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM deals
      ${whereClause}
    `;
    
    const [countResult] = await executeQuery(countQuery, queryParams);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // Get deals with pagination
    const dealsQuery = `
      SELECT 
        id,
        name,
        contact_name,
        company,
        stage,
        value,
        created_at,
        close_date,
        description
      FROM deals
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
    `;

    const deals = await executeQuery(dealsQuery, [...queryParams, parseInt(limit), offset]);

    // Calculate summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_deals,
        SUM(CASE WHEN stage = 'Won' THEN 1 ELSE 0 END) as won_deals,
        SUM(CASE WHEN stage = 'Lost' THEN 1 ELSE 0 END) as lost_deals,
        SUM(CASE WHEN stage = 'In Progress' THEN 1 ELSE 0 END) as in_progress_deals,
        SUM(CASE WHEN stage = 'New' THEN 1 ELSE 0 END) as new_deals,
        SUM(value) as total_value,
        AVG(value) as avg_value
      FROM deals
      ${whereClause}
    `;

    const [stats] = await executeQuery(statsQuery, queryParams);

    res.json({
      success: true,
      data: {
        deals,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_records: total,
          limit: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1
        },
        filters: {
          search,
          stage,
          minValue,
          maxValue,
          startDate,
          endDate
        },
        sorting: {
          sortBy: validSortBy,
          sortOrder: validSortOrder
        },
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deals',
      message: error.message
    });
  }
});

// GET /api/deals/:id - Get single deal
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deal] = await executeQuery(
      'SELECT * FROM deals WHERE id = ?',
      [id]
    );

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    res.json({
      success: true,
      data: deal
    });

  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deal',
      message: error.message
    });
  }
});

// POST /api/deals - Create new deal
router.post('/', async (req, res) => {
  try {
    const { name, contact_name, company, stage, value, close_date, description } = req.body;

    // Validation
    if (!name || !contact_name || !company) {
      return res.status(400).json({
        success: false,
        error: 'Name, contact name, and company are required'
      });
    }

    const result = await executeQuery(`
      INSERT INTO deals (name, contact_name, company, stage, value, close_date, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, contact_name, company, stage || 'New', value || 0, close_date, description]);

    const newDeal = await executeQuery(
      'SELECT * FROM deals WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: newDeal[0],
      message: 'Deal created successfully'
    });

  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create deal',
      message: error.message
    });
  }
});

// PUT /api/deals/:id - Update deal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_name, company, stage, value, close_date, description } = req.body;

    // Check if deal exists
    const [existingDeal] = await executeQuery(
      'SELECT id FROM deals WHERE id = ?',
      [id]
    );

    if (!existingDeal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    // Update deal
    await executeQuery(`
      UPDATE deals 
      SET name = ?, contact_name = ?, company = ?, stage = ?, value = ?, close_date = ?, description = ?
      WHERE id = ?
    `, [name, contact_name, company, stage, value, close_date, description, id]);

    // Get updated deal
    const [updatedDeal] = await executeQuery(
      'SELECT * FROM deals WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      data: updatedDeal,
      message: 'Deal updated successfully'
    });

  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update deal',
      message: error.message
    });
  }
});

// DELETE /api/deals/:id - Delete deal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if deal exists
    const [existingDeal] = await executeQuery(
      'SELECT id FROM deals WHERE id = ?',
      [id]
    );

    if (!existingDeal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    // Delete deal
    await executeQuery('DELETE FROM deals WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Deal deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete deal',
      message: error.message
    });
  }
});

// GET /api/deals/stats/summary - Get summary statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total_deals,
        SUM(CASE WHEN stage = 'Won' THEN 1 ELSE 0 END) as won_deals,
        SUM(CASE WHEN stage = 'Lost' THEN 1 ELSE 0 END) as lost_deals,
        SUM(CASE WHEN stage = 'In Progress' THEN 1 ELSE 0 END) as in_progress_deals,
        SUM(CASE WHEN stage = 'New' THEN 1 ELSE 0 END) as new_deals,
        SUM(value) as total_value,
        AVG(value) as avg_value,
        MAX(value) as max_value,
        MIN(value) as min_value
      FROM deals
    `);

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router;
