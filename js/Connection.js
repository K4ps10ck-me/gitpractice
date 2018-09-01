
var ur = "http://paincha.com/";
var imageUrl = "";

function  getFormData() {
    var unindexed_array = ($('#signUp_form').serializeArray());
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return (JSON.stringify(indexed_array));
}

function getFormData1() {
    var unindexed_array = ($('#addProduct_form').serializeArray());
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });
  
    

    return (JSON.stringify(indexed_array));
}


//Registering user account
$(document).ready(function () {
    $('#Register').click(function (e) {      

        var datas = getFormData();
        alert(datas);
        $.ajax({
            type: 'Post',
            url: ur+'/api/account',
            contentType: "application/json; charset=utf-8",  
            dataType: "json",
            data: datas,
            crossDomain: true,
            success: function (msg) {
                window.location.assign("index.html");

            },
            error: function (jqXhr, textStatus, errorThrown) {

                alert(errorThrown);
            }
        });
    })
});


//Adding Product
$(document).ready(function () {
    $('#addProduct').click(function (e) {

        var datas = getFormData1();
        var files = $("#productImageUpload").get(0).files;
        var data = new FormData();
        // Add the uploaded image content to the form data collection
        if (files.length > 0) {
            data.append("image", files[0]);
        }
        data.append("data",datas);
        alert(datas);
        $.ajax({
            type: 'Post',
            url: ur + '/api/Product',
            processData: false,
            contentType: false,
            data: data,
            
            success: function (msg) {
                alert(msg);
                //document.getElementById('display').src = 'data:image/jpeg;base64,' + msg;                

            },
            error: function (jqXhr, textStatus, errorThrown) {

                alert(errorThrown);
            }
        });
    })
});

//Get General Product List
function getProduct() {
    checkCredential();
    
    $.ajax({
        type: 'Get',
        url: ur + '/api/product/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { value:"kusal" },
        crossDomain: true,
        success: function (msg) {
            
            var obj = JSON.parse(JSON.stringify(msg));            
            for (var i = 0; i < obj.length; i++) {

                $("#featuredProduct").append($("<li>").attr('class', 'span3').append($("<div>").attr('class', 'product-box').append
                    (" <p><a href='product_detail.html'><img  src=" + obj[i].fileContent + " /></a></p>" +
                    "<a href='product_detail.html'  class='title'>" + obj[i].productName + "</a><br />" +
                    "<a href='products.html' class='category'>" + obj[i].Description + "</a>" +
                    "<p class='price'>" + obj[i].price + "</p>")));                
                    
            }
           
              },
        error: function (jqXhr, textStatus, errorThrown) {

            alert(errorThrown);
        }
    });
}

//getting product Category list
function getProductCategory() {
    var val = 0;
    $.ajax({
        type: 'Get',
        url: ur + '/api/Category',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { "mainId": val },
        crossDomain: true,
        success: function (msg) {
            
            var obj = JSON.parse(JSON.stringify(msg));
            for (var i = 0; i < obj.length; i++) {
                $("#productList").append("<li><a href='./ products.html' id='category" + obj[i].id + "'>" + obj[i].cat + "</a></li>");                   

            }
            
        },
        error: function (jqXhr, textStatus, errorThrown) {

            alert(errorThrown);
        }
    });
}

//getting Vendor List
function getVendorList() {
    var val = 0;
    $.ajax({
        type: 'Get',
        url: ur + '/api/Vendor',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        
        crossDomain: true,
        success: function (msg) {

            var obj = JSON.parse(JSON.stringify(msg));
            for (var i = 0; i < obj.length; i++) {
                $("#vendorList").append("<li><a href='./ products.html' id='vendor" + obj[i].userName + "'>" + obj[i].Name + "</a></li>");

            }

        },
        error: function (jqXhr, textStatus, errorThrown) {

            alert(errorThrown);
        }
    });
}

