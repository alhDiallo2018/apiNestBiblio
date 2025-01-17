import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: { prenom: string; email: string; password: string; roles: string[] }) {
        return await this.userService.createUser(createUserDto.prenom, createUserDto.email, createUserDto.password, createUserDto.roles);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id);
    }

    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string) {
        return await this.userService.getUserByEmail(email);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: { prenom?: string; email?: string; password?: string; roles?: string[] }) {
        return await this.userService.updateUser(id, updateUserDto.prenom, updateUserDto.email, updateUserDto.password, updateUserDto.roles);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deleteUser(id);
    }
}
