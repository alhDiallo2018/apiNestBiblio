import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Book extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    author: string;

    @Prop()
    publishedDate: Date;

    @Prop()
    category: string;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ type: [Types.ObjectId], ref: 'Review', default: [] })
    reviews: Types.Array<Types.ObjectId>;  
}

export const BookSchema = SchemaFactory.createForClass(Book);
