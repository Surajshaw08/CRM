import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const DealCard = ({ deal, onView, onEdit, onDelete }) => {
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

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Get company initials for avatar
  const getCompanyInitials = (company) => {
    return company
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header with Stage */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              {deal.name}
            </Typography>
            <Chip
              label={deal.stage}
              color={getStageColor(deal.stage)}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* Company Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
              {getCompanyInitials(deal.company)}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {deal.company}
              </Typography>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {deal.contact_name}
            </Typography>
          </Box>

          {/* Value */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MoneyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {formatCurrency(deal.value)}
            </Typography>
          </Box>

          {/* Dates */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Created: {formatDate(deal.created_at)}
              </Typography>
            </Box>
            {deal.close_date && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Close: {formatDate(deal.close_date)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Description Preview */}
          {deal.description && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}>
                {deal.description}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={onView}
                color="primary"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Edit Deal">
              <IconButton
                size="small"
                onClick={onEdit}
                color="secondary"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'secondary.light',
                    color: 'white'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Delete Deal">
            <IconButton
              size="small"
              onClick={onDelete}
              color="error"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'error.light',
                  color: 'white'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default DealCard;
