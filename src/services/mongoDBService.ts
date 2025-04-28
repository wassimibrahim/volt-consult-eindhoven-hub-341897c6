
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
};

// Re-export types using the "export type" syntax
export type { PositionType, ApplicationType, ContactMessage } from './supabaseService';
