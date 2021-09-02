module.exports = {
    READ_PRODUCTS: 1 << 1,

    READ_DEMANDS: 1 << 2,
    CREATE_DEMANDS: 1 << 3,
    UPDATE_DEMANDS: 1 << 4,
    DELETE_DEMANDS: 1 << 5,

    hasPermission: function (code, permission) {
        return (code & permission) == permission;
    },
    addPermission: function (code, permission) {
        return code |= permission;
    }
}