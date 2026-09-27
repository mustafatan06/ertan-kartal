// Firebase Bağlantı Ayarları
const firebaseConfig = {
  apiKey: "AIzaSyDMIz96KNZF-7zWGRuI-2fvQ72fZImHtUw",
  authDomain: "eretankartal.firebaseapp.com",
  projectId: "eretankartal",
  storageBucket: "eretankartal.firebasestorage.app",
  messagingSenderId: "775846519838",
  appId: "1:775846519838:web:75b1d7dfb4ef942a3f7a0f",
  measurementId: "G-6SL3LJVG99"
};

// Firebase Başlatma
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kategori Filtreleme
    const filterButtons = document.querySelectorAll('.filter-btn');
    const foodCards = document.querySelectorAll('.food-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');

                foodCards.forEach(card => {
                    if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. MODAL AÇMA (Garanti Dinleyici)
    const modal = document.getElementById('orderModal');
    const modalProductName = document.getElementById('modalProductName');
    const triggerButtons = document.querySelectorAll('.trigger-modal');

    triggerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');
            
            if(modal) {
                modal.style.display = 'flex';
                if(modalProductName) {
                    modalProductName.textContent = `${productName} (${productPrice})`;
                }
            }
        });
    });

    // Modalı Kapatma
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            if(modal) modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 3. SİPARİŞİ GÖNDERME BUTONU
    const submitBtn = document.querySelector('.submit-order-btn');
    if(submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const branchSelect = document.getElementById('branchSelect');
            const customerNameInput = document.getElementById('customerName');
            const customerPhoneInput = document.getElementById('customerPhone');
            const customerAddressInput = document.getElementById('customerAddress');

            const branch = branchSelect ? branchSelect.value : "Merkez Şube";
            const name = customerNameInput ? customerNameInput.value.trim() : "";
            const phone = customerPhoneInput ? customerPhoneInput.value.trim().replace(/\s+/g, '') : "";
            const address = customerAddressInput ? customerAddressInput.value.trim() : "";
            const product = modalProductName ? modalProductName.textContent : "Çiğ Köfte Menü";

            if (!name) {
                alert("Lütfen isim soyisim giriniz.");
                if(customerNameInput) customerNameInput.focus();
                return;
            }

            if (!phone || phone.length < 10) {
                alert("Lütfen geçerli bir telefon numarası giriniz.");
                if(customerPhoneInput) customerPhoneInput.focus();
                return;
            }

            if (!address) {
                alert("Lütfen teslimat adresi giriniz.");
                if(customerAddressInput) customerAddressInput.focus();
                return;
            }

            const orderData = {
                id: Date.now(),
                branch: branch,
                name: name,
                phone: phone,
                address: address,
                product: product,
                status: "Yeni Sipariş",
                time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };

            // Firebase veritabanına yaz ve admin paneline anında düşür
            database.ref('orders').push(orderData)
                .then(() => {
                    alert(`Sayın ${name},\n\nSiparişiniz ${branch} şubemize başarıyla iletildi!`);
                    if(modal) modal.style.display = 'none';
                    const form = document.getElementById('orderForm');
                    if(form) form.reset();
                })
                .catch((error) => {
                    alert("Sipariş gönderilirken hata oluştu: " + error.message);
                });
        });
    }
});