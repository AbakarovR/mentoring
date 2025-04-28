import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { miniUser, User } from '../../interface/user.interface';
import { UsersApiService } from '../../services/users-api.service';
import { UsersService } from '../../services/users.service';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, NgFor, UserCardComponent, AsyncPipe, MatButtonModule, 
    MatIconModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
	private readonly usersApiService = inject(UsersApiService);
	public readonly usersService = inject(UsersService);
	private dialog = inject(MatDialog);
	private snackBar = inject(MatSnackBar);

  	constructor() {
    	this.usersService.loadUsers();
  	}
	
  	openCreateDialog() {
    	const dialogRef = this.dialog.open(CreateUserDialogComponent, {});

 	 	dialogRef.afterClosed().subscribe((createResult: miniUser | undefined) => {
    		if (createResult) {
      			this.createUser(createResult);
        		this.snackBar.open('Пользователь создан', 'Ок', {
          			duration: 3000,
      			});
    		} else if (createResult === false) {
        		this.snackBar.open('Пользователь не создан', 'Закрыть', {
          			duration: 3000,
        		});
    		};
  		});

    	const buttonElement = document.activeElement as HTMLElement;
    	buttonElement.blur();
  	}

	deleteUser(userId: number) {
    	this.usersService.deleteUser(userId);
	}

	editUser(formDialogValue: User) {
    	this.usersService.editUser({
        	...formDialogValue
    	});
	}

	createUser(formData: miniUser) {
    	this.usersService.createUser({
        	id: new Date().getTime(),
        	name: formData.name,
        	email: formData.email,
        	website: formData.website,
        	company: {
            	name: formData.company.name,
        	}
    	});
	}
}
