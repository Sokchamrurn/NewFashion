// Sample Product Data
const products = [
    {
        id: 1,
        name: "Men's Casual Shirt",
        category: "men",
        price: 49.99,
        oldPrice: 59.99,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["new", "sale"]
    },
    {
        id: 2,
        name: "Women's Summer Dress",
        category: "women",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["new"]
    },
    {
        id: 3,
        name: "Men's Denim Jeans",
        category: "men",
        price: 69.99,
        oldPrice: 79.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["sale"]
    },
    {
        id: 4,
        name: "Women's Blouse",
        category: "women",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: []
    },
    {
        id: 5,
        name: "Men's Leather Jacket",
        category: "men",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["new"]
    },
    {
        id: 6,
        name: "Women's Skirt",
        category: "women",
        price: 39.99,
        oldPrice: 49.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["sale"]
    },
    {
        id: 7,
        name: "Men's T-Shirt Pack",
        category: "men",
        price: 35.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: []
    },
    {
        id: 8,
        name: "Women's Jumpsuit",
        category: "women",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["new"]
    }
];

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCount = document.querySelector('.cart-count');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Products
function displayProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
        if (filter === 'all') return true;
        if (filter === 'men' && product.category === 'men') return true;
        if (filter === 'women' && product.category === 'women') return true;
        if (filter === 'new' && product.tags.includes('new')) return true;
        if (filter === 'sale' && product.tags.includes('sale')) return true;
        return false;
    });
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.tags.includes('sale') ? '<span class="sale-badge">SALE</span>' : ''}
                ${product.tags.includes('new') ? '<span class="sale-badge" style="background: #4CAF50;">NEW</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.oldPrice ? 
                        `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : 
                        ''
                    }
                    $${product.price.toFixed(2)}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="wishlist-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to newly created buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to Cart Function
function addToCart(e) {
    const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Update cart count
    updateCartCount();
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Filter Products
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Filter products
        const filter = button.dataset.filter;
        displayProducts(filter);
    });
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.subscribe-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        showNotification(`Thank you for subscribing with ${email}!`);
        this.reset();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    
    // Add CSS for notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});