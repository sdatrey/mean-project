import { createReducer, on, Action } from "@ngrx/store";
import * as PostPageAction from "../action/action";
import { Post } from "../../components/posts/post.model"

export interface PostState {
    posts: Post[];
}

export const initialState : PostState = {
    posts: []
};

const PostReducer = createReducer(
    initialState,
    on(PostPageAction.CreatePost, (state, {post}) =>{
        return {
            ...state,
            posts: [...state.posts, post]
        }
    }),
    on(PostPageAction.DeletePost, (state, {id}) => {
        return{
            ...state,
            posts: [...state.posts, id]
        }
    }),
    on(PostPageAction.EditPost, (state, {id}) => {
        return {
            ...state,
            posts: [...state.posts, id]
        }
    })
)
export function reducer(state = initialState, action: Action){
    return PostReducer(state, action); 
}
