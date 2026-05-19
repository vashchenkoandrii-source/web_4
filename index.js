/* ===== JSON ТОВАРІВ ===== */

const productsJSON = `[
{
"name":"Lenovo -30%",
"img":"image/lenovo.jpg",
"desc":"Знижки місяця"
},

{
"name":"Бездротові навушники",
"img":"image/headphones.jpg",
"desc":"Кращій звук"
},

{
"name":"Жорсткий диск",
"img":"image/HDD.jpg",
"desc":"Зберігання даних"
},

{
"name":"Смарт годинники",
"img":"image/smartwatch.jpg",
"desc":"AI помічник"
},

{
"name":"Фітнес браслет",
"img":"image/fitness tracker.webp",
"desc":"Ідеально для спорту"
},

{
"name":"Клавіатура",
"img":"image/keyboard.jpg",
"desc":"Механічна"
},

{
"name":"VR шолом",
"img":"image/VR.jpg",
"desc":"Доповнена реальність"
},

{
"name":"Ігровий ноутбук",
"img":"image/Laptop.jpg",
"desc":"Для ігор"
}
]`;

/* ===== PARSE JSON ===== */

const popularProducts = JSON.parse(productsJSON);

/* ===== LOAD MORE ===== */

let index = 0;

function loadMore(){

for(let i=0;i<3;i++){

if(index >= popularProducts.length){

document.getElementById("more").style.display = "none";

return;
}

let p = popularProducts[index++];

let card = document.createElement("div");

card.className = "card";

card.innerHTML = `
<img src="${p.img}">
<h3>${p.name}</h3>
<p class="hidden">${p.desc}</p>
`;

card.onclick = ()=>{

card.querySelector("p")
.classList.toggle("hidden");

};

document.getElementById("cards")
.appendChild(card);

}
}

document.getElementById("more")
.onclick = loadMore;

/* ===== ПЕРШЕ ЗАВАНТАЖЕННЯ ===== */

loadMore();

/* ===== ВСПЛИВАЮЧА РЕКЛАМА ===== */

setTimeout(()=>{

document.getElementById("adModal")
.style.display = "flex";

},4000);

/* ===== ТАЙМЕР ===== */

let time = 5;

let timer = setInterval(()=>{

time--;

document.getElementById("time")
.innerText = time;

if(time === 0){

document.getElementById("closeAd")
.disabled = false;

clearInterval(timer);

}

},1000);

/* ===== ЗАКРИТТЯ ===== */

document.getElementById("closeAd")
.onclick = ()=>{

document.getElementById("adModal")
.style.display = "none";

};

/* ===== ПІДПИСКА ===== */

setTimeout(()=>{

if(!localStorage.getItem("subscribed")){

document.getElementById("subscribe")
.style.display = "flex";

}

},3000);

/* ===== ACCEPT ===== */

document.getElementById("acceptSub")
.onclick = ()=>{

localStorage.setItem(
"subscribed",
"yes"
);

document.getElementById("subscribe")
.style.display = "none";

alert("Дякуємо за підписку!");

};

/* ===== DECLINE ===== */

document.getElementById("declineSub")
.onclick = ()=>{

document.getElementById("subscribe")
.style.display = "none";

};