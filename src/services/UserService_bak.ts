import { db } from '../database/config';
import { users, type User, type NewUser } from '../database/schema';
import { eq, like, or, desc } from 'drizzle-orm';
import log from 'electron-log';

export class UserService {
  // 获取所有用户
  static async getAllUsers(): Promise<User[]> {
    log.info('UserService: Getting all users');
    try {
      const allUsers = db.select().from(users).orderBy(desc(users.createdAt)).all();
      log.info(`UserService: Successfully retrieved ${allUsers.length} users`);
      return allUsers;
    } catch (error) {
      log.error('UserService: Failed to get all users:', error);
      throw new Error('获取用户列表失败');
    }
  }

  // 根据ID获取用户
  static async getUserById(id: number): Promise<User | null> {
    log.info(`UserService: Getting user by ID: ${id}`);
    try {
      const user = db.select().from(users).where(eq(users.id, id)).get();
      if (user) {
        log.info(`UserService: Successfully found user: ${user.username} (ID: ${id})`);
      } else {
        log.warn(`UserService: User not found with ID: ${id}`);
      }
      return user || null;
    } catch (error) {
      log.error(`UserService: Failed to get user by ID ${id}:`, error);
      throw new Error('获取用户失败');
    }
  }

  // 根据用户名获取用户
  static async getUserByUsername(username: string): Promise<User | null> {
    log.debug(`UserService: Getting user by username: ${username}`);
    try {
      const user = db.select().from(users).where(eq(users.username, username)).get();
      if (user) {
        log.debug(`UserService: Successfully found user by username: ${username} (ID: ${user.id})`);
      } else {
        log.debug(`UserService: User not found with username: ${username}`);
      }
      return user || null;
    } catch (error) {
      log.error(`UserService: Failed to get user by username ${username}:`, error);
      throw new Error('获取用户失败');
    }
  }

  // 根据邮箱获取用户
  static async getUserByEmail(email: string): Promise<User | null> {
    log.debug(`UserService: Getting user by email: ${email}`);
    try {
      const user = db.select().from(users).where(eq(users.email, email)).get();
      if (user) {
        log.debug(`UserService: Successfully found user by email: ${email} (ID: ${user.id})`);
      } else {
        log.debug(`UserService: User not found with email: ${email}`);
      }
      return user || null;
    } catch (error) {
      log.error(`UserService: Failed to get user by email ${email}:`, error);
      throw new Error('获取用户失败');
    }
  }

  // 创建用户
  static async createUser(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    log.info('UserService.createUser: 开始创建用户', { username: userData.username, email: userData.email, role: userData.role });
    
    try {
      // 检查用户名是否已存在
      log.debug('UserService.createUser: 检查用户名是否已存在', { username: userData.username });
      const existingUserByUsername = await this.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        log.warn('UserService.createUser: 用户名已存在', { username: userData.username });
        throw new Error('用户名已存在');
      }

      // 检查邮箱是否已存在
      log.debug('UserService.createUser: 检查邮箱是否已存在', { email: userData.email });
      const existingUserByEmail = await this.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        log.warn('UserService.createUser: 邮箱已存在', { email: userData.email });
        throw new Error('邮箱已存在');
      }

