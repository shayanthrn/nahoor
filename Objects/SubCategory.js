class SubCategory{
    constructor(name,parentname,path){
        this.name=name;
        this.parentname=parentname;
        this.image=path;
        this.banners=[]
    }
}

module.exports = SubCategory;