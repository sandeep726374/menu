window.onload = function() {
    ScrollReveal({
        reset: true,
        distance: '80px',
        duration: 2000,
        delay: 200
    });

    ScrollReveal().reveal('.heading', {
        origin: 'left'
    });
};

// Menu Icon and Navbar Setup
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

// Toggle Navbar visibility on menu icon click
menuIcon.addEventListener('click', (event) => {
    menuIcon.classList.toggle('fa-bars'); // Toggle bars icon
    menuIcon.classList.toggle('fa-times'); // Toggle X icon
    navbar.classList.toggle('active');
    event.stopPropagation(); // Prevent immediate closing when clicking the icon
});

// Close navbar when clicking outside of it
document.addEventListener('click', (event) => {
    if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
        closeNavbar();
    }
});

// Prevent navbar from closing when clicking inside
navbar.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Close the navbar function
function closeNavbar() {
    navbar.classList.remove('active');
    menuIcon.classList.remove('fa-times'); // Remove cross (X)
    menuIcon.classList.add('fa-bars'); // Add bars (☰)
}

// SMOOTH SCROLL FOR NAVIGATION LINKS
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.header').offsetHeight; // Get navbar height
            const offset = targetElement.offsetTop - navbarHeight; // Adjust scroll position

            window.scrollTo({
                top: offset,
                behavior: "smooth"
            });
        }

        // Close menu after clicking a link
        closeNavbar();
    });
});

// Highlight active section on scroll
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



document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from local storage
  const cartContainer = document.getElementById("cart-container");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartItemTemplate = document.querySelector(".cart-item.template");
  const cartIcon = document.querySelector(".bag-icon");
  const sendOrderButton = document.getElementById("send-order-btn");
  const closeCartButton = document.getElementById("close-cart");
  const popupMessage = document.getElementById("popup-message");

  // Function to show a temporary popup message
  function showPopupMessage() {
      popupMessage.style.display = "block";
      popupMessage.style.opacity = "1";

      setTimeout(() => {
          popupMessage.style.opacity = "0";
          setTimeout(() => {
              popupMessage.style.display = "none";
          }, 500);
      }, 1000); // Popup stays visible for 1 second
  }

  // Function to close the cart
  function closeCart() {
      cartContainer.style.display = "none";
  }

  // Hide cart initially
  cartContainer.style.display = "none";

  // Toggle cart visibility when clicking the bag icon
  cartIcon.addEventListener("click", (event) => {
      cartContainer.style.display = cartContainer.style.display === "none" ? "block" : "none";
      event.stopPropagation(); // Prevent body click from closing immediately
  });

  // Prevent closing when clicking inside the cart container
  cartContainer.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent event from reaching document click listener
  });

  // Close cart when clicking outside of it
  document.addEventListener("click", (event) => {
      if (!cartContainer.contains(event.target) && !cartIcon.contains(event.target)) {
          closeCart();
      }
  });

  // Close cart when clicking the close button
  closeCartButton.addEventListener("click", closeCart);

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

          showPopupMessage(); // Show popup message when item is added
          updateCart(); // Automatically save to local storage
      });
  });

  // Load cart from local storage when page loads
  updateCart();
});




// Dynamically add menu items
const vegSoupContainer = document.getElementById("veg-soup-container");
const nonVegSoupContainer = document.getElementById("non-veg-soup-container");
// Staters
const vegStartersContainer = document.getElementById("veg-starters-container");
const nonVegChickenContainer = document.getElementById("non-veg-chicken-container");
const nonVegSeaFoodContainer = document.getElementById("non-veg-seaFood-container");
//Biriyani
const CHICKENBIRIYANIContainer = document.getElementById("chicken-biriyani-container");
const MUTTONBIRIYANIContainer = document.getElementById("mutton-biriyani-container");
const VEGBIRIYANIContainer = document.getElementById("veg-biriyani-container");
const EGGBIRIYANIContainer = document.getElementById("egg-biriyani-container");
const SEAFOODBiriyaniContainer = document.getElementById("seafood-biriyani-container");
const PANNERBIRIYANIContainer = document.getElementById("panner-biriyani-container");
//Kabab
const MuttonKebabsContainer = document.getElementById("Mutton-Kebabs-container");
const ChickenKebabsContainer = document.getElementById("Chicken-Kebabs-container");
const FishPrawnsKebabsContainer = document.getElementById("FishPrawns-Kebabs-container");
const PaneerKebabsContainer = document.getElementById("Paneer-Kebabs-container");
const RotisKababContainer = document.getElementById("Rotis-Kabab-container");
//Platters
const ChickenPlatterContainer = document.getElementById("Chicken-Platter-container");
const TandoorPlatterContainer = document.getElementById("Tandoor-Platter-container");
const SeaFoodPlatterContainer = document.getElementById("SeaFoodContainer");
const ChinesePlatterContainer = document.getElementById("Chinese-Platter-container");
//Fried Rice
const VegFriedRiceContainer = document.getElementById("Veg-Fried-Rice-container");
const NonVegFriedRiceContainer = document.getElementById("Non-Veg-Fried Rice-container");
//Noodles
const VegNoodlesContainer = document.getElementById("VNoodles-container");
const NonVegNoodlesContainer = document.getElementById("NVNoodles-container");
//Pulao
const VegPulaoContainer = document.getElementById("Veg-Pulao-container");
const ShawarmaContainer = document.getElementById("Shawarma-container");
const ChopSueyContainer = document.getElementById("Chop-Suey-container");
//Handi
const BiryaniHandiContainer = document.getElementById("Biryani-Handi-container");
const SplChikenHandiContainer = document.getElementById("Spl-Chiken-Handi-container");
const SplMuttonHandiContainer = document.getElementById("Spl-Mutton-Handi-container");
const SplVegHandiContainer = document.getElementById("Spl-Veg-Handi-container");

//Desserts
const DessertsContainer = document.getElementById("Desserts-container");
const MocktailsContainer = document.getElementById("Mocktails-container");
const SoftDrinksContainer = document.getElementById("SoftDrinks-container");
const LassiContainer = document.getElementById("Lassi-container");
//Curries
const ChickenBoneContainer = document.getElementById("Chicken-Bone-container");
const ChickenBonelessContainer = document.getElementById("Chicken-Boneless-container");
const MuttonContainer = document.getElementById("Mutton-container");
const PrawnsContainer = document.getElementById("Prawns-container");
const VegCurriesContainer = document.getElementById("Veg-Curries-container");
const FishCurriesContainer = document.getElementById("Fish-Curries-container");

