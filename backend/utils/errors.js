const notFound = route => {
    const err = new Error(`${route} couldn't be found`);
    err.status = 404;
    return err;
}

const authorizationError = () => {
    const err = new Error(`Fobidden`);
    err.status = 403;
    return err;
}

module.exports = {
    notFound,
    authorizationError
}
