import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Patient } from '../../entities/patient/Patient'; // Import your entities here
import { CapacitorSQLite } from '@capacitor-community/sqlite';

class DatabaseManager {
  private static instance: DatabaseManager;
  private dataSource: DataSource | null = null;

  private constructor() {}

  /**
   * Singleton: Get the single instance of DatabaseManager
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize the database connection, create tables, and handle migrations.
   */
  public async initDatabase(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      console.log('Database is already initialized.');
      return;
    }

    const options: DataSourceOptions = {
      type: 'capacitor', // Use Capacitor driver
      database: 'app-db',
      driver: CapacitorSQLite, // Use Capacitor SQLite driver
      entities: [Patient], // Add all your entities
      synchronize: true, // Automatically create tables (use cautiously in production)
      migrations: [], // Add migrations here (if needed)
      logging: true, // Enable logging for debugging
    };

    try {
      this.dataSource = new DataSource(options);
      await this.dataSource.initialize();
      console.log('Database initialized successfully.');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Run migrations if defined
   */
  public async runMigrations(): Promise<void> {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      throw new Error('Database is not initialized. Call initDatabase() first.');
    }

    try {
      const migrations = await this.dataSource.runMigrations();
      if (migrations.length > 0) {
        console.log('Migrations applied successfully:', migrations);
      } else {
        console.log('No migrations to apply.');
      }
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    }
  }

  /**
   * Get the initialized DataSource
   */
  public getDataSource(): DataSource {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      throw new Error('Database is not initialized. Call initDatabase() first.');
    }
    return this.dataSource;
  }

  /**
   * Close the database connection
   */
  public async closeDatabase(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      try {
        await this.dataSource.destroy();
        console.log('Database connection closed.');
      } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
      }
    } else {
      console.warn('No initialized database connection to close.');
    }
  }
}

export default DatabaseManager;
