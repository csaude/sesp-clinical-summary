import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('patient') // Map this class to the "patient" table
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number; // Primary key (auto-generated)

  @Column('text', { nullable: true })
  identifiers!: string | null; // Patient identifiers

  @Column('text', { nullable: true })
  tags!: string | null; // Patient tags

  @Column('text', { nullable: true })
  deletionStatus!: string | null; // Deletion status

  @Column('integer')
  personId!: number; // Person ID (required)

  @Column('text', { nullable: true })
  personUuid!: string | null; // Person UUID

  @Column('text', { nullable: true })
  gender!: string | null; // Gender

  @Column('integer', { nullable: true })
  birthdate!: number | null; // Birthdate as a timestamp

  @Column('integer')
  birthdateEstimated!: number; // Birthdate estimated (required)

  @Column('text', { nullable: true })
  names!: string | null; // Names in JSON or plain text format

  @Column('text', { nullable: true })
  attributes!: string | null; // Attributes in JSON format

  @Column('text', { nullable: true })
  addresses!: string | null; // Addresses in JSON format

  @Column('integer')
  voided!: number; // Voided flag (required)

  @Column('text', { nullable: true })
  personTags!: string | null; // Person tags

  @Column('text', { nullable: true })
  uri!: string | null; // URI for additional info

  @Column('text')
  uuid!: string; // UUID (required)
}
