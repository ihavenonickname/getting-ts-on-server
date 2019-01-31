import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import Summary from './Summary'

@Entity()
export default class Person {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column()
    public name!: string

    @Column()
    public email!: string

    @Column()
    public phone!: string

    @Column()
    public auth!: string

    @Column({ default: () => 'now()' })
    public creation!: Date

    @OneToMany(
        () => Summary,
        ({ person }) => person,
        { onDelete: 'CASCADE', cascade: true }
    )
    public summaries!: Summary[]
}
