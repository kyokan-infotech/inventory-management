import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name_en: string;
  name_jp: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name_en: {
      type: String,
      required: [true, "English name is required"],
      unique: true,
      trim: true,
    },
    name_jp: {
      type: String,
      required: [true, "Japanese name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);