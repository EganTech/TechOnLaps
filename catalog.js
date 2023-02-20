sessionStorage.setItem('page', 'catalog')
let catalogDiv = document.getElementById('catalogDiv')
let categorySelected = 1;
let allCategory = document.getElementById('allCategory')
let resCategory = document.getElementById('resCategory')
let comCategory = document.getElementById('comCategory')
let landCategory = document.getElementById('landCategory')
let categories = [resCategory, comCategory, landCategory, allCategory]
for(let i = 0; i < categories.length; i++){
    categories[i].addEventListener('click', ()=>{
        if(categorySelected != (i + 1)){
            categories[categorySelected - 1].style.color = 'black'
            categories[categorySelected - 1].style.border = '0.5px solid grey'
            categories[categorySelected - 1].style.backgroundColor = 'white'
            categories[i].style.color = 'white'
            categories[i].style.border = '0.5 px solid darkgreen'
            categories[i].style.backgroundColor = 'darkgreen'
            categorySelected = i + 1;
            console.log("category selected " + categorySelected)
            clearCatalogDiv()
            filter()
        }
    })
}

function clearCatalogDiv(){ 
    let el;
    while((el = catalogDiv.firstElementChild) != undefined){
        catalogDiv.removeChild(el)
    }
}

function filter(){
    let xhttp = getXMLHTTPObject()
    xhttp.open("POST", "/filter");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayProperty(JSON.parse(this.responseText))
        }
    }
    xhttp.send(JSON.stringify({pType:categorySelected}))
}

filter()

//checks if an element is in view port
function isInViewport(element, imageview, profileUrl) {
    const rect = element.getBoundingClientRect();
    if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
        //set image if it returns true
        imageview.src = profileUrl;
    }
}

