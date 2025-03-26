module.exports = (req, res, next) => {
    console.log("Role middleware executed");
    next();
};
