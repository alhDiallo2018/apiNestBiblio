import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books') // Regroupe les routes sous "Books" dans la documentation Swagger
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    // Créer un livre
    @Post()
    @ApiResponse({ status: 201, description: 'Book created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid data provided.' })
    async create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    // Obtenir tous les livres
    @Get()
    @ApiResponse({ status: 200, description: 'List of all books retrieved successfully.' })
    async findAll() {
        return this.booksService.findAll();
    }

    // Obtenir un livre par ID
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Book retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    // Mettre à jour un livre
    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Book updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid data provided.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }

    // Supprimer un livre
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Book deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async remove(@Param('id') id: string) {
        return this.booksService.remove(id);
    }

    // Recherche avancée de livres avec filtrage et tri
    @Get('search')
    @ApiResponse({ status: 200, description: 'Search results retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request: Invalid query parameters.' })
    async search(
        @Query('title') title: string,
        @Query('author') author: string,
        @Query('category') category: string,
        @Query('sortBy') sortBy: string = 'publishedDate', 
        @Query('sortOrder') sortOrder: string = 'ASC'
    ) {
        return this.booksService.search(title, author, category, sortBy, sortOrder);
    }
}
