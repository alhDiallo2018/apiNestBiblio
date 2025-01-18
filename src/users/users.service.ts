import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { EmailAlreadyExistsException } from '../common/email-already-exists.exception';
import { UserNotFoundException } from '../common/user-not-found.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

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

    async getUserById(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UserNotFoundException(`Email: ${email}`);
        }
        return user;
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        const { email, prenom, password, roles } = updateUserDto;

        if (email) {
            const emailExists = await this.userModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== userId) {
                throw new EmailAlreadyExistsException(email);
            }
            user.email = email;
        }

        if (prenom) user.prenom = prenom;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (roles) user.roles = roles;

        await user.save();
        return user;
    }

    async deleteUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        await this.userModel.deleteOne({ _id: userId });
        return { message: 'User deleted successfully' };
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UserNotFoundException(`Email: ${email}`);
        }
        return user;
    }
}
