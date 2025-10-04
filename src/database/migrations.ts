import { db } from './config';
import { users, userSessions } from './schema';
import { eq } from 'drizzle-orm';
import log from 'electron-log';

// 创建表的 SQL 语句
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const createUserSessionsTable = `
  CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`;

// 创建索引
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);',
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
  'CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);',
  'CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);'
];

// 运行迁移
export const runMigrations = () => {
  try {
    log.info('Starting database migrations...');
    
    // 创建表
    log.info('Creating users table...');
    db.run(createUsersTable);
    log.info('Users table created successfully');
    
    log.info('Creating user_sessions table...');
    db.run(createUserSessionsTable);
    log.info('User_sessions table created successfully');
    
    // 创建索引
    log.info('Creating database indexes...');
    createIndexes.forEach((indexSql, index) => {
      log.debug(`Creating index ${index + 1}/${createIndexes.length}: ${indexSql}`);
      db.run(indexSql);
    });
    log.info('All database indexes created successfully');
    
    log.info('Database migrations completed successfully');
  } catch (error) {
    log.error('Database migration failed:', error);
    throw error;
  }
};

// 插入默认管理员用户
export const seedDefaultAdmin = () => {
  try {
    log.info('Checking for existing admin user...');
    
    // 检查是否已存在管理员用户
    const existingAdmin = db.select().from(users).where(eq(users.role, 'admin')).get();
    
    if (!existingAdmin) {
      log.info('No admin user found, creating default admin user...');
      
      // 创建默认管理员用户（密码应该在实际使用中进行哈希处理）
      db.insert(users).values({
        username: 'admin',
        email: 'admin@electron-template.com',
        password: 'admin123', // 在实际应用中应该使用哈希密码
        fullName: '系统管理员',
        role: 'admin',
        status: 'active'
      }).run();
      
      log.info('Default admin user created successfully: admin@electron-template.com');
    } else {
      log.info(`Admin user already exists: ${existingAdmin.username} (${existingAdmin.email})`);
    }
  } catch (error) {
    log.error('Failed to create default admin user:', error);
  }
};