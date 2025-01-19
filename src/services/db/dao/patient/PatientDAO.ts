import DatabaseManager from 'src/services/db/DatabaseManager';
import { Patient } from 'src/entities/patient/Patient';
import { Repository } from 'typeorm';

class PatientDAO {
  private patientRepo: Repository<Patient>;

  constructor() {
    const dataSource = DatabaseManager.getInstance().getDataSource();
    this.patientRepo = dataSource.getRepository(Patient); // Initialize the repository in the constructor
  }

  // Create a new patient record
  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepo.create(patientData);
    return await this.patientRepo.save(patient);
  }

  // Get all patients
  async getAll(): Promise<Patient[]> {
    return await this.patientRepo.find();
  }

  // Get a patient by ID
  async getById(id: number): Promise<Patient | null> {
    return await this.patientRepo.findOneBy({ id });
  }

  // Update a patient record
  async update(id: number, updateData: Partial<Patient>): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ id });

    if (!patient) {
      throw new Error('Patient not found');
    }

    Object.assign(patient, updateData);
    return await this.patientRepo.save(patient);
  }

  // Delete a patient record
  async delete(id: number): Promise<void> {
    const patient = await this.patientRepo.findOneBy({ id });

    if (!patient) {
      throw new Error('Patient not found');
    }

    await this.patientRepo.remove(patient);
  }
}

export default new PatientDAO();
