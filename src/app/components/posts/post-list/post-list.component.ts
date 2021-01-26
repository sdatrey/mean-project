import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DeletePost, EditPost } from 'src/app/store/action/action';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {
   posts: Post[] = [];
   totalPosts =  0;
   postsPerPage = 3;
   currentPage = 1;
   pageSizeOptions = [1, 3, 5, 7];
   userId: string;
   private postsSub : Subscription;
   private authStatusSubs: Subscription;
    userIsAuthenticated = false;

  constructor(public postService : PostService, public authService: AuthService, private store : Store) { }

  ngOnInit() {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
      this.userId = this.authService.getUserId();
      this.postsSub = this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }
  onDelete(postId: string){
    this.postService.deletePost(postId)
    .subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    });
    this.store.dispatch(DeletePost({id: postId}));
  }
  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
