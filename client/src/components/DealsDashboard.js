import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Skeleton,
  Alert,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import SearchAndFilters from './SearchAndFilters';
import DealCard from './DealCard';
import StatisticsCards from './StatisticsCards';

const DealsDashboard = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    stage: 'all',
    minValue: '',
    maxValue: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Fetch deals with current filters and pagination
  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        sortOrder
      };

      const response = await axios.get('/api/deals', { params });
      
      if (response.data.success) {
        setDeals(response.data.data.deals);
        setPagination(response.data.data.pagination);
      } else {
        setError('Failed to fetch deals');
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError(err.response?.data?.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, currentPage: value }));
  };

  // Handle sorting change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  // Handle deal deletion
  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await axios.delete(`/api/deals/${dealId}`);
        fetchDeals(); // Refresh the list
      } catch (err) {
        console.error('Error deleting deal:', err);
        alert('Failed to delete deal');
      }
    }
  };

  // Fetch deals when filters, pagination, or sorting changes
  useEffect(() => {
    fetchDeals();
  }, [filters, pagination.currentPage, sortBy, sortOrder]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="30%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Deals Dashboard
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/deals/new')}
              size="large"
            >
              New Deal
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SearchAndFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </motion.div>

      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {deals.length} of {pagination.totalRecords} deals
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="created_at">Date Created</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            <MenuItem value="value">Value</MenuItem>
            <MenuItem value="close_date">Close Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Deals Grid */}
      <Box sx={{ mb: 3 }}>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : deals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No deals found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Try adjusting your search criteria or create a new deal.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/deals/new')}
              >
                Create First Deal
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <AnimatePresence>
            <Grid container spacing={3}>
              {deals.map((deal, index) => (
                <Grid item xs={12} sm={6} md={4} key={deal.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <DealCard
                      deal={deal}
                      onView={() => navigate(`/deals/${deal.id}`)}
                      onEdit={() => navigate(`/deals/${deal.id}/edit`)}
                      onDelete={() => handleDeleteDeal(deal.id)}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
      </Box>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default DealsDashboard;