//Login to user account
$(document).ready(function () {
    $('#login').click(function (e) {
        modal();
        document.cookie = "";
        var un = document.getElementById('userName').value;
        var pa = document.getElementById('Password').value;
        
        $.ajax({
            type: 'Get',
            url: ur + '/api/account',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { "userName": un, "Password": pa },
            crossDomain: true,
            success: function (msg) {                
                var token = btoa(un + ':' + pa);
                window.localStorage.setItem('token', token);   
                closeModal();
                window.location.assign("index.html");
                
            },
            error: function (jqXhr, textStatus, errorThrown) {
                
                alert(errorThrown);
            }
        });
    })
});

//getting Cart detail
function getCartDetail() {
    checkCredential();    
    $.ajax({
        type: 'Get',
        url: ur + '/api/Cart/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        
        headers: {
            'Authorization': 'Basic ' + window.localStorage.getItem('token')
        },
        crossDomain: true,
        success: function (msg) { 

            var obj = JSON.parse(JSON.stringify(msg));
            
            for (var i = 0; i < obj.length; i++) {
                
                $("#cartDetail").append($("<tr>").append("<td> <input type='checkbox' onChange='add(" + obj[i].productId + ")' value='option1' id=" + obj[i].productId + "></td><td> <a href = 'product_detail.html'><img height='40' width='40' src=" +  obj[i].fileContent + " /></a ></td > <td>" + obj[i].productName + "</td> <td><input type='text' value='1' class='input-mini' id='quantity" + obj[i].productId + "'></td><td id='price" + obj[i].productId + "'>" + obj[i].price + "</td>"));           
 
        }
        
    },
        error: function (jqXhr, textStatus, errorThrown) {

            alert(errorThrown);
        }
    });
    
}

//adding product to order 
function add(val) {
    var myCheck = document.getElementById(val);
    var total = document.getElementById('total');
    var subTotal = document.getElementById('subTotal');
    if (myCheck.checked) {
        var currentSum = document.getElementById('quantity' + val).value * document.getElementById('price' + val).innerHTML;
        var prevSum = parseFloat(subTotal.innerHTML);
        subTotal.innerHTML = "";
        total.innerHTML = "";
        subTotal.innerHTML = currentSum + prevSum;
        total.innerHTML = subTotal.innerHTML;
    }
    else {
        var currentSum = document.getElementById('quantity' + val).value * document.getElementById('price' + val).innerHTML;
        var prevSum = parseFloat(subTotal.innerHTML);
        subTotal.innerHTML = "";
        total.innerHTML = "";
        subTotal.innerHTML = prevSum - currentSum;
        total.innerHTML = subTotal.innerHTML;
    }
}

//getting Order list by vendor
function getOrderList() {
    
    if (window.localStorage.getItem('token') == "") {
        window.location.assign("index.html");
    }
    else {
        $.ajax({
            type: 'Get',
            url: ur + '/api/Order/',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Basic ' + window.localStorage.getItem('token')
            },
            crossDomain: true,
            success: function (msg) {

                var obj = JSON.parse(JSON.stringify(msg));
                for (var i = 0; i < obj.length; i++) {
                    $("#orderList").append($("<tr>").append("<td> <input type='checkbox' value='option1'></td><td>" + obj[i].productId + "</td><td>" + obj[i].productName + "</td><td>" + obj[i].Name + "</td><td>" + obj[i].Phone + "</td><td>" + obj[i].Address + "</td><td>" + obj[i].Description + "</td><td>" + obj[i].discount + "</td><td>" + obj[i].deliveryStatus + "</td><td>" + obj[i].bookingDate + "</td><td>" + obj[i].price + "</td>"));

                }
                // getProductCategory();
                // getVendorList();
            },
            error: function (jqXhr, textStatus, errorThrown) {

                alert(errorThrown);
            }
        });
    }
}

