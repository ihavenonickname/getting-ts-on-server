import {
    JsonController,
    Param,
    Body,
    Get,
    Post,
    Put,
    Delete,
    Res,
    HttpError,
    OnNull,
    OnUndefined
} from 'routing-controllers'

import { Response } from 'express';
import { Service, Inject } from 'typedi';

import { User } from '../models/User'
import { UserService } from '../services/UserService'

@JsonController('/users')
@Service()
export class UserController {
    @Inject()
    private service!: UserService

    @Get('/')
    findAll() {
        return this.service.findAll()
    }

    @Get('/:id')
    @OnNull(404)
    find(@Param('id') id: number) {
        return this.service.find(id)
    }

    @Post('/')
    @OnUndefined(201)
    async save(@Body() user: User, @Res() response: Response) {
        const id = await this.service.save(user)
        response.location('/users/' + id)
    }

    @Put('/:id')
    @OnUndefined(204)
    async update(@Param('id') id: number, @Body() user: User) {
        if (id !== user.id) {
            throw new HttpError(409, "id fields don't match")
        }

        try {
            await this.service.save(user)
        } catch (EntityNotFoundError) {
            throw new HttpError(404)
        }
    }

    @Delete('/:id')
    @OnUndefined(204)
    async delete(@Param('id') id: number) {
        try {
            await this.service.delete(id)
        } catch (EntityNotFoundError) {
            throw new HttpError(404)
        }
    }
}