// Veg Soup List
const vegSoupItems =  [
    {
        id: 12,
        item_name: "Veg Corn Soup",
        imgURL: "https://www.funfoodfrolic.com/wp-content/uploads/2020/12/Sweet-Corn-Soup-TThumbnail.jpg",
        price: 170,
    },
    {
        id: 13,
        item_name: "Lemon Coriander Soup",
        imgURL: "https://www.indianveggiedelight.com/wp-content/uploads/2020/03/lemon-coriander-soup-featured.jpg",
        price: 170,
    },
    {
        id: 14,
        item_name: "Veg Manchow Soup",
        imgURL: "https://sinfullyspicy.com/wp-content/uploads/2023/12/1200-by-1200-images-1.jpg",
        price: 170,
    },
    {
        id: 15,
        item_name: "Veg Clear Soup",
        imgURL: "https://www.vegrecipesofindia.com/wp-content/uploads/2024/06/clear-soup-recipe-1.jpg",
        price: 170,
    },
    {
        id: 16,
        item_name: "Tomato Soup",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM-Uy9MA6cq1nDR_8Q9NCuOgEW9zev3T_kcg&s",
        price: 170,
    },
    {
        id: 17,
        item_name: "Mix Veg Clear Soup",
        imgURL: "https://www.sharmispassions.com/wp-content/uploads/2013/07/ClearSoup4-500x500.jpg",
        price: 170,
    },
    {
        id: 18,
        item_name: "Tomato Lemon Soup",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cyaqZ4UOvWQcNF_tQhTISnoyWYvyHT3IOw&s",
        price: 170,
    },
    {
        id: 19,
        item_name: "Mix Vegetable Soup",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwawU1XZWomMNLnQGxiLumVnTJdS_4aFcAMg&s",
        price: 180,
    }
];
// Non-Veg Soup List
const nonVegSoupItems = [
    {
        id: 20,
        item_name: "Chicken Corn Soup",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThcZi1RewWwbu6vg7khI0Ic60QX58op3ZErg&s",
        price: 200,
    },
    {
        id: 21,
        item_name: "Chicken Hot & Sour Soup",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpCCl1dQV3vcwd8HQl8lC2EE7RNyk-GG8O4g&s",
        price: 210,
    },
    {
        id: 22,
        item_name: "Chicken Manchow Soup",
        imgURL: "https://sinfullyspicy.com/wp-content/uploads/2023/12/1200-by-1200-images-1.jpg",
        price: 210,
    },
    {
        id: 23,
        item_name: "Chicken Clear Soup",
        imgURL: "https://www.shellyfoodspot.com/wp-content/uploads/2022/11/Chicken-clear-soup-recipe-restaurant-stylesoup-without-cornflour-2-720x720.jpg",
        price: 200,
    },
    {
        id: 24,
        item_name: "Lung-Fung Chicken Soup",
        imgURL: "https://orders.popskitchen.in/storage/2024/09/image-328-460x358.png",
        price: 200,
    },
    {
        id: 25,
        item_name: "Chicken Garlic Soup",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1lovCB-hpFS0XwNA3R0gtT-8clbMfltz5Pw&s",
        price: 200,
    },
    {
        id: 26,
        item_name: "Chicken Pepper Soup",
        imgURL: "https://afrifoodnetwork.com/wp-content/uploads/2021/10/43D67F6C-2E5C-4BAA-A44E-F2233F9C31FE.jpeg",
        price: 210,
    }
];
//veg-starters-container
const vegStarters = [
    {
        id: 27,
        item_name: "VEG. MANCHURIA ( DRY / WET )",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDE1T1Jn_4Tjeh6kRSNBcz1SSGA1sZhtpTRQ&s",
        price: 279,
    },
    {
        id: 28,
        item_name: "CHILLI VEG",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4GamzXDHDv8gYwkp-j-EEnmU3kdPCcmuig&s",
        price: 279,
    },
    {
        id: 29,
        item_name: "CRISPY VEG",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcb7x-fzE-bYZPVeZKg99qKf_U9SSgirSSvA&s",
        price: 279,
    },
    {
        id: 30,
        item_name: "GOBI MANCHURIA",
        imgURL: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/gobi-manchurian-cauliflower-manchurian.jpg",
        price: 299,
    },
    {
        id: 31,
        item_name: "MUSHROOM 65",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6nqYW7LrOhPtcKvzvoAHnZCIC_Qx4ocfZtw&s",
        price: 299,
    },
    {
        id: 32,
        item_name: "CHILLY MUSHROOM",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdLTOlvdPsSNJm5sODa_o3xhU9s2A4DeBS2A&s",
        price: 299,
    },
    {
        id: 33,
        item_name: "BABY CORN MANCHURIA",
        imgURL: "https://cdn2.foodviva.com/static-content/food-images/chinese-recipes/baby-corn-manchurian/baby-corn-manchurian.jpg",
        price: 299,
    },
    {
        id: 34,
        item_name: "CHILLY PANEER",
        imgURL: "https://www.cookwithmanali.com/wp-content/uploads/2016/01/Chilli-Paneer-Restaurant-Style-500x500.jpg",
        price: 299,
    },
    {
        id: 35,
        item_name: "GINGER PANEER ( DRY / WET )",
        imgURL: "https://s3-ap-southeast-1.amazonaws.com/sb-singleserver-prod-bucket/2882229e90535c401037d4cfcae0078f/o_1488963660.jpg",
        price: 299,
    },
    {
        id: 36,
        item_name: "PANEER 65 ( DRY / WET )",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNnTfFQhOsH9sEu6aTR2b-Es6S4PETihUxQ&s",
        price: 299,
    },
    {
        id: 37,
        item_name: "PANEER MAJESTIC",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV3SZhK9UaCuevDtylIXZu1GehWzGQoYoQCQ&s",
        price: 299,
    },
    {
        id: 38,
        item_name: "SCHEZWAN PANEER",
        imgURL: "https://www.cookwithmanali.com/wp-content/uploads/2023/05/Schezwan-Paneer-500x500.jpg",
        price: 299,
    }
];
//non-veg-chicken-container
const ChickenStarters = [
    {
        id: 39,
        item_name: "CRISPY THREAD CHICKEN - OUR SPL.",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE_UBHi7gqgshd8y51FrBZBHk0LC1IrJStAw&s",
        price: 399,
    },
    {
        id: 40,
        item_name: "CHICKEN 65",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLQresj0_8HaaStyeLHvsBvkxpbEulGh-HUw&s",
        price: 349,
    },
    {
        id: 41,
        item_name: "CHICKEN MANCHURIA ( DRY / WET )",
        imgURL: "https://pupswithchopsticks.com/wp-content/uploads/chicken-manchurian-tnnew.webp",
        price: 349,
    },
    {
        id: 42,
        item_name: "CHILLY CHICKEN ( DRY / WET )",
        imgURL: "https://www.licious.in/blog/wp-content/uploads/2022/04/shutterstock_1498639676-min.jpg",
        price: 349,
    },
    {
        id: 43,
        item_name: "KUNG-FU CHICKEN - OUR SPL.",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTowajLWHEDJXFpQNrQs4Wp6mliQE26KbFAdA&s",
        price: 349,
    },
    {
        id: 44,
        item_name: "APOLLO CHICKEN",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgML1XnhzpukR65dapxY7JSNU8n8BnAq6XkQ&s",
        price: 349,
    },
    {
        id: 45,
        item_name: "RAJASTHANI CHICKEN",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV5MuwnwYB5w0jq9rzVTFlqKXfq3bJcUJjMg&s",
        price: 349,
    },
    {
        id: 46,
        item_name: "GINGER CHICKEN ( DRY / WET )",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOR1U4gEntLZeTqCscm2TcBKNgRxJJURY7Cw&s",
        price: 349,
    },
    {
        id: 47,
        item_name: "CHICKEN DRUM STICK (8 PCS)",
        imgURL: "https://www.allrecipes.com/thmb/FsvJMhIF9POzd6ISGzEAnzOfmQg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-256872-Slow-Cooked-Chicken-Drumsticks-ddmfs-beauty-4x3-13c39d54711745e7840bad1a7bed444c.jpg",
        price: 349,
    },
    {
        id: 48,
        item_name: "CHICKEN LOLLIPOP (8 PCS)",
        imgURL: "https://ohthatsgood.com/wp-content/uploads/2022/08/Chicken-Lollipop-1200x1200-1.jpg",
        price: 369,
    },
    {
        id: 49,
        item_name: "CHICKEN ROAST",
        imgURL: "https://spoonsofflavor.com/wp-content/uploads/2020/10/Spicy-Chicken-Roast-Recipe.jpg",
        price: 349,
    },
    {
        id: 50,
        item_name: "PEPPER CHICKEN",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV37gOsHJfdKjmSo_lF2RsPeu9D78G2GmYOQ&s",
        price: 349,
    },
    {
        id: 51,
        item_name: "CHICKEN MAJESTIC",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUXVO7YMBrj7kHsAJwcsA35CGEnjwwgP2Bog&s",
        price: 349,
    },
    {
        id: 52,
        item_name: "DEVIL CHICKEN - OUR SPL.",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn7FLM7nFwaDgnmXW1N1y9Srpdny6cQtSqNg&s",
        price: 349,
    }
];
//non-veg-seaFood-container
const FishStarters = [
    {
        id: 53,
        item_name: "APOLLO FISH",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-R_2Q7WDR9NU6BJoTIRhml7Ig5JvL6lBmzw&s",
        price: 369,
    },
    {
        id: 54,
        item_name: "FRY FISH",
        imgURL: "https://i0.wp.com/vickypham.com/wp-content/uploads/2021/07/66884-eosm50_4391.jpg",
        price: 369,
    },
    {
        id: 55,
        item_name: "GINGER FISH",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcC9n4iMQiGfr39pNgST514yCDiG9QeRm_EQ&s",
        price: 369,
    },
    {
        id: 56,
        item_name: "CHILLY FISH",
        imgURL: "https://www.yummytummyaarthi.com/wp-content/uploads/2018/07/1-30-500x500.jpg",
        price: 369,
    },
    {
        id: 57,
        item_name: "PEPPER FISH",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRalck8RcN1_j-QZTjmDjyY3CixaQCnb51P9w&s",
        price: 369,
    },
    {
        id: 58,
        item_name: "FINGER FISH",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiWsIGeVVblwfiWJkzISdZI9ducOaez7rA2Q&s",
        price: 369,
    },
    {
        id: 59,
        item_name: "FISH MAJESTIC",
        imgURL: "https://jeyporedukaan.in/wp-content/uploads/2022/09/download.jpeg",
        price: 369,
    },
    {
        id: 60,
        item_name: "FISH MANCHURIA",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn7TCNgjjw713CgsMpZUW2A95BZmyCvC4A-g&s",
        price: 369,
    },
    {
        id: 61,
        item_name: "LOOSE PRAWNS",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQylhK01hNF0iJYngVmt-2d8u0L4ekrK5FtA&s",
        price: 369,
    },
    {
        id: 62,
        item_name: "PEPPER PRAWNS",
        imgURL: "https://hips.hearstapps.com/hmg-prod/images/jamaican-pepper-prawns-recipe-low-res-1655728210.jpg?crop=1.00xw:0.669xh;0,0.119xh&resize=1200:*",
        price: 369,
    },
    {
        id: 63,
        item_name: "CHILLY PRAWNS",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOG7nejtBHWGEbNCTwjOQS2yWwmQKbVuR3Q&s",
        price: 369,
    },
    {
        id: 64,
        item_name: "GOLDEN HONEY PRAWNS",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWPkfQOyxfNQpYdx7RvhqHA7IPKxK1W1uPA&s",
        price: 369,
    },
    {
        id: 65,
        item_name: "GINGER PRAWNS",
        imgURL: "https://static.toiimg.com/photo/75452887.cms",
        price: 369,
    },
    {
        id: 66,
        item_name: "PRAWNS SALT PEPPER",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq1F4TJlAgYjrKlOamzg758oihF9hnLK7puw&s",
        price: 369,
    },
    {
        id: 67,
        item_name: "PRAWNS MANCHURIA",
        imgURL: "https://www.marionskitchen.com/wp-content/uploads/2019/05/Sichuan-Chilli-Prawns2.jpg",
        price: 369,
    }
];
// Tandoori sections
//Mutton
const Mutton = [
    {
      id: 68,
      item_name: "SPL.HABIBI TAWA GHOSH",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxENjvQDWOLUhAyk2ImBZhemLl15HUj4P8A&s",
      price: 550,
    },
    {
      id: 69,
      item_name: "MUTTON TIKKA KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRcnQLURClfyjMtXXxfSUrtrleYPyTdIQ4kw&s",
      price: 550,
    },
    {
      id: 70,
      item_name: "MUTTON SEEKH KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGUeWNtmtkeXKr6HAwyexRLz9QjQLRXYeksw&s",
      price: 550,
    },
    {
      id: 71,
      item_name: "MUTTON BOTI KEBAB",
      imgURL: "https://static.toiimg.com/thumb/73982940.cms?imgsize=1875351&width=800&height=800",
      price: 550,
    },
    {
      id: 72,
      item_name: "MUTTON RAJASTHANI SHOLEY KEBAB",
      imgURL: "https://cdn.dotpe.in/longtail/store-items/6572500/tf0iyVGd.jpeg",
      price: 550,
    },
  ];
