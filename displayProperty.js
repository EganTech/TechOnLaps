sessionStorage.setItem('page', 'displayProperty')
let pImg = document.getElementById('profileImg')
let div1 = document.getElementById('div1')
let contentDiv = document.getElementById('contentDiv');

function configureDim(){
    if(window.innerWidth > 1000){
        //big screen
        div1.style.display = 'flex'
        pImg.style.width = (window.innerWidth / 2) + 'px'
        pImg.style.height = ((window.innerWidth / 2) * (2/3)) + 'px'
    }else {
        //small screen
        div1.style.display = 'block'
        pImg.style.width = (window.innerWidth - 40) + 'px'
        pImg.style.height = ((window.innerWidth - 80) * (2/3)) + 'px'
    }
}

configureDim()

window.addEventListener('resize', configureDim)

function retrievePropertyDetails(){
    console.log("item id" + sessionStorage.getItem('itemid'));
    let xhttp = getXMLHTTPObject()
    xhttp.open("POST", "/propertyDetails");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            displayProperty(JSON.parse(this.responseText)[0])
        }
    }
    xhttp.send(JSON.stringify({itemid: sessionStorage.getItem('itemid')}))
}

retrievePropertyDetails()

function displayProperty(property){
    let h;
    let p;
    let div;
    for(let i in property){
        if(property[i] !== ""){
            if(i === 'photo_url'){
                pImg.src = property[i]
            }else {
                if(i === 'propertytype'){
                    if(property[i] == 1){
                        property[i] = "Residential"
                    }else if (property[i] == 2){
                        property[i] = 'Commercial'
                    }else {
                        property[i] = 'Land'
                    }
                }else if(i === 'listtype'){
                    if(property[i] == 1){
                        property[i] = 'For sale'
                    }else {
                        property[i] = 'For lease'
                    }
                }
                p = document.createElement('p')
                p.innerHTML = property[i]
                div = document.createElement('div')
                div.setAttribute('style', 'width:200px')
                h = document.createElement('h4')
                if(i === 'propertytype'){
                    i = 'Property Type'
                }else if (i === 'listtype'){
                    i = 'List Type'
                }
                h.innerHTML = toTitleCase(i)
                h.style.marginBottom = '10px'
                h.style.color = 'grey'
                p.style.marginBottom = '10px'
                div.appendChild(h)
                div.appendChild(p)
                contentDiv.appendChild(div)
            }
        }
    }

    let btn = document.createElement('button')
    btn.innerHTML = 'Schedule a meeting'
    btn.style.width = '250px'
    btn.style.height = '40px'
    btn.style.border = '0px'
    btn.style.borderRadius = '7px'
    btn.style.cursor = 'pointer'
    btn.style.backgroundColor = '#008037'
    btn.style.color = 'white'
    btn.style.marginTop = '100px'
    contentDiv.appendChild(btn)

    function toTitleCase(s){
        let a = s.substring(0, 1)
        a = a.toUpperCase()
        s = a.concat(s.substring(1))
        return s;
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