import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ranking: {
      type: String,
      trim: true,
    },
    positionRanking: {
      type: Number,
      trim: true,
    },
    urlProfilePlayer: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
