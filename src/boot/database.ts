import { boot } from 'quasar/wrappers';
import DatabaseManager from 'src/services/db/DatabaseManager';

export default boot(async () => {
  try {
    await DatabaseManager.getInstance().initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
});
