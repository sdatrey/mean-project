import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onAddPost(){
    const post: Post = {
      title : this.enteredTitle,
      content : this.enteredContent
    }
    this.postCreated.emit(post);
  }

}
