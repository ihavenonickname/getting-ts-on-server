import {
    Body,
    Delete,
    Get,
    HttpError,
    JsonController,
    OnUndefined,
    Param,
    Patch,
    Post,
    Res,
} from 'routing-controllers'

import {
    Inject,
    Service,
} from 'typedi'

import Summary from '../models/Summary'

import SummaryService from '../services/SummaryService'

import { Response } from 'express'

@JsonController('/summaries')
@Service()
export default class SummaryController {
    @Inject()
    private summaryService!: SummaryService

    @Get('/')
    public findAll() {
        return this.summaryService.findAll()
    }

    @Get('/:id')
    @OnUndefined(404)
    public find(@Param('id') id: number) {
        return this.summaryService.find(id)
    }

    @Post('/')
    @OnUndefined(201)
    public async save(@Body() summary: Summary, @Res() response: Response) {
        const id = await this.summaryService.save(summary)
        response.location('/summaries/' + id)
    }

    @Patch('/:id')
    @OnUndefined(204)
    public async update(@Param('id') id: number, @Body() summary: Summary) {
        if (id !== summary.id) {
            throw new HttpError(409, 'id fields do not match')
        }

        await this.summaryService.update(summary)
    }

    @Delete('/:id')
    @OnUndefined(204)
    public async delete(@Param('id') id: number) {
        await this.summaryService.delete(id)
    }
}
