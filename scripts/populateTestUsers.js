import { getActor } from '../src/utils/icp';

const testUsers = [
  // Citizens
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'Citizen',
    departments: [],
    barangays: []
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'Citizen',
    departments: [],
    barangays: []
  },

  // Police Officials
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@manilapd.gov.ph',
    password: 'password123',
    role: 'Police',
    departments: ['Manila Police Station 1'],
    barangays: []
  },
  {
    name: 'Sarah Williams',
    email: 'sarah.williams@manilapd.gov.ph',
    password: 'password123',
    role: 'Police',
    departments: ['Manila Police Station 2'],
    barangays: []
  },

  // Barangay Officials
  {
    name: 'Maria Santos',
    email: 'maria.santos@barangay.gov.ph',
    password: 'password123',
    role: 'BarangayOfficial',
    departments: [],
    barangays: ['Barangay 1']
  },
  {
    name: 'Pedro Cruz',
    email: 'pedro.cruz@barangay.gov.ph',
    password: 'password123',
    role: 'BarangayOfficial',
    departments: [],
    barangays: ['Barangay 2']
  },

  // Department Heads
  {
    name: 'Robert Garcia',
    email: 'robert.garcia@manilapd.gov.ph',
    password: 'password123',
    role: 'HeadPolice',
    departments: ['Manila Police District'],
    barangays: []
  },
  {
    name: 'Elena Reyes',
    email: 'elena.reyes@barangay.gov.ph',
    password: 'password123',
    role: 'HeadBarangay',
    departments: [],
    barangays: ['District 1']
  }
];

async function populateTestUsers() {
  try {
    const actor = await getActor();
    console.log('Starting to populate test users...');

    for (const user of testUsers) {
      console.log(`Registering user: ${user.name}`);
      const result = await actor.registerUser(
        user.name,
        user.email,
        user.role,
        user.departments,
        user.barangays
      );

      if ('Ok' in result) {
        console.log(`Successfully registered ${user.name}`);
      } else {
        console.error(`Failed to register ${user.name}:`, result.Err);
      }
    }

    console.log('Finished populating test users');
  } catch (error) {
    console.error('Error populating test users:', error);
  }
}

// Run the population script
populateTestUsers(); 