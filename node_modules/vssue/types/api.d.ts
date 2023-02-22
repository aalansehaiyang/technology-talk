export namespace VssueAPI {
  export type Options = {
    owner: string;
    repo: string;
    clientId: string;
    clientSecret?: string;
    baseURL?: string;
    state: string;
    labels: Array<string>;
    proxy?: string | ((url: string) => string);
  };

  export type Platform = {
    name: string;
    link: string;
    version: string;
    meta: {
      reactable: boolean;
      sortable: boolean;
    };
  };

  export type AccessToken = string | null;

  export type User = {
    username: string;
    avatar?: string;
    homepage?: string;
  };

  export type Issue = {
    id: string | number;
    title: string;
    content: string;
    link: string;
  };

  export type Comment = {
    id: string | number;
    content: string;
    contentRaw: string;
    author: VssueAPI.User;
    createdAt: string;
    updatedAt: string;
    reactions?: VssueAPI.Reactions | null;
  };

  export type Comments = {
    count: number;
    page: number;
    perPage: number;
    data: Array<VssueAPI.Comment>;
  };

  export type Reactions = {
    like?: number;
    unlike?: number;
    heart?: number;
  };

  export type Query = {
    page: number;
    perPage: number;
    sort: string;
  };

  export interface Instance {
    /**
     * The platform api info
     */
    readonly platform: VssueAPI.Platform;

    /**
     * Redirect to the authorization page of platform.
     */
    redirectAuth(): void;

    /**
     * Handle authorization.
     *
     * @remarks
     * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
     */
    handleAuth(): Promise<VssueAPI.AccessToken>;

    /**
     * Get the logined user with access token.
     */
    getUser(options: {
      accessToken: VssueAPI.AccessToken;
    }): Promise<VssueAPI.User>;

    /**
     * Get issue according to id or title
     */
    getIssue(options: {
      accessToken: VssueAPI.AccessToken;
      issueId?: string | number;
      issueTitle?: string;
    }): Promise<VssueAPI.Issue | null>;

    /**
     * Create a new issue
     */
    postIssue(options: {
      accessToken: VssueAPI.AccessToken;
      title: string;
      content: string;
    }): Promise<VssueAPI.Issue>;

    /**
     * Get comments of issue according to the issue id
     */
    getComments(options: {
      accessToken: VssueAPI.AccessToken;
      issueId: string | number;
      query?: Partial<VssueAPI.Query>;
    }): Promise<VssueAPI.Comments>;

    /**
     * Create a new comment
     */
    postComment(options: {
      accessToken: VssueAPI.AccessToken;
      issueId: string | number;
      content: string;
    }): Promise<VssueAPI.Comment>;

    /**
     * Edit a comment
     */
    putComment(options: {
      accessToken: VssueAPI.AccessToken;
      issueId: string | number;
      commentId: string | number;
      content: string;
    }): Promise<VssueAPI.Comment>;

    /**
     * Delete a comment
     */
    deleteComment(options: {
      accessToken: VssueAPI.AccessToken;
      issueId: string | number;
      commentId: string | number;
    }): Promise<boolean>;

    /**
     * Get reaction of a comment
     */
    getCommentReactions(options: {
      accessToken: VssueAPI.AccessToken;
      issueId: string | number;
      commentId: string | number;
    }): Promise<VssueAPI.Reactions>;

    /**
     * Create a new reaction of a comment
     */
    postCommentReaction(options: {
      accessToken: VssueAPI.AccessToken;
      issueId: string | number;
      commentId: string | number;
      reaction: keyof VssueAPI.Reactions;
    }): Promise<boolean>;
  }

  export interface Constructor {
    new (options: VssueAPI.Options): VssueAPI.Instance;
  }
}

export default VssueAPI;
