// ========== ДАНІ ==========
let products = [
    { name: "Samsung", price: 120, popularity: 0, _id: null },
    { name: "iPhone", price: 140, popularity: 0, _id: null },
    { name: "Asus", price: 100, popularity: 0, _id: null },
    { name: "Dell", price: 95, popularity: 0, _id: null },
    { name: "HP", price: 85, popularity: 0, _id: null }
];

let cart = [];
let currentUser = null;

const colors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#14b8a6", "#f97316"];
const API = "https://backend-for-students-production.up.railway.app/api/items";

// ========== DOM ЕЛЕМЕНТИ ==========
const container = document.getElementById("cards");
const cartBox = document.getElementById("cart");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("search");
const minInput = document.getElementById("min");
const maxInput = document.getElementById("max");

const adminPanel = document.getElementById("adminPanel");
const newName = document.getElementById("newName");
const newPrice = document.getElementById("newPrice");
const addProductBtn = document.getElementById("addProduct");

const cartTopBtn = document.getElementById("cartTopBtn");
const cartClose = document.getElementById("cartClose");
const orderBtn = document.getElementById("orderBtn");
const chartType = document.getElementById("chartType");
const resetChartBtn = document.getElementById("resetChartBtn");
const cartCountSpan = document.getElementById("cartCount");

