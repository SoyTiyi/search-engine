import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column()
  departureDate: string;

  @Column({ nullable: true })
  returnDate: string;

  @Column({ type: 'int' })
  resultsCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
