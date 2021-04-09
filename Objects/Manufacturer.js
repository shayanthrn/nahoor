class Manufacturer{
    constructor(name,description,logo,address,phonenumber,email,listofcats){
        this.name=name;
        this.logo=logo;
        this.images=[];
        this.introvideo="";
        this.description=description;
        this.address=address;
        this.phonenumber=phonenumber;
        this.email=email;
        this.productscategory=listofcats;
    }
}

module.exports = Manufacturer;