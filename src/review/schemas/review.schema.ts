import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Review extends Document {
    @Prop({ required: true })
    comment: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true })
    userId: string; 

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
