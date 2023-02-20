let homeBtn = document.getElementById('home');
homeBtn.style.cursor = 'pointer'
let servicesBtn = document.getElementById('services');
servicesBtn.style.cursor = 'pointer'
let catalogBtn = document.getElementById('catalog');
catalogBtn.style.cursor = 'pointer'
let aboutBtn = document.getElementById('about');
aboutBtn.style.cursor = 'pointer'
let careersBtn = document.getElementById('careers')
careersBtn.style.cursor = 'pointer'
let titleBar = document.getElementById('logo')
titleBar.style.cursor = 'pointer'

titleBar.addEventListener('click', ()=>{
    window.location.href = '/'
})

if(sessionStorage.getItem('services') == true){
    navigateToServices()
    sessionStorage.setItem('services', false)
}

//add event listeners
homeBtn.addEventListener('click', ()=>{
    if(sessionStorage.getItem('page') != 'home'){
        window.location.href = '/'
        sessionStorage.setItem('page', 'home')
    }
})

servicesBtn.addEventListener('click', ()=>{
    if(sessionStorage.getItem('page') !== 'home'){
        window.location.href = '/'
        sessionStorage.setItem('page', 'home')
        sessionStorage.setItem('services', 'true')
    }else {
        navigateToServices()
    }
})

function navigateToServices(){
    window.scrollTo(0, document.getElementById('txtS').offsetTop);
}

catalogBtn.addEventListener('click', ()=>{
    if(sessionStorage.getItem('page') != 'catalog'){
        window.location.href = '/catalogPage'
        sessionStorage.setItem('page', 'catalog')
    }
})

aboutBtn.addEventListener('click', ()=>{
    if(sessionStorage.getItem('page') != 'about'){
        window.location.href = '/aboutPage'
        sessionStorage.setItem('page', 'about')
    }
})

function configureHeader(){
    if(window.innerWidth > 1000){
        //big screen
        homeBtn.style.visibility = 'visible'
        catalogBtn.style.visibility = 'visible'
        servicesBtn.style.visibility = 'visible'
        aboutBtn.style.visibility = 'visible'
        careersBtn.style.visibility = 'visible'
    }else {
        //small screen
        homeBtn.style.visibility = 'hidden'
        catalogBtn.style.visibility = 'hidden'
        servicesBtn.style.visibility = 'hidden'
        aboutBtn.style.visibility = 'hidden'
        careersBtn.style.visibility = 'hidden'
    }
}

configureHeader()

window.addEventListener('resize', configureHeader)