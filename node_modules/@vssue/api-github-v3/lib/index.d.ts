import { VssueAPI } from 'vssue';
import { AxiosInstance } from 'axios';
/**
 * Github REST API v3
 *
 * @see https://developer.github.com/v3/
 * @see https://developer.github.com/apps/building-oauth-apps/
 */
export default class GithubV3 implements VssueAPI.Instance {
    baseURL: string;
    owner: string;
    repo: string;
    labels: Array<string>;
    clientId: string;
    clientSecret: string;
    state: string;
    proxy: string | ((url: string) => string);
    $http: AxiosInstance;
    constructor({ baseURL, owner, repo, labels, clientId, clientSecret, state, proxy, }: VssueAPI.Options);
    /**
     * The platform api info
     */
    get platform(): VssueAPI.Platform;
    /**
     * Redirect to the authorization page of platform.
     *
     * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
     */
    redirectAuth(): void;
    /**
     * Handle authorization.
     *
     * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
     *
     * @remarks
     * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
     */
    handleAuth(): Promise<VssueAPI.AccessToken>;
    /**
     * Get user access token via `code`
     *
     * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
     */
    getAccessToken({ code }: {
        code: string;
    }): Promise<string>;
    /**
     * Get the logged-in user with access token.
     *
     * @see https://developer.github.com/v3/users/#get-the-authenticated-user
     */
    getUser({ accessToken, }: {
        accessToken: VssueAPI.AccessToken;
    }): Promise<VssueAPI.User>;
    /**
     * Get issue of this page according to the issue id or the issue title
     *
     * @see https://developer.github.com/v3/issues/#list-issues-for-a-repository
     * @see https://developer.github.com/v3/issues/#get-a-single-issue
     * @see https://developer.github.com/v3/#pagination
     * @see https://developer.github.com/v3/search/#search-issues-and-pull-requests
     */
    getIssue({ accessToken, issueId, issueTitle, }: {
        accessToken: VssueAPI.AccessToken;
        issueId?: string | number;
        issueTitle?: string;
    }): Promise<VssueAPI.Issue | null>;
    /**
     * Create a new issue
     *
     * @see https://developer.github.com/v3/issues/#create-an-issue
     */
    postIssue({ accessToken, title, content, }: {
        accessToken: VssueAPI.AccessToken;
        title: string;
        content: string;
    }): Promise<VssueAPI.Issue>;
    /**
     * Get comments of this page according to the issue id
     *
     * @see https://developer.github.com/v3/issues/comments/#list-comments-on-an-issue
     * @see https://developer.github.com/v3/#pagination
     *
     * @remarks
     * Github V3 does not support sort for issue comments now.
     * Github V3 have to request the parent issue to get the count of comments.
     */
    getComments({ accessToken, issueId, query: { page, perPage }, }: {
        accessToken: VssueAPI.AccessToken;
        issueId: string | number;
        query?: Partial<VssueAPI.Query>;
    }): Promise<VssueAPI.Comments>;
    /**
     * Create a new comment
     *
     * @see https://developer.github.com/v3/issues/comments/#create-a-comment
     */
    postComment({ accessToken, issueId, content, }: {
        accessToken: VssueAPI.AccessToken;
        issueId: string | number;
        content: string;
    }): Promise<VssueAPI.Comment>;
    /**
     * Edit a comment
     *
     * @see https://developer.github.com/v3/issues/comments/#edit-a-comment
     */
    putComment({ accessToken, commentId, content, }: {
        accessToken: VssueAPI.AccessToken;
        issueId: string | number;
        commentId: string | number;
        content: string;
    }): Promise<VssueAPI.Comment>;
    /**
     * Delete a comment
     *
     * @see https://developer.github.com/v3/issues/comments/#delete-a-comment
     */
    deleteComment({ accessToken, commentId, }: {
        accessToken: VssueAPI.AccessToken;
        issueId: string | number;
        commentId: string | number;
    }): Promise<boolean>;
    /**
     * Get reactions of a comment
     *
     * @see https://developer.github.com/v3/issues/comments/#get-a-single-comment
     * @see https://developer.github.com/v3/reactions/#list-reactions-for-an-issue-comment
     *
     * @remarks
     * The `List reactions for an issue comment` API also returns author of each reaction.
     * As we only need the count, use the `Get a single comment` API is much simpler.
     */
    getCommentReactions({ accessToken, commentId, }: {
        accessToken: VssueAPI.AccessToken;
        issueId: string | number;
        commentId: string | number;
    }): Promise<VssueAPI.Reactions>;
    /**
     * Create a new reaction of a comment
     *
     * @see https://developer.github.com/v3/reactions/#create-reaction-for-an-issue-comment
     */
    postCommentReaction({ accessToken, commentId, reaction, }: {
        accessToken: VssueAPI.AccessToken;
        issueId: string | number;
        commentId: string | number;
        reaction: keyof VssueAPI.Reactions;
    }): Promise<boolean>;
    /**
     * Delete a reaction of a comment
     *
     * @see https://developer.github.com/v3/reactions/#delete-a-reaction
     */
    deleteCommentReaction({ accessToken, commentId, reactionId, }: {
        accessToken: VssueAPI.AccessToken;
        commentId: string | number;
        reactionId: string | number;
    }): Promise<boolean>;
}
