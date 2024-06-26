import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users, newUser } from '../models/users.model';
import { TOKEN } from '../token';
import { Observable } from 'rxjs';
import { Todos } from '../models/todos.model';
import { Posts, newPosts } from '../models/posts.model';
import { Comments, newComments } from '../models/comments.model';

const USERS_URL = 'https://gorest.co.in/public/v2/users?page=1&per_page=30';
const USERS_URL_SHORT = 'https://gorest.co.in/public/v2/users';
const POSTS_URL_SHORT = 'https://gorest.co.in/public/v2/posts';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  registerUser(user: newUser) {
    const token = TOKEN;
    return this.httpClient.post(`${USERS_URL_SHORT}`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUsers(): Observable<Users[]> {
    return this.httpClient.get<Users[]>(USERS_URL);
  }

  deleteUser(userId: number) {
    const token = localStorage.getItem('token');
    return this.httpClient.delete(`${USERS_URL_SHORT}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  addUser(user: newUser) {
    const token = localStorage.getItem('token');
    return this.httpClient.post(`${USERS_URL_SHORT}`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getTodos(userId: number): Observable<Todos[]> {
    return this.httpClient.get<Todos[]>(`${USERS_URL_SHORT}/${userId}/todos`);
  }

  getPosts(userId: number): Observable<Posts[]> {
    return this.httpClient.get<Posts[]>(`${USERS_URL_SHORT}/${userId}/posts`);
  }

  getComments(postId: number): Observable<Comments[]> {
    return this.httpClient.get<Comments[]>(
      `${POSTS_URL_SHORT}/${postId}/comments`,
    );
  }

  addComments(postId: number, comment: newComments) {
    const token = localStorage.getItem('token');
    return this.httpClient.post(
      `${POSTS_URL_SHORT}/${postId}/comments`,
      comment,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  addPosts(userId: number, post: newPosts) {
    const token = localStorage.getItem('token');
    return this.httpClient.post(`${USERS_URL_SHORT}/${userId}/posts`, post, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
