const DEFAULT_PAGE_LIMIT = 15;

function getPagination(query) {
    return Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
}

export default getPagination;
