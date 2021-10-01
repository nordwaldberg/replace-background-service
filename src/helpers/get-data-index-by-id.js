const getDataIndexById = (id, database) => {
    let searched = 0;
    database.data.forEach((item, index) => {
        if (item.id === id) {
            searched = index;
        }
    });
    return searched;
}

module.exports = getDataIndexById;