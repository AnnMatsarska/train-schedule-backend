import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("trains")
export class Train {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  trainNumber: string;

  @Column("jsonb")
  departure: {
    station: string;
    time: string;
    date: string;
  };

  @Column("jsonb")
  arrival: {
    station: string;
    time: string;
    date: string;
  };

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("int")
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
