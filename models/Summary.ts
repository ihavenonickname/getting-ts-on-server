import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import Exercise from './Exercise'

import Meal from './Meal'
import Person from './Person'

@Entity()
export default class Summary {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column({ default: () => 'now()' })
    public creation!: Date

    @OneToMany(
        () => Meal,
        ({ summary }) => summary,
        { onDelete: 'CASCADE', cascade: true }
    )
    public meals!: Meal[]

    @OneToMany(
        () => Exercise,
        ({ summary }) => summary,
        { onDelete: 'CASCADE', cascade: true }
    )
    public exercises!: Exercise[]

    @ManyToOne(() => Person, ({ summaries }) => summaries)
    public person!: Person
}
