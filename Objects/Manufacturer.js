class Manufacturer{
    constructor(name,description,address,phonenumber,email){
        this.name=name;
        this.images=[];
        this.introvideo="";
        this.description=description;
        this.address=address;
        this.phonenumber=phonenumber;
        this.email=email;
        this.productscategory=[];
    }
}

module.exports = Manufacturer;