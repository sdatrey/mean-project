import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { CreatePost } from 'src/app/store/action/action';
import { PostState } from 'src/app/store/reducer/reducer';
import { PostService } from '../post-list/post.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post = {
    content: '',
    title: '',
    id: '',
    imagePath: '',
    creator: ''
  };
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  constructor(public postService: PostService, public route: ActivatedRoute, private store: Store<PostState>) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}) ,
      content: new FormControl(null, {validators:[Validators.required, Validators.minLength(4)]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = 
          {id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
     } else {
       this.mode = 'create';
       this.postId = null;
     }

    })

  }
  onImagePicker(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
  onSavePost(){
    if (this.form.invalid) {
      return;
    }
    if(this.mode === 'create'){
        this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        this.store.dispatch(CreatePost({post: {
          title: this.form.value.title,
          content: this.form.value.content,
          imagePath: this.form.value.image
        }}))
        console.log(this.form.value.image);
    } else {
      this.postService.updatePost(this.postId,this.form.value.title, this.form.value.content, this.form.value.image);
    }

    this.form.reset();
  }

}
