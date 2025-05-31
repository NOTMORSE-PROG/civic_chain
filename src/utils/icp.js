import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './civicchain_backend.did.js';

// Canister ID will be set after deployment
const CANISTER_ID = process.env.REACT_APP_CANISTER_ID || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';

// Create agent
const agent = new HttpAgent({
  host: process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:4943',
});

// Fetch root key for local development
if (process.env.NODE_ENV !== 'production') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
    console.error(err);
  });
}

// Create actor
export const civicchainActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: CANISTER_ID,
});

// Helper functions
export const reportTypes = [
  { value: 'Pothole', label: 'Pothole' },
  { value: 'Theft', label: 'Theft' },
  { value: 'Corruption', label: 'Corruption' },
  { value: 'TrafficViolation', label: 'Traffic Violation' },
  { value: 'NoiseComplaint', label: 'Noise Complaint' },
  { value: 'StreetLight', label: 'Street Light' },
  { value: 'Garbage', label: 'Garbage' },
];

export const userRoles = [
  { value: 'Citizen', label: 'Citizen' },
  { value: 'Police', label: 'Police Officer' },
  { value: 'BarangayOfficial', label: 'Barangay Official' },
  { value: 'HeadPolice', label: 'Head Police' },
  { value: 'HeadBarangay', label: 'Head Barangay' },
];

export const reportStatuses = [
  { value: 'Submitted', label: 'Submitted', class: 'status-submitted' },
  { value: 'UnderReview', label: 'Under Review', class: 'status-underreview' },
  { value: 'InProgress', label: 'In Progress', class: 'status-inprogress' },
  { value: 'Resolved', label: 'Resolved', class: 'status-resolved' },
  { value: 'Escalated', label: 'Escalated', class: 'status-submitted' },
];

