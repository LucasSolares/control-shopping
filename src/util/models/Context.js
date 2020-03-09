class Context {

    constructor(no_bill, date, name, nit, address, products, total) {
        this.no_bill = no_bill
        this.date = date
        this.name = name
        this.nit = nit
        this.address = address
        this.products = products
        this.total = total
    }

    toHandleBars() {

        return {
            no_bill: this.no_bill,
            date: this.date,
            name: this.name,
            nit: this.nit,
            address: this.address,
            products: this.products,
            subtotal: this.subtotal,
            total: this.total
        }

    }

}

module.exports = Context