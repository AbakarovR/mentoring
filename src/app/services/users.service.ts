import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/user.interface';
import { LocalStorageService } from './local-storage.service';
import { UsersApiService } from './users-api.service';

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	private readonly usersSubject$ = new BehaviorSubject<User[]>([]);
	public readonly users$ = this.usersSubject$.asObservable();
	private readonly apiService = inject(UsersApiService);
	public readonly localStorageService: LocalStorageService = inject(LocalStorageService);
	public readonly localStorageKey: string = 'users';

	public setUsers(users: User[]): void {
		this.usersSubject$.next(users);
		this.localStorageService.seveDataLocalStorage<User[]>(
			this.localStorageKey, users
		);
	}

	public loadUsers(): void {
		const loadStorageUsers: User[] | null = this.localStorageService.getDataLocalStorage<User[]>(
			this.localStorageKey
		);

		if (loadStorageUsers) {
			this.usersSubject$.next(loadStorageUsers);
		} else {
			this.apiService.getUsers().subscribe(
				(users: User[]): void => {
					this.setUsers(users);
				}
			)
		}
	}
		
	editUser(editedUser: User) {
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
		);

		if (this.usersSubject$.value.length) {
			this.localStorageService.seveDataLocalStorage<User[]>(
				this.localStorageKey, this.usersSubject$.value
			);
		}
	}

	createUser(user: User) {
		this.usersSubject$.next(
			[...this.usersSubject$.value, user]
		);

		if (this.usersSubject$.value.length) {
			this.localStorageService.seveDataLocalStorage<User[]>(
				this.localStorageKey, this.usersSubject$.value
			);
		}
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
		);

		if (this.usersSubject$.value.length) {
			this.localStorageService.removeDataLocalStorage(this.localStorageKey);
		}
	}
}
