import { randomUUID } from 'node:crypto';

export class User {
  id!: string; 
  name!: string;

  email!: string;

  password_hash!: string;

  created_at!: Date;

  constructor() {
    if (!this.id) {
      this.id = randomUUID();
    }
    if(!this.created_at) {
      this.created_at = new Date();
    }
  }
}