import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    // Créer un utilisateur
    async createUser(prenom: string, email: string, password: string, roles: string[] = ['user']) {
        const userExists = await this.userModel.findOne({ email });
        if (userExists) {
            throw new BadRequestException('Email already exists');
        }

        const newUser = new this.userModel({ prenom, email, password, roles });
        return await newUser.save();
    }

    // Obtenir un utilisateur par son ID
    async getUserById(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Obtenir un utilisateur par son email
    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Mettre à jour un utilisateur
    async updateUser(userId: string, prenom?: string, email?: string, password?: string, roles?: string[]) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (email) {
            const emailExists = await this.userModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== userId) {
                throw new BadRequestException('Email already in use');
            }
            user.email = email;
        }

        if (prenom) user.prenom = prenom;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash du nouveau mot de passe
        if (roles) user.roles = roles;

        await user.save();
        return user;
    }

    // Supprimer un utilisateur
    async deleteUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Utilisation de deleteOne() au lieu de remove()
        await this.userModel.deleteOne({ _id: userId });

        return { message: 'User deleted successfully' };
    }

    // Trouver un utilisateur par email
    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

}
