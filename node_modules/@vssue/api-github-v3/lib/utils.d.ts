import { VssueAPI } from 'vssue';
import { ResponseUser, ResponseIssue, ResponseComment, ResponseReactionsSummary } from './types';
export declare function normalizeUser(user: ResponseUser): VssueAPI.User;
export declare function normalizeIssue(issue: ResponseIssue): VssueAPI.Issue;
export declare function normalizeReactions(reactions: ResponseReactionsSummary): VssueAPI.Reactions;
export declare function normalizeComment(comment: ResponseComment): VssueAPI.Comment;
export declare function mapReactionName(reaction: keyof VssueAPI.Reactions): string;
declare const _default: {
    normalizeUser: typeof normalizeUser;
    normalizeIssue: typeof normalizeIssue;
    normalizeComment: typeof normalizeComment;
    normalizeReactions: typeof normalizeReactions;
    mapReactionName: typeof mapReactionName;
};
export default _default;
