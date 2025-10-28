export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;

  friends: string[]; // IDs of accepted friends
  friendRequests: string[]; // IDs of incoming friend requests
  sentRequests: string[]; // IDs of sent friend requests
  blockedUsers: string[]; // IDs of blocked users
  lastActive?: Date; // Last online timestamp
  createdAt?: Date;
  updatedAt?: Date;
}