//Chicken
const Chicken = [
    {
      id: 73,
      item_name: "ARABIAN TANDOORI CHICKEN",
      imgURL: "https://img.freepik.com/premium-photo/arabian-tandoori-chicken-with-chili-sauce-served-dish-isolated-grey-background-top-view-bangladesh-food_689047-3148.jpg",
      price: 550,
    },
    {
      id: 74,
      item_name: "TANDOORI CHICKEN",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF8Qr5LJKkMhy33hyPFDbsOdcIkc2Lzd8d7g&s",
      price: 500,
    },
    {
      id: 75,
      item_name: "GRILL CHICKEN",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_7mct1A792qL8zopviKQXLsZdtNxOf28HFw&s",
      price: 479,
    },
    {
      id: 76,
      item_name: "CHICKEN TANGDI KEBAB",
      imgURL: "https://palatesdesire.com/wp-content/uploads/2022/07/Tangdi-kebab-recipe@palates-desire-1.jpg",
      price: 400,
    },
    {
      id: 77,
      item_name: "CHICKEN KALMI KEBAB",
      imgURL: "https://www.archanaskitchen.com/images/Kalmi_Kebab_Recipe_Mughlai_Style_Spicy_Pan_Fried_Chicken-2_400.jpg",
      price: 400,
    },
    {
      id: 78,
      item_name: "MURG BBQ KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSJFJuQqhvi8zcxt_fJamQsl-pLFcqQdWErA&s",
      price: 410,
    },
    {
      id: 79,
      item_name: "CHICKEN SEEKH KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR--QJkSet28iJfu0p0QnUb95jI7BKokYXrRg&s",
      price: 379,
    },
    {
      id: 80,
      item_name: "MURG GARLIC KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJb32VOT0pj7zcVaVOKsY2VI4GaeQNIBY9wA&s",
      price: 379,
    },
    {
      id: 81,
      item_name: "MURG ANGARA KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJb32VOT0pj7zcVaVOKsY2VI4GaeQNIBY9wA&s",
      price: 379,
    },
    {
      id: 82,
      item_name: "MURG TIKKA KEBAB",
      imgURL: "https://butfirstchai.com/wp-content/uploads/2023/03/chicken-tikka-skewers-recipe.jpg",
      price: 379,
    },
    {
      id: 83,
      item_name: "MURG ACHARI TIKKA KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC29PXhDCP_7vDPRYq2noQ7OiQDxwg-PIOHQ&s",
      price: 379,
    },
    {
      id: 84,
      item_name: "MURG RESHMI KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf4IFi8cSK5ZAzdw8Fjhdx0XTeeMfRRZ9xyg&s",
      price: 379,
    },
    {
      id: 85,
      item_name: "MURG KALI MIRCHI KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdIxox4XeBwBpohCMAALbP92116SZAPX8KFg&s",
      price: 379,
    },
    {
      id: 86,
      item_name: "MURG RAJASTHANI SHOLEY KEBAB",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR598Z1qE0M2-9jeJ0uSwRqSp6LD66bcOEEyw&s",
      price: 379,
    },
    {
      id: 87,
      item_name: "MURG KARACHI TIKKA",
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNll9h6OsTK4PIS0ZO-AFflO4MvVBV__WpsA&s",
      price: 379,
    },
  ];  
//Fish and Kebebs
const FishPrawnsKEBABS=[
    {
        id:90,
        item_name:"FISH ZAFRANI KEBAB(KESAR)",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMf0tDE7Pcl5V1Zooy4EIvEEirNGXaMli1Ag&s",
        price:379,
    },
    {
        id:91,
        item_name:"FISH TIKKA KEBAB",
        imgURL:"https://spicecravings.com/wp-content/uploads/2019/08/Fish-Tikka-6-500x500.jpg",
        price:379,
    },
    {
        id:92,
        item_name:"ACHARI FISH TIKKA KEBAB",
        imgURL:"https://static.toiimg.com/thumb/55201222.cms?imgsize=156594&width=800&height=800",
        price:379,
    },
    {
        id:93,
        item_name:"TANDOORI PRAWNS KEBAB",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7ph94JI7VFji5nOLta-5QFG-9jIV04bWfMQ&s",
        price:379,
    },
    {
        id:94,
        item_name:"TANDOORI PRAWNS TIKKA KEBAB",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRnCknxKDDtFlRxRzXmlGkltgyzCfc7UW6Pg&s",
        price:379,
    },
    {
        id:95,
        item_name:"ACHARI PRAWNS TIKKA KEBAB",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAq4ckUks7zy4CTYeNiiQ-_0ER9eMaHT7WPA&s",
        price:379,
    },
]
//Panner
const PANEER=[
    {
        id:96,
        item_name:"PANEER TIKKA KEBAB",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfPSukRfeHtN7tj8-ayndPIH9C0Bt1VVrbbA&s",
        price:280,
    },
    {
        id:97,
        item_name:"PANEER ACHARI KEBAB",
        imgURL:"https://static.toiimg.com/thumb/75535761.cms?imgsize=2077414&width=800&height=800",
        price:280,
    },
    ]
//ROTISKabab
const ROTISKabab=[
    {
        id:98,
        item_name:"RUMALI ROTI",
        imgURL:"https://img-cdn.thepublive.com/fit-in/1200x675/filters:format(webp)/sanjeev-kapoor/media/post_banners/a4a4db1961e45e5d50d484422ac136734250d185bb99bf33da875fa42c1d47ea.jpg",
        price:25,
    },
    {
        id:99,
        item_name:"IRANI TANDOORI ROTI",
        imgURL:"https://b.zmtcdn.com/data/dish_photos/d3e/c43aaeb02996cc86bffdc348f8aa2d3e.png",
        price:45,
    },
    {
        id:100,
        item_name:"BUTTER ROTI",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8m877eiGeSKwfoKNRd_rFZniSoyEUokz2XA&s",
        price:50,
    },
    {
        id:101,
        item_name:"PLAIN NAAN",
        imgURL:"https://arbuz.com/wp-content/uploads/2019/04/Easy-Naan-Recipe.jpg",
        price:45,
    },
    {
        id:102,
        item_name:"BUTTER NAAN",
        imgURL:"https://www.chainbaker.com/wp-content/uploads/2021/02/IMG_2644.jpg",
        price:50,
    },
    {
        id:103,
        item_name:"GARLIC NAAN / FRESH CREAM NAAN",
        imgURL:"https://www.budgetbytes.com/wp-content/uploads/2015/12/Homemade-Naan-stack-1200.jpg",
        price:60,
    },
    {
        id:104,
        item_name:"BUTTER GARLIC NAAN",
        imgURL:"https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/butter-naan-500x500.jpg",
        price:60,
    },
    ]
    
//platters
//Chiken_Platter
const Chiken_Platter=[
    {
        id:105,
        item_name:"MURG KALI MIRCHI",
        imgURL:"https://www.easyfoodsmith.com/wp-content/uploads/2015/04/gSAZwF1429264312.jpg",
        price:1349,
    },
    {
        id:106,
        item_name:"MURG KALI MIRCHI",
        imgURL:"https://www.easyfoodsmith.com/wp-content/uploads/2015/04/gSAZwF1429264312.jpg",
        price:1349,
    },
    { 
        id: 107, 
        item_name: "MURG MALAI KEBAB", 
        imgURL: "https://www.archanaskitchen.com/images/archanaskitchen/0-Archanas-Kitchen-Recipes/2021/Murgh_Malai_Kebab_Recipe_Chicken_Malai_Kebab_1.jpg", 
        price:1349, 
    },
    { 
        id: 108, 
        item_name: "MURG RESHMI KEBAB", 
        imgURL: "https://www.licious.in/blog/wp-content/uploads/2020/12/shutterstock_1801066921.jpg", 
        price: 1349, 
    },
    { 
        id: 109, 
        item_name: "MURG GARLIC KEBAB", 
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp58a_pUPINcGjFhf9fpCedDuY0PTkbIrM6g&s", 
        price: 1349, 
    },
    { 
        id: 110, 
        item_name: "MURG TIKKA KEBAB", 
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nkKKXBeMJhdb_AnEPg0SYDHGw9eUaTapYg&s", 
        price: 1349, 
      },
    ]
 //Tandoori_Platter
 const Tandoori_Platter=[
    {
        id:111,
        item_name:"GRILL CHICKEN",
        imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCejJG8uGK5kCRUQUlRptPivNJj8kSoWtjgg&s",
        price:1699,
    },
    { 
        id: 112, 
        item_name: "TANDOORI CHICKEN", 
        imgURL: "https://merecipes.com/wp-content/uploads/2022/12/1/360_F_285688134_EIQSNAxBVRB6H5jXg6ZZK9pX0D5LeY6j.jpg", 
        price:1699,
      },
      { 
        id: 113, 
        item_name: "ARABIAN TANDOORI CHICKEN", 
        imgURL: "https://palatesdesire.com/wp-content/uploads/2022/07/Tangdi-kebab-recipe@palates-desire-1.jpg", 
        price:1699,
      },
    { 
        id: 114, 
        item_name: "TANGDI KEBAB", 
        imgURL: "https://www.archanaskitchen.com/images/Kalmi_Kebab_Recipe_Mughlai_Style_Spicy_Pan_Fried_Chicken-2.jpg", 
        price:1699,
      },
      ]
