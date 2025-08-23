import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const DealForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    company: '',
    stage: 'New',
    value: '',
    close_date: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load deal data if editing
  useEffect(() => {
    if (isEditing) {
      loadDeal();
    }
  }, [id]);

  const loadDeal = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/deals/${id}`);
      if (response.data.success) {
        const deal = response.data.data;
        setFormData({
          name: deal.name || '',
          contact_name: deal.contact_name || '',
          company: deal.company || '',
          stage: deal.stage || 'New',
          value: deal.value || '',
          close_date: deal.close_date || '',
          description: deal.description || ''
        });
      }
    } catch (err) {
      console.error('Error loading deal:', err);
      setError('Failed to load deal data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear any previous errors
    if (error) setError(null);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Deal name is required');
      return false;
    }
    if (!formData.contact_name.trim()) {
      setError('Contact name is required');
      return false;
    }
    if (!formData.company.trim()) {
      setError('Company name is required');
      return false;
    }
    if (formData.value && isNaN(parseFloat(formData.value))) {
      setError('Value must be a valid number');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const submitData = {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : 0
      };

      let response;
      if (isEditing) {
        response = await axios.put(`/api/deals/${id}`, submitData);
      } else {
        response = await axios.post('/api/deals', submitData);
      }

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving deal:', err);
      setError(err.response?.data?.message || 'Failed to save deal');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {isEditing ? 'Edit Deal' : 'Create New Deal'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              Deal {isEditing ? 'updated' : 'created'} successfully! Redirecting...
            </Alert>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Deal Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deal Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter deal name"
                variant="outlined"
              />
            </Grid>

            {/* Contact and Company */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                value={formData.contact_name}
                onChange={(e) => handleInputChange('contact_name', e.target.value)}
                required
                placeholder="Enter contact name"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
                placeholder="Enter company name"
                variant="outlined"
              />
            </Grid>

            {/* Stage and Value */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={formData.stage}
                  label="Stage"
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Won">Won</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deal Value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="0"
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>

            {/* Close Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Close Date"
                  value={formData.close_date ? new Date(formData.close_date) : null}
                  onChange={(date) => handleInputChange('close_date', date ? date.toISOString().split('T')[0] : '')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  clearable
                />
              </LocalizationProvider>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter deal description"
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                  startIcon={<CancelIcon />}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  size="large"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Deal' : 'Create Deal')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default DealForm;
