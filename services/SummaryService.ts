import { Service } from 'typedi'
import { DeepPartial, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import Exercise from '../models/Exercise'
import Meal from '../models/Meal'
import Summary from '../models/Summary'

interface ISummaryMember {
    summary: Summary
}

@Service()
export default class SummaryService {
    @InjectRepository(Summary)
    private summaryRepository!: Repository<Summary>

    @InjectRepository(Meal)
    private mealRepository!: Repository<Meal>

    @InjectRepository(Exercise)
    private exerciseRepository!: Repository<Exercise>

    public findAll(): Promise<Summary[]> {
        return this.summaryRepository.find()
    }

    public async find(id: number): Promise<Summary | undefined> {
        return (
            this.summaryRepository
            .createQueryBuilder('s')
            .whereInIds([id])
            .leftJoinAndSelect('s.meals', 'meals')
            .leftJoinAndSelect('s.exercises', 'exercises')
            .getOne()
        )
    }

    public async save(summary: Summary): Promise<number> {
        await this.summaryRepository.save(summary)

        return summary.id
    }

    public async update(summary: Summary): Promise<void> {
        if (summary.exercises !== undefined) {
            this.fillSummary(summary.exercises, summary)

            await this.updateEntities(
                this.exerciseRepository,
                summary.exercises,
                summary
            )
        }

        if (summary.meals !== undefined) {
            this.fillSummary(summary.meals, summary)

            await this.updateEntities(
                this.mealRepository,
                summary.meals,
                summary
            )
        }
    }

    public async delete(id: number): Promise<void> {
        await this.summaryRepository
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id })
            .execute()
    }

    private fillSummary(entities: ISummaryMember[], summary: Summary): void {
        for (const x of entities) {
            x.summary = summary
        }
    }

    private async updateEntities<SummaryMember>(repo: Repository<SummaryMember>, entities: DeepPartial<SummaryMember>[], summary: Summary): Promise<void> {
        await repo
            .createQueryBuilder()
            .delete()
            .where('"summaryId" = :id', { id: summary.id })
            .execute()

        await repo.save(entities)
    }
}
