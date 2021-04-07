class Order{
    constructor(userphonenumber){
        this.userphonenumber=userphonenumber;
        this.listoforders=[];
        this.totalcost=0;
        this.status="paymentpending"
    }
}

module.exports = Order;