// SeaFood_Platter
const SeaFood_Platter=[
    { 
      id: 115, 
      item_name: "PEPPER PRAWNS", 
      imgURL: "https://hips.hearstapps.com/hmg-prod/images/jamaican-pepper-prawns-recipe-low-res-1655728210.jpg?crop=1.00xw:0.669xh;0,0.119xh&resize=1200:*", 
      price: 1699, 
    },
    { 
      id: 116, 
      item_name: "APOLLO FISH", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1CEo8cohQ2swX12TOal2sbOPyVERef4y-r-POnZ3wD2oh4lCHn4GWyokAdHwI50J7_fg&usqp=CAU", 
      price: 1699, 
    },
    { 
      id: 117, 
      item_name: "LOOSE PRAWNS", 
      imgURL: "https://media-cdn.tripadvisor.com/media/photo-s/19/26/9a/75/loose-prawns-loose-chilli.jpg", 
      price: 1699, 
    },
    { 
      id: 118, 
      item_name: "FISH FRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpDP18MnH0eEcHX6CoCWcRb87HY72kkBBhIw&s", 
      price: 1699,
    },
    { 
      id: 119, 
      item_name: "PEPPER FISH", 
      imgURL: "https://www.mydiasporakitchen.com/wp-content/uploads/2018/03/peppered-fish-1.jpg", 
      price: 1699,
    },
    ]
//ChineeseMixed_Platter
const ChineeseMixed_Platter=[
    { 
      id: 120, 
      item_name: "LOOSE PRAWNS", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkl7akPlLEq3-lnPgR25nn10UidIcmJulmAw&s", 
      price: 1599,
    },
    { 
      id: 121, 
      item_name: "APOLLO FISH", 
      imgURL: "https://srinivasabhavan.com/wp-content/uploads/2024/11/Apollo-Fish.jpg", 
      price: 1599,
    },
    { 
      id: 122, 
      item_name: "MUTTON ROAST", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoj4IFosYZJ_chilL9ucmEN-X9xg7QjXrpFQ&s", 
      price: 1599,
    },
    { 
      id: 123, 
      item_name: "DRAGON CHICKEN", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcntflUnfjY6VOIaLlLYeKb_aJPF6MZ4bnHA&s", 
      price: 1599,
    },
    { 
      id: 124, 
      item_name: "PEPPER CHICKEN", 
      imgURL: "https://madscookhouse.com/wp-content/uploads/2021/08/Spicy-Back-Pepper-Chicken-500x500.jpg", 
      price: 1599, 
    },
    ]

//Non-Veg Curries
//ChikenBone

const ChickenBone=[
    { 
      id: 125, 
      item_name: "HUNGAMA CHICKEN MASALA", 
      imgURL: "https://zaykarecipes.com/wp-content/uploads/2022/09/chicken-hungama-150x150.jpg", 
      price: 300,
    },
    { 
      id: 126, 
      item_name: "FRY CHICKEN", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3dWTcT41LYFmvq3jRowvWv7uxf9VBLcLZZw&s", 
      price:300,
    },
    { 
      id: 127, 
      item_name: "CHICKEN DO-PYAZA", 
      imgURL: "https://i.pinimg.com/736x/cf/f4/a7/cff4a7942eca655b11c369736ce7bc14.jpg", 
      price: 300,
    },
    { 
      id: 128, 
      item_name: "CHICKEN PUNJABI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHK2HqNZ2VDoIBrsjcgBGC_rv4rL5q_bAJuw&s", 
      price: 300, 
    },
    { 
      id: 129, 
      item_name: "TANDOORI CHICKEN MASALA", 
      imgURL: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/chicken-tikka-masala-500x500.jpg", 
      price: 300, 
    },
    { 
      id: 130, 
      item_name: "ANDHRA CHICKEN", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShvWDE0TYK__AEyWn2L6VOmL1W0VuVd50-AA&s", 
      price: 300,
    },
    { 
      id: 131, 
      item_name: "MURG MUSALLAM", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1JUX_sYNCrTYTUNCDRE95n4xBlmYG0jDpvw&s", 
      price: 300, 
    },
    { 
      id: 132, 
      item_name: "MURG KALI MIRCHI", 
      imgURL: "https://www.whiskaffair.com/wp-content/uploads/2018/10/Chicken-Kali-Mirch-2-3.jpg", 
      price: 300,
    },
    { 
      id: 133, 
      item_name: "ADRAKI CHICKEN MASALA", 
      imgURL: "https://images.slurrp.com/prod/recipe_images/whiskaffair/indian-ginger-chicken-curry-recipe-1617380053_WSMU84FU4SSBQW4JXSH0.webp?impolicy=slurrp-20210601&width=1200&height=675", 
      price: 300,
    },
    { 
      id: 134, 
      item_name: "CHICKEN HYDERABADI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStxg-5u6_gYMd5f1DnjEyZlZS0fR_oikNDeA&s", 
      price: 300, 
    },
    { 
      id: 135, 
      item_name: "DUM KA CHICKEN", 
      imgURL: "https://www.foodfusion.com/wp-content/uploads/2017/05/ID-R00313-5.jpg", 
      price: 359, 
    },
    ]
//ChienBoneLess
const  ChickenBoneless=[
{ 
    id: 136, 
    item_name: "SPL. HABIBI CHICKEN CURRY", 
    imgURL: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/fe0w9fojpx4au9jxiykk", 
    price: 359, 
},
{ 
    id: 137, 
    item_name: "BUTTER CHICKEN", 
    imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSegneEIjn7BXdB19uN6O6G3V030wDdHJC1Sw&s", 
    price: 359, 
},
{ 
    id: 138, 
    item_name: "KADAI CHICKEN", 
    imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG_ZnfXsm8dOECH7TBJL0EPImhHxmwqLRyBg&s", 
    price: 359,
},
{ 
    id: 139, 
    item_name: "ACARI CHICKEN", 
    imgURL: "https://pipingpotcurry.com/wp-content/uploads/2024/02/Achari-Chicken-Piping-Pot-Curry.jpg", 
    price: 359, 
},
{ 
    id: 140, 
    item_name: "CHICKEN TIKKA MASALA", 
    imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUcNTu6mSvUxTmg0k8qX70DsuxwrG-FqC29g&s", 
    price: 359, 
},
{ 
    id: 141, 
    item_name: "CHICKEN CHATPATA", 
    imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzOar75PTiln1_yjDplFbuzIC7s7NM_GSebw&s", 
    price: 359,
},
{ 
    id: 142, 
    item_name: "CHICKEN MUGHALAI", 
    imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuIabagKsXWdYqMxGCZ0UTO6tjsZalI76JOA&s", 
    price: 359,
},
{ 
    id: 143, 
    item_name: "CHICKEN AFGHANI", 
    imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1kxWhbxYKyNaRGlsE1i4Gs4JEgXUAIqZ4Qw&s", 
    price: 359, 
},
]
//MUTOONBone
const MUTOONBone=[
    { 
      id: 144, 
      item_name: "NALLI GHOSH KA SALAN", 
      imgURL: "https://c.ndtvimg.com/2021-12/06qv90f_nalli-ka-salan_625x300_23_December_21.jpg", 
      price: 520,
    },
    { 
      id: 145, 
      item_name: "HUNGAMA MUTTON MASALA", 
      imgURL: "https://b.zmtcdn.com/data/dish_photos/3d9/defc6788ca7545b79a6e94793faf83d9.jpeg", 
      price: 449, 
    },
    { 
      id: 146, 
      item_name: "KADAI GHOSH", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT53cUjs41sWccmU0Hv3LL-qX28k4hbL0VZEA&s", 
      price: 449,
    },
    { 
      id: 147, 
      item_name: "FRY MUTTON", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSughmrEllTywXIV-pJn6pux8JrYtkGahuyDg&s", 
      price: 449, 
    },
    { 
      id: 148, 
      item_name: "MUTTON DO PYAZA", 
      imgURL: "https://lh5.googleusercontent.com/proxy/fm5qZsQ1nm8HztsfW92BSx3XQKt1tl2miFs7fXnbRmwE5bmIR3ADNRXrG0h6fpcNpkggOK684pAHz0bkpBZTvZLVj8bIwot0-h0aDsU", 
      price: 449, 
    },
    { 
      id: 149, 
      item_name: "MUTTON HYDERABAI", 
      imgURL: "https://www.licious.in/blog/wp-content/uploads/2020/12/Mutton-Masala-min.jpg", 
      price: 449, 
    },
    { 
      id: 150, 
      item_name: "ANDHRA MUTTON", 
      imgURL: "https://www.yummytummyaarthi.com/wp-content/uploads/2015/02/1-2.jpg", 
      price: 449, 
    },
    { 
      id: 151, 
      item_name: "ZAFRANI GHOSH KA SALAN", 
      imgURL: "https://c.ndtvimg.com/2021-02/6tkrhcsg_mutton-curry_625x300_10_February_21.jpg", 
      price: 449,
    },
    { 
      id: 152, 
      item_name: "TALAWA GHOSH", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlIgXIke81RXh1mjLlNtP89ZkuSUtNfqRHZQ&s", 
      price: 449, 
    },
    { 
      id: 153, 
      item_name: "MUTTON ROGAN JOSH", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIbjzPXU8w_k1Sbrt4b5Y0GBuxAYdxHppCtQ&s", 
      price: 449, 
    },
    { 
      id: 154, 
      item_name: "MUTTON CHATPATA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPiwAWtW-EWrfFaJU8Lv8I6GPbTYIWktIOGg&s", 
      price: 449, 
    },
    { 
      id: 155, 
      item_name: "MUTTON AFGHANI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbMkhdEmPhGtRXksmArZ71ak6CwU5_sZNmA&s", 
      price: 449, 
    },
    { 
      id: 156, 
      item_name: "MUTTON KALI MIRCHI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzpFaJ-DXapxc6_kFr60u5bE3nvdVNSFn05w&s", 
      price: 449,
    },
    ]
