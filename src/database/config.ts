import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as path from 'path';
import { app } from 'electron';
import log from 'electron-log';

// 获取数据库文件路径
export const getDatabasePath = (): string => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'database.sqlite');
  log.info(`Database path: ${dbPath}`);
  return dbPath;
};

// 创建数据库连接
export const createDatabase = (): Database.Database => {
  const dbPath = getDatabasePath();
  log.info('Creating database connection...');
  
  try {
    const database = new Database(dbPath);
    log.info('Database connection created successfully');
    
    // 启用外键约束
    database.pragma('foreign_keys = ON');
    log.debug('Foreign keys constraint enabled');
    
    return database;
  } catch (error) {
    log.error('Error creating database connection:', error);
    throw error;
  }
};

// 创建 Drizzle ORM 实例
log.info('Initializing Drizzle ORM...');
export const db = drizzle(createDatabase());
log.info('Drizzle ORM initialized successfully');