//Getting List of Vendor Product
function getVendorProduct() {
    document.getElementById('header1').innerHTML = "Products List";
    document.getElementById('header').innerHTML = "";
    $("#header").append("<strong>My</strong> Products") ;
    document.getElementById('orderList').innerHTML = "";
    document.getElementById('tableHeader').innerHTML = "";
    $("#tableHeader").append(" <th>Edit</th><th>Id</th><th>Product Name</th><th>Description</th><th>Discount</th><th>Price</th>");
    
    if (window.localStorage.getItem('token') == "") {
        window.location.assign("index.html");
    }
    else {
        $.ajax({
            type: 'Get',
            url: ur + '/api/Product/',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Basic ' + window.localStorage.getItem('token')

            },
            crossDomain: true,
            success: function (msg) {

                var obj = JSON.parse(JSON.stringify(msg));
                for (var i = 0; i < obj.length; i++) {
                    $("#orderList").append($("<tr>").append("<td> <input type='button' value='Edit' onClick=call(" + obj[i].productId+")></td><td>" +
                        obj[i].productId + "</td><td>" + obj[i].productName +
                        "</td><td>" + obj[i].Description + "</td><td>" + obj[i].discount +
                        "</td>" + obj[i].category + "<td>" +
                        obj[i].price + "</td>"));

                }
                // getProductCategory();
                // getVendorList();
            },
            error: function (jqXhr, textStatus, errorThrown) {

                alert(errorThrown);
            }
        });
    }
}
//Edit Product Call
function call(val) {
    window.localStorage.setItem('productId', val);
    window.location.assign("editproduct.html");
    
}

//Logout user
function Logout() {
    window.localStorage.setItem('token', "clear");
    window.localStorage.setItem('role', "clear");
    window.location.assign("index.html");

}


//Getting Product By Id
function getProductById() {
    var val = window.localStorage.getItem('productId');    
    $.ajax({

        type: 'Get',
        url: ur + '/api/product/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { "id": val },
        crossDomain: true,
        success: function (msg) {
            var obj = JSON.parse(JSON.stringify(msg));
            
            document.getElementById('pn').value = obj[0].productName;
            document.getElementById('pr').value = obj[0].price;
            document.getElementById('dis').value = obj[0].discount;
            document.getElementById('cat').value = obj[0].category;
            document.getElementById('home').innerHTML = obj[0].Description;
            document.getElementById('image').src = obj[0].fileContent;
            getProductCategory();
            getVendorList();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });

}

//getting product detail by id
function getProductDetailById() {
    var val = window.localStorage.getItem('productId');
    $.ajax({

        type: 'Get',
        url: ur + '/api/product/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Basic ' + window.localStorage.getItem('token')
        },
        data: { "id": val },
        crossDomain: true,
        success: function (msg) {
            var obj = JSON.parse(JSON.stringify(msg));
            document.getElementById('image').src =  obj[0].fileContent;
            document.getElementById('id').innerHTML = obj[0].productId;
            document.getElementById('pn').innerHTML = obj[0].productName;
            document.getElementById('pr').innerHTML = obj[0].price;
            document.getElementById('dis').innerHTML = obj[0].discount;
            document.getElementById('cat').innerHTML = obj[0].category;
            document.getElementById('home').innerHTML = obj[0].Description;
            getProduct();
           
        },
        error: function (jqXhr, textStatus, errorThrown) {

            alert(errorThrown);
        }
    });

}

//Updating products
$(document).ready(function () {
    $('#editProduct').click(function (e) {        
        var datas = getFormData1();
        
        var data = new FormData();
        // Add the uploaded image content to the form data collection       
        alert(imageUrl);
        data.append("image", imageUrl);
        data.append("mimeType", "image/jpeg");
        data.append("fileName", window.localStorage.getItem('productId')+".jpeg");       
        data.append("data", datas);
        data.append("id", window.localStorage.getItem('productId'));
        data.append("Description", document.getElementById('home').innerHTML);
        $.ajax({
            type: 'Put',
            url: ur + '/api/Product',
            processData: false,
            contentType: false,
            data: data,

            success: function (msg) {
                alert(msg);

                //document.getElementById('display').src = 'data:image/jpeg;base64,' + msg;                

            },
            error: function (jqXhr, textStatus, errorThrown) {

                alert(errorThrown);
            }
        });
       
    })
});

