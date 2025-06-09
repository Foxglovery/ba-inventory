# BA Inventory System

A comprehensive inventory tracking system for cannabis dispensary/bakery operations, built with React, TypeScript, and Firebase.

## Features

- **Authentication & Role-Based Access**
  - Secure login with Firebase Authentication
  - Different views for kitchen and fulfillment staff
  - Role-based permissions

- **Kitchen Management**
  - Track production batches
  - Monitor ingredient inventory
  - Generate batch codes
  - Recipe management
  - Low inventory alerts

- **Fulfillment Management**
  - QR code scanning for order fulfillment
  - Real-time inventory updates
  - Order tracking
  - Performance metrics

- **Inventory Tracking**
  - Real-time stock levels
  - Batch tracking
  - Ingredient management
  - Automatic reorder alerts

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ba-inventory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Realtime Database

4. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_DATABASE_URL=your_database_url
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  │   ├── kitchen/   # Kitchen-specific pages
  │   └── fulfillment/ # Fulfillment-specific pages
  ├── firebase/      # Firebase configuration and utilities
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  └── theme/         # Material-UI theme configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
