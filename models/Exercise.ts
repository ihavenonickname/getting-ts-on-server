import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import Summary from './Summary'

@Entity()
export default class Exercise {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column()
    public description!: string

    @Column({ nullable: true })
    public repetitions!: number

    @Column({ nullable: true })
    public weight!: number

    @Column({ nullable: true })
    public duration!: number

    @ManyToOne(() => Summary, ({ exercises }) => exercises)
    public summary!: Summary
}
