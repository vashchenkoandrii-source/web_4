/* ===== JSON НОВИН ===== */
const newsJSON = `[
{
"title":"Велика знижка 50%",
"date":"20.03.2026 14:30",
"status":"important",
"text":"Знижки на всі продукти."
},
{
"title":"Оновлення AI системи",
"date":"22.03.2026 10:15",
"status":"normal",
"text":"Додано голосове керування."
},
{
"title":"Кібератака зупинена",
"date":"18.03.2026 18:20",
"status":"vip",
"text":"Система захисту спрацювала."
},
{
"title":"Новий дизайн інтерфейсу",
"date":"15.03.2026 09:00",
"status":"vip",
"text":"Повністю оновлений UI."
},
{
"title":"Оновлення безпеки",
"date":"14.03.2026 11:40",
"status":"normal",
"text":"Покращено захист системи."
},
{
"title":"Новий продукт",
"date":"13.03.2026 16:50",
"status":"important",
"text":"Запущено новий сервіс."
},
{
"title":"Зміни в політиці",
"date":"10.03.2026 13:25",
"status":"vip",
"text":"Оновлено правила користування."
}
]`;
/* ===== PARSE JSON ===== */
const newsList = JSON.parse(newsJSON);
/* ===== СОРТУВАННЯ ===== */
function parseDate(str) {
    let parts = str.split(" ");
    let date = parts[0].split(".");
    let time = parts[1].split(":");
    return new Date(
        date[2],
        date[1] - 1,
        date[0],
        time[0],
        time[1]
    );
}
newsList.sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
);
const sidebar = document.getElementById("news-sidebar");
const main = document.getElementById("news-main");
const loadBtn = document.getElementById("loadMore");
let index = 0;
/* ===== ВИВІД ===== */
function loadNews() {
    for (let i = 0; i < 3; i++) {
        if (index >= newsList.length) {
            loadBtn.style.display = "none";
            return;
        }
        let item = newsList[index++];
        let div = document.createElement("div");
        div.className = `news-item ${item.status}`;
        div.innerHTML = `
<b>${item.title}</b>
<p>${item.date}</p>
`;
        div.onclick = () => {
            main.innerHTML = `
<h2>${item.title}</h2>
<p><b>${item.date}</b></p>
<p>${item.text}</p>
`;
        };
        sidebar.appendChild(div);
    }
}
loadBtn.onclick = loadNews;
loadNews();
/* ===== ОНОВЛЕННЯ НОВИН ===== */
setInterval(() => {
    let newNews = {
        title: "Термінове оновлення",
        date: "25.03.2026 20:00",
        status: "important",
        text: "Система отримала нове оновлення."
    };
    newsList.unshift(newNews);
    sidebar.innerHTML = "";
    index = 0;
    loadNews();
}, 3000);
/* ===== МОДАЛКА ===== */
const modal = document.getElementById("login");
const btn = document.getElementById("login-btn");
btn.onclick = () => {
    modal.style.display = "flex";
};
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.style.display = "none";
    }
});
/* ===== КНОПКА ВГОРУ ===== */
const topBtn = document.getElementById("topBtn");
window.onscroll = () => {
    if (window.scrollY > window.innerHeight * 0.4) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};
topBtn.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};