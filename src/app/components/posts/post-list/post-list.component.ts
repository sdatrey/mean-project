import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
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
   private postsSub : Subscription;

  constructor(public postService : PostService) { }

  ngOnInit() {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
      this.postsSub = this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
    });
  }
  onDelete(postId: string){
    this.postService.deletePost(postId)
    .subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    });
  }
  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
