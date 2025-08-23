import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StatisticsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/deals/stats/summary');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate win rate
  const getWinRate = () => {
    if (!stats || !stats.total_deals) return 0;
    return Math.round((stats.won_deals / stats.total_deals) * 100);
  };

  // Get stage color
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Won':
        return 'success';
      case 'Lost':
        return 'error';
      case 'In Progress':
        return 'warning';
      case 'New':
        return 'info';
      default:
        return 'default';
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend, loading }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {title}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="60%" height={32} />
              ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
                  {value}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: `${color}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color
              }}
            >
              {icon}
            </Box>
          </Box>
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="caption"
                color={trend > 0 ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {trend > 0 ? '+' : ''}{trend}%
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Total Deals */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Deals"
          value={stats?.total_deals || 0}
          subtitle="All deals in the system"
          icon={<BusinessIcon />}
          color="primary"
          loading={loading}
        />
      </Grid>

      {/* Total Value */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Value"
          value={formatCurrency(stats?.total_value || 0)}
          subtitle="Combined deal value"
          icon={<MoneyIcon />}
          color="success"
          loading={loading}
        />
      </Grid>

      {/* Win Rate */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Win Rate"
          value={`${getWinRate()}%`}
          subtitle="Success rate of deals"
          icon={<CheckCircleIcon />}
          color="success"
          trend={getWinRate()}
          loading={loading}
        />
      </Grid>

      {/* Average Deal Value */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Avg Deal Value"
          value={formatCurrency(stats?.avg_value || 0)}
          subtitle="Average deal size"
          icon={<MoneyIcon />}
          color="info"
          loading={loading}
        />
      </Grid>

      {/* Stage Breakdown */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                Deals by Stage
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<AddIcon />}
                  label={`New: ${stats?.new_deals || 0}`}
                  color="info"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  icon={<ScheduleIcon />}
                  label={`In Progress: ${stats?.in_progress_deals || 0}`}
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Won: ${stats?.won_deals || 0}`}
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  icon={<CancelIcon />}
                  label={`Lost: ${stats?.lost_deals || 0}`}
                  color="error"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default StatisticsCards;
