# CivicChain: Community Governance & Reporting Platform

A decentralized civic coordination, transparency, and reporting system for Manila communities — connecting citizens, barangays, and law enforcement under one transparent network built on Internet Computer Protocol (ICP).

## 🚀 Deployment Information

### Canister IDs
- **Backend Canister**: `bkyz2-fmaaa-aaaaa-qaaaq-cai`
- **Frontend Canister**: `bd3sg-teaaa-aaaaa-qaaba-cai`

### Live URLs
- **Frontend Application**: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai
- **Backend Candid Interface**: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
- **Development Server**: https://work-1-xjeokbreievqvdym.prod-runtime.all-hands.dev

### ✅ Deployment Status
- **Google Maps API**: ✅ Configured and working (AIzaSyBPrGpYHnJtj4t1S2ioiDKZ98NRG4_IdcM)
- **Backend Connection**: ✅ Verified and functional
- **Frontend Build**: ✅ Successfully deployed to canister
- **Manila Data**: ✅ 36 Barangays and 12 Police Stations loaded
- **DFX Replica**: ✅ Running and healthy

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React.js with Vite, Tailwind CSS, React Router
- **Backend**: Motoko smart contracts on Internet Computer
- **Maps**: Google Maps JavaScript API integration
- **Authentication**: Role-based authentication system
- **State Management**: React Context API

### User Roles
1. **Citizen** - Submit reports, view announcements, vote on proposals
2. **Police Officer** - Manage assigned cases, create announcements
3. **Barangay Official** - Handle local reports, create announcements
4. **Head Police** - Oversee police operations, manage assignments, analytics
5. **Head Barangay** - Manage barangay operations, create proposals, analytics

## 🌟 Features

### Core Functionality
- **Report Management**: Submit, track, and manage community reports
- **DAO Governance**: Create and vote on community proposals
- **Announcements**: Official communications from authorities
- **Analytics Dashboard**: Real-time statistics and insights
- **Google Maps Integration**: Location-based reporting and visualization
- **Role-based Access Control**: Secure, permission-based system

### Manila-Specific Implementation
- **70 Barangays**: Complete coverage of Manila's barangay system
- **12 Police Stations**: Integrated police station network
- **District-based Organization**: 6 districts for efficient management

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- DFX (Internet Computer SDK)
- Google Maps API Key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd civicchain-platform

# Install dependencies
npm install

# Install DFX
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

# Start local replica
dfx start --background

# Deploy canisters
dfx deploy

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env` file:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 📱 User Interface

### Dashboard Features
- **Statistics Overview**: Total reports, users, proposals, announcements
- **Recent Activity**: Latest reports and updates
- **Quick Actions**: Role-specific action buttons
- **Navigation**: Intuitive sidebar with role-based menu items

### Report System
- **Rich Forms**: Categorized reporting with media upload support
- **Location Picker**: Interactive Google Maps integration
- **Status Tracking**: Real-time report status updates
- **Assignment System**: Automatic routing to appropriate authorities

### DAO Governance
- **Proposal Creation**: Officials can create community proposals
- **Voting System**: Democratic decision-making process
- **Budget Tracking**: Transparent fund allocation
- **Public Ledger**: Immutable voting records

## 🔐 Security Features

- **Role-based Authentication**: Secure login system
- **Permission Controls**: Feature access based on user roles
- **Data Encryption**: Secure data storage on ICP
- **Audit Trails**: Complete activity logging
- **Anonymous Reporting**: Privacy-protected submissions

## 📊 Analytics & Reporting

### System-wide Metrics
- Total reports, users, proposals, announcements
- Resolution rates and performance indicators
- Community engagement statistics

### Barangay-specific Analytics
- Report distribution by type and status
- Resolution efficiency metrics
- Community participation rates

## 🌐 Internet Computer Integration

### Smart Contract Features
- **Immutable Storage**: Tamper-proof data storage
- **Decentralized Architecture**: No single point of failure
- **Transparent Operations**: All actions recorded on-chain
- **Scalable Infrastructure**: Built for growth

### Canister Functions
- User management and authentication
- Report creation and status updates
- Proposal and voting system
- Announcement management
- Analytics and reporting

## 🚀 Deployment Status

✅ **Backend Deployed**: Motoko canister successfully deployed
✅ **Frontend Deployed**: React application built and deployed
✅ **Google Maps**: Integration configured (API key required)
✅ **Role System**: Complete user role implementation
✅ **Manila Data**: All 70 barangays and 12 police stations configured

## 📞 Support

For technical support or questions about the CivicChain platform, please refer to the documentation or contact the development team.

---

**CivicChain** - Empowering communities through transparent governance and efficient reporting.