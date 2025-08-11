export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plaintext or hashed
}

const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

export function addUser(user: User): void {
  users.push(user);
}
