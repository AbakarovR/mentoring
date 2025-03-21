import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersSubject$ = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject$.asObservable();

  setUsers(users: User[]) {
    this.usersSubject$.next(users);
  }
    
  editeUser(editedUser: User) {
    this.usersSubject$.next(
      this.usersSubject$.value.map(
        user => {
          if (user.id === editedUser.id) {
            return editedUser;
          } else {
            return user;
          }
        }
      )
    )
  }

  createUser(user: User) {
    this.usersSubject$.next(
      [...this.usersSubject$.value, user]
    );
  }

  deleteUser(id: number) {
    this.usersSubject$.next(
      this.usersSubject$.value.filter(
        user => {
          if (id === user.id) {
            return false
          } else {
            return true;
          }   
        }
      )
    )
  }
}