const guestBox = document.getElementById("guestBox");
const userBox = document.getElementById("userBox");
const userNameSpan = document.getElementById("userName");
const navLogin = document.getElementById("navLogin");
const navPassword = document.getElementById("navPassword");
const navLoginBtn = document.getElementById("navLoginBtn");
const navRegisterBtn = document.getElementById("navRegisterBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Модальне вікно
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const submitAuthBtn = document.getElementById("submitAuthBtn");
const switchToRegister = document.getElementById("switchToRegister");
const registerFields = document.getElementById("registerFields");
const validationErrors = document.getElementById("validationErrors");
const authLogin = document.getElementById("authLogin");
const authPassword = document.getElementById("authPassword");
const authPasswordRepeat = document.getElementById("authPasswordRepeat");
const authEmail = document.getElementById("authEmail");

let isRegisterMode = false;

// Ініціалізація користувачів (створюємо адміна за замовчуванням)
function initUsers() {
    let users = localStorage.getItem("users");
    if (!users) {
        const defaultUsers = [
            { username: "admin", password: "admin123", role: "admin" }
        ];
        localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
}
initUsers();

// ========== ЗАВАНТАЖЕННЯ ТОВАРІВ ==========
async function fetchProducts() {
    try {
        let response = await fetch(API);
        let data = await response.json();
        let apiProducts = data.filter(i => i.category === "nova-tech");
        
        if (apiProducts.length > 0) {
            products = apiProducts.map(p => ({ ...p, popularity: p.popularity || 0 }));
        }
        render(products);
        drawChart();
    } catch (err) {
        console.log("API помилка, локальні дані");
        render(products);
        drawChart();
    }
}

// ========== ВІДОБРАЖЕННЯ ==========
function render(list) {
    if (!container) return;
    container.innerHTML = "";
    
    list.forEach((p, index) => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p> ${p.price}$</p>
            <p> Популярність: ${p.popularity || 0}</p>
            <button class="addBtn">Додати</button>
            ${currentUser?.role === "admin" ? `
                <button class="editBtn">Редагувати</button>
                <button class="deleteBtn">Видалити</button>
            ` : ""}
        `;
        
        div.querySelector(".addBtn").onclick = () => addToCart(p);
        
        if (currentUser?.role === "admin") {
            const editBtn = div.querySelector(".editBtn");
            const deleteBtn = div.querySelector(".deleteBtn");
            if (editBtn) editBtn.onclick = () => editProduct(p);
            if (deleteBtn) deleteBtn.onclick = () => deleteProduct(p._id, index);
        }
        
        container.appendChild(div);
    });
}

// ========== ФІЛЬТРИ ==========
function filterAll() {
    let search = searchInput?.value.toLowerCase() || "";
    let min = parseFloat(minInput?.value) || 0;
    let max = maxInput?.value === "" ? Infinity : parseFloat(maxInput?.value);
    
    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(search) && p.price >= min && p.price <= max
    );
    render(filtered);
}

if (searchInput) searchInput.addEventListener("input", filterAll);
if (minInput) minInput.addEventListener("input", filterAll);
if (maxInput) maxInput.addEventListener("input", filterAll);

// ========== КОШИК ==========
function updateCartCount() {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountSpan) cartCountSpan.innerText = totalQty;
}

if (cartTopBtn) {
    cartTopBtn.onclick = () => {
        cartBox.style.display = cartBox.style.display === "block" ? "none" : "block";
    };
}

if (cartClose) {
    cartClose.onclick = () => {
        cartBox.style.display = "none";
    };
}

function addToCart(product) {
    product.popularity = (product.popularity || 0) + 1;
    let found = cart.find(i => i.name === product.name);
    
    if (found) {
        found.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
    render(products);
    drawChart();
}

function updateCart() {
    if (!cartItems) return;
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach((item, i) => {
        let sum = item.price * item.qty;
        total += sum;
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div><b>${item.name}</b> ${item.price}$ x 
            <input type="number" min="1" value="${item.qty}" data-i="${i}" style="width:45px;">
            <button data-del="${i}">X</button>
            = ${sum}$</div>
        `;
        cartItems.appendChild(div);
    });
    
    document.querySelectorAll("input[data-i]").forEach(inp => {
        inp.onchange = (e) => {
            cart[e.target.dataset.i].qty = +e.target.value;
            updateCart();
            drawChart();
        };
    });
    
    document.querySelectorAll("[data-del]").forEach(btn => {
        btn.onclick = (e) => {
            cart.splice(e.target.dataset.del, 1);
            updateCart();
            drawChart();
        };
    });
    
    if (totalEl) totalEl.innerText = "Сума: " + total + "$";
    updateCartCount();
}

if (orderBtn) {
    orderBtn.onclick = () => {
        if (!currentUser) {
            alert("Увійдіть в акаунт!");
            showAuthModal();
            return;
        }
        if (cart.length === 0) {
            alert("Кошик порожній");
            return;
        }
        alert("Замовлення оформлено!");
        cart = [];
        updateCart();
    };
}

// ========== МОДАЛЬНЕ ВІКНО АВТОРИЗАЦІЇ ==========
function showAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("hidden");
    isRegisterMode = false;
    if (modalTitle) modalTitle.innerText = "Авторизація";
    if (submitAuthBtn) submitAuthBtn.innerText = "Увійти";
    if (switchToRegister) switchToRegister.innerText = "Немає акаунту? Зареєструватись";
    if (registerFields) registerFields.classList.add("hidden");
    if (validationErrors) validationErrors.innerHTML = "";
    
    if (authLogin) authLogin.value = "";
    if (authPassword) authPassword.value = "";
    if (authPasswordRepeat) authPasswordRepeat.value = "";
    if (authEmail) authEmail.value = "";
}

function closeAuthModal() {
    if (authModal) authModal.classList.add("hidden");
}

function validateRegistration(login, password, repeat) {
    let errors = [];
    if (!login || login.trim().length < 3) errors.push("Логін має бути не менше 3 символів");
    if (!password || password.length < 6) errors.push("Пароль має бути не менше 6 символів");
    if (password !== repeat) errors.push("Паролі не співпадають");
    return errors;
}

function validateLogin(login, password) {
    return login && password && login.trim().length > 0 && password.length > 0;
}

