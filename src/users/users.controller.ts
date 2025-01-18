import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';


@ApiTags('users') // Regroupe les routes sous "Users" dans la documentation Swagger
@Controller('users')
export class UserController {
    userService: any;
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    // Créer un utilisateur
    @Post()
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Email already exists.' })
    async createUser(createUserDto: CreateUserDto) {
        const { prenom, email, password, roles } = createUserDto;
    
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Création de l'utilisateur
        const newUser = new this.userModel({
            prenom,
            email,
            password: hashedPassword,
            roles,
        });
    
        // Sauvegarde de l'utilisateur dans la base de données
        return await newUser.save();
    }

    // Obtenir un utilisateur par ID
    @Get(':id')
    @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id);
    }

    // Obtenir un utilisateur par email
    @Get('email/:email')
    @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async getUserByEmail(@Param('email') email: string) {
        return await this.userService.getUserByEmail(email);
    }

    // Mettre à jour un utilisateur
    @Put(':id')
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Email already in use.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return await this.userService.updateUser(id, updateUserDto);
    }

    // Supprimer un utilisateur
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deleteUser(id);
    }
}
