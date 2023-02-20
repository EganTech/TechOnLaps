let firstnameEdt = document.getElementById('firstname')
let lastnameEdt = document.getElementById('lastname')
let emailEdt = document.getElementById('email')
let sendBtn = document.getElementById('send')
let commentTa = document.getElementById('commentTa')

let emailValid = false;

sendBtn.addEventListener('click', validateAllFields)

function validateEmail() {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailEdt.value.trim())) {
        emailValid = true;
        emailEdt.style.border = "1px solid lightgrey";
    } else {
        emailValid = false;
        emailEdt.style.border = "1px solid red";
    }
}

function validateAllFields(){
    if(firstnameEdt.value.trim().length > 0 && lastnameEdt.value.trim().length > 0 && emailEdt.value.trim() && commentTa.value.trim() && emailValid){
        send()
    }
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

function send(){
    let xhttp = getXMLHTTPObject()
    xhttp.open("POST", "/comment");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText))
            displayProperty(JSON.parse(this.responseText))
        }
    }
    let obj = {firstname : firstnameEdt.value.trim(),
                lastname : lastnameEdt.value.trim(),
                email : emailEdt.value.trim(),
                comment : commentTa.value.trim()}
    xhttp.send(JSON.stringify(obj))
}

emailEdt.addEventListener('change', () => {
    validateEmail()
})