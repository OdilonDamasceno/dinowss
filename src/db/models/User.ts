export interface UserSchema {
  _id: { $oid: string };
  userName: string;
  isOnline: boolean;
  socketId: string;
  password: string;
  pending: Array<unknown>;
}
