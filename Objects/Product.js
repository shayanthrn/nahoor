class Product{
    constructor(name,priceT,priceA,category,weight,countperbox){
        this.name=name;
        this.priceA=priceA;
        this.priceT=priceT;
        this.category=category;
        this.weight=weight;
        this.countperbox=countperbox;
        this.features=[];
    }
}

module.exports = Product;