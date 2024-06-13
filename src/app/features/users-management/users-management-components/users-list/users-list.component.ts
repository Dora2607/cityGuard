import { Component, OnDestroy, OnInit } from '@angular/core';
import { Users } from '../../../../models/users.model';
import { LoggedUserService } from '../../../../services/logged-user.service';
import { UsersListService } from '../../../../services/users-list.service';
import { ApiService } from '../../../../services/api.service';
import { Subscription } from 'rxjs';
import { UsersViewService } from '../../../../services/users-view.service';
import { slideInOutAnimation } from '../../../../shared/Animations/slideInOut-animation';
import { listAnimation } from '../../../../shared/Animations/list-animation';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  animations: [listAnimation]
})
export class UsersListComponent implements OnInit, OnDestroy {
  loggedUser!: Users;
  displayedUsers: Array<Users> = [];
  usersSubscription: Subscription | undefined;
  isdeleteBtnClicked: boolean = false;
  isLoading = false;
  isLoadingSubscription: Subscription | undefined;


  constructor(
    private loggedUserService: LoggedUserService,
    private usersListService: UsersListService,
    private apiService: ApiService,
    private usersViewService: UsersViewService,
    
  ) {}

  ngOnInit(): void {
    
    this.loggedUser = this.loggedUserService.initializePersonalProfile();
    if (this.usersListService.isFirstVisit) {
      this.getAllUser();
      this.usersListService.isFirstVisit = false;
    } else {
      this.displayedUsers = this.usersListService.getDisplayedUsers();
    }

    this.usersSubscription =
      this.usersListService.displayedUsersChanged.subscribe(
        (users: Array<Users>) => {
          this.displayedUsers = users;
        },
      );

    this.usersViewService.deleteButtonClicked.subscribe(
      (deleteButton: boolean) => {
        this.isdeleteBtnClicked = deleteButton;
      },
    );

    this.isLoadingSubscription = this.usersListService.isLoading.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      },
    );
  }

  getAllUser(): void {
    this.usersListService.isLoading.next(true);
    this.apiService.getUsers().subscribe((users) => {
      this.usersListService.setAllUsers(users);
      if (this.loggedUser && !users.find((u) => u.id === this.loggedUser.id)) {
        this.usersListService.addUser(this.loggedUser);
      }
      this.usersListService.setDisplayedUsers([...users]);
      this.usersListService.isLoading.next(false);
    });
  }

  activeDeleteUser(id: number): void {
    if (id === this.loggedUser.id) {
      alert('It is not possible to delete the currently logged in user');
      return;
    }
    const confirmDelete = confirm('Are you sure you want to delete the user?');
    if (confirmDelete) {
      this.apiService.deleteUser(id).subscribe(() => {
        this.usersListService.deleteUser(id);
        alert('The user has been deleted');
      });
    } else {
      alert('The deletion was canceled');
    }
  }

  goToPreviousPage(): boolean {
    return (this.isdeleteBtnClicked = !this.isdeleteBtnClicked);
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }
}