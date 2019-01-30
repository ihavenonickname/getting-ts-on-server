import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Exercise from '../models/Exercise'
import Meal from '../models/Meal'
import Summary from '../models/Summary'

@Service()
export default class SummaryService {
    @InjectRepository(Summary)
    private summaryRepository!: Repository<Summary>

    @InjectRepository(Meal)
    private mealRepository!: Repository<Meal>

    @InjectRepository(Exercise)
    private exerciseRepository!: Repository<Exercise>

    public findAll() {
        return this.summaryRepository.find()
    }

    public async find(id: number) {
        return (
            this.summaryRepository
            .createQueryBuilder('s')
            .whereInIds([id])
            .leftJoinAndSelect('s.meals', 'meals')
            .leftJoinAndSelect('s.exercises', 'exercises')
            .getMany()
        )
    }

    public async save(summary: Summary) {
        await this.mealRepository.save(summary.meals)
        await this.exerciseRepository.save(summary.exercises)
        await this.summaryRepository.save(summary)

        return summary.id
    }

    public async update(summary: Summary) {
        if (summary.exercises !== undefined) {
            await this.updateEntities(this.exerciseRepository, summary.exercises, summary)
        }

        if (summary.meals !== undefined) {
            await this.updateEntities(this.mealRepository, summary.meals, summary)
        }
    }

    public async delete(id: number) {
        await this.summaryRepository.createQueryBuilder().delete().where('id = :id', { id }).execute()
    }

    private async updateEntities(repo: Repository<any>, entities: any[], summary: Summary) {
        await repo
            .createQueryBuilder()
            .delete()
            .where('"summaryId" = :id', { id: summary.id })
            .execute()

        for (const x of entities) {
            x.summary = summary
        }

        await repo.save(entities)
    }
}
