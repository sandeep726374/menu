window.addEventListener("scroll", function () {
    var header = document.querySelector(".header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


// CHANGING THE BACKGROUND SLIDES IN HOME SECTION
document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".slide");
    let index = 0;

    // Automatic Slide Change for Background
    function changeSlide() {
        slides.forEach(slide => slide.classList.remove("active"));
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }

    setInterval(changeSlide, 3500); // Change background every 3.5 seconds

    // Play GIF independently when entering the home section
    let gif = document.querySelector(".home-gif img");

    function playGif() {
        let newSrc = gif.src; // Refreshing the GIF
        gif.src = "";
        gif.src = newSrc;
    }

    // Detect when home section is in view
    let homeSection = document.querySelector(".home");

    window.addEventListener("scroll", () => {
        let rect = homeSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            playGif(); // Restart GIF when home section is visible
        }
    });
});

    // Menu Icon and Navbar Setup
    const menuIcon = document.getElementById('menu-icon'); // Ensure this matches your menu icon ID in HTML
    const navbar = document.querySelector('.navbar'); // Ensure this matches your navbar class in HTML

    // Toggle Navbar visibility on menu icon click
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    });

    let sections = document.querySelectorAll('section');
    let navlinks = document.querySelectorAll('header nav a');

    window.onscroll = () => {
        sections.forEach(sec => {
            let top = window.scrollY;
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navlinks.forEach(link => {
                    link.classList.remove('active');
                    document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
                });
            }
        });

        let header = document.querySelector('header');
        header.classList.toggle('sticky', window.scrollY > 100);
    };


    // ABOUT SECTION CUROSAL
    
    let slideIndex = 0;
    showSlides();

    function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
    }
// End About


//  SCROLL REVEAL ANIMATION 

window.onload = function () {
    ScrollReveal({ reset: true, distance: '80px', duration: 2000, delay: 200 });

    ScrollReveal().reveal('.home-content, .heading, .section-title', { origin: 'top' });
    ScrollReveal().reveal('.menu-container,.bd-grid,.testimonials-container, .portfolio-box, .contact form, .cards, .contact-container', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .why-choose-us p, .section-desc, .info-item', { origin: 'left' });
    ScrollReveal().reveal('.home-content p, .about-content, .head, .about-info', { origin: 'right' });
};


// REVIEWS SECTION CUROUSEL EFFECT

document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".testimonial-slide");
    let dots = document.querySelectorAll(".dot");
    let totalSlides = slides.length;
    let totalDots = dots.length;
    let currentIndex = 0;
    let batchSize = Math.ceil(totalSlides / totalDots); // Group slides into sets controlled by 3 dots
    let interval = setInterval(nextSlide, 4000);

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });

        let dotIndex = Math.floor(index / batchSize) % totalDots;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[dotIndex].classList.add("active");
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    }

    function setSlide(index) {
        currentIndex = index * batchSize;
        showSlide(currentIndex);
        resetAutoplay();
    }

    function resetAutoplay() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 4000);
    }

    document.getElementById("next").addEventListener("click", () => {
        nextSlide();
        resetAutoplay();
    });

    document.getElementById("prev").addEventListener("click", () => {
        prevSlide();
        resetAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => setSlide(index));
    });

    showSlide(currentIndex);
});

// TO DISPLAY THE ITEMS IN BAG-CONTAINER FROM THE LOCAL STORAGE

document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from local storage
    const cartContainer = document.getElementById("cart-container");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartItemTemplate = document.querySelector(".cart-item.template");
    const cartIcon = document.querySelector(".bag-icon");
    const sendOrderButton = document.getElementById("send-order-btn");
    document.getElementById("close-cart").addEventListener("click", function() {
        document.getElementById("cart-container").style.display = "none";
    });
    

    // Hide cart initially
    cartContainer.style.display = "none";
  
    // Toggle cart visibility when clicking the bag icon
    cartIcon.addEventListener("click", () => {
        cartContainer.style.display = cartContainer.style.display === "none" ? "block" : "none";
    });
  
    // Function to update cart UI & save to local storage
    function updateCart() {
        cartItemsContainer.innerHTML = ""; // Clear previous cart items
        let total = 0;
  
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
  
            // Clone template and remove "template" class
            const newItem = cartItemTemplate.cloneNode(true);
            newItem.classList.remove("template");
            newItem.style.display = "flex";
  
            newItem.querySelector(".cart-item-name").innerText = `${item.name} - ₹${item.price} x ${item.quantity}`;
            newItem.querySelector(".quantity").innerText = item.quantity;
  
            // Add event listeners for buttons
            newItem.querySelector(".increase-btn").addEventListener("click", () => updateQuantity(index, 1));
            newItem.querySelector(".decrease-btn").addEventListener("click", () => updateQuantity(index, -1));
            newItem.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(index));
  
            cartItemsContainer.appendChild(newItem);
        });
  
        document.getElementById("cart-total").innerText = `₹${total}`;
        
        // Save updated cart to local storage
        localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    // Function to update quantity
    function updateQuantity(index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            cart.splice(index, 1);
        }
        updateCart(); // Automatically save to local storage
    }
  
    // Function to remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart(); // Automatically save to local storage
    }
  
    // Function to send order via WhatsApp
    sendOrderButton.addEventListener("click", () => {
        const tableNumber = document.getElementById("table-number").value.trim();
        if (!tableNumber) {
            alert("Please enter your table number.");
            return;
        }
  
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
  
        let orderText = `*New Order from Table ${tableNumber}*%0A%0A`;
        cart.forEach(item => {
            orderText += `🛒 ${item.name} - ₹${item.price} x ${item.quantity}%0A`;
        });
  
        orderText += `%0A🧾 *Total Bill: ₹${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}*`;
  
        const restaurantNumber = "918919313108"; // WhatsApp format: Add '91' for India
        const whatsappURL = `https://wa.me/${restaurantNumber}?text=${orderText}`;
        window.location.href = whatsappURL; // Open WhatsApp directly
    });
  
    // Add item to cart when clicking the cart icon on a menu item
    document.querySelectorAll(".cart").forEach(cartButton => {
        cartButton.addEventListener("click", function () {
            const menuItem = this.closest(".menu-item-box");
            const name = menuItem.querySelector(".menu-item-name").innerText;
            const price = parseFloat(menuItem.querySelector(".menu-item-price").innerText.replace("₹", ""));
  
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
  
            updateCart(); // Automatically save to local storage
        });
    });
  
    // Load cart from local storage when page loads
    updateCart();
  });
  
  