//Prawns    
const PRAWNS=[
        { 
          id: 157, 
          item_name: "SPECIAL HABIBI PRAWNS MASALA", 
          imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREc_Rg4z1dgUzk8C8wFqRmB2zQVJuKvG2Vzw&s", 
          price:399,
        },
        { 
          id: 158, 
          item_name: "KADAI PRAWNS", 
          imgURL: "https://m.media-amazon.com/images/X/bxt1/M/obxt1x9FHJZenUq._SL828_QL90_FMwebp_.jpg", 
          price: 399,
        },
        { 
          id: 159, 
          item_name: "PRAWNS CHATPATA", 
          imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6gw6To8pNi24j4ipEG8uJN-4j-xwzKEAHSA&s", 
          price: 399,
        },
        { 
          id: 160, 
          item_name: "PRAWNS BUTTER MASALA", 
          imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuIuXfwlwPUQqrR_ttaZf3WXFdjZFKdVQ8Zg&s", 
          price: 399,
        },
        { 
          id: 161, 
          item_name: "ACHARI PRAWNS CURRY", 
          imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfqOcdccbSiyw28SOxhe1IRPmJT42fDbF3OA&s", 
          price: 399,
        },
        ]
//VegCurries
const  VegCurries=[
    { 
      id: 162, 
      item_name: "PANEER BUTTER MASALA-OUR SPL.", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_JfZHtD_jlggLqhDlthd7Jg2o4gt7OrWH7w&s", 
      price: 299, 
    },
    { 
      id: 163, 
      item_name: "MIXED VEG CURRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFmMGJlfxGvp0zGmsGjUijCWxynckzwvYfQ&s", 
      price: 299, 
    },
    { 
      id: 164, 
      item_name: "ACHARI VEG CURRY", 
      imgURL: "https://edesiadiaries.com/wp-content/uploads/2020/06/achari-mix-veg.jpeg?w=1024", 
      price: 299, 
    },
    { 
      id: 165, 
      item_name: "KADAI VEG.", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfK4IysaLfLabNsLTb-A4iXekZnDLrSmh_Gw&s", 
      price: 299,
    },
    { 
      id: 166, 
      item_name: "VEG. DO-PYAZA", 
      imgURL: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/01/paneer-do-pyaza.jpg", 
      price: 299,
    },
    { 
      id: 167, 
      item_name: "KAJU CURRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQawj4xufkEe5sa3E-R6Es_-1Q7O4WSZVglcA&s", 
      price: 299, 
    },
    { 
      id: 168, 
      item_name: "KADAI PANEER", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRMQBO6XkbXnpcM5LTVXKxb_t2ab4zQGSztQ&s", 
      price: 299, 
    },
    { 
      id: 169, 
      item_name: "PANEER TIKKA MASALA", 
      imgURL: "https://i0.wp.com/wanderingmatilda.com/wp-content/uploads/2015/12/img_20151201_144511-1.jpg?fit=1080%2C1080&ssl=1", 
      price: 299, 
    },
    { 
      id: 170, 
      item_name: "KAJU PANEER MASALA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShms38XE9JRgDN8fpjcVCpcPW0lgP0i3C-tg&s", 
      price: 299, 
    },
    { 
      id: 171, 
      item_name: "MUSHROOM MASALA", 
      imgURL: "https://jalojog.com/wp-content/uploads/2024/03/Mushroom_Masala.jpg", 
      price: 299, 
    },
    { 
      id: 172, 
      item_name: "DAL TADKA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMrLe4SQHqkTZBeddWAqLGE-ReAPIvO0FKGg&s", 
      price: 299, 
    },
    { 
      id: 173, 
      item_name: "DAL FRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjNrfBfwkq4bqJJLArplEAyytgpiuP7TMjg&s", 
      price: 299, 
    },
    { 
      id: 174, 
      item_name: "DAL PALAK", 
      imgURL: "https://www.fatrainbow.com/wp-content/uploads/2021/09/instant-pot-dal-palak.jpg", 
      price: 299, 
    },
    ]
//FishCurries
const  FishCurries=[
    { 
      id: 175, 
      item_name: "SPL.HABIBI FISH CURRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwQ18t_C-DyagHQfYEVZVtCTN9AuvJyImIvA&s", 
      price: 399, 
    },
    { 
      id: 176, 
      item_name: "FISH TIKKA MASALA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScywzPWcx8vSQd5D7Nq91GSlmDzBxmQdX74A&s", 
      price: 379, 
    },
    { 
      id: 177, 
      item_name: "FISH DO-PYAZA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYujNgWGAxdvVK1j6ZfKk8GRz6_YyKDufKZQ&s", 
      price: 379, 
    },
    { 
      id: 178, 
      item_name: "KADAI FISH", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZIWqCsicGYoNN39SB86aLdYBgFVoNIW-Swg&s", 
      price: 379,
    },
    { 
      id: 179, 
      item_name: "ACHARI FISH", 
      imgURL: "https://static.toiimg.com/thumb/55201222.cms?imgsize=156594&width=800&height=800", 
      price: 379, 
    },
    { 
      id: 180, 
      item_name: "FISH ANDHRA CURRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQzXMIt21QWgcDdzkqtwf4_KIu5l8MzIEsWA&s", 
      price: 379, 
    },
    { 
      id: 181, 
      item_name: "FISH CHATPATA", 
      imgURL: "https://i0.wp.com/kalimirchbysmita.com/wp-content/uploads/2015/11/Surmai-Fry-01.jpg?resize=550%2C550", 
      price: 379,
    },
]  

//Fried Rice
//VegFriedRice
const VegFriedRice=[
    { 
      id: 182, 
      item_name: "SPECIAL HABIBI VEG FRIED RICE", 
      imgURL: "https://cdn.dotpe.in/longtail/item_thumbnails/999815/8KRJF8Jx-400-400.webp", 
      price: 240, 
    },
    { 
      id: 183, 
      item_name: "VEG FRIED RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREs_5FT-5coNK9wyGzbhqkapvV46Lzc7YvCg&s", 
      price: 220, 
    },
    { 
      id: 184, 
      item_name: "SCHEZWAN VEG FRIED RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPqwpjytBXa0NkE9hKPfb9MHgsM4h8pnfoQQ&s", 
      price: 230, 
    },
    { 
      id: 185, 
      item_name: "ZEERA RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXRSlgXV7T76f5yxUoh8dPzre_1W1csfyo3g&s", 
      price: 220, 
    },
    ]
//Non-Veg FRiedRice
const  NonVegFriedRice=[
    { 
      id: 186, 
      item_name: "SPL.HABIBI CHICKEN FRIED RICE", 
      imgURL: "https://www.kitchensanctuary.com/wp-content/uploads/2020/04/Chicken-Fried-Rice-square-FS-.jpg", 
      price: 280, 
    },
    { 
      id: 187, 
      item_name: "CHICKEN FRIED RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqr1jOIIIh_oeis38_1cV2CfucsdnhaLdMig&s", 
      price: 240, 
    },
    { 
      id: 188, 
      item_name: "SCHEZWAN CHICKEN FRIED RICE", 
      imgURL: "https://www.veganricha.com/wp-content/uploads/2023/09/Schezwan-Rice-2756-500x500.jpg", 
      price: 250, 
    },
    { 
      id: 189, 
      item_name: "MIXED FRIED RICE", 
      imgURL: "https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Fried-Rice-min-600x600.jpg", 
      price: 260, 
    },
    { 
      id: 190, 
      item_name: "SCHEZWAN MIXED FRIED RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Ck9i_mMOGNgHrgMzSWFRV5dHFwWlZ-yzLA&s", 
      price: 270, 
    },
    { 
      id: 191, 
      item_name: "EGG FRIED RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxF7j3jLduNXcPlue3b9mUWTFDmZEX1t9ktA&s", 
      price: 220,
    },
    { 
      id: 192, 
      item_name: "PRAWNS FRIED RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpObz7G5g_lvz-29xCU1ypvOBF6ASH8YAHkA&s", 
      price: 250, 
    },
    ]

