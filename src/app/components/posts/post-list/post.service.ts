import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../post.model';

@Injectable({providedIn: 'root'})
export class PostService{
    private posts : Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient){}

    getPosts() {
       this.http.get<{message: string, posts: any}>('http://localhost:3000/posts')
       .pipe(map(postData =>{
           return postData.posts.map(post =>{
               return {
                   title: post.title,
                   content: post.content,
                   id: post._id
               };
           })
       }))
       .subscribe((transformedPosts) =>{
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]);
       });
    }
    getPostUpdateListener(): Observable<Post[]> {
            return this.postsUpdated.asObservable();
        }
    getPost(id: string): Observable<{_id: string, title: string, content: string}> {
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/posts/' + id);
    }

    addPost(title: string, content: string){
        const post : Post = {id: null,title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/posts', post)
        .subscribe((responseData) => {
            const postId = responseData.postId;
            post.id = postId;
            this.posts.push(post); 
            this.postsUpdated.next([...this.posts]);
        })
        
    }

    updatePost(id: string, title: string, content: string){
        const post: Post = {id: id, title: title, content: content};
        this.http.put('http://localhost:3000/posts/' + id, post)
        .subscribe((res) => {
            const updatedPost = [...this.posts];
            const oldPostIndex = updatedPost.findIndex(p => p.id === id);
            updatedPost[oldPostIndex] = post;
            this.posts = updatedPost;
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string){
        this.http.delete('http://localhost:3000/posts/' + postId)
        .subscribe(() => {
            const postsUpdated = this.posts.filter(post => post.id != postId);
            this.posts = postsUpdated;
            this.postsUpdated.next([...this.posts]);
        });
    }   
} 