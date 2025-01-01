const express  = require("express");
const fs = require("fs");
const path = require("path");
const hbs  = require("hbs");
const connection = require("./db/Conn");
const db = require("./db/ConnPromise");
const bcrypt = require("bcryptjs");
const app = express();
const bodyParser = require('body-parser');
const { count } = require("console");
const dotenv = require('dotenv');
dotenv.config();
const port = 8000;
let admin1 = false;
const date = new Date();

function searchFile(directory, targetFileName) {
    let found = 0; // Initialize found as 0
  
    function searchRecursively(dir) {
      const files = fs.readdirSync(dir);
  
      for (const file of files) {
        const filePath = path.join(dir, file);
  
        const stats = fs.statSync(filePath);
  
        if (stats.isDirectory()) {
          searchRecursively(filePath);
        } else if (file === targetFileName) {
          console.log(`File "${targetFileName}" found at: ${filePath}`);
          found = 1; // Set found to 1 when the file is found
        }
      }
    }
  
    searchRecursively(directory);
  
    return found;
  }

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let = y = year.toString();  

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}/${month}/${y[2]}${y[3]}`;
console.log(currentDate); // "17/6/2022"
let Category1;
let Not_Available1 = "";
let MSG = "";
let Fimg,Simg,Timg,id,amount,shoe_name;
var totalprice=0;
let Full_name,Mobile_number,City1,Postal,Addres,order_no;

console.log(currentDate);


// var Product = {};
// var cat1 = 'Sneakers';
// var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
// connection.query(sql, [cat1], function (err, result) {
//     if (err) throw err;
//     Product = result;
// });
                
// var Product1 = {};
// var cat2 = 'Causals';
// var sql1 = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
// connection.query(sql1, [cat2], function (err, result) {
//     if (err) throw err;
//     Product1 = result;
// });
                
// var Product2 = {};
// var cat3 = 'Formals';
// var sql2 = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
// connection.query(sql2, [cat3], function (err, result) {
//     if (err) throw err;
//     Product2 = result;
// });
                
// var Product3 = {};
// var cat3 = 'Sandals';
// var sql3 = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
// connection.query(sql3, [cat3], function (err, result) {
//     if (err) throw err;
//     Product3 = result;
// });



                
const templatePath = path.join(__dirname,"./Templates/views");
const PartialPath = path.join(__dirname,"./Templates/Partials");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine","hbs");
app.set("views",templatePath);
app.use("/images",express.static(path.join(__dirname,"../images")));
app.use("/js",express.static(path.join(__dirname,"../js")));
hbs.registerPartials(PartialPath);

app.get('/',async(req,res)=>{
    admin1 = false;
    res.render("index");
});

app.get('/about',(req,res)=>{
    res.render("about");
});

app.get('/checkout',async(req,res)=>{
    var sql9 = "SELECT C.size,C.Pid,P.Firstimg,P.Pname,P.price,C.quantity,(P.price*C.quantity) AS PQ FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
    const [Cartt,fields] = await db.query(sql9);
    var total=0;
    for (let i = 0; i < Cartt.length; i++) {
        total += Cartt[i].price*Cartt[i].quantity;
    }
    totalprice = total;
    res.render("checkout",{Cartt,Total_price:totalprice,Empty: MSG});
});





app.post('/checkout1',async(req,res)=>{
    console.log(req.body.button);
    var sql36 = "delete from cart c where c.Pid = ? "
    const [Carttt,fields] = await db.query(sql36,req.body.button);
    var sql9 = "SELECT C.size,C.Pid,P.Firstimg,P.Pname,P.price,C.quantity,(P.price*C.quantity) AS PQ FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
    const [Cartt,fields111] = await db.query(sql9);
    var total=0;
    for (let i = 0; i < Cartt.length; i++) {
        total += Cartt[i].price*Cartt[i].quantity;
    }
    totalprice = total;
    res.render("checkout",{Cartt,Total_price:totalprice,Empty: MSG});
});


app.post('/checkout',async(req,res)=>{
    try{
        var sql17 = "SELECT C.size,C.Pid,P.Firstimg,P.Pname,P.price,C.quantity,(P.price*C.quantity) AS PQ FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
        const [Carttt,fields] = await db.query(sql17);
        if(Carttt.length==0)
        {
            MSG = "Your Cart is Empty";
            res.render("checkout",{Empty: MSG,Total_price: totalprice});
            MSG="";
        }
        if(req.body.Postal_Code.length==5 &&req.body.Mobile_no.length==11)
        {
            Full_name = req.body.name;
            Mobile_number = req.body.Mobile_no;
            Postal = req.body.Postal_Code;
            City1 = req.body.City;
            Addres = req.body.Address;
            res.status(201).render("payment");
        }
        else
        {
            var sql9 = "SELECT C.size,C.Pid,P.Firstimg,P.Pname,P.price,C.quantity,(P.price*C.quantity) AS PQ FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
            const [Cartt,fields] = await db.query(sql9);
            var total=0;
            for (let i = 0; i < Cartt.length; i++) {
                total += Cartt[i].price*Cartt[i].quantity;
            }
            totalprice = total;
            MSG = "Wrong Input Details";
            // res.render("checkout",{Empty: MSG,Total_price: totalprice});
            res.render("checkout",{Cartt,Total_price:totalprice,Empty: MSG});
            MSG="";
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send(err);
    }
});

app.get('/contact',(req,res)=>{
    res.render("contact");
});

app.get('/payment',(req,res)=>{
    res.render("payment");
});

app.post('/payment',async(req,res)=>{
    var sql20 = "SELECT * FROM Cart";
    const [rows6,fields6] = await db.query(sql20);
    if(rows6.length==0)
    {
        res.render("Payment",{Errr: "Your Cart is Empty"});
    }
    else
    {
        let Method, Name_on_Card,Card_number, Cvv, EXP_Date;
        Method = req.body.Payment;
        
        var sql10 = "Select * FROM Customer_Purchasing";
        const [rows,fields] = await db.query(sql10);
        if(Method=="CARD")
        {
            Name_on_Card = req.body.name;
            Card_number = req.body.number;
            Cvv = req.body.security;
            EXP_Date = req.body.expiration;
            console.log(Card_number.length);
            if(Card_number.length!=16)
            {
                res.render("payment",{Errorr:"Invalid Card Number"});
                return;
            }
            if(Cvv.length!=3)
            {
                res.render("payment",{Errorr:"Invalid Card CVV"});
                return;
            }
            if(rows.length==0)
            {
                order_no = 100000;

                var sql11 = "INSERT INTO Customer_Purchasing (Order_id,Full_name, Mobile_no, City, Postal_code, Address) VALUES ?";
                var values = [
                    [order_no, Full_name ,Mobile_number,City1,Postal,Addres]
                ];
                const [rows1,fields] = await db.query(sql11,[values]);

                var sql13 = "SELECT C.*, P.price FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
                const [rows2,fields1] = await db.query(sql13);

                for (let i = 0; i < rows2.length; i++) 
                {
                    var sql14 = "INSERT INTO Order_Details (Order_id, Pid ,size ,quantity,price) VALUES ?";
                    var values1 = [
                        [order_no,rows2[i].Pid,rows2[i].size7,rows2[i].quantity,rows2[i].price]
                    ];
                    const [rows3,fields2] = await db.query(sql14,[values1]);

                    
                }
                
                
                var sql16 = "INSERT INTO Payment (Order_id, Method,Total_amount,Dates) VALUES ?";
                var values = [
                    [order_no, Method,totalprice,currentDate]
                ];
                await db.query(sql16,[values]);
                
                var sql22 = "SELECT * FROM Payment";
                const [rows8,fields8] = await db.query(sql22);


                Card_number = await bcrypt.hash(Card_number,10);
                Cvv = await bcrypt.hash(Cvv,10);
                var sql21 = "INSERT INTO Payment_Method(Payid,Card_name,Card_no,CVV,EXP_date) VALUES ?";
                var values = [
                    [rows8[rows8.length-1].Payid,Name_on_Card ,Card_number,Cvv,EXP_Date]
                ]
                const [rows7,fields7] = await db.query(sql21,[values]);
                console.log("sdfsd" + rows8[rows8.length-1].Payid);

                var sql19 = "SELECT * FROM Cart";
                const [rows5,fields4] = await db.query(sql19);
                
                for (let i = 0; i < rows5.length; i++) 
                {
                    var sql18 = "UPDATE Product_sizes SET quantity  = quantity - ? WHERE Pid = ? AND size = ?";
                    await db.query(sql18,[rows5[i].quantity,rows5[i].Pid,rows5[i].size]);
                }
                
                var sql15 = "DELETE FROM Cart";
                await db.query(sql15);


                const objectArray = [];

                var sql23 = "SELECT * FROM Customer_Purchasing WHERE Order_id = ?";
                const [rows9,fields11] = await db.query(sql23,[order_no]);


                var sql24 = "SELECT * FROM Order_Details WHERE Order_id = ?";
                const [rows10,fields12] = await db.query(sql24,[order_no]);

                for (let i = 0; i < rows10.length; i++) 
                {
                    var sql25 = "SELECT * FROM Product WHERE Pid = ?";
                    const [rows11,fields22] = await db.query(sql25,[rows10[i].Pid]);

                    objectArray.push({
                        Firstimg: rows11[0].Firstimg,
                        quantity: rows10[i].quantity,
                        Pname: rows11[0].Pname,
                        price: rows11[0].price,
                        size: rows10[i].size
                    });
                }

                res.render("ThankuPage",{objectArray});
            }
            else
            {

                order_no = rows[rows.length-1].Order_id + 1;
                console.log(order_no);
                var sql12 = "INSERT INTO Customer_Purchasing (Order_id, Full_name, Mobile_no, City, Postal_code, Address) VALUES ?";
                var values = [
                    [order_no, Full_name ,Mobile_number,City1,Postal,Addres]
                ];
                const [rows1,fields] = await db.query(sql12,[values]);

                var sql13 = "SELECT C.*, P.price FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
                const [rows2,fields1] = await db.query(sql13);

                for (let i = 0; i < rows2.length; i++) 
                {
                    var sql14 = "INSERT INTO Order_Details (Order_id, Pid , size ,quantity, price) VALUES ?";
                    var values1 = [
                        [order_no,rows2[i].Pid,rows2[i].size,rows2[i].quantity,rows2[i].price]
                    ];
                    const [rows3,fields2] = await db.query(sql14,[values1]);
                }



                
                var sql16 = "INSERT INTO Payment (Order_id, Method,Total_amount,Dates) VALUES ?";
                var values = [
                    [order_no, Method,totalprice,currentDate]
                ];
                await db.query(sql16,[values]);
                
                var sql22 = "SELECT * FROM Payment";
                const [rows8,fields8] = await db.query(sql22);


                Card_number = await bcrypt.hash(Card_number,10);
                Cvv = await bcrypt.hash(Cvv,10);
                var sql21 = "INSERT INTO Payment_Method(Payid,Card_name,Card_no,CVV,EXP_date) VALUES ?";
                var values = [
                    [rows8[rows8.length-1].Payid,Name_on_Card ,Card_number,Cvv,EXP_Date]
                ]
                const [rows7,fields7] = await db.query(sql21,[values]);
                console.log("sdfsd" + rows8[rows8.length-1].Payid);

                
                var sql19 = "SELECT * FROM Cart";
                const [rows5,fields4] = await db.query(sql19);

                for (let i = 0; i < rows5.length; i++) 
                {
                    var sql18 = "UPDATE Product_sizes SET quantity  = quantity - ? WHERE Pid = ? AND size = ?";
                    await db.query(sql18,[rows5[i].quantity,rows5[i].Pid,rows5[i].size]);
                }

                var sql15 = "DELETE FROM Cart";
                await db.query(sql15);


                const objectArray = [];

                var sql23 = "SELECT * FROM Customer_Purchasing WHERE Order_id = ?";
                const [rows9,fields11] = await db.query(sql23,[order_no]);


                var sql24 = "SELECT * FROM Order_Details WHERE Order_id = ?";
                const [rows10,fields12] = await db.query(sql24,[order_no]);

                for (let i = 0; i < rows10.length; i++) 
                {
                    var sql25 = "SELECT * FROM Product WHERE Pid = ?";
                    const [rows11,fields22] = await db.query(sql25,[rows10[i].Pid]);

                    objectArray.push({
                        Firstimg: rows11[0].Firstimg,
                        quantity: rows10[i].quantity,
                        Pname: rows11[0].Pname,
                        price: rows11[0].price,
                        size: rows10[i].size
                    });
                }

                res.render("ThankuPage",{objectArray});
            }
        }
        else if(Method=="COD")
        {
            if(rows.length==0)
            {
                order_no = 100000;

                var sql11 = "INSERT INTO Customer_Purchasing (Order_id,Full_name, Mobile_no, City, Postal_code, Address) VALUES ?";
                var values = [
                    [order_no, Full_name ,Mobile_number,City1,Postal,Addres]
                ];
                const [rows1,fields] = await db.query(sql11,[values]);

                var sql13 = "SELECT C.*, P.price FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
                const [rows2,fields1] = await db.query(sql13);

                for (let i = 0; i < rows2.length; i++) 
                {
                    var sql14 = "INSERT INTO Order_Details (Order_id, Pid ,size ,quantity,price) VALUES ?";
                    var values1 = [
                        [order_no,rows2[i].Pid,rows2[i].size7,rows2[i].quantity,rows2[i].price]
                    ];
                    const [rows3,fields2] = await db.query(sql14,[values1]);

                    
                }
                
                
                var sql16 = "INSERT INTO Payment (Order_id,Method,Total_amount,Dates) VALUES ?";
                var values = [
                    [order_no,Method,totalprice,currentDate]
                ];
                const [rows4,fields3] = await db.query(sql16,[values]);
                
                var sql19 = "SELECT * FROM Cart";
                const [rows5,fields4] = await db.query(sql19);
                
                for (let i = 0; i < rows5.length; i++) 
                {
                    var sql18 = "UPDATE Product_sizes SET quantity  = quantity - ? WHERE Pid = ? AND size = ?";
                    await db.query(sql18,[rows5[i].quantity,rows5[i].Pid,rows5[i].size]);
                }
                
                var sql15 = "DELETE FROM Cart";
                await db.query(sql15);


                const objectArray = [];

                var sql23 = "SELECT * FROM Customer_Purchasing WHERE Order_id = ?";
                const [rows9,fields11] = await db.query(sql23,[order_no]);


                var sql24 = "SELECT * FROM Order_Details WHERE Order_id = ?";
                const [rows10,fields12] = await db.query(sql24,[order_no]);

                for (let i = 0; i < rows10.length; i++) 
                {
                    var sql25 = "SELECT * FROM Product WHERE Pid = ?";
                    const [rows11,fields22] = await db.query(sql25,[rows10[i].Pid]);

                    objectArray.push({
                        Firstimg: rows11[0].Firstimg,
                        quantity: rows10[i].quantity,
                        Pname: rows11[0].Pname,
                        price: rows11[0].price,
                        size: rows10[i].size
                    });
                }

                res.render("ThankuPage",{objectArray});
            }
            else
            {

                order_no = rows[rows.length-1].Order_id + 1;
                console.log(order_no);
                var sql12 = "INSERT INTO Customer_Purchasing (Order_id, Full_name, Mobile_no, City, Postal_code, Address) VALUES ?";
                var values = [
                    [order_no, Full_name ,Mobile_number,City1,Postal,Addres]
                ];
                const [rows1,fields] = await db.query(sql12,[values]);

                var sql13 = "SELECT C.*, P.price FROM Cart AS C JOIN Product P ON C.Pid=P.Pid";
                const [rows2,fields1] = await db.query(sql13);

                for (let i = 0; i < rows2.length; i++) 
                {
                    var sql14 = "INSERT INTO Order_Details (Order_id, Pid , size ,quantity, price) VALUES ?";
                    var values1 = [
                        [order_no,rows2[i].Pid,rows2[i].size,rows2[i].quantity,rows2[i].price]
                    ];
                    const [rows3,fields2] = await db.query(sql14,[values1]);
                }



                
                var sql16 = "INSERT INTO Payment (Order_id,Method,Total_amount,Dates) VALUES ?";
                var values = [
                    [order_no,Method,totalprice,currentDate]
                ];
                const [rows4,fields3] = await db.query(sql16,[values]);

                
                var sql19 = "SELECT * FROM Cart";
                const [rows5,fields4] = await db.query(sql19);

                for (let i = 0; i < rows5.length; i++) 
                {
                    var sql18 = "UPDATE Product_sizes SET quantity  = quantity - ? WHERE Pid = ? AND size = ?";
                    await db.query(sql18,[rows5[i].quantity,rows5[i].Pid,rows5[i].size]);
                }

                var sql15 = "DELETE FROM Cart";
                await db.query(sql15);



                const objectArray = [];

                var sql23 = "SELECT * FROM Customer_Purchasing WHERE Order_id = ?";
                const [rows9,fields11] = await db.query(sql23,[order_no]);


                var sql24 = "SELECT * FROM Order_Details WHERE Order_id = ?";
                const [rows10,fields12] = await db.query(sql24,[order_no]);

                for (let i = 0; i < rows10.length; i++) 
                {
                    var sql25 = "SELECT * FROM Product WHERE Pid = ?";
                    const [rows11,fields22] = await db.query(sql25,[rows10[i].Pid]);

                    objectArray.push({
                        Firstimg: rows11[0].Firstimg,
                        quantity: rows10[i].quantity,
                        Pname: rows11[0].Pname,
                        price: rows11[0].price,
                        size: rows10[i].size
                    });
                }

                res.render("ThankuPage",{objectArray});
            }
        }
        else
        {
            console.log(err);
            res.status(400).send(err);
        }
    }
});


app.get('/formals',async(req,res)=>{
    Category1 = 'formals';
    var cat1 = 'Formals';
    var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
    const [Product2,fields22] = await db.query(sql,[cat1]);
    console.log(Product2);
    res.render("formals",{Product2});
});

app.get('/casuals',async(req,res)=>{
    Category1 = 'casuals';
    var cat1 = 'Causals';
    var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
    const [Product1,fields22] = await db.query(sql,[cat1]);
    res.render("casuals",{Product1});
});

app.get('/sandals',async(req,res)=>{
    Category1 = 'sandals';
    var cat1 = 'Sandals';
    var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
    const [Product3,fields22] = await db.query(sql,[cat1]);
    res.render("sandals",{Product3});
});

app.get('/shop',async(req,res)=>{
    Category1 = 'shop';
    var cat1 = 'Sneakers';
    var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
    const [Product,fields22] = await db.query(sql,[cat1]);
    res.render("shop",{Product});
});

app.get('/shoping',(req,res)=>{

});

app.post('/shoping',async(req,res)=>{
    var sql = "SELECT * FROM Product_sizes";
    const [Product4,fields5] = await db.query(sql);
    let quantity = req.body.Quantity;
    let size = req.body.radio;
    let id = req.body.Pid;
    let flag = 0;
    let index;
    let quantity1 = 0;
    for (let i = 0; i < Product4.length; i++) 
    {
        if(id==Product4[i].Pid && size==Product4[i].size)
        {
            flag=1;
            index = i;
            break;
        }    
    }
    var sql5 = "SELECT * FROM Cart WHERE Pid = ? AND size = ?";
    const [rows1,fields] = await db.query(sql5,[id,size]);
    if(rows1.length>0)
    {
        // console.log(rows1.length);
        quantity1 = rows1[0].quantity;
        console.log(quantity1+ +quantity);
    }
    if(flag==1)
    {
        if((quantity1+ +quantity)<=Product4[index].quantity)
        {
            var sql5 = "SELECT * FROM Cart WHERE Pid = ? AND size = ?";
            const [rows,fields] = await db.query(sql5,[id,size]);
            if(rows.length==0)
            {
                var sql6 = "INSERT INTO Cart (Pid, size, quantity) VALUES ?";
                var values = [[id,size,quantity]];
                await db.query(sql6,[values]);
            }
            else
            {
                // for (let i = 0; i < array.length; i++) {
                //     const element = array[i];
                    
                // }
                if(rows[0].Pid==id)
                {
                    var sql8 = "UPDATE Cart SET quantity = quantity + ? WHERE Pid = ? AND size = ?";
                    await db.query(sql8,[quantity,id,size]);
                }
                else
                {
                    var sql7 = "INSERT INTO Cart (Pid, size,quantity) VALUES ?";
                    var values = [[id,size,quantity]];
                    await db.query(sql7,[values]);
                }
            }
        }
        else
        {
            console.log("dsfsdf");
            Not_Available1 = 'This Product is not available in this Qunatity';
            res.render("single",{
                ShoeName:shoe_name,
                amount:amount,
                First_img: Fimg,
                Sec_img: Simg,
                Third_img: Timg,
                Pid: id,
                Not_Available: Not_Available1
            });
            Not_Available1 = "";
            return;
        }
    }
    if(Category1=='shop')
    {
        var cat2 = 'Sneakers';
        var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
        const [Product,fields22] = await db.query(sql,[cat2]);
        res.render("shop",{Product});
    }
    else if(Category1=='formals')
    {
        var cat2 = 'Formals';
        var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
        const [Product2,fields22] = await db.query(sql,[cat2]);
        res.render("formals",{Product2});
    }
    else if(Category1=='casuals')
    {
        var cat2 = 'Causals';
        var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
        const [Product1,fields22] = await db.query(sql,[cat2]);
        res.render("casuals",{Product1});
    }
    else if(Category1=='sandals')
    {
        var cat2 = 'Sandals';
        var sql = "SELECT * FROM Product WHERE Pid in (Select Pid FROM Product_Category WHERE Category=?)";
        const [Product3,fields22] = await db.query(sql,[cat2]);
        res.render("sandals",{Product3});
    }
});
app.get('/single',(req,res)=>{
    res.render("single");
});

app.post('/single',async(req,res)=>{
    try{
        amount = req.body.amount;
        id = req.body.id;
        var sql4 = "SELECT * FROM Product WHERE Pid = ?";
        const [rows,fields] = await db.query(sql4,[id]);
        shoe_name = req.body.shoe_item;
        Fimg = rows[0].Firstimg;
        Simg = rows[0].Secondimg;
        Timg = rows[0].Thirdimg;
        res.status(201).render("single",{
            ShoeName:req.body.shoe_item,
            amount:req.body.amount,
            First_img: Fimg,
            Sec_img: Simg,
            Third_img: Timg,
            Pid: id,
            Not_Available: Not_Available1
        });
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send(err);
    }
});


app.get('/insertproduct',(req,res)=>{
    if(admin1==true)
    {
        res.render("insertproduct");
    }
    else
    {
        res.render("loginadmin");
    }
});

app.post('/insertproduct',async(req,res)=>{
    let count1=0;
    let flag1 = 0;
    let productid = req.body.productid;
    let productname = req.body.productname;
    let Category = req.body.Category;
    let uploadimage1 = req.body.uploadimage1;
    let final_imag1 = `images/${uploadimage1}`;
    let uploadimage2 = req.body.uploadimage2;
    let final_imag2 = `images/${uploadimage2}`;
    let uploadimage3 = req.body.uploadimage3;
    let final_imag3 = `images/${uploadimage3}`;
    let price = req.body.price;
    let Quantity40 = req.body.Quantity40;
    let Quantity41 = req.body.Quantity41;
    let Quantity42 = req.body.Quantity42;
    let Quantity43 = req.body.Quantity43;



    count1 += searchFile('../images',uploadimage1);
    count1 += searchFile('../images',uploadimage2);
    count1 += searchFile('../images',uploadimage3);
    
    if(count1==3)
    {
        var sql29 = "SELECT * FROM Product";
        const [rows14,fields] = await db.query(sql29);

        for (let i = 0; i < rows14.length; i++) 
        {
            if(productid==rows14[i].Pid)
            {
                flag1 = 1;
            }
        }
        if(flag1==0)
        {
            var sql30 = "INSERT INTO Product (Pid, Pname,Firstimg,Secondimg,Thirdimg,price) VALUES ?";
            var values = [
                [productid, productname,final_imag1,final_imag2,final_imag3,price]
            ];
            await db.query(sql30,[values]);
            var sql31 = "INSERT INTO Product_Category (Pid, Category) VALUES ?";
            var valuess = [
                [productid,Category]
            ];
            await db.query(sql31,[valuess]);
            var sql32 = "INSERT INTO Product_sizes (Pid, size,quantity) VALUES ?";
            var valuesss = [
                [productid,40,Quantity40],
                [productid,41,Quantity41],
                [productid,42,Quantity42],
                [productid,43,Quantity43]
            ];
            await db.query(sql32,[valuesss]);
            res.render("insertproduct",{MSGGG: "Product Inserted"});
        }
        else
        {
            res.render("insertproduct",{MSGGG: "Product Id is already used"});
        }
    }
    else
    {
        console.log(count1);
        res.render("insertproduct",{MSGGG: "Image was not in images directory"});
    }
    
});

app.get('/stockupdate',(req,res)=>{
    if(admin1==true)
    {
        res.render("stockupdate",{MSGGG: ""});
    }
    else
    {
        res.render("loginadmin");
    }
});

app.post('/stockupdate',async(req,res)=>{
    try
    {
        let pid = req.body.productid;
        let size = req.body.productsize;
        let q = req.body.quantity;
    
        var sql27 = "SELECT * FROM Product_sizes WHERE Pid = ? AND size = ?";
        const [rows13,fields13] = await db.query(sql27,[pid,size]);
        if(rows13[0].Pid==pid)
        {
            var sql28 = "UPDATE Product_sizes SET quantity = quantity + ? WHERE Pid = ? AND size = ?";
            await db.query(sql28,[q,pid,size]);
            res.render("stockupdate",{MSGGG: "Stock Updated"});
        }
    }
    catch(err)
    {
        res.render("stockupdate",{MSGGG: "Invalid Product Id"}); 
    }
    
});



app.get('/checkrecord',async (req,res)=>{
    if(admin1==true)
    {
        var sql23 = "SELECT * FROM Customer_Purchasing order by Order_id desc";
        const [rows9,fields] = await db.query(sql23);
        const objectArray1 = []
        const objectArray2 = []
        const objectArray3 = []
        for (let i = 0; i < 10; i++) 
            {
            console.log(rows9[i].Order_id);
            var sql26 = "SELECT * FROM Payment WHERE Order_id = ?";
            const [rows12,fields2] = await db.query(sql26,rows9[i].Order_id);
            console.log(rows12);
            let day1 = rows12[0].Dates.getDate();
            let month1= rows12[0].Dates.getMonth() + 1;
            let year1 = rows12[0].Dates.getFullYear();
            let y1 = year1.toString();  

            // This arrangement can be altered based on how we want the date's format to appear.
            let Datess = `${y1[2]}${y1[3]}/${month1}/${day1}`;

            objectArray1.push({
                Order_id: rows9[i].Order_id,
                Full_name: rows9[i].Full_name,
                Mobile_no: rows9[i].Mobile_no,
                City: rows9[i].City,
                Dates: Datess,
                Address: rows9[i].Address
            });
        }


        res.render("CheckRecord",{objectArray1,
            MSGGG: "Enter your Order Id To Search Records"
            });
        res.render("CheckRecord",{MSGGG: "Enter your Order Id To Search Records"});
    }
    else    
    {
        res.render("loginadmin");
    }
});

app.post('/checkrecord',async(req,res)=>{
    try{
        let orderid = req.body.OrderId;
        console.log(orderid);
        const objectArray = [];
        const objectArray1 = []

        var sql23 = "SELECT * FROM Customer_Purchasing WHERE Order_id = ?";
        const [rows9,fields] = await db.query(sql23,[orderid]);
        
        if(rows9[0].Order_id==orderid)
        {
            var sql24 = "SELECT * FROM Order_Details WHERE Order_id = ?";
            const [rows10,fields1] = await db.query(sql24,[orderid]);

            for (let i = 0; i < rows10.length; i++) 
            {
                var sql25 = "SELECT * FROM Product WHERE Pid = ?";
                const [rows11,fields2] = await db.query(sql25,[rows10[i].Pid]);

                objectArray.push({
                    Firstimg: rows11[0].Firstimg,
                    quantity: rows10[i].quantity,
                    Pname: rows11[0].Pname,
                    price: rows11[0].price,
                    size: rows10[i].size
                });
            }

            var sql26 = "SELECT * FROM Payment WHERE Order_id = ?";
            const [rows12,fields2] = await db.query(sql26,[orderid]);
            let day1 = rows12[0].Dates.getDate();
            let month1= rows12[0].Dates.getMonth() + 1;
            let year1 = rows12[0].Dates.getFullYear();
            let y1 = year1.toString();  

            // This arrangement can be altered based on how we want the date's format to appear.
            let Datess = `${y1[2]}${y1[3]}/${month1}/${day1}`;


            objectArray1.push({
                Order_id: rows9[0].Order_id,
                Full_name: rows9[0].Full_name,
                Mobile_no: rows9[0].Mobile_no,
                City: rows9[0].City,
                Dates: Datess,
                Address: rows9[0].Address
            });

            res.render("CheckRecord",{objectArray1,objectArray,
                MSGGG: "Enter your Order Id To Search Records"
            });
        }
        else
        {
            res.render("CheckRecord",{MSGGG: "Invalid Order Id"});
        }
    }
    catch(err)
    {
        res.render("CheckRecord",{MSGGG: "Invalid Order Id"});
    }
});


app.get('/checkstock',async(req,res)=>{
    if(admin1==true)
    {
        const objectArray = [];
        var sql33 = "SELecT * FROM Product";
        const [rows15,fields6] = await db.query(sql33);

        for (let i = 0; i < rows15.length; i++) 
        {
            const [rows16,fields] = await db.query(sql34,rows15[i].Pid);

            var sql35 = "SELECT * FROM Product_Category WHERE Pid = ?";
            const [rows17,fields1] = await db.query(sql35,rows15[i].Pid);
            // console.log(rows15[0].Firstimg);
            objectArray.push({
                Firstimg: rows15[i].Firstimg,
                Pname: rows15[i].Pid,
                Category: rows17[0].Category,
                price: rows15[i].price,
                size40: rows16[0].quantity,
                size41: rows16[1].quantity,
                size42: rows16[2].quantity,
                size43: rows16[3].quantity
            });
        }

        res.render("Checkstock",{objectArray,MSGGG: "Enter your Product Id To Check Stock"});
    }
    else
    {
        res.render("loginadmin");
    }
});


app.post('/checkstock',async(req,res)=>{
    try
    {
        let ProductId = req.body.ProductId;
        console.log(ProductId);
        const objectArray = [];

        var sql33 = "SELECT * FROM Product WHERE Pid = ?";
        const [rows15,fields6] = await db.query(sql33,[ProductId]);
        console.log(rows15);

        var sql34 = "SELECT * FROM Product_sizes WHERE Pid = ?";
        const [rows16,fields] = await db.query(sql34,[ProductId]);

        var sql35 = "SELECT * FROM Product_Category WHERE Pid = ?";
        const [rows17,fields1] = await db.query(sql35,[ProductId]);
        console.log(rows15[0].Firstimg);
        objectArray.push({
            Firstimg: rows15[0].Firstimg,
            Pname: ProductId,
            Category: rows17[0].Category,
            price: rows15[0].price,
            size40: rows16[0].quantity,
            size41: rows16[1].quantity,
            size42: rows16[2].quantity,
            size43: rows16[3].quantity
        });


        res.render("checkstock",{objectArray,MSGGG: "Enter your Product Id To Check Stock"});
    }
    catch(err)
    {  
        console.log(err);
    }

})


app.get('/loginadmin',(req,res)=>{
    res.render("loginadmin");
});

app.post('/loginadmin',(req,res)=>{

    if(req.body.UserName=="admin")
    {
        if(req.body.password=="7258")
        {
            admin1 = true;
            res.render("adminpage");
        }
        else
        {
            res.render("loginadmin",{ERROR: "Password is incorrect"});
        }
    }
    else
    {
        res.render("loginadmin",{ERROR: "User Name and Password is incorrect"});
    }

    console.log(process.env.USER_NAME);
    console.log(process.env.SECRET_KEY);
    
    
});


app.get('/test',(req,res)=>{
    res.render("test");
});

app.get('/*',(req,res)=>{
    res.render("404");
});

app.listen(port,'localhost',()=>{
    console.log(`Listening on port number : ${port}`);
});



connection.end();