//Noodles
//VegNoodles
const  VegNoodles=[
    { 
      id: 193, 
      item_name: "SPL.HABIBI VEG.SOFT NOODLES", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgn5jgH9SfzeCRhs550R4yr2LjJIFBOg_wdQ&s", 
      price: 240, 
    },
    { 
      id: 194, 
      item_name: "VEG.SOFT NOODLES", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-NVJoXAGZigHgIgSMrChx-v3UQr57tpLx4Q&s", 
      price: 220, 
    },
    { 
      id: 195, 
      item_name: "SCHEZWAN VEG.SOFT NOODLES", 
      imgURL: "https://food.annapurnaderoyal.com/wp-content/uploads/2021/07/Veg-Hakka-Noodles-300x300.jpg", 
      price: 230, 
    },
    ]
//NonVegNoodles
const  NonVegNoodles=[
    { 
      id: 196, 
      item_name: "SPL.HABIBI CHICKEN SOFT NOODLES", 
      imgURL: "https://static.toiimg.com/thumb/54458787.cms?imgsize=153197&width=800&height=800", 
      price: 280, 
    },
    { 
      id: 197, 
      item_name: "CHICKEN SOFT NOODLES", 
      imgURL: "https://static.toiimg.com/photo/75356205.cms", 
      price: 240, 
    },
    { 
      id: 198, 
      item_name: "SCHEZWAN CHICKEN SOFT NOODLES", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQaipbEDyghODjp2gbMbAM_LgRU5whNPSRUg&s", 
      price: 250, 
    },
    { 
      id: 199, 
      item_name: "MIXED SOFT NOODLES", 
      imgURL: "https://static.toiimg.com/photo/75455420.cms", 
      price: 260, 
    },
    { 
      id: 200, 
      item_name: "SCHEZWAN MIXED SOFT NOODLES", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpChK9LwIyXl73wk_woisjscKPadeO1cu-lw&s", 
      price: 270, 
    },
    { 
      id: 201, 
      item_name: "EGG NOODLES", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB_sKxw_ab-43JZLQzZqJBSRUz6lmnytsfcA&s", 
      price: 220, 
    },
  ]

//Pulao & Sawarma
const VegPulao = [
    { 
      id: 202, 
      item_name: "VEG PULAO", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7qqF6SyqCDfW-JnnEjOZdt02RurJYAXiupg&s", 
      price: 220,
    },
    { 
      id: 203, 
      item_name: "STEAM RICE", 
      imgURL: "https://dinnerthendessert.com/wp-content/uploads/2019/02/Chinese-Steamed-Rice-2-e1725547119357.jpg", 
      price: 200, 
    },
    { 
      id: 204, 
      item_name: "CURD RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFTd9fd8tcQnOyAGyAY-aBo00R72llNKigGw&s", 
      price: 200, 
    },
    ]
//Shawarma
const  Shawarma = [
    { 
      id: 205, 
      item_name: "SHAWARMA IN RUMALI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzacklL_l1T6eOk2_1xsuZ_6zoNFa6BKItg&s", 
      price: 180, 
    },
    { 
      id: 206, 
      item_name: "SPL.SHAWARMA IN RUMALI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBgSkS9PR-uSVaZM1Qk2Ru8mqxmRvAI0Se9A&s", 
      price: 200, 
    },
    { 
      id: 207, 
      item_name: "SPL.GRILL SHAWARMA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR20cjDgxVXyLgPRwSqscAfe1_dVJwIX0Dkcg&s", 
      price: 200,
    },
    { 
      id: 208, 
      item_name: "CHICKEN SPRING ROLL", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdaePwGnEvsDauYyyRC8JEIF_8K5sPLpIu8A&s", 
      price: 250,
    },
    { 
      id: 209, 
      item_name: "EGG SPRING ROLL", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfHHWz3s3JAZD3kJbuKjHYR7GJzahghajsLA&s", 
      price: 220, 
    },
    { 
      id: 210, 
      item_name: "VEG SPRING ROLL", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBC0lsPQ5qR9OwdFgxA9pPZwznozZBOPRN4w&s", 
      price: 200, 
    },
    ]
//ChopSuey
const  ChopSuey = [
    { 
      id: 211, 
      item_name: "VEG.CHINEESE CHOP SUEY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJlnVe3GMgt59VUkaxj3us-zv0cEc7DPb0Cw&s", 
      price: 300, 
    },
    { 
      id: 212, 
      item_name: "VEG AMERICAN CHOP SUEY", 
      imgURL: "https://www.archanaskitchen.com/images/archanaskitchen/0-Archanas-Kitchen-Recipes/2020/Vegetarian_American_Chopsuey_Recipe_Indo_Chinese_recipe_1.jpg", 
      price: 300, 
    },
    { 
      id: 213, 
      item_name: "CHICKEN CHINEESE CHOP SUEY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaiz7Q_QOTuV4-J7SHo1F9VuX2Y7XLH1hhTA&s", 
      price: 330, 
    },
    { 
      id: 214, 
      item_name: "CHICKEN AMERICAN CHOP SUEY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzaIEhmqhH_lvFUdaFm8JX6NUwAS577VIzOA&s", 
      price: 330,
    },
    ]
  
//Biriyani's
//ChickenBiryani
const ChickenBiryani = [
    { 
      id: 215, 
      item_name: "FULL CHICKEN DUM BIRYANI(2PCS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLCMFH6fxDIvas0C4JOwJavHiatcocu-ERTw&s", 
      price: 329, 
    },
    { 
      id: 216, 
      item_name: "CHICKEN FAMILY BIRYANI(4PCS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx2LVYM0Lu3WG-fT6Lc-UyM3GWJAEaBczTpg&s", 
      price: 579,
    },
    { 
      id: 217, 
      item_name: "CHICKEN JUMBO BIRYANI(8PCS)", 
      imgURL: "https://us2guntur.com/images//10071img/ChikJumboBiryani_B_161220.jpg", 
      price: 1149, 
    },
    { 
      id: 218, 
      item_name: "EXTRA CHICKEN(2PCS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8HzD674S177Hm2WTOf9lToFuK9YHMDb5Yrg&s", 
      price:  229,
    },
    { 
      id: 219, 
      item_name: "FULL CHICKEN FRY BIRYANI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBmuZTJ1g3jBBk2RluaRsDbKDxHigCQ5SzdQ&s", 
      price:  349, 
    },
    { 
      id: 220, 
      item_name: "MINI CHICKEN 65 BIRYANI(BONELESS)", 
      imgURL: "https://cdn.uengage.io/uploads/7057/image-737742-1686723280.jpeg", 
      price: 229,
    },
    { 
      id: 221, 
      item_name: "FULL CHICKEN 65 BIRYANI(BONELESS)", 
      imgURL: "https://cdn.uengage.io/uploads/7057/image-5568-1721978467.jpg", 
      price: 379,
    },
    { 
      id: 222, 
      item_name: "FULL MURG TIKKA BIRYANI(16PCS),(BONELESS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJVIgS8l5eBeuuGMYyKN6troOJ7Breia3u_g&s", 
      price: 379,
    },
    ]
//MuttonBiryani
const MuttonBiryani = [
    { 
      id: 229, 
      item_name: "FULL MUTTON BIRYANI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknZsQQ2VkMRxF1b8sxIWtxkx4ZrM_OoijXw&s", 
      price: 399,
    },
    { 
      id: 230, 
      item_name: "FULL MUTTON BIRYANI DOUBLE GHOSH", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTf7c-INpnHCw69DIWMZr-vq-zIZVnJIaYzw&s", 
      price: 549, 
    },
    { 
      id: 231, 
      item_name: "MUTTON FAMILY PACK(4 PERSONS)", 
      imgURL: "https://cdn.uengage.io/uploads/23764/image-7363-1707820507.jpg", 
      price: 699,
    },
    { 
      id: 232, 
      item_name: "MUTTON JUMBO PACK(6-8 PERSONS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSua3OLscrSzSEKJ-CSVnxMrACxT00UALjM1w&s", 
      price: 1199,
    },
    { 
      id: 233, 
      item_name: "NALLI GHOSH KI BIRYANI(2PCS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-tf6dRm3XjB2AUnafyDHE2fxtl1cJBwyq_g&s", 
      price: 599,
    },
    { 
      id: 234, 
      item_name: "EXTRA MUTTON(8PCS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJrlcfInaxLrNR942HJFH19hR23hT2Eeb2Dg&s", 
      price: 279,
    },
    ] 
