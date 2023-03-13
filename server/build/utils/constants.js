"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumberId = exports.formatReviews = void 0;
var formatReviews = function (reviews) {
    var results = reviews === null || reviews === void 0 ? void 0 : reviews.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.point / reviews.length;
    }, 0);
    return Math.round(results * 2) / 2;
};
exports.formatReviews = formatReviews;
var randomNumberId = function () {
    return Math.floor(100000000 + Math.random() * 900000000);
};
exports.randomNumberId = randomNumberId;