if (submitAuthBtn) {
    submitAuthBtn.onclick = () => {
        let login = authLogin ? authLogin.value.trim() : "";
        let password = authPassword ? authPassword.value : "";
        let repeat = authPasswordRepeat ? authPasswordRepeat.value : "";
        
        if (validationErrors) validationErrors.innerHTML = "";
        
        if (isRegisterMode) {
            // РЕЄСТРАЦІЯ - локальна
            let errors = validateRegistration(login, password, repeat);
            if (errors.length > 0) {
                if (validationErrors) {
                    errors.forEach(err => {
                        let p = document.createElement("p");
                        p.innerText = err;
                        validationErrors.appendChild(p);
                    });
                }
                return;
            }
            
            let users = JSON.parse(localStorage.getItem("users") || "[]");
            
            if (users.find(u => u.username === login)) {
                alert("Користувач з таким логіном вже існує!");
                return;
            }
            
            let role = (login === "admin" && password === "admin123") ? "admin" : "user";
            
            users.push({ username: login, password: password, role: role });
            localStorage.setItem("users", JSON.stringify(users));
            
            alert("Реєстрація успішна!");
            
            // ЗАКРИВАЄМО ВІКНО ПІСЛЯ РЕЄСТРАЦІЇ
            closeAuthModal();
            
        } else {
            // АВТОРИЗАЦІЯ - локальна
            if (!validateLogin(login, password)) {
                alert("Невірний логін або пароль");
                return;
            }
            
            let users = JSON.parse(localStorage.getItem("users") || "[]");
            let user = users.find(u => u.username === login && u.password === password);
            
            if (user) {
                currentUser = { username: user.username, role: user.role };
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                alert("Вхід успішний! Вітаємо, " + login);
                
                // ЗАКРИВАЄМО ВІКНО ПІСЛЯ ВХОДУ
                closeAuthModal();
                updateUI();
            } else {
                alert("Невірний логін або пароль");
            }
        }
    };
}

if (switchToRegister) {
    switchToRegister.onclick = () => {
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            if (modalTitle) modalTitle.innerText = "Реєстрація";
            if (submitAuthBtn) submitAuthBtn.innerText = "Зареєструватись";
            if (switchToRegister) switchToRegister.innerText = "Вже є акаунт? Увійти";
            if (registerFields) registerFields.classList.remove("hidden");
        } else {
            if (modalTitle) modalTitle.innerText = "Авторизація";
            if (submitAuthBtn) submitAuthBtn.innerText = "Увійти";
            if (switchToRegister) switchToRegister.innerText = "Немає акаунту? Зареєструватись";
            if (registerFields) registerFields.classList.add("hidden");
        }
        if (validationErrors) validationErrors.innerHTML = "";
        if (authLogin) authLogin.value = "";
        if (authPassword) authPassword.value = "";
        if (authPasswordRepeat) authPasswordRepeat.value = "";
    };
}

// Закриття модального вікна (хрестик)
if (closeModal) {
    closeModal.onclick = closeAuthModal;
}

// Закриття при кліку поза вікном
if (authModal) {
    window.onclick = (e) => {
        if (e.target === authModal) closeAuthModal();
    };
}

// Закриття по клавіші ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && authModal && !authModal.classList.contains("hidden")) {
        closeAuthModal();
    }
});

// ========== ОНОВЛЕННЯ UI ==========
function updateUI() {
    if (currentUser) {
        if (guestBox) guestBox.classList.add("hidden");
        if (userBox) userBox.classList.remove("hidden");
        if (userNameSpan) userNameSpan.innerText = currentUser.username + " (" + (currentUser.role === "admin" ? "Адмін" : "Користувач") + ")";
        if (adminPanel) {
            adminPanel.style.display = currentUser.role === "admin" ? "block" : "none";
        }
    } else {
        if (guestBox) guestBox.classList.remove("hidden");
        if (userBox) userBox.classList.add("hidden");
        if (adminPanel) adminPanel.style.display = "none";
    }
    render(products);
}

if (navLoginBtn) {
    navLoginBtn.onclick = () => {
        if (navLogin) navLogin.value = "";
        if (navPassword) navPassword.value = "";
        showAuthModal();
    };
}

if (navRegisterBtn) {
    navRegisterBtn.onclick = () => {
        if (navLogin) navLogin.value = "";
        if (navPassword) navPassword.value = "";
        isRegisterMode = true;
        if (modalTitle) modalTitle.innerText = "Реєстрація";
        if (submitAuthBtn) submitAuthBtn.innerText = "Зареєструватись";
        if (switchToRegister) switchToRegister.innerText = "Вже є акаунт? Увійти";
        if (registerFields) registerFields.classList.remove("hidden");
        if (validationErrors) validationErrors.innerHTML = "";
        if (authModal) authModal.classList.remove("hidden");
    };
}

