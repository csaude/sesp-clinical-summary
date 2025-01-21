import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('patient') // Map this class to the "patient" table
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  identifiers!: string | null;

  @Column('text', { nullable: true })
  tags!: string | null;

  @Column('text', { nullable: true })
  deletionStatus!: string | null;

  @Column('integer')
  personId!: number;

  @Column('text', { nullable: true })
  personUuid!: string | null;

  @Column('text', { nullable: true })
  gender!: string | null;

  @Column('integer', { nullable: true })
  birthdate!: number | null;

  @Column('integer')
  birthdateEstimated!: number;

  @Column('text', { nullable: true })
  names!: string | null;

  @Column('text', { nullable: true })
  attributes!: string | null;

  @Column('text', { nullable: true })
  addresses!: string | null;

  @Column('integer')
  voided!: number;

  @Column('text', { nullable: true })
  personTags!: string | null;

  @Column('text', { nullable: true })
  uri!: string | null;

  @Column('text')
  uuid!: string;

  constructor(init?: Partial<Patient>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
