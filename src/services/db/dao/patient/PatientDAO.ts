import { getRepository } from 'typeorm';
import { Patient } from 'src/entities/patient/Patient;

class PatientDAO {
  // Create a new patient record
  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patientRepo = getRepository(Patient);
    const patient = patientRepo.create(patientData);
    return await patientRepo.save(patient);
  }

  // Get all patients
  async getAll(): Promise<Patient[]> {
    const patientRepo = getRepository(Patient);
    return await patientRepo.find();
  }

  // Get a patient by ID
  async getById(id: number): Promise<Patient | undefined> {
    const patientRepo = getRepository(Patient);
    return await patientRepo.findOne(id);
  }

  // Update a patient record
  async update(id: number, updateData: Partial<Patient>): Promise<Patient> {
    const patientRepo = getRepository(Patient);
    const patient = await patientRepo.findOne(id);

    if (!patient) {
      throw new Error('Patient not found');
    }

    Object.assign(patient, updateData);
    return await patientRepo.save(patient);
  }

  // Delete a patient record
  async delete(id: number): Promise<void> {
    const patientRepo = getRepository(Patient);
    const patient = await patientRepo.findOne(id);

    if (!patient) {
      throw new Error('Patient not found');
    }

    await patientRepo.remove(patient);
  }
}

export default new PatientDAO();
