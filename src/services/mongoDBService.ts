
// This file now redirects to the Supabase service
import {
  login,
  logout,
  isAuthenticated,
  verifyAdminPassword,
  getPositions,
  savePosition,
  updatePosition,
  deletePosition,
  getApplications,
  saveApplication,
  updateApplicationStatus,
  getContactMessages,
  saveContactMessage,
  PositionType,
  ApplicationType,
  ContactMessage
} from './supabaseService';

// Re-export everything from the Supabase service
export {
  login,
  logout,
  isAuthenticated,
  verifyAdminPassword,
  getPositions,
  savePosition,
  updatePosition,
  deletePosition,
  getApplications,
  saveApplication,
  updateApplicationStatus,
  getContactMessages,
  saveContactMessage,
  PositionType,
  ApplicationType,
  ContactMessage
};
