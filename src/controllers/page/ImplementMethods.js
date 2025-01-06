export function goToIndex() {
    this.router.push({
        name: this.route_index,
        replace: true,
    });
}

export function addItem() {
    this.router.push({
        name: this.route_create,
    });
}

export function editItem(id) {
    this.router.push({
        name: this.route_edit,
        params: { id },
    });
}

export function showItem(id) {
    this.router.push({
        name: this.route_show,
        params: { id },
    });
}
