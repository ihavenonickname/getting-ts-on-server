import {
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import Exercise from './Exercise'

import Meal from './Meal'

@Entity()
export default class Summary {
    @PrimaryGeneratedColumn()
    public id!: number

    @OneToMany(() => Meal, ({ summary }) => summary, { onDelete: 'CASCADE' })
    public meals!: Meal[]

    @OneToMany(() => Exercise, ({ summary }) => summary, { onDelete: 'CASCADE' })
    public exercises!: Exercise[]
}
