export const formatReviews = (reviews: { point: number }[]) => {
    const results = reviews?.reduce(
        (accumulator, currentValue) =>
            accumulator + currentValue.point / reviews.length,
        0
    );
    return Math.round(results * 2) / 2;
};

export const randomNumberId = () => {
    return Math.floor(100000000 + Math.random() * 900000000);
}