class Manufacturer{
    constructor(name,shortdescription,description,logo,address,phonenumber,email,website,listofcats,categories){
        this.name=name;
        this.logo=logo;
        this.images=[];
        this.shortdescription=shortdescription
        this.description=description;
        this.address=address;
        this.phonenumber=phonenumber;
        this.email=email;
        this.website=website;
        this.productscategory=listofcats;
        this.categories=[];
        this.rate=0;
    }
}

module.exports = Manufacturer;