      const result = db.insert(users).values({
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning().get();

      log.info('UserService.createUser: 用户创建成功', { 
        id: result.id, 
        username: result.username, 
        email: result.email, 
        role: result.role 
      });
      return result;
    } catch (error) {
      log.error('UserService.createUser: 创建用户失败', { 
        username: userData.username, 
        email: userData.email, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  // 更新用户
  static async updateUser(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    log.info('UserService.updateUser: 开始更新用户', { id, updateData: userData });
    
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        log.warn('UserService.updateUser: 用户不存在', { id });
        throw new Error('用户不存在');
      }

      // 如果更新用户名，检查是否已存在
      if (userData.username && userData.username !== existingUser.username) {
        log.debug('UserService.updateUser: 检查新用户名是否已存在', { 
          id, 
          oldUsername: existingUser.username, 
          newUsername: userData.username 
        });
        const existingUserByUsername = await this.getUserByUsername(userData.username);
        if (existingUserByUsername) {
          log.warn('UserService.updateUser: 新用户名已存在', { 
            id, 
            username: userData.username, 
            conflictUserId: existingUserByUsername.id 
          });
          throw new Error('用户名已存在');
        }
      }

      // 如果更新邮箱，检查是否已存在
      if (userData.email && userData.email !== existingUser.email) {
        log.debug('UserService.updateUser: 检查新邮箱是否已存在', { 
          id, 
          oldEmail: existingUser.email, 
          newEmail: userData.email 
        });
        const existingUserByEmail = await this.getUserByEmail(userData.email);
        if (existingUserByEmail) {
          log.warn('UserService.updateUser: 新邮箱已存在', { 
            id, 
            email: userData.email, 
            conflictUserId: existingUserByEmail.id 
          });
          throw new Error('邮箱已存在');
        }
      }

      const result = db.update(users)
        .set({
          ...userData,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, id))
        .returning()
        .get();

      log.info('UserService.updateUser: 用户更新成功', { 
        id: result.id, 
        username: result.username, 
        email: result.email, 
        role: result.role,
        status: result.status,
        updatedFields: Object.keys(userData)
      });
      return result;
    } catch (error) {
      log.error('UserService.updateUser: 更新用户失败', { 
        id, 
        updateData: userData, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  // 删除用户
  static async deleteUser(id: number): Promise<boolean> {
    log.info('UserService.deleteUser: 开始删除用户', { id });
    
    try {
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        log.warn('UserService.deleteUser: 用户不存在', { id });
        throw new Error('用户不存在');
      }

      log.debug('UserService.deleteUser: 执行删除操作', { 
        id, 
        username: existingUser.username, 
        email: existingUser.email 
      });
      
      db.delete(users).where(eq(users.id, id)).run();
      
      log.info('UserService.deleteUser: 用户删除成功', { 
        id, 
        username: existingUser.username 
      });
      return true;
    } catch (error) {
      log.error('UserService.deleteUser: 删除用户失败', { 
        id, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  // 搜索用户
  static async searchUsers(keyword: string): Promise<User[]> {
    log.info('UserService.searchUsers: 开始搜索用户', { keyword });
    
    try {
      const results = db.select()
        .from(users)
        .where(
          or(
            like(users.username, `%${keyword}%`),
            like(users.email, `%${keyword}%`),
            like(users.fullName, `%${keyword}%`)
          )
        )
        .orderBy(desc(users.createdAt))
        .all();
      
      log.info('UserService.searchUsers: 搜索完成', { 
        keyword, 
        resultCount: results.length 
      });
      return results;
    } catch (error) {
      log.error('UserService.searchUsers: 搜索用户失败', { 
        keyword, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error('搜索用户失败');
    }
  }

  // 更新用户状态
  static async updateUserStatus(id: number, status: 'active' | 'inactive' | 'banned'): Promise<User> {
    log.info('UserService.updateUserStatus: 开始更新用户状态', { id, status });
    
    try {
      const result = await this.updateUser(id, { status });
      log.info('UserService.updateUserStatus: 用户状态更新成功', { 
        id, 
        status, 
        username: result.username 
      });
      return result;
    } catch (error) {
      log.error('UserService.updateUserStatus: 更新用户状态失败', { 
        id, 
        status, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  // 获取用户统计信息
  static async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    banned: number;
    admins: number;
  }> {
    log.info('UserService.getUserStats: 开始获取用户统计信息');
    
    try {
      const allUsers = await this.getAllUsers();
      
      const stats = {
        total: allUsers.length,
        active: allUsers.filter(u => u.status === 'active').length,
        inactive: allUsers.filter(u => u.status === 'inactive').length,
        banned: allUsers.filter(u => u.status === 'banned').length,
        admins: allUsers.filter(u => u.role === 'admin').length,
      };
      
      log.info('UserService.getUserStats: 用户统计信息获取成功', stats);
      return stats;
    } catch (error) {
      log.error('UserService.getUserStats: 获取用户统计失败', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error('获取用户统计失败');
    }
  }
}