//checking Credential
function checkCredential() {
    getVendorList();
    getProductCategory();
    
    if (window.localStorage.getItem('token') == "clear") {
        
        document.getElementById('profile_menu').style.display = "none";
        document.getElementById('cart_menu').style.display = "none";       
        document.getElementById('order_menu').style.display = "none"; 
        document.getElementById('logout_menu').style.display = "none"; 

    }
    else {
        getUserInformation();
        
        document.getElementById('login_menu').style.display = "none"; 
        if (window.localStorage.getItem('role') != 'vendor') {
            document.getElementById('order_menu').style.display = "none";
        }
        
       
    }
    
}

//getting User Information
function getUserInformation() {
    
    $.ajax({

        type: 'Get',
        url: ur + '/api/Account/',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Basic ' + window.localStorage.getItem('token')
        },
        crossDomain: true,
        success: function (msg) {
            
            
            var obj = JSON.parse(JSON.stringify(msg));   
            window.localStorage.setItem('role', obj[0].Role);
            document.getElementById('image').src = 'data:image/jpeg;base64,' + obj[0].fileContent;
            document.getElementById('User').innerHTML = obj[0].userName;
            document.getElementById('Name').innerHTML = obj[0].Name;
            document.getElementById('Password').innerHTML = obj[0].Password;
            document.getElementById('Address').innerHTML = obj[0].Address;
            document.getElementById('Phone').innerHTML = obj[0].Phone;            
            document.getElementById('Email').innerHTML = obj[0].Email;        
            
          

        },
        error: function (jqXhr, textStatus, errorThrown) {

            alert(errorThrown);
        }
    });
    
}

//Updating Use Information
function updateUserInfo(id) {
    // alert(window.localStorage.getItem('token'));
    
    if (id == "image") {
        document.getElementById('productImageUpload').click();
        document.getElementById('productImageUpload').onchange = function () {
            var files = $("#productImageUpload").get(0).files;
            var data = new FormData();
            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                data.append("image", files[0]);
            }
            $.ajax({
                type: 'Put',
                url: ur + '/api/Account',
                processData: false,
                contentType: false,
                data: data,
                headers: {
                    'Authorization': 'Basic ' + window.localStorage.getItem('token')
                },

                success: function (msg) {
                    alert(msg);
                    getUserInformation();
                },
                error: function (jqXhr, textStatus, errorThrown) {

                    alert(errorThrown);
                }
            });
        };
    }
    else { 
        var person = prompt(id, document.getElementById(id).innerHTML);
        document.getElementById(id).innerHTML = person;
        var data = new FormData();
        data.append("Name", document.getElementById('Name').innerHTML);
        data.append("Password", document.getElementById('Password').innerHTML);
        data.append("Phone", document.getElementById('Phone').innerHTML);
        data.append("Email", document.getElementById('Email').innerHTML);
        data.append("Address", document.getElementById('Address').innerHTML);
        $.ajax({
            type: 'Put',
            url: ur + '/api/Account',
            processData: false,
            contentType: false,
            data: data,
            headers: {
                'Authorization': 'Basic ' + window.localStorage.getItem('token')
            },

            success: function (msg) {
                alert(msg);
                getUserInformation();
            },
            error: function (jqXhr, textStatus, errorThrown) {

                alert(errorThrown);
            }
        });
    }
   
}

//compressing image
$(function (ready) {
    $('#productImageUpload').change(function () {        
        handleFiles();
        
    });
});

function handleFiles() {
    var dataurl = null;
    var filesToUpload = document.getElementById('productImageUpload').files;
    var file = filesToUpload[0];

    // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader
    reader.onload = function (e) {
        img.src = e.target.result;

        img.onload = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 169;
            var MAX_HEIGHT = 220;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            dataurl = canvas.toDataURL("image/jpeg");
            document.getElementById('image').src = dataurl;
            imageUrl = dataurl;
          /*  var link = document.createElement("a");

            link.setAttribute("href", dataurl);
            link.setAttribute("download", 'image');
            link.click();*/
        } // img.onload
    }
    // Load files into file reader
    reader.readAsDataURL(file);
   
}


function modal() {
    $('.modal').modal('show');            
    
}
function closeModal() {
    $('.modal').modal('hide');
}