if (logoutBtn) {
    logoutBtn.onclick = () => {
        currentUser = null;
        localStorage.removeItem("currentUser");
        updateUI();
        alert("Ви вийшли");
    };
}

// Завантаження збереженого користувача
const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
    currentUser = JSON.parse(savedUser);
}
updateUI();

// ========== АДМІН ФУНКЦІЇ ==========
if (addProductBtn) {
    addProductBtn.onclick = async () => {
        if (!currentUser || currentUser.role !== "admin") {
            alert("Тільки адмін!");
            return;
        }
        let name = newName?.value.trim();
        let price = parseFloat(newPrice?.value);
        if (!name || !price) { alert("Заповніть поля"); return; }
        
        try {
            await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price, description: "NovaTech", category: "nova-tech", popularity: 0 })
            });
            fetchProducts();
            if (newName) newName.value = "";
            if (newPrice) newPrice.value = "";
            alert("Товар додано!");
        } catch (err) {
            products.push({ name, price, popularity: 0, _id: null });
            render(products);
            alert("Товар додано локально!");
        }
    };
}

async function editProduct(product) {
    let newProductName = prompt("Нова назва:", product.name);
    let newProductPrice = prompt("Нова ціна:", product.price);
    if (!newProductName || !newProductPrice) return;
    
    try {
        if (product._id) {
            await fetch(API + "/" + product._id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newProductName, price: parseFloat(newProductPrice), category: "nova-tech", popularity: product.popularity })
            });
        } else {
            product.name = newProductName;
            product.price = parseFloat(newProductPrice);
        }
        fetchProducts();
        alert("Товар змінено!");
    } catch (err) { console.log(err); }
}

async function deleteProduct(id, index) {
    if (!confirm("Видалити товар?")) return;
    try {
        if (id) {
            await fetch(API + "/" + id, { method: "DELETE" });
        } else {
            products.splice(index, 1);
        }
        fetchProducts();
        alert("Товар видалено!");
    } catch (err) { console.log(err); }
}

// ========== ГРАФІК ==========
const canvas = document.getElementById("chart");
const ctx = canvas?.getContext("2d");

if (chartType) chartType.onchange = drawChart;

function drawChart() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, 300);
    
    let labels = products.map(p => p.name);
    let values = products.map(p => cart.find(c => c.name === p.name)?.qty || 0);
    let type = chartType ? chartType.value : "bar";
    let maxVal = Math.max(...values, 1);
    let scale = maxVal > 10 ? 20 : 40;
    
    if (type === "bar") {
        labels.forEach((name, i) => {
            let height = values[i] * scale;
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(i * 70 + 30, 300 - height, 40, height);
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            ctx.fillText(name, i * 70 + 30, 295);
            ctx.fillText(values[i], i * 70 + 45, 300 - height - 5);
        });
    }
    
    if (type === "pie") {
        let total = values.reduce((a, b) => a + b, 0);
        if (total === 0) {
            ctx.fillStyle = "gray";
            ctx.fillText("Немає даних", 250, 150);
            return;
        }
        let start = 0;
        values.forEach((val, i) => {
            let slice = (val / total) * Math.PI * 2;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(300, 150);
            ctx.arc(300, 150, 100, start, start + slice);
            ctx.fill();
            let mid = start + slice / 2;
            let x = 300 + Math.cos(mid) * 70;
            let y = 150 + Math.sin(mid) * 70;
            ctx.fillStyle = "white";
            ctx.fillText(labels[i], x - 15, y);
            start += slice;
        });
    }
    
    if (type === "line") {
        ctx.beginPath();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        values.forEach((val, i) => {
            let x = i * 70 + 50;
            let y = 300 - val * scale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.fillText(labels[i], x - 15, 295);
            ctx.fillText(val, x - 5, y - 8);
        });
        ctx.stroke();
    }
}

// ========== ОБНУЛЕННЯ ДІАГРАМИ ==========
function resetChart() {
    products.forEach(p => { p.popularity = 0; });
    cart = [];
    updateCart();
    render(products);
    drawChart();
    alert("Статистику очищено!");
}

if (resetChartBtn) resetChartBtn.onclick = resetChart;

// ========== ЗАПУСК ==========
fetchProducts();