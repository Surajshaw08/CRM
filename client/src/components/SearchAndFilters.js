import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Collapse,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SearchAndFilters = ({ filters, onFilterChange, showFilters, setShowFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      stage: 'all',
      minValue: '',
      maxValue: '',
      startDate: '',
      endDate: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all'
  );

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 'all'
    ).length;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search deals by name, contact, or company..."
              value={localFilters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: localFilters.search && (
                  <IconButton
                    size="small"
                    onClick={() => handleInputChange('search', '')}
                  >
                    <ClearIcon />
                  </IconButton>
                )
              }}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ flex: 1 }}
              >
                Filters
                {hasActiveFilters && (
                  <Chip
                    label={getActiveFilterCount()}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
              <Button
                variant="contained"
                onClick={applyFilters}
                sx={{ minWidth: 100 }}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {/* Stage Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={localFilters.stage}
                  label="Stage"
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                >
                  <MenuItem value="all">All Stages</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Won">Won</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Value Range Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Value"
                type="number"
                value={localFilters.minValue}
                onChange={(e) => handleInputChange('minValue', e.target.value)}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                }}
                placeholder="0"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Value"
                type="number"
                value={localFilters.maxValue}
                onChange={(e) => handleInputChange('maxValue', e.target.value)}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                }}
                placeholder="1000000"
              />
            </Grid>

            {/* Date Range Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={localFilters.startDate ? new Date(localFilters.startDate) : null}
                  onChange={(date) => handleInputChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  clearable
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={localFilters.endDate ? new Date(filters.endDate) : null}
                  onChange={(date) => handleInputChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  clearable
                />
              </LocalizationProvider>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  sx={{ flex: 1 }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  sx={{ flex: 1 }}
                >
                  Apply
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    onDelete={() => handleInputChange('search', '')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.stage !== 'all' && (
                  <Chip
                    label={`Stage: ${filters.stage}`}
                    onDelete={() => handleInputChange('stage', 'all')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.minValue && (
                  <Chip
                    label={`Min: $${filters.minValue}`}
                    onDelete={() => handleInputChange('minValue', '')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.maxValue && (
                  <Chip
                    label={`Max: $${filters.maxValue}`}
                    onDelete={() => handleInputChange('maxValue', '')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.startDate && (
                  <Chip
                    label={`From: ${filters.startDate}`}
                    onDelete={() => handleInputChange('startDate', '')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.endDate && (
                  <Chip
                    label={`To: ${filters.endDate}`}
                    onDelete={() => handleInputChange('endDate', '')}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </motion.div>
      </Collapse>
    </Paper>
  );
};

export default SearchAndFilters;