// Manila Barangays data
export const manilaBarangays = [
  { number: 1, name: 'Barangay 1', district: 'District 1' },
  { number: 2, name: 'Barangay 2', district: 'District 1' },
  { number: 3, name: 'Barangay 3', district: 'District 1' },
  { number: 4, name: 'Barangay 4', district: 'District 1' },
  { number: 5, name: 'Barangay 5', district: 'District 1' },
  { number: 6, name: 'Barangay 6', district: 'District 1' },
  { number: 7, name: 'Barangay 7', district: 'District 1' },
  { number: 8, name: 'Barangay 8', district: 'District 1' },
  { number: 9, name: 'Barangay 9', district: 'District 1' },
  { number: 10, name: 'Barangay 10', district: 'District 1' },
  { number: 11, name: 'Barangay 11', district: 'District 1' },
  { number: 12, name: 'Barangay 12', district: 'District 1' },
  { number: 13, name: 'Barangay 13', district: 'District 1' },
  { number: 14, name: 'Barangay 14', district: 'District 1' },
  { number: 15, name: 'Barangay 15', district: 'District 1' },
  { number: 16, name: 'Barangay 16', district: 'District 1' },
  { number: 17, name: 'Barangay 17', district: 'District 1' },
  { number: 18, name: 'Barangay 18', district: 'District 1' },
  { number: 19, name: 'Barangay 19', district: 'District 1' },
  { number: 20, name: 'Barangay 20', district: 'District 1' },
  // District 2
  { number: 21, name: 'Barangay 21', district: 'District 2' },
  { number: 22, name: 'Barangay 22', district: 'District 2' },
  { number: 23, name: 'Barangay 23', district: 'District 2' },
  { number: 24, name: 'Barangay 24', district: 'District 2' },
  { number: 25, name: 'Barangay 25', district: 'District 2' },
  { number: 26, name: 'Barangay 26', district: 'District 2' },
  { number: 27, name: 'Barangay 27', district: 'District 2' },
  { number: 28, name: 'Barangay 28', district: 'District 2' },
  { number: 29, name: 'Barangay 29', district: 'District 2' },
  { number: 30, name: 'Barangay 30', district: 'District 2' },
  // District 3
  { number: 31, name: 'Barangay 31', district: 'District 3' },
  { number: 32, name: 'Barangay 32', district: 'District 3' },
  { number: 33, name: 'Barangay 33', district: 'District 3' },
  { number: 34, name: 'Barangay 34', district: 'District 3' },
  { number: 35, name: 'Barangay 35', district: 'District 3' },
  { number: 36, name: 'Barangay 36', district: 'District 3' },
  { number: 37, name: 'Barangay 37', district: 'District 3' },
  { number: 38, name: 'Barangay 38', district: 'District 3' },
  { number: 39, name: 'Barangay 39', district: 'District 3' },
  { number: 40, name: 'Barangay 40', district: 'District 3' },
  // District 4
  { number: 41, name: 'Barangay 41', district: 'District 4' },
  { number: 42, name: 'Barangay 42', district: 'District 4' },
  { number: 43, name: 'Barangay 43', district: 'District 4' },
  { number: 44, name: 'Barangay 44', district: 'District 4' },
  { number: 45, name: 'Barangay 45', district: 'District 4' },
  { number: 46, name: 'Barangay 46', district: 'District 4' },
  { number: 47, name: 'Barangay 47', district: 'District 4' },
  { number: 48, name: 'Barangay 48', district: 'District 4' },
  { number: 49, name: 'Barangay 49', district: 'District 4' },
  { number: 50, name: 'Barangay 50', district: 'District 4' },
  // District 5
  { number: 51, name: 'Barangay 51', district: 'District 5' },
  { number: 52, name: 'Barangay 52', district: 'District 5' },
  { number: 53, name: 'Barangay 53', district: 'District 5' },
  { number: 54, name: 'Barangay 54', district: 'District 5' },
  { number: 55, name: 'Barangay 55', district: 'District 5' },
  { number: 56, name: 'Barangay 56', district: 'District 5' },
  { number: 57, name: 'Barangay 57', district: 'District 5' },
  { number: 58, name: 'Barangay 58', district: 'District 5' },
  { number: 59, name: 'Barangay 59', district: 'District 5' },
  { number: 60, name: 'Barangay 60', district: 'District 5' },
  // District 6
  { number: 61, name: 'Barangay 61', district: 'District 6' },
  { number: 62, name: 'Barangay 62', district: 'District 6' },
  { number: 63, name: 'Barangay 63', district: 'District 6' },
  { number: 64, name: 'Barangay 64', district: 'District 6' },
  { number: 65, name: 'Barangay 65', district: 'District 6' },
  { number: 66, name: 'Barangay 66', district: 'District 6' },
  { number: 67, name: 'Barangay 67', district: 'District 6' },
  { number: 68, name: 'Barangay 68', district: 'District 6' },
  { number: 69, name: 'Barangay 69', district: 'District 6' },
  { number: 70, name: 'Barangay 70', district: 'District 6' },
];

// Police stations in Manila
export const manilaPoliceStations = [
  { id: 'mps1', name: 'Manila Police Station 1', district: 'District 1', address: 'Intramuros, Manila' },
  { id: 'mps2', name: 'Manila Police Station 2', district: 'District 2', address: 'Binondo, Manila' },
  { id: 'mps3', name: 'Manila Police Station 3', district: 'District 3', address: 'Quiapo, Manila' },
  { id: 'mps4', name: 'Manila Police Station 4', district: 'District 4', address: 'Ermita, Manila' },
  { id: 'mps5', name: 'Manila Police Station 5', district: 'District 5', address: 'Malate, Manila' },
  { id: 'mps6', name: 'Manila Police Station 6', district: 'District 6', address: 'Paco, Manila' },
  { id: 'mps7', name: 'Manila Police Station 7', district: 'District 1', address: 'Port Area, Manila' },
  { id: 'mps8', name: 'Manila Police Station 8', district: 'District 2', address: 'Tondo, Manila' },
  { id: 'mps9', name: 'Manila Police Station 9', district: 'District 3', address: 'Santa Cruz, Manila' },
  { id: 'mps10', name: 'Manila Police Station 10', district: 'District 4', address: 'San Miguel, Manila' },
  { id: 'mps11', name: 'Manila Police Station 11', district: 'District 5', address: 'Sampaloc, Manila' },
  { id: 'mps12', name: 'Manila Police Station 12', district: 'District 6', address: 'Santa Ana, Manila' },
];