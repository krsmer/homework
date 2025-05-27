// script.js for Lost & Found Portal

// --- Sign Up Logic ---
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.username.value.trim();
    const email = this.email.value.trim().toLowerCase();
    const password = this.password.value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('Email already registered.');
        return;
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now sign in.');
    window.location.href = 'signin.html';
});

// --- Sign In Logic ---
document.getElementById('signinForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.email.value.trim().toLowerCase();
    const password = this.password.value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Sign in successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password.');
    }
});

// --- Forgot Password Logic ---
document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    
    // EmailJS ile e-posta gönder
    emailjs.sendForm("service_rzi5vs5", "template_vjob3qk",this).then (function() 
    {
            document.getElementById('resetMessage').textContent = 
                "Password reset link sent to your email!";
        }, function(error) {
            document.getElementById('resetMessage').textContent = 
                "Error: " + error;
        });
});

    
        


// --- Report Item Logic ---
document.getElementById('reportForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const type = this.type.value;
    const itemName = this.itemName.value.trim();
    const description = this.description.value.trim();
    const contact = this.contact.value.trim();
    const imageInput = this.image;
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
        alert('You must be signed in to report an item.');
        window.location.href = 'signin.html';
        return;
    }
    const saveItem = (imageData) => {
        let items = JSON.parse(localStorage.getItem('items') || '[]');
        items.push({
            type,
            itemName,
            description,
            contact,
            image: imageData,
            reporter: user.username,
            date: new Date().toISOString()
        });
        localStorage.setItem('items', JSON.stringify(items));
        alert('Item reported successfully!');
        window.location.href = 'list.html';
    };
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            saveItem(evt.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveItem('');
    }
});

// --- List/Search Items Logic ---
window.addEventListener('DOMContentLoaded', function() {
    const itemsList = document.getElementById('itemsList');
    const searchBar = document.getElementById('searchBar');
    if (!itemsList) return;
    function renderItems(filter = '') {
        let items = JSON.parse(localStorage.getItem('items') || '[]');
        if (filter) {
            items = items.filter(item =>
                item.itemName.toLowerCase().includes(filter.toLowerCase()) ||
                item.description.toLowerCase().includes(filter.toLowerCase()) ||
                item.type.toLowerCase().includes(filter.toLowerCase())
            );
        }
        if (items.length === 0) {
            itemsList.innerHTML = '<p>No items found.</p>';
            return;
        }
        itemsList.innerHTML = items.reverse().map(item => `
            <div class="item-card" style="border:1px solid #ccc; border-radius:6px; padding:15px; margin-bottom:15px;">
                <strong>${item.type.toUpperCase()}</strong> - <b>${item.itemName}</b><br>
                <span>${item.description}</span><br>
                ${item.image ? `<img src="${item.image}" alt="item image" style="max-width:120px; max-height:120px; display:block; margin:10px 0;">` : ''}
                <span><b>Contact:</b> ${item.contact}</span><br>
                <span style="font-size:0.9em; color:#888;">Reported by: ${item.reporter} on ${new Date(item.date).toLocaleString()}</span>
            </div>
        `).join('');
    }
    renderItems();
    searchBar?.addEventListener('input', function() {
        renderItems(this.value);
    });
}); 