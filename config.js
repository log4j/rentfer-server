/**
 *	config
 */





var config = {
	website_name: 'RentFerence',
	description: 'Make our life easier!',
	site_static_host: '',
	port: 1234,

    auth_cookie_name: 'rentference_cookie',

	session_secret: 'rentference_secret',
	db: 'mongodb://127.0.0.1/rentfer',


    labelColor: ['primary','success','info','warning','danger','cyan','red','green','orange','amethyst','greensea','dutch','hotpink','drank','blue','slategray','redbrown'],
    randomLabelColor : function(){
        return this.labelColor[parseInt(Math.random()*this.labelColor.length)];
    },
    typeIconList:['fa-shopping-cart', 'fa-car', 'fa-cutlery'],
    typeNameList:['Shopping', 'Travel', 'Eating'],


    cardColor: ['cyan','green','orange', 'amethyst','greensea','drank','dutch','hotpink','redbrown','slategray'],
    randomCardColor : function(){
        return this.cardColor[parseInt(Math.random()*this.cardColor.length)];
    },

    tip_type : ['租房大全','吃货百科','生存指南','交通手册'],
    image_max_size: 2

};


module.exports = config;



