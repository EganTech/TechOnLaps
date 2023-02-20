sessionStorage.setItem('page', 'listing')
let propertyType = document.getElementById('propertyType')
let submitBtn = document.getElementById('submitBtn')
let saleCb = document.getElementById('saleCb')
let leaseCb = document.getElementById('leaseCb')
let rent = document.getElementById('rent')
let price = document.getElementById('price')
let fees = document.getElementById('fees')
let county = document.getElementById('county')
let area = document.getElementById('area')
let street = document.getElementById('street')
let coordinates = document.getElementById('coordinates')
let zipcode = document.getElementById('zipcode')
let propertyNo = document.getElementById('propertyNo')
let size = document.getElementById('size')
let bedrooms = document.getElementById('bedrooms')
let bathrooms = document.getElementById('bathrooms')
let pool = document.getElementById('poolCb')
let gym = document.getElementById('gymCb')
let file1 = document.getElementById('file1')
let file2 = document.getElementById('file2')
let doneBtn = document.getElementById('doneBtn')
let inputEls = document.getElementsByTagName('input')
let cbs = document.getElementsByTagName('checkbox')
let listType = -1;

var counties = ["Mombasa", "Kilifi", "Kwale", "Tana River", "Lamu", "Taita/Taveta", "Garissa", "Wajir", "Mandera",
    "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarwa", "Turkana", "Kiambu", "West Pokot", "Samburu", "Trans-Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi",
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihinga", "Bungoma",
    "Busia", "Siaya", "Kisumu", "Homabay", "Migori", "Kisumu", "Naymira", "Nairobi"
];


let opt;
for (let i = 0; i < counties.length; i++) {
    opt = document.createElement("option");
    opt.value = counties[i];
    opt.innerHTML = counties[i];
    county.appendChild(opt);
}

//add listener to every element
for(let i = 0; i < inputEls.length; i++){
    inputEls[i].addEventListener('change', validateAllFields)
}

for(let i = 0; i < cbs.length; i++){
    cbs[i].addEventListener('change', validateAllFields)
}

saleCb.addEventListener('change', ()=>{
    console.log(saleCb.checked)
    if(saleCb.checked){
        rent.disabled = true;
        price.disabled = false
        leaseCb.checked = false;
        listType = 1;
    }else {
        listType = -1;
        rent.disabled = false;
    }
})

leaseCb.addEventListener('change', ()=>{
    if(leaseCb.checked){
        rent.disabled = false;
        price.disabled = true;
        saleCb.checked = false;
        listType = 2;
    }else {
        listType = -1;
        price.disabled = false;
    }
})

function validateAllFields(){
    if((listType == 1 && price.value.trim().length > 0) || (listType == 2 && rent.value.trim().length > 0) && county.value.trim().length > 0 && area.value.trim().length > 0 && street.value.trim().length > 0 && coordinates.value.trim().length > 0 && zipcode.value.trim().length > 0 && propertyNo.value.trim().length > 0 && size.value.trim().length > 0 && bedrooms.value.trim().length > 0 && bathrooms.value.trim().length > 0 && file1.files.length > 0 && file2.files.length > 0){
        doneBtn.disabled = false;
        doneBtn.style.backgroundColor = 'blue'
        doneBtn.style.color = 'white'
    }else {
        doneBtn.disabled = true;
        doneBtn.style.backgroundColor = 'lightgrey'
        doneBtn.style.color = 'black'
    }
}

let editMode = false;

doneBtn.addEventListener('click', ()=>{
    if(!editMode){
        editMode = true;
        doneBtn.innerHTML = 'Edit'
        disableAllFields(true)
        submitBtn.style.visibility = 'visible'
    }else {
        editMode = false
        doneBtn.innerHTML = 'Continue'
        disableAllFields(false)
        submitBtn.style.visibility = 'hidden'
    }
})

submitBtn.addEventListener('click', () =>{
    sendValues()
})

function disableAllFields(bool){
    for(let i in inputEls){
        inputEls[i].disabled = bool;
    }
    
    for(let i in cbs){
        cbs[i].disabled = bool;
    }
}

function sendValues(){
    let obj = {}
    obj.pType = propertyType.selectedIndex + 1;
    obj.lType = listType
    obj.rent = rent.value.trim()
    obj.price = price.value.trim()
    obj.fees = fees.value.trim()
    obj.county = county.value.trim()
    obj.area = area.value.trim()
    obj.street = street.value.trim()
    obj.coordinates = coordinates.value.trim()
    obj.zipcode = zipcode.value.trim()
    obj.pNo = propertyNo.value.trim()
    obj.size = size.value.trim()
    obj.bedrooms = bedrooms.value.trim()
    obj.bathrooms = bathrooms.value.trim()
    obj.pool = pool.checked
    obj.gym = gym.checked
    let xhttp = getXMLHTTPObject()
    xhttp.open("POST", "/listProperty");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let result;
            if((result = JSON.parse(this.responseText)).length > 0){
                xhttp = getXMLHTTPObject()
                xhttp.open("POST", "/photo");
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if(this.responseText === "1"){
                            xhttp = getXMLHTTPObject()
                            xhttp.open("POST", "/id");
                            xhttp.onreadystatechange = function() {
                                if (this.readyState == 4 && this.status == 200) {
                                    if(this.responseText === "1"){
                                        alert("Item added successfuly")
                                        window.location.replace('/')
                                    }else {
                                        alert("Something happened, try again")
                                    }
                                }
                            }
                            let fD = new FormData()
                            fD.append('itemid', result[0])
                            fD.append('id', file2.files[0])
                            xhttp.send(fD)
                        }else {
                            alert("Something happened, try again")
                        }
                    }
                }
                let fD = new FormData()
                fD.append('itemid', result[0])
                fD.append('photo', file1.files[0])
                xhttp.send(fD)
            }else {
                alert("Something happened, try again")
            }
        }
    }
    xhttp.send(JSON.stringify(obj))
}

function getXMLHTTPObject() {
    let xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}