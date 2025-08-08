export interface AuthUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}
