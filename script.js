// --- Report Item Logic ---
document.getElementById('reportForm')?.addEventListener('submit', function(e) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
        alert('You must be signed in to report an item.');
        window.location.href = 'signin.html';
        e.preventDefault();
        return;
    }
    
    const type = this.type.value;
    const itemName = this.itemName.value.trim();
    const description = this.description.value.trim();
    const contact = this.contact.value.trim();
    const imageInput = this.image;
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
    // Giriş kontrolü: 
    if (window.location.pathname.endsWith('list.html')) {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) {
            alert('You must be signed in to view items.');
            window.location.href = 'signin.html';
            return;
        }
    }

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