//VegBiryani
const VegBiryani= [
    { 
      id: 238, 
      item_name: "FULL VEG BIRYANI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLDQsSxJCFPT-pBQTKKcxcSt7whWhU2MmYPA&s", 
      price: 280, 
    },
    { 
      id: 239, 
      item_name: "VEG.FAMILY PACK", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3aVonZfHbeyYv3SmIy_cXL-CXXXpHlL02MA&s", 
      price: 420, 
    },
    { 
      id: 240, 
      item_name: "VEG.JUMBO PACK", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrc6N92-1Yh4jy24cBYYOveanZiUYzSBqJ4g&s", 
      price: 520, 
    },
    { 
      id: 241, 
      item_name: "FULL VEG.MANCHURIA BIRYANI", 
      imgURL: "https://i0.wp.com/cookingfromheart.com/wp-content/uploads/2021/10/Gobi-Fried-Rice-2.jpg?resize=720%2C960&ssl=1", 
      price: 300,
    },
    { 
      id: 242, 
      item_name: "FULL KAJU BIRYANI", 
      imgURL: "https://assets.cntraveller.in/photos/60ba209d591f977adc9778e2/master/w_1600%2Cc_limit/mushroombiryani-440x587.jpg", 
      price: 250, 
    },
    { 
      id: 243, 
      item_name: "BIRYANI RICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB3_3iGxKiPjHMlcvMNbwAm02Mqfs7gJxz8A&s", 
      price: 200,
    },
    ]
//EggBiryani
const EggBiryani= [
    { 
      id: 248, 
      item_name: "EGG BIRYANI(2 BOILED EGGS)", 
      imgURL: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/02/instant-pot-egg-biryani.jpg", 
      price: 169, 
    },
    { 
      id: 249, 
      item_name: "EGG FAMILY PACK(6 BOILED EGGS)", 
      imgURL: "https://kadhaikhana.com/wp-content/uploads/2023/05/Egg-Biryani-family-pack.jpg", 
      price: 300, 
    },
    { 
      id: 250, 
      item_name: "EGG JUMBO PACK(10 BOILED EGGS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7mjITLI0dUqlLwHkOYmXM7kKNFLKhlkpeWg&s", 
      price: 500, 
    },
    ]
//PaneerBiryani
const PaneerBiryani= [
    { 
      id: 251, 
      item_name: "FULL PANEER BIRYANI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd7-FereO4XCoXwXSlCv1XJJ6K3eNH4gqO5Q&s", 
      price: 299,
    },
    ]
//
const SeaFoodBiryani= [
    { 
      id: 252, 
      item_name: "FISH BIRYANI", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbA5ker6SIkqXLkWeJ9lY_qGVZUnfdsnREkg&s", 
      price: 329, 
    },
    { 
      id: 253, 
      item_name: "PRAWNS BIRYANI", 
      imgURL: "https://images.slurrp.com/prod/recipe_images/transcribe/main%20course/Prawn-Biryani.webp", 
      price: 399, 
    },
]   

//Desserts
const Deserts= [
    { 
      id: 254, 
      item_name: "DOUBLE KA MEETHA", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMA1UFkLeEDtJ_-DYBZ5QRFlPs7tXRj3KjtA&s", 
      price: 130, 
    },
    { 
      id: 255, 
      item_name: "KADDU KI KHEER", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4ew66g38TYl28-BvkXaUt6o2AG-C9ODxNPQ&s", 
      price: 130,
    },
    { 
      id: 256, 
      item_name: "GULAB JAMUN(KHOWA 4 PCS)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ6nGerqkR51BFeMG2GWmzUqm47ljJUEZs-g&s", 
      price: 130,
    },
    { 
      id: 257, 
      item_name: "APRICORT DELIGHT", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxgwgRyKMlRRAdC3OHrSRklMSY6LutIfWtVQ&s", 
      price: 170,
    },
    { 
      id: 258, 
      item_name: "SITAPHAL DELIGHT", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Pj4C22zwd5NujyrJJ5SxeFZqnWeNybQe1A&s", 
      price: 180,
    },
    ]

//Mocktails
const Mocktails= [
    { 
      id: 259, 
      item_name: "VIRGIN MOJITO", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdZqToAa_vhrSWh7mhtyzMVdGozS0WdbWs0Q&s", 
      price: 149,
    },
    { 
      id: 260, 
      item_name: "BLUE BERRY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZXLqmM1Xgcw5sBKdQm7El5OVFwJmDZ2N4mg&s", 
      price: 149, 
    },
    { 
      id: 261, 
      item_name: "WATER MELON", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScoRebUM4tD-AfRuaAFAfjxGX6SCtWXPI_vw&s", 
      price: 149,
    },
    { 
      id: 262, 
      item_name: "STRAWBEERY", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEqip9wWO5wPHU4CB_pI3Ol-WrYA4DB-UGBQ&s", 
      price: 149,
    },
    { 
      id: 263, 
      item_name: "GREEN APPLE", 
      imgURL: "https://monin.in/cdn/shop/files/GreenApplecooler_1.png?v=1684575403", 
      price: 149, 
    },
    { 
      id: 264, 
      item_name: "ORANGE", 
      imgURL: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Rupal_Patel/Orange_Mocktail_400.jpg", 
      price: 149,
    },
    { 
      id: 265, 
      item_name: "SPECIAL BLUE ANGLE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD5BaYEN_NtRz2b9dxuJD2uItv9SB-A03y2Q&s", 
      price: 199,
    },
    { 
      id: 266, 
      item_name: "SPECIAL FALL IN LOVE", 
      imgURL: "https://mocktail.net/wp-content/uploads/2022/01/Love-Mocktail_2-ig.jpg", 
      price: 199,
    },
    { 
      id: 267, 
      item_name: "FRESH LIME JUICE", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSXco1btvmA5FhW7ZsINMdJ4C5CVeYjofCfg&s", 
      price: 60,
    },
    ]
//
const SoftDrinks= [
  { 
    id: 268, 
    item_name: "MINERAL WATER", 
    imgURL: "https://cdn.zeptonow.com/production/ik-seo/tr:w-640,ar-745-753,pr-true,f-auto,q-80/inventory/product/a51660b1-2c61-406e-a545-2794596bf5b3-1hofpeFKQgmoDTQh9vfRhqSsY8S3uikBx/Kinley-Packaged-Drinking-Water.jpeg", 
    price: 20,
  },
  { 
    id: 269, 
    item_name: "SOFT DRINKS", 
    imgURL: "https://media.istockphoto.com/id/533575209/photo/soft-drink-being-poured-into-glass.jpg?s=612x612&w=0&k=20&c=OPfGgxIkH_6j-ozfWol5RxypTAIZSmkR3NL-qsJ7_Qk=", 
    price: 25,
  },
  ]
//Lassi
const Lassi = [{
        id: 270,
        item_name: "MANGO LASSI",
        imgURL: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/mango-lassi-recipe.jpg",
        price: 110,
    },
    {
        id: 271,
        item_name: "SPECIAL LASSI",
        imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO_Y0jVhc1pFEymPD-PuKwTlAUCidoXbDhSw&s",
        price: 130,
    },
    {
        id: 272,
        item_name: "STRAWBEERY LASSI",
        imgURL: "https://masalaandchai.com/wp-content/uploads/2022/07/Strawberry-Lassi-500x500.jpg",
        price: 110,
    },
]

//Handi
//biriyaniHandi
const biriyaniHandi = [
    {
      id: 1,
      item_name: "CHICKEN HANDI 30 MEMBERS",
      imgURL: "https://purendesi.in/wp-content/uploads/2024/12/Andhra-Style-Chicken-Biryani.jpg",
      price: 4500,
    },
    {
      id: 2,
      item_name: "CHICKEN HANDI 40 MEMBERS",
      imgURL: "https://purendesi.in/wp-content/uploads/2024/12/Andhra-Style-Chicken-Biryani.jpg",
      price: 5500,
    },
    {
      id: 3,
      item_name: "CHICKEN HANDI 50 MEMBERS",
      imgURL: "https://purendesi.in/wp-content/uploads/2024/12/Andhra-Style-Chicken-Biryani.jpg",
      price: 6800,
    },
    {
      id: 4,
      item_name: "MUTTON HANDI 30 MEMBERS",
      imgURL: "https://infinitybiryani.com/wp-content/uploads/2024/09/Mutton-Fry-Biryani-800x800.webp",
      price: 5700,
    },
    {
      id: 5,
      item_name: "MUTTON HANDI 40 MEMBERS",
      imgURL: "https://infinitybiryani.com/wp-content/uploads/2024/09/Mutton-Fry-Biryani-800x800.webp",
      price: 6800,
    },
    {
      id: 6,
      item_name: "MUTTON HANDI 50 MEMBERS",
      imgURL: "https://infinitybiryani.com/wp-content/uploads/2024/09/Mutton-Fry-Biryani-800x800.webp",
      price: 8800,
    },
    {
      id: 7,
      item_name: "VEG HANDI 30 MEMBERS",
      imgURL: "https://www.terrafood.co.in/cdn/shop/files/VegBiryani.jpg?crop=center&height=2048&v=1687766592&width=2048",
      price: 4200,
    },
    {
      id: 8,
      item_name: "VEG HANDI 40 MEMBERS",
      imgURL: "https://www.terrafood.co.in/cdn/shop/files/VegBiryani.jpg?crop=center&height=2048&v=1687766592&width=2048",
      price: 5200,
    },
    {
      id: 9,
      item_name: "VEG HANDI 50 MEMBERS",
      imgURL: "https://www.terrafood.co.in/cdn/shop/files/VegBiryani.jpg?crop=center&height=2048&v=1687766592&width=2048",
      price: 6200,
    },
    {
      id: 10,
      item_name: "EXTRA MUTTON (1KG)",
      imgURL: "https://static.toiimg.com/thumb/84667091.cms?width=1200&height=900",
      price: 1300,
    },
    {
      id: 11,
      item_name: "EXTRA CHICKEN (1 BIRD)",
      imgURL: "https://maharajaroyaldining.com/wp-content/uploads/2024/03/Tandoori-Chicken-3.webp",
      price: 500,
    },
  ];
