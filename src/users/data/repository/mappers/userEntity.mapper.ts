import { User } from 'src/users/domain/models/user.model';
import { UserEntity } from '../entitites';

export const mapUserEntityToUser = (userEntity: UserEntity): User => ({
  id: userEntity.id,
  username: userEntity.username,
  password: userEntity.password,
});
