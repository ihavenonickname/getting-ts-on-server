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

import * as HttpStatus from 'http-status-codes'

@JsonController('/summaries')
@Service()
export default class SummaryController {
    @Inject()
    private summaryService!: SummaryService

    @Get('/')
    public findAll(): Promise<Summary[]> {
        return this.summaryService.findAll()
    }

    @Get('/:id')
    @OnUndefined(HttpStatus.NOT_FOUND)
    public find(@Param('id') id: number): Promise<Summary | undefined> {
        return this.summaryService.find(id)
    }

    @Post('/')
    @OnUndefined(HttpStatus.CREATED)
    public async save(@Body() summary: Summary, @Res() response: Response): Promise<void> {
        const id = await this.summaryService.save(summary)
        response.location('/summaries/' + id)
    }

    @Patch('/:id')
    @OnUndefined(HttpStatus.NO_CONTENT)
    public async update(@Param('id') id: number, @Body() summary: Summary): Promise<void> {
        if (id !== summary.id) {
            throw new HttpError(HttpStatus.CONFLICT, 'id fields do not match')
        }

        await this.summaryService.update(summary)
    }

    @Delete('/:id')
    @OnUndefined(HttpStatus.NO_CONTENT)
    public async delete(@Param('id') id: number): Promise<void> {
        await this.summaryService.delete(id)
    }
}
