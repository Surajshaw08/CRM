import React from 'react';
import './custom.css';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DealsDashboard from './components/DealsDashboard';
import DealForm from './components/DealForm';
import DealDetail from './components/DealDetail';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<DealsDashboard />} />
            <Route path="/deals/new" element={<DealForm />} />
            <Route path="/deals/:id" element={<DealDetail />} />
            <Route path="/deals/:id/edit" element={<DealForm />} />
          </Routes>
        </motion.div>
      </Container>
    </Box>
  );
};

export default App;
