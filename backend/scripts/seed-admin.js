const bcrypt = require('bcryptjs');
const env = require('../src/config/env');
const { sequelize, User } = require('../src/models');

const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (!arg.startsWith('--')) {
      return acc;
    }

    
    const [rawKey, ...rawValue] = arg.slice(2).split('=');
    const key = rawKey.trim();
    const value = rawValue.length ? rawValue.join('=').trim() : true;
    acc[key] = value;
    return acc;
  }, {});
}

function printHelp() {
  console.log('Admin seeder for Aména Consulting');
  console.log('');
  console.log('Usage:');
  console.log('  npm run seed:admin');
  console.log('  npm run seed:admin -- --email=admin@amena-consulting.com --password=Admin123456!');
  console.log('');
  console.log('Optional arguments:');
  console.log('  --name=Full Name');
  console.log('  --email=admin@amena-consulting.com');
  console.log('  --password=Admin123456!');
  console.log('  --role=SUPER_ADMIN|ADMIN|EDITOR');
  console.log('');
  console.log('Environment fallbacks:');
  console.log('  SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_ROLE');
}

function resolveSeederConfig(args) {
  const fullName = String(args.name || process.env.SEED_ADMIN_NAME || 'Admin Aména Consulting').trim();
  const email = String(args.email || process.env.SEED_ADMIN_EMAIL || 'admin@amena-consulting.com')
    .trim()
    .toLowerCase();
  const password = String(args.password || process.env.SEED_ADMIN_PASSWORD || 'Admin123456!').trim();
  const role = String(args.role || process.env.SEED_ADMIN_ROLE || 'SUPER_ADMIN').trim().toUpperCase();

  if (!fullName) {
    throw new Error('Admin full name is required.');
  }

  if (!email || !email.includes('@')) {
    throw new Error('A valid admin email is required.');
  }

  if (password.length < 8) {
    throw new Error('Admin password must be at least 8 characters long.');
  }

  if (!VALID_ROLES.includes(role)) {
    throw new Error(`Invalid admin role. Allowed roles: ${VALID_ROLES.join(', ')}`);
  }

  return { fullName, email, password, role };
}

async function seedAdminAccount(config) {
  await sequelize.authenticate();
  await User.sync();

  const passwordHash = await bcrypt.hash(config.password, 10);
  const existingUser = await User.findOne({ where: { email: config.email } });

  if (existingUser) {
    await existingUser.update({
      fullName: config.fullName,
      passwordHash,
      role: config.role,
      isActive: true,
    });

    return { action: 'updated', user: existingUser };
  }

  const user = await User.create({
    fullName: config.fullName,
    email: config.email,
    passwordHash,
    role: config.role,
    isActive: true,
  });

  return { action: 'created', user };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printHelp();
    return;
  }

  const config = resolveSeederConfig(args);
  const usedDefaultPassword = !args.password && !process.env.SEED_ADMIN_PASSWORD;
  const result = await seedAdminAccount(config);

  console.log(`Admin account ${result.action} successfully on database \"${env.dbName}\".`);
  console.log(`Name: ${config.fullName}`);
  console.log(`Email: ${config.email}`);
  console.log(`Role: ${config.role}`);

  if (usedDefaultPassword) {
    console.log(`Password: ${config.password}`);
    console.log('Important: change this default password after first login.');
  } else {
    console.log('Password: custom value provided (not echoed).');
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed admin account:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });