import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { createConnection, Connection } from 'typeorm';
import { Patient } from 'src/entities/patient/Patient'; // Example entity

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: SQLiteDBConnection | null = null;
  private connection: Connection | null = null;

  private constructor() {}

  // Singleton pattern to get the instance
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Initialize the database (open connection, create tables, and initialize TypeORM)
  public async initDatabase(): Promise<void> {
    try {
      await this.ensureEncryptionKey();
      await this.getConnection();
      await this.createTables();
      await this.initTypeORM();
      console.log('Database initialized successfully with TypeORM');
    } catch (error) {
      console.error('Error initializing the database:', error);
    }
  }

  // Ensure the encryption key exists and generate it if not
  private async ensureEncryptionKey(): Promise<void> {
    let { value: encryptionKey } = await Preferences.get({ key: 'db_encryption_key' });

    if (!encryptionKey) {
      encryptionKey = this.generateEncryptionKey();
      await Preferences.set({ key: 'db_encryption_key', value: encryptionKey });
      console.log('New encryption key generated and saved');
    } else {
      console.log('Encryption key retrieved from secure storage');
    }
  }

  // Generate a random 256-bit encryption key
  private generateEncryptionKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Get or create a connection to the database
  public async getConnection(): Promise<SQLiteDBConnection> {
    if (!this.db) {
      try {
        const { value: encryptionKey } = await Preferences.get({ key: 'db_encryption_key' });

        if (!encryptionKey) {
          throw new Error('Encryption key is missing');
        }

        await CapacitorSQLite.createConnection({
          database: 'app-db',
          encrypted: true,
          mode: 'secret',
          version: 1,
        });

        this.db = new SQLiteDBConnection('app-db', false, CapacitorSQLite);
        await this.db.open();
        console.log('Database connection opened');
      } catch (error) {
        console.error('Error initializing the database connection:', error);
        throw error;
      }
    }

    if (this.db) {
      return this.db;
    } else {
      throw new Error('Failed to establish a database connection.');
    }
  }

  // Initialize TypeORM with the database connection
  private async initTypeORM(): Promise<void> {
    if (!this.connection) {
      this.connection = await createConnection({
        type: 'capacitor',
        database: 'app-db',
        synchronize: true,
        logging: false,
        entities: [Patient], // Add your entities here
      });

      console.log('TypeORM connection established');
    }
  }

  // Create the necessary tables
  private async createTables(): Promise<void> {
    if (!this.db) return;

    const createPatientsTableQuery = `
      CREATE TABLE IF NOT EXISTS patient (
        identifiers TEXT,
        tags TEXT,
        deletionStatus TEXT,
        personId INTEGER NOT NULL,
        personUuid TEXT,
        gender TEXT,
        birthdate INTEGER,
        birthdateEstimated INTEGER NOT NULL,
        names TEXT,
        attributes TEXT,
        addresses TEXT,
        voided INTEGER NOT NULL,
        personTags TEXT,
        uri TEXT,
        uuid TEXT NOT NULL
      );
    `;

    try {
      await this.db.execute(createPatientsTableQuery);
      console.log('Patients table created successfully');
    } catch (error) {
      console.error('Error creating patients table:', error);
    }
  }

  // Close the database connection
  public async closeConnection(): Promise<void> {
    if (this.db) {
      try {
        await this.db.close();
        console.log('Database connection closed');
        this.db = null;
      } catch (error) {
        console.error('Error closing the database connection:', error);
      }
    }

    if (this.connection) {
      await this.connection.close();
      console.log('TypeORM connection closed');
      this.connection = null;
    }
  }
}

export default DatabaseManager;
