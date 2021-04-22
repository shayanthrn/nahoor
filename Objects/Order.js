class Order{
    constructor(userphonenumber,listoforders,totalcost,manufacturer){
        this.userphonenumber=userphonenumber;
        this.manufacturer=manufacturer;
        this.listoforders=listoforders;
        this.totalcost=totalcost;
        this.status="paymentpending"
    }
}

module.exports = Order;