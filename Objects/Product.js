class Product{
    constructor(name,priceT,priceA,category,weight,countperbox,manufacturer,features_title,features){
        this.name=name;
        this.priceA=priceA;
        this.priceT=priceT;
        this.category=category;
        this.weight=weight;
        this.countperbox=countperbox;
        this.features_title=features_title;
        this.features=features;
        this.manufacturer=manufacturer;
    }
}

module.exports = Product;