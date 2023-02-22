export const formatReviews = (reviews: { point: number }[]) => {
    const results = reviews?.reduce(
        (accumulator, currentValue) =>
            accumulator + currentValue.point / reviews.length,
        0
    );
    return Math.round(results * 2) / 2;
};