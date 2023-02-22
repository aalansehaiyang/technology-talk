"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// can't be const enum if we use babel to compile
// https://github.com/babel/babel/issues/8741
var EnumChangefreq;
(function (EnumChangefreq) {
    EnumChangefreq["DAILY"] = "daily";
    EnumChangefreq["MONTHLY"] = "monthly";
    EnumChangefreq["ALWAYS"] = "always";
    EnumChangefreq["HOURLY"] = "hourly";
    EnumChangefreq["WEEKLY"] = "weekly";
    EnumChangefreq["YEARLY"] = "yearly";
    EnumChangefreq["NEVER"] = "never";
})(EnumChangefreq = exports.EnumChangefreq || (exports.EnumChangefreq = {}));
exports.CHANGEFREQ = [
    EnumChangefreq.ALWAYS,
    EnumChangefreq.HOURLY,
    EnumChangefreq.DAILY,
    EnumChangefreq.WEEKLY,
    EnumChangefreq.MONTHLY,
    EnumChangefreq.YEARLY,
    EnumChangefreq.NEVER
];
var EnumYesNo;
(function (EnumYesNo) {
    EnumYesNo["YES"] = "yes";
    EnumYesNo["NO"] = "no";
})(EnumYesNo = exports.EnumYesNo || (exports.EnumYesNo = {}));
var EnumAllowDeny;
(function (EnumAllowDeny) {
    EnumAllowDeny["ALLOW"] = "allow";
    EnumAllowDeny["DENY"] = "deny";
})(EnumAllowDeny = exports.EnumAllowDeny || (exports.EnumAllowDeny = {}));
//# sourceMappingURL=types.js.map