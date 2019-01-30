import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import Summary from './Summary'

@Entity()
export default class Meal {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column()
    public description!: string

    @Column()
    public datetime!: Date

    @ManyToOne(() => Summary, ({ meals }) => meals)
    public summary!: Summary
}
