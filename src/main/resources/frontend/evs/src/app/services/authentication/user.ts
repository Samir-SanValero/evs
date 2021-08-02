export class User {
  id: number;
  username: string;
  password: string;
  authToken?: string;
  refreshToken?: string;
}