function displayProperty(list){
    let v;
    for(let i in list){
        if(list[i].propertType == 3){
            v = getView1(list[i])
        }else {
            v = getView(list[i])
        }
        catalogDiv.appendChild(v)
    }


    function getView1(item){
        let cover = document.createElement('div')
        cover.style.padding = '10px'
        let img = document.createElement('img')
        img.style.width = (window.innerWidth > 600) ? ((window.innerWidth - 200) / 3) + 'px' : (window.innerWidth - 80) + 'px'
        img.className = 'img'
        img.src = ""
        isInViewport(img, img, item.photo_url)
        img.addEventListener('scroll', ()=>{
            if(img.src == ""){
                isInViewport(img, img, item.photo_url)
            }
        })
        let txt = document.createElement('h4')
        txt.innerHTML = 'Location'
        let locationTxt = document.createElement('p')
        locationTxt.innerHTML = item.county
        locationTxt.style.marginLeft = '10px'
        let div1 = document.createElement('div')
        div1.style.display = 'flex'
        div1.appendChild(txt)
        div1.appendChild(locationTxt)

        let txt4 = document.createElement('h4')
        txt4.innerHTML = (item.price === "") ? 'Rent' : 'Price'
        let priceTxt = document.createElement('p')
        priceTxt.innerHTML = (item.price === "") ? item.rent : item.price
        priceTxt.style.marginLeft = '10px'
        let div6 = document.createElement('div')
        div6.style.display = 'flex'
        div6.appendChild(txt4)
        div6.appendChild(priceTxt)

        cover.appendChild(img)
        cover.appendChild(div1)
        cover.appendChild(div6)

        cover.addEventListener('click', ()=>{
            window.location.href = '/displayProperty'
            sessionStorage.setItem('itemid', item.id)
        })
        
        return cover
    }

    function getView(item){
        let cover = document.createElement('div')
        cover.style.padding = '10px'
        let img = document.createElement('img')
        img.style.width = (window.innerWidth > 600) ? ((window.innerWidth - 200) / 3) + 'px' : (window.innerWidth - 80) + 'px'
        img.className = 'imgs'
        img.src = ""
        isInViewport(img, img, item.photo_url)
        img.addEventListener('scroll', ()=>{
            if(img.src == ""){
                isInViewport(img, img, item.photo_url)
            }
        })
        let txt = document.createElement('h4')
        txt.innerHTML = 'Location'
        txt.style.marginBottom = 'auto'
        txt.style.marginTop = 'auto'
        let locationTxt = document.createElement('p')
        locationTxt.innerHTML = item.county
        locationTxt.style.marginLeft = '10px'
        let div1 = document.createElement('div')
        div1.style.display = 'flex'
        div1.appendChild(txt)
        div1.appendChild(locationTxt)

        let div2 = document.createElement('div')
        div2.style.justifyContent = 'center'
        let txt1 = document.createElement('h4')
        txt1.innerHTML = 'Bedrooms'
        let bedrmsTxt = document.createElement('p')
        bedrmsTxt.innerHTML = item.bedrooms
        bedrmsTxt.style.textAlign = 'center'
        div2.appendChild(txt1)
        div2.appendChild(bedrmsTxt)
        div2.setAttribute('style', 'display:block; justify-content:center; border-right:0.2px solid lightgrey; margin-right:10px; padding:5px')

        let div3 = document.createElement('div')
        div3.style.justifyContent = 'center'
        let txt2 = document.createElement('h4')
        txt2.innerHTML = 'Bathrooms'
        let bathrmsTxt = document.createElement('p')
        bathrmsTxt.innerHTML = item.bathrooms
        bathrmsTxt.style.textAlign = 'center'
        div3.appendChild(txt2)
        div3.appendChild(bathrmsTxt)
        div3.setAttribute('style', 'border-right:0.2px solid lightgrey; margin-right:10px; padding:5px')

        let div4 = document.createElement('div')
        div4.style.justifyContent = 'center'
        let txt3 = document.createElement('h4')
        txt3.innerHTML = 'Size'
        let sizeTxt = document.createElement('p')
        sizeTxt.innerHTML = item.size
        sizeTxt.style.textAlign = 'center'
        div4.appendChild(txt3)
        div4.appendChild(sizeTxt)
        div4.style.justifyContent = 'center'
        div4.setAttribute('style', 'display:block; justify-content:center; border-right:0.2px solid lightgrey; margin-right:10px; padding:5px')

        let div5 = document.createElement('div')
        div5.style.display = 'flex'
        div5.appendChild(div2)
        div5.appendChild(div3)
        div5.appendChild(div4)

        let txt4 = document.createElement('h4')
        txt4.innerHTML = (item.price === "") ? 'Rent' : 'Price'
        txt4.style.marginTop = 'auto'
        txt4.style.marginBottom = 'auto'
        let priceTxt = document.createElement('p')
        priceTxt.innerHTML = (item.price === "") ? item.rent : item.price
        priceTxt.style.marginLeft = '10px'
        priceTxt.style.marginTop = 'auto'
        priceTxt.style.marginBottom = 'auto'
        let div6 = document.createElement('div')
        div6.setAttribute('style', 'margin-top:10px')
        div6.style.display = 'flex'
        div6.appendChild(txt4)
        div6.appendChild(priceTxt)

        cover.appendChild(img)
        cover.appendChild(div1)
        cover.appendChild(div5)
        cover.appendChild(div6)
        cover.setAttribute('style', 'border:0.2px solid lightgrey; padding:10px; margin-left:10px')

        cover.addEventListener('click', ()=>{
            window.location.href = '/displayProperty'
            sessionStorage.setItem('itemid', item.id)
        })
        return cover;
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

function configureDimensions(){
    let imgs = document.getElementsByClassName('img')
    if(window.innerWidth > 600){
        //big screen
        catalogDiv.style.display = 'flex';
        catalogDiv.style.overflowX = 'auto'
        for(let i = 0; i < imgs.length; i++){
            imgs[i].style.width = ((window.innerWidth - 200) / 3) + 'px'
        }
    }else {
        //small screen
        catalogDiv.style.display = 'block';
        let imgs = document.getElementsByClassName('img')
        for(let i = 0; i < imgs.length; i++){
            imgs[i].style.width = (window.innerWidth - 80) + 'px'
        }
    }
}