//SplChikenHandiItems
const SplChikenHandiItems = [
    { 
      id: 223, 
      item_name: "SPL.MINI CHICKEN HANDI BIRYANI (WITH CHICKEN-65 + 1 BOILED EGG)", 
      imgURL: "https://cdn.uengage.io/uploads/7057/image-3459-1699547229.jpg", 
      price:299, 
    },
    { 
      id: 224,
      item_name: "COUPLE PACK CHICKEN HANDI BIRYANI(2 PERSONS) (CHICKEN-65 + 2 BOILED EGG)", 
      imgURL: "https://cdn.uengage.io/uploads/23764/image-1724-1728124575.jpg", 
      price: 399, 
    },
    { 
      id: 225, 
      item_name: "PARTY PACK CHICKEN HANDI BIRYANI(3 PERSONS) (CHICKEN-65 + 3 BOILED EGG)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1djFWBk_qWmQ4xlvLobn16efAkPLElRlWng&s", 
      price: 499, 
    },
    { 
      id: 226,
      item_name: "SUPREME PARTY PACK CHICKEN HANDI BIRYANI(6 PERSONS) (FULL CHICKEN-65 + 4 BOILED EGGS) ", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4O5gJPZ733DNXzWUdhyvtyFV-jywac-xmQ&s",  
      price: 949, 
    },
    { 
      id: 227, 
      item_name: "MIXED FAMILY PACK(CHICKEN & MUTTON)", 
      imgURL: "https://cdn.uengage.io/uploads/23764/image-7363-1707820507.jpg", 
      price: 599,
    },
    { 
      id: 228, 
      item_name: "MIX JUMBO PACK(CHICKEN & MUTTON)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScuugsPdEFiLTI-lnOcnQcoN4cZ4rHYT0Vjw&s", 
      price: 1049, 
    },
    ]
//SplMuttonHandiItems
const SplMuttonHandiItems= [
    { 
      id: 235, 
      item_name: "COUPLE PACK MUTTON HANDI BIRYANI (2 PERSONS) (CHICKEN-65 + 2 BOILED EGG)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBjoQb0J7L8bf-xya2M5v29HyHR9WqB0LMIQ&s", 
      price: 499, 
    },
    { 
      id: 236, 
      item_name: "PARTY PACK MUTTON HANDI BIRYANI(3 PERSONS) (CHICKEN-65 + 3 BOILED EGG)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBAtOgR66JA_gw0CxfWQWuOGQ8npo_PBAepA&s", 
      price: 599, 
    },
    { 
      id: 237, 
      item_name: "SUPREME PACK MUTTON HANDI BIRYANI(6-8 PERSONS) (FULL CHICKEN-65 + 4 BOILED EGG)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVC3tFrUDaE0lDQjGzxuAM5fZ_AaDNJzD4CQ&s", 
      price: 1499, 
    },
    ]
//SplVegHandiItems
const SplVegHandiItems= [
    { 
      id: 244, 
      item_name: "SPL.MINI VEG HANDI BIRYANI (SOME PCS OF VEG. MANCHURIA)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSns3R8AcHF8rRyCLi9ZSAfyZi3qckAUovVeg&s", 
      price: 220,
    },
    { 
      id: 245, 
      item_name: "COUPLE PACK VEG HANDI BIRYANI (2 PERSONS) (WITH HALF VEG. MANCHURIA)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJ2h31dR4ggcMY-SCgnSaFJBgFnypXoWbjQ&s", 
      price: 300, 
    },
    { 
      id: 246, 
      item_name: "PARTY PACK VEG HANDI BIRYANI(3 PERSONS) (WITH HALF VEG. MANCHURIA)", 
      imgURL: "https://deliverfood2me.in/wp-content/uploads/2023/08/Veg-Biryani-Mix-Veg-Manchurian-Top.jpg", 
      price: 350,
    },
    { 
      id: 247, 
      item_name: "SUPREME PACK VEG HANDI BIRYANI(6 PERSONS) (FULL VEG. MANCHURIA-GRAVY/WET)", 
      imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwvYYsPR3o1u3jG_ZlR5C3isN75s90kTaROg&s", 
      price: 600, 
    },
    ]
  

function createMenuItems(container, items) {
    items.forEach((item) => {
        let menuItemBox = document.createElement("div");
        menuItemBox.classList.add("menu-item-box");

        let img = document.createElement("img");
        img.src = item.imgURL;
        img.classList.add("img");

        let menuItemDes = document.createElement("div");
        menuItemDes.classList.add("menu-item-des");

        let itemName = document.createElement("h1");
        itemName.classList.add("menu-item-name");
        itemName.textContent = item.item_name;

        let priceCart = document.createElement("div");
        priceCart.classList.add("price-cart");

        let itemPrice = document.createElement("p");
        itemPrice.classList.add("menu-item-price");
        itemPrice.textContent = `${item.price}/-`;

        let cartIcon = document.createElement("i");
        cartIcon.classList.add("fa", "fa-shopping-cart", "cart");

        priceCart.appendChild(itemPrice);
        priceCart.appendChild(cartIcon);
        menuItemDes.appendChild(itemName);
        menuItemDes.appendChild(priceCart);
        menuItemBox.appendChild(img);
        menuItemBox.appendChild(menuItemDes);

        container.appendChild(menuItemBox);
    });
}


if (vegSoupContainer) {
    createMenuItems(vegSoupContainer, vegSoupItems);
    createMenuItems(nonVegSoupContainer, nonVegSoupItems);
}

if(vegStartersContainer){
createMenuItems(vegStartersContainer, vegStarters);
createMenuItems(nonVegChickenContainer, ChickenStarters);
createMenuItems(nonVegSeaFoodContainer, FishStarters);
}

// Biriyani  Items Append

if(CHICKENBIRIYANIContainer){
    createMenuItems(CHICKENBIRIYANIContainer,ChickenBiryani);
    createMenuItems(MUTTONBIRIYANIContainer, MuttonBiryani);
    createMenuItems(VEGBIRIYANIContainer,VegBiryani); 
    createMenuItems(EGGBIRIYANIContainer, EggBiryani);
    createMenuItems(SEAFOODBiriyaniContainer, SeaFoodBiryani);
    createMenuItems(PANNERBIRIYANIContainer, PaneerBiryani);
}

//Kabab Items Append
if(MuttonKebabsContainer){
    createMenuItems(MuttonKebabsContainer, Mutton);
    createMenuItems(ChickenKebabsContainer, Chicken);
    createMenuItems(FishPrawnsKebabsContainer, FishPrawnsKEBABS);
    createMenuItems(PaneerKebabsContainer, PANEER);
    createMenuItems(RotisKababContainer, ROTISKabab);   
}

//Platters Items Append
if(ChickenPlatterContainer){
    createMenuItems(ChickenPlatterContainer, Chiken_Platter);
    createMenuItems(TandoorPlatterContainer, Tandoori_Platter);
    createMenuItems(SeaFoodPlatterContainer, SeaFood_Platter);
    createMenuItems(ChinesePlatterContainer, ChineeseMixed_Platter);   
}

//Fried Rice Items Append
if (VegFriedRiceContainer) {
    createMenuItems(VegFriedRiceContainer, VegFriedRice);
    createMenuItems(NonVegFriedRiceContainer,NonVegFriedRice);
}

//Noodles  Items Append
if (VegNoodlesContainer) {
    createMenuItems(VegNoodlesContainer, VegNoodles);
    createMenuItems(NonVegNoodlesContainer, NonVegNoodles);
}

//Pulao Item Append
if (VegPulaoContainer) {
    createMenuItems(VegPulaoContainer, VegPulao);
    createMenuItems(ShawarmaContainer, Shawarma);
    createMenuItems(ChopSueyContainer, ChopSuey);
}

//Handi Item Append
if (BiryaniHandiContainer) {
    createMenuItems(BiryaniHandiContainer,biriyaniHandi);
    createMenuItems(SplChikenHandiContainer, SplChikenHandiItems);
    createMenuItems(SplMuttonHandiContainer,SplMuttonHandiItems);
    createMenuItems(SplVegHandiContainer, SplVegHandiItems);
}

//Desserts Item Append
if (DessertsContainer) {
    createMenuItems(DessertsContainer, Deserts);
    createMenuItems(MocktailsContainer, Mocktails);
    createMenuItems(SoftDrinksContainer, SoftDrinks);
    createMenuItems(LassiContainer, Lassi);
}

//Curries Item Append
if (ChickenBoneContainer) {
    createMenuItems(ChickenBoneContainer, ChickenBone);
    createMenuItems(ChickenBonelessContainer, ChickenBoneless);
    createMenuItems(MuttonContainer, MUTOONBone);
    createMenuItems(PrawnsContainer, PRAWNS);
    createMenuItems(VegCurriesContainer, VegCurries);
    createMenuItems(FishCurriesContainer, FishCurries);
}
