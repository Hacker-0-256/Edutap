import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        studentId?: string;
        parentId?: string;
      };
    }
  }
}

declare module 'mongoose' {
  interface Document {
    id: string;
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }
}
declare module 'mongoose' {
  interface Document {
    comparePassword?(candidatePassword: string): Promise<boolean>;
    changedPasswordAfter?(JWTTimestamp: number): boolean;
  }
}