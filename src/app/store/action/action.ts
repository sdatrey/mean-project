import { createAction, props } from '@ngrx/store';
import { Post } from 'src/app/components/posts/post.model';

export const CreatePost = createAction(
    '[Create Page] Create',
    props<{post: Post}>()
);
export const EditPost = createAction(
    '[Edit Page] Edit',
    props<{id: string, updates: Post}>()
);
export const DeletePost = createAction(
    '[Delete Page] Delete',
    props<{id: string}>()
);
export const GetPost = createAction(
    '[Get Page] Get',
    props<{post: Post}>()
)