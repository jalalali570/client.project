/* =========================================================
   CAMERO TECHNOLOGY
   COMPLETE WEBSITE JAVASCRIPT
   SINGLE-PAGE CHECKOUT VERSION

   IMPORTANT:
   Replace your ENTIRE old JavaScript file with this file.
   Do NOT append this below the old JavaScript.
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL SETTINGS
   ========================================================= */

const CART_STORAGE_KEY = "cameroCart";
const WISHLIST_STORAGE_KEY = "cameroWishlist";

const OWNER_WHATSAPP = "923115593745";


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let cart = [];
let wishlist = [];


/* =========================================================
   LOAD LOCAL STORAGE
   ========================================================= */

function loadStoredData() {

    try {

        const savedCart =
            JSON.parse(
                localStorage.getItem(
                    CART_STORAGE_KEY
                )
            );

        cart =
            Array.isArray(savedCart)
                ? savedCart
                : [];

    }

    catch (error) {

        console.error(
            "Could not load cart:",
            error
        );

        cart = [];

    }


    try {

        const savedWishlist =
            JSON.parse(
                localStorage.getItem(
                    WISHLIST_STORAGE_KEY
                )
            );

        wishlist =
            Array.isArray(savedWishlist)
                ? savedWishlist
                : [];

    }

    catch (error) {

        console.error(
            "Could not load wishlist:",
            error
        );

        wishlist = [];

    }

}


/* =========================================================
   PRICE FORMAT
   ========================================================= */

function formatPrice(price) {

    return (
        "Rs. " +
        Number(price || 0).toLocaleString("en-PK")
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    }

    catch (error) {

        console.error(
            "Could not save cart:",
            error
        );

    }

}


/* =========================================================
   SAVE WISHLIST
   ========================================================= */

function saveWishlist() {

    try {

        localStorage.setItem(
            WISHLIST_STORAGE_KEY,
            JSON.stringify(wishlist)
        );

    }

    catch (error) {

        console.error(
            "Could not save wishlist:",
            error
        );

    }

}


/* =========================================================
   CART COUNT
   ========================================================= */

function getCartItemCount() {

    return cart.reduce(
        function (total, item) {

            return (
                total +
                Number(item.quantity || 0)
            );

        },
        0
    );

}


function updateCartCount() {

    const elements =
        document.querySelectorAll(
            ".cart-count"
        );

    const total =
        getCartItemCount();


    elements.forEach(
        function (element) {

            element.textContent =
                total;

        }
    );

}


/* =========================================================
   CART SUBTOTAL
   ========================================================= */

function getCartSubtotal() {

    return cart.reduce(
        function (total, item) {

            return (
                total +
                Number(item.price || 0) *
                Number(item.quantity || 0)
            );

        },
        0
    );

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productCard) {

    if (!productCard) {

        console.error(
            "Product card not found."
        );

        return false;

    }


    const productId =
        productCard.dataset.productId;


    const productName =
        productCard.dataset.productName ||
        productCard
            .querySelector("h3")
            ?.textContent
            .trim() ||
        "Product";


    const productPrice =
        Number(
            productCard.dataset.productPrice || 0
        );


    const productImage =
        productCard.dataset.productImage ||
        productCard
            .querySelector(
                ".product-image img"
            )
            ?.getAttribute("src") ||
        "";


    /* -----------------------------------------
       VALIDATE PRODUCT
       ----------------------------------------- */

    if (!productId) {

        console.error(
            "Product card is missing data-product-id:",
            productCard
        );

        return false;

    }


    /* -----------------------------------------
       FIND EXISTING PRODUCT
       ----------------------------------------- */

    const existingProduct =
        cart.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(productId)
                );

            }
        );


    /* -----------------------------------------
       INCREASE EXISTING PRODUCT
       ----------------------------------------- */

    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + 1;

    }


    /* -----------------------------------------
       ADD NEW PRODUCT
       ----------------------------------------- */

    else {

        cart.push({

            id: productId,

            name: productName,

            price: productPrice,

            image: productImage,

            quantity: 1

        });

    }


    /* -----------------------------------------
       SAVE / UPDATE
       ----------------------------------------- */

    saveCart();

    updateCartCount();

    renderCart();

    renderCheckoutPage();

    showCartMessage(
        productName
    );


    return true;

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            function (item) {

                return (
                    String(item.id) !==
                    String(productId)
                );

            }
        );


    saveCart();

    updateCartCount();

    renderCart();

    renderCheckoutPage();

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(
    productId,
    change
) {

    const product =
        cart.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(productId)
                );

            }
        );


    if (!product) {

        return;

    }


    product.quantity =
        Number(product.quantity || 0) +
        Number(change);


    if (product.quantity <= 0) {

        removeFromCart(
            productId
        );

        return;

    }


    saveCart();

    updateCartCount();

    renderCart();

    renderCheckoutPage();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    if (!cart.length) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmed) {

        return;

    }


    cart = [];


    saveCart();

    updateCartCount();

    renderCart();

    renderCheckoutPage();

}


/* =========================================================
   RENDER CART DRAWER
   ========================================================= */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const emptyCart =
        document.getElementById(
            "emptyCart"
        );


    const cartFooter =
        document.getElementById(
            "cartFooter"
        );


    if (!cartItems) {

        return;

    }


    cartItems.innerHTML =
        "";


    /* -----------------------------------------
       EMPTY CART
       ----------------------------------------- */

    if (!cart.length) {

        if (emptyCart) {

            emptyCart.style.display =
                "flex";

            emptyCart.classList.add(
                "show"
            );

        }


        if (cartFooter) {

            cartFooter.style.display =
                "none";

            cartFooter.classList.add(
                "hidden"
            );

        }


        updateCartSummary();

        return;

    }


    /* -----------------------------------------
       CART HAS PRODUCTS
       ----------------------------------------- */

    if (emptyCart) {

        emptyCart.style.display =
            "none";

        emptyCart.classList.remove(
            "show"
        );

    }


    if (cartFooter) {

        cartFooter.style.display =
            "block";

        cartFooter.classList.remove(
            "hidden"
        );

    }


    /* -----------------------------------------
       CREATE ITEMS
       ----------------------------------------- */

    cart.forEach(
        function (item) {

            const quantity =
                Number(
                    item.quantity || 0
                );


            const price =
                Number(
                    item.price || 0
                );


            const itemTotal =
                price * quantity;


            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.className =
                "cart-item";


            cartItem.dataset.productId =
                item.id;


            cartItem.innerHTML = `

                <div class="cart-item-image">

                    ${
                        item.image

                        ?

                        `
                        <img
                            src="${escapeHtml(item.image)}"
                            alt="${escapeHtml(item.name)}"
                            onerror="
                                this.style.display='none';
                                this.parentElement.classList.add('placeholder');
                            "
                        >
                        `

                        :

                        `
                        <i class="fa-solid fa-box"></i>
                        `
                    }

                </div>


                <div class="cart-item-info">

                    <span class="cart-item-category">
                        TECHNOLOGY PRODUCT
                    </span>


                    <h4>
                        ${escapeHtml(item.name)}
                    </h4>


                    <span class="cart-item-price">
                        ${formatPrice(price)}
                    </span>


                    <div class="cart-item-controls">

                        <button
                            class="quantity-minus"
                            type="button"
                            data-product-id="${escapeHtml(item.id)}"
                            aria-label="Decrease quantity"
                        >

                            <i class="fa-solid fa-minus"></i>

                        </button>


                        <span class="cart-item-quantity">
                            ${quantity}
                        </span>


                        <button
                            class="quantity-plus"
                            type="button"
                            data-product-id="${escapeHtml(item.id)}"
                            aria-label="Increase quantity"
                        >

                            <i class="fa-solid fa-plus"></i>

                        </button>


                        <button
                            class="remove-cart-item"
                            type="button"
                            data-product-id="${escapeHtml(item.id)}"
                            aria-label="Remove product"
                        >

                            <i class="fa-solid fa-trash-can"></i>

                        </button>

                    </div>


                    <strong class="cart-item-total">
                        ${formatPrice(itemTotal)}
                    </strong>

                </div>

            `;


            cartItems.appendChild(
                cartItem
            );

        }
    );


    updateCartSummary();

}


/* =========================================================
   UPDATE CART SUMMARY
   ========================================================= */

function updateCartSummary() {

    const totalItems =
        getCartItemCount();


    const subtotal =
        getCartSubtotal();


    const totalItemsElement =
        document.getElementById(
            "cartTotalItems"
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (totalItemsElement) {

        totalItemsElement.textContent =
            totalItems;

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(subtotal);

    }


    updateCartCount();

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!drawer) {

        console.warn(
            "Cart drawer #cartDrawer was not found."
        );

        return;

    }


    renderCart();


    drawer.classList.add(
        "active"
    );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    drawer.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (drawer) {

        drawer.classList.remove(
            "active"
        );

        drawer.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   CART SUCCESS MESSAGE
   ========================================================= */

function showCartMessage(
    productName
) {

    let message =
        document.getElementById(
            "cartAddedMessage"
        );


    if (!message) {

        message =
            document.createElement(
                "div"
            );


        message.id =
            "cartAddedMessage";


        message.className =
            "cart-added-message";


        document.body.appendChild(
            message
        );

    }


    message.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${escapeHtml(productName)}
            added to cart
        </span>

    `;


    message.classList.add(
        "show"
    );


    clearTimeout(
        window.cameroCartMessageTimer
    );


    window.cameroCartMessageTimer =
        setTimeout(
            function () {

                message.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   ADD BUTTON FEEDBACK
   ========================================================= */

function showAddButtonFeedback(
    button
) {

    if (!button) {

        return;

    }


    if (
        button.dataset.feedbackRunning ===
        "true"
    ) {

        return;

    }


    button.dataset.feedbackRunning =
        "true";


    const originalHTML =
        button.innerHTML;


    button.classList.add(
        "added"
    );


    button.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <span>
            ADDED
        </span>

    `;


    clearTimeout(
        button._feedbackTimer
    );


    button._feedbackTimer =
        setTimeout(
            function () {

                button.classList.remove(
                    "added"
                );


                button.innerHTML =
                    originalHTML;


                button.dataset.feedbackRunning =
                    "false";

            },
            1200
        );

}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWishlist(
    productCard
) {

    if (!productCard) {

        return;

    }


    const productId =
        productCard.dataset.productId;


    if (!productId) {

        return;

    }


    const button =
        productCard.querySelector(
            ".product-wishlist"
        );


    const icon =
        button?.querySelector("i");


    const existingIndex =
        wishlist.indexOf(
            productId
        );


    /* -----------------------------------------
       ADD
       ----------------------------------------- */

    if (existingIndex === -1) {

        wishlist.push(
            productId
        );


        if (button) {

            button.classList.add(
                "active"
            );

        }


        if (icon) {

            icon.classList.remove(
                "fa-regular"
            );

            icon.classList.add(
                "fa-solid"
            );

        }

    }


    /* -----------------------------------------
       REMOVE
       ----------------------------------------- */

    else {

        wishlist.splice(
            existingIndex,
            1
        );


        if (button) {

            button.classList.remove(
                "active"
            );

        }


        if (icon) {

            icon.classList.remove(
                "fa-solid"
            );

            icon.classList.add(
                "fa-regular"
            );

        }

    }


    saveWishlist();

    updateWishlistCount();

}


/* =========================================================
   WISHLIST COUNT
   ========================================================= */

function updateWishlistCount() {

    document
        .querySelectorAll(
            ".wishlist-count"
        )
        .forEach(
            function (element) {

                element.textContent =
                    wishlist.length;

            }
        );

}


/* =========================================================
   LOAD WISHLIST STATE
   ========================================================= */

function loadWishlistState() {

    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(
            function (card) {

                const productId =
                    card.dataset.productId;


                if (
                    !productId ||
                    !wishlist.includes(
                        productId
                    )
                ) {

                    return;

                }


                const button =
                    card.querySelector(
                        ".product-wishlist"
                    );


                const icon =
                    button?.querySelector("i");


                if (button) {

                    button.classList.add(
                        "active"
                    );

                }


                if (icon) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );

                }

            }
        );

}


/* =========================================================
   SEARCH
   ========================================================= */

function performSearch(
    searchTerm
) {

    const term =
        String(searchTerm || "")
            .toLowerCase()
            .trim();


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    let visibleProducts = 0;


    productCards.forEach(
        function (card) {

            const name =
                (
                    card.dataset.productName ||
                    card.querySelector("h3")?.textContent ||
                    ""
                )
                .toLowerCase();


            const category =
                (
                    card.querySelector(
                        ".product-category"
                    )?.textContent ||
                    ""
                )
                .toLowerCase();


            const searchableText =
                name +
                " " +
                category;


            const matches =
                term === "" ||
                searchableText.includes(
                    term
                );


            card.style.display =
                matches
                    ? ""
                    : "none";


            if (matches) {

                visibleProducts++;

            }

        }
    );


    showSearchResult(
        term,
        visibleProducts
    );

}


/* =========================================================
   SEARCH RESULT
   ========================================================= */

function showSearchResult(
    term,
    count
) {

    let result =
        document.getElementById(
            "searchResultMessage"
        );


    if (!term) {

        if (result) {

            result.remove();

        }

        return;

    }


    if (!result) {

        result =
            document.createElement(
                "div"
            );


        result.id =
            "searchResultMessage";


        result.className =
            "search-result-message";


        const section =
            document.querySelector(
                ".products-section"
            );


        if (section) {

            section.before(
                result
            );

        }

        else {

            document.body.prepend(
                result
            );

        }

    }


    result.innerHTML = `

        <strong>
            Search:
        </strong>

        "${escapeHtml(term)}"

        <span>
            ${count}
            product${count === 1 ? "" : "s"}
            found
        </span>

    `;

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    const menu =
        document.getElementById(
            "mainMenu"
        );


    if (
        !button ||
        !menu ||
        button.dataset.bound === "true"
    ) {

        return;

    }


    button.dataset.bound =
        "true";


    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            const isOpen =
                menu.classList.contains(
                    "active"
                ) ||
                menu.classList.contains(
                    "show"
                );


            menu.classList.toggle(
                "active",
                !isOpen
            );


            menu.classList.toggle(
                "show",
                !isOpen
            );


            button.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        }
    );


    menu.querySelectorAll(
        ".menu-link"
    ).forEach(
        function (link) {

            if (
                link.classList.contains(
                    "category-link"
                )
            ) {

                return;

            }


            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove(
                        "active",
                        "show"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   CATEGORY DROPDOWN
   ========================================================= */

function setupCategoryDropdown() {

    const categoryLink =
        document.querySelector(
            ".category-link"
        );


    const categoryDropdown =
        document.querySelector(
            ".category-dropdown"
        );


    if (
        !categoryLink ||
        !categoryDropdown ||
        categoryLink.dataset.bound === "true"
    ) {

        return;

    }


    categoryLink.dataset.bound =
        "true";


    categoryLink.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth <= 768
            ) {

                event.preventDefault();

                event.stopPropagation();


                const isOpen =
                    categoryDropdown.classList.contains(
                        "active"
                    ) ||
                    categoryDropdown.classList.contains(
                        "open"
                    );


                categoryDropdown.classList.toggle(
                    "active",
                    !isOpen
                );


                categoryDropdown.classList.toggle(
                    "open",
                    !isOpen
                );

            }

        }
    );

}


/* =========================================================
   OUTSIDE MENU CLOSE
   ========================================================= */

function setupOutsideMenuClose() {

    if (
        document.body.dataset.outsideMenuBound ===
        "true"
    ) {

        return;

    }


    document.body.dataset.outsideMenuBound =
        "true";


    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth > 768
            ) {

                return;

            }


            const menu =
                document.getElementById(
                    "mainMenu"
                );


            const button =
                document.getElementById(
                    "mobileMenuButton"
                );


            const dropdown =
                document.querySelector(
                    ".category-dropdown"
                );


            if (
                menu &&
                button &&
                !menu.contains(event.target) &&
                !button.contains(event.target)
            ) {

                menu.classList.remove(
                    "active",
                    "show"
                );


                button.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }


            if (
                dropdown &&
                !dropdown.contains(event.target)
            ) {

                dropdown.classList.remove(
                    "active",
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   TECHNOLOGY GLIDER
   ========================================================= */

function setupTechnologyGlider() {

    const glider =
        document.getElementById(
            "technologyGlider"
        );


    if (!glider) {

        return;

    }


    if (
        glider.dataset.cloned ===
        "true"
    ) {

        return;

    }


    const cards =
        Array.from(
            glider.children
        );


    if (!cards.length) {

        return;

    }


    glider.dataset.cloned =
        "true";


    cards.forEach(
        function (card) {

            const clone =
                card.cloneNode(
                    true
                );


            clone.setAttribute(
                "aria-hidden",
                "true"
            );


            glider.appendChild(
                clone
            );

        }
    );

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function setupSmoothScroll() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            function (link) {

                if (
                    link.dataset.smoothBound ===
                    "true"
                ) {

                    return;

                }


                link.dataset.smoothBound =
                    "true";


                link.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            event.preventDefault();


                            window.scrollTo({

                                top: 0,

                                behavior: "smooth"

                            });


                            return;

                        }


                        let target;


                        try {

                            target =
                                document.querySelector(
                                    targetId
                                );

                        }

                        catch (error) {

                            return;

                        }


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        target.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }
                );

            }
        );

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

    const button =
        document.querySelector(
            ".back-to-top"
        );


    if (
        !button ||
        button.dataset.bound === "true"
    ) {

        return;

    }


    button.dataset.bound =
        "true";


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   SEARCH SETUP
   ========================================================= */

function setupSearch() {

    const form =
        document.querySelector(
            ".search-form"
        );


    const input =
        document.getElementById(
            "searchInput"
        );


    if (
        !form ||
        !input ||
        form.dataset.bound === "true"
    ) {

        return;

    }


    form.dataset.bound =
        "true";


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            performSearch(
                input.value
            );


            const section =
                document.querySelector(
                    ".products-section"
                );


            if (section) {

                section.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        }
    );


    input.addEventListener(
        "input",
        function () {

            performSearch(
                input.value
            );

        }
    );

}


/* =========================================================
   CART EVENTS
   ========================================================= */

function setupCartEvents() {

    if (
        document.body.dataset.cartEventsBound ===
        "true"
    ) {

        return;

    }


    document.body.dataset.cartEventsBound =
        "true";


    document.addEventListener(
        "click",
        function (event) {

            /* ---------------------------------
               ADD TO CART
               --------------------------------- */

            const addButton =
                event.target.closest(
                    ".add-to-cart"
                );


            if (addButton) {

                event.preventDefault();


                const productCard =
                    addButton.closest(
                        ".product-card"
                    );


                if (!productCard) {

                    console.error(
                        "Add to cart button is not inside a product card."
                    );

                    return;

                }


                const added =
                    addToCart(
                        productCard
                    );


                if (added) {

                    showAddButtonFeedback(
                        addButton
                    );

                }


                return;

            }


            /* ---------------------------------
               OPEN CART
               --------------------------------- */

            const basketButton =
                event.target.closest(
                    ".cart-action"
                );


            if (basketButton) {

                event.preventDefault();


                openCart();


                return;

            }


            /* ---------------------------------
               PLUS
               --------------------------------- */

            const plusButton =
                event.target.closest(
                    ".quantity-plus"
                );


            if (plusButton) {

                event.preventDefault();


                changeQuantity(

                    plusButton.dataset.productId,

                    1

                );


                return;

            }


            /* ---------------------------------
               MINUS
               --------------------------------- */

            const minusButton =
                event.target.closest(
                    ".quantity-minus"
                );


            if (minusButton) {

                event.preventDefault();


                changeQuantity(

                    minusButton.dataset.productId,

                    -1

                );


                return;

            }


            /* ---------------------------------
               REMOVE
               --------------------------------- */

            const removeButton =
                event.target.closest(
                    ".remove-cart-item"
                );


            if (removeButton) {

                event.preventDefault();


                removeFromCart(
                    removeButton.dataset.productId
                );


                return;

            }


            /* ---------------------------------
               WISHLIST
               --------------------------------- */

            const wishlistButton =
                event.target.closest(
                    ".product-wishlist"
                );


            if (wishlistButton) {

                event.preventDefault();


                toggleWishlist(
                    wishlistButton.closest(
                        ".product-card"
                    )
                );


                return;

            }


            /* ---------------------------------
               CLOSE CART
               --------------------------------- */

            const closeButton =
                event.target.closest(
                    "#cartClose"
                );


            if (closeButton) {

                event.preventDefault();


                closeCart();


                return;

            }


            /* ---------------------------------
               CONTINUE SHOPPING
               --------------------------------- */

            const continueButton =
                event.target.closest(
                    "#continueShopping"
                );


            if (continueButton) {

                event.preventDefault();


                closeCart();


                return;

            }


            /* ---------------------------------
               CLEAR CART
               --------------------------------- */

            const clearButton =
                event.target.closest(
                    "#clearCartButton"
                );


            if (clearButton) {

                event.preventDefault();


                clearCart();


                return;

            }


            /* ---------------------------------
               CHECKOUT
               --------------------------------- */

            const checkoutButton =
                event.target.closest(
                    "#checkoutButton"
                );


            if (checkoutButton) {

                event.preventDefault();


                goToCheckout();


                return;

            }


            /* ---------------------------------
               CART OVERLAY
               --------------------------------- */

            if (
                event.target.id ===
                "cartOverlay"
            ) {

                closeCart();

                return;

            }


            /* ---------------------------------
               BACK TO SHOP
               --------------------------------- */

            const backToShop =
                event.target.closest(
                    "#backToShop"
                );


            if (backToShop) {

                event.preventDefault();


                goBackToShop();


                return;

            }

        }
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

function setupEscapeKey() {

    if (
        document.body.dataset.escapeBound ===
        "true"
    ) {

        return;

    }


    document.body.dataset.escapeBound =
        "true";


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeCart();


            const menu =
                document.getElementById(
                    "mainMenu"
                );


            const dropdown =
                document.querySelector(
                    ".category-dropdown"
                );


            const mobileButton =
                document.getElementById(
                    "mobileMenuButton"
                );


            if (menu) {

                menu.classList.remove(
                    "active",
                    "show"
                );

            }


            if (dropdown) {

                dropdown.classList.remove(
                    "active",
                    "open"
                );

            }


            if (mobileButton) {

                mobileButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   IMAGE FALLBACKS
   ========================================================= */

function setupImageFallbacks() {

    document
        .querySelectorAll(
            ".product-image img"
        )
        .forEach(
            function (image) {

                if (
                    image.dataset.fallbackBound ===
                    "true"
                ) {

                    return;

                }


                image.dataset.fallbackBound =
                    "true";


                image.addEventListener(
                    "error",
                    function () {

                        image.style.display =
                            "none";


                        const parent =
                            image.parentElement;


                        if (parent) {

                            parent.classList.add(
                                "image-placeholder"
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   SHOW CHECKOUT
   ========================================================= */

function goToCheckout() {

    /* -----------------------------------------
       CHECK EMPTY CART
       ----------------------------------------- */

    if (!cart.length) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;

    }


    const checkoutPage =
        document.getElementById(
            "checkoutPage"
        );


    if (!checkoutPage) {

        console.error(
            "Checkout page #checkoutPage was not found in the main HTML."
        );


        alert(
            "Checkout section was not found. Please make sure #checkoutPage exists in your HTML."
        );


        return;

    }


    /* -----------------------------------------
       CLOSE CART
       ----------------------------------------- */

    closeCart();


    /* -----------------------------------------
       HIDE HEADER
       ----------------------------------------- */

    const header =
        document.querySelector(
            "header"
        );


    if (header) {

        header.dataset.shopHidden =
            "true";

        header.style.display =
            "none";

    }


    /* -----------------------------------------
       HIDE FOOTER
       ----------------------------------------- */

    const footer =
        document.querySelector(
            "footer"
        );


    if (footer) {

        footer.dataset.shopHidden =
            "true";

        footer.style.display =
            "none";

    }


    /* -----------------------------------------
       IMPORTANT:
       DO NOT HIDE THE ENTIRE MAIN IF
       CHECKOUT IS INSIDE MAIN.
       ----------------------------------------- */

    const checkoutParent =
        checkoutPage.parentElement;


    if (checkoutParent) {

        Array.from(
            checkoutParent.children
        ).forEach(
            function (element) {

                if (
                    element !== checkoutPage
                ) {

                    element.dataset.checkoutHidden =
                        "true";

                    element.style.display =
                        "none";

                }

            }
        );

    }


    /* -----------------------------------------
       SHOW CHECKOUT
       ----------------------------------------- */

    checkoutPage.style.display =
        "block";


    checkoutPage.classList.add(
        "active"
    );


    document.body.classList.add(
        "checkout-mode"
    );


    /* -----------------------------------------
       RENDER CURRENT CART
       ----------------------------------------- */

    renderCheckoutPage();


    /* -----------------------------------------
       TOP OF PAGE
       ----------------------------------------- */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   RETURN TO SHOP
   ========================================================= */

function goBackToShop() {

    const checkoutPage =
        document.getElementById(
            "checkoutPage"
        );


    /* -----------------------------------------
       HIDE CHECKOUT
       ----------------------------------------- */

    if (checkoutPage) {

        checkoutPage.style.display =
            "none";

        checkoutPage.classList.remove(
            "active"
        );

    }


    /* -----------------------------------------
       RESTORE CHECKOUT PARENT CONTENT
       ----------------------------------------- */

    if (checkoutPage?.parentElement) {

        Array.from(
            checkoutPage.parentElement.children
        ).forEach(
            function (element) {

                if (
                    element !== checkoutPage &&
                    element.dataset.checkoutHidden ===
                    "true"
                ) {

                    element.style.display =
                        "";

                    delete element.dataset.checkoutHidden;

                }

            }
        );

    }


    /* -----------------------------------------
       RESTORE HEADER
       ----------------------------------------- */

    const header =
        document.querySelector(
            "header"
        );


    if (
        header &&
        header.dataset.shopHidden ===
        "true"
    ) {

        header.style.display =
            "";

        delete header.dataset.shopHidden;

    }


    /* -----------------------------------------
       RESTORE FOOTER
       ----------------------------------------- */

    const footer =
        document.querySelector(
            "footer"
        );


    if (
        footer &&
        footer.dataset.shopHidden ===
        "true"
    ) {

        footer.style.display =
            "";

        delete footer.dataset.shopHidden;

    }


    document.body.classList.remove(
        "checkout-mode"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   RENDER CHECKOUT
   ========================================================= */

function renderCheckoutPage() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );


    const checkoutSubtotal =
        document.getElementById(
            "checkoutSubtotal"
        );


    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    const checkoutItemCount =
        document.getElementById(
            "checkoutItemCount"
        );


    if (!checkoutItems) {

        return;

    }


    checkoutItems.innerHTML =
        "";


    /* -----------------------------------------
       EMPTY
       ----------------------------------------- */

    if (!cart.length) {

        checkoutItems.innerHTML = `

            <div class="checkout-empty">

                <i class="fa-solid fa-basket-shopping"></i>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Please add products before checkout.
                </p>

                <a
                    href="#"
                    id="emptyCheckoutBack"
                >
                    CONTINUE SHOPPING
                </a>

            </div>

        `;


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                "Rs. 0";

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                "Rs. 0";

        }


        if (checkoutItemCount) {

            checkoutItemCount.textContent =
                "0";

        }


        document
            .getElementById(
                "emptyCheckoutBack"
            )
            ?.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    goBackToShop();

                }
            );


        return;

    }


    /* -----------------------------------------
       CREATE CHECKOUT ITEMS
       ----------------------------------------- */

    cart.forEach(
        function (item) {

            const quantity =
                Number(
                    item.quantity || 0
                );


            const price =
                Number(
                    item.price || 0
                );


            const itemTotal =
                price * quantity;


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "checkout-product";


            element.innerHTML = `

                <div class="checkout-product-image">

                    ${
                        item.image

                        ?

                        `
                        <img
                            src="${escapeHtml(item.image)}"
                            alt="${escapeHtml(item.name)}"
                            onerror="
                                this.style.display='none';
                            "
                        >
                        `

                        :

                        `
                        <i class="fa-solid fa-box"></i>
                        `
                    }

                </div>


                <div class="checkout-product-info">

                    <h4>
                        ${escapeHtml(item.name)}
                    </h4>


                    <p>
                        ${formatPrice(price)}
                        ×
                        ${quantity}
                    </p>

                </div>


                <strong>
                    ${formatPrice(itemTotal)}
                </strong>

            `;


            checkoutItems.appendChild(
                element
            );

        }
    );


    /* -----------------------------------------
       UPDATE SUMMARY
       ----------------------------------------- */

    const subtotal =
        getCartSubtotal();


    const totalItems =
        getCartItemCount();


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatPrice(subtotal);

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(subtotal);

    }


    if (checkoutItemCount) {

        checkoutItemCount.textContent =
            totalItems;

    }

}


/* =========================================================
   CHECKOUT FORM
   ========================================================= */

function setupCheckoutForm() {

    const form =
        document.getElementById(
            "checkoutForm"
        );


    if (
        !form ||
        form.dataset.bound === "true"
    ) {

        return;

    }


    form.dataset.bound =
        "true";


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            submitOrder();

        }
    );

}


/* =========================================================
   SUBMIT ORDER
   ========================================================= */

function submitOrder() {

    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const customerName =
        document
            .getElementById(
                "customerName"
            )
            ?.value
            .trim() ||
        "";


    const customerPhone =
        document
            .getElementById(
                "customerPhone"
            )
            ?.value
            .trim() ||
        "";


    const customerAddress =
        document
            .getElementById(
                "customerAddress"
            )
            ?.value
            .trim() ||
        "";


    const customerCity =
        document
            .getElementById(
                "customerCity"
            )
            ?.value
            .trim() ||
        "";


    const customerNotes =
        document
            .getElementById(
                "customerNotes"
            )
            ?.value
            .trim() ||
        "";


    /* -----------------------------------------
       VALIDATION
       ----------------------------------------- */

    if (!customerName) {

        alert(
            "Please enter your name."
        );

        document
            .getElementById(
                "customerName"
            )
            ?.focus();

        return;

    }


    if (!customerPhone) {

        alert(
            "Please enter your phone number."
        );

        document
            .getElementById(
                "customerPhone"
            )
            ?.focus();

        return;

    }


    if (!customerAddress) {

        alert(
            "Please enter your delivery address."
        );

        document
            .getElementById(
                "customerAddress"
            )
            ?.focus();

        return;

    }


    if (!customerCity) {

        alert(
            "Please enter your city."
        );

        document
            .getElementById(
                "customerCity"
            )
            ?.focus();

        return;

    }


    /* -----------------------------------------
       ORDER NUMBER
       ----------------------------------------- */

    const orderNumber =
        "CT-" +
        Date.now()
            .toString()
            .slice(-8);


    /* -----------------------------------------
       BUILD PRODUCT MESSAGE
       ----------------------------------------- */

    let productMessage =
        "";


    cart.forEach(
        function (item, index) {

            const quantity =
                Number(
                    item.quantity || 0
                );


            const price =
                Number(
                    item.price || 0
                );


            const itemTotal =
                price * quantity;


            productMessage +=
                `${index + 1}. ${item.name}\n` +
                `Qty: ${quantity}\n` +
                `Price: ${formatPrice(price)}\n` +
                `Total: ${formatPrice(itemTotal)}\n\n`;

        }
    );


    const subtotal =
        getCartSubtotal();


    const itemCount =
        getCartItemCount();


    /* -----------------------------------------
       PAYMENT METHOD
       ----------------------------------------- */

    const paymentMethod =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value ||
        "Cash on Delivery";


    /* -----------------------------------------
       WHATSAPP MESSAGE
       ----------------------------------------- */

    const message =

`*NEW ORDER - CAMERO TECHNOLOGY*

Order No: ${orderNumber}

*CUSTOMER DETAILS*

Name: ${customerName}
Phone: ${customerPhone}
City: ${customerCity}
Address: ${customerAddress}
${customerNotes
    ? `Notes: ${customerNotes}\n`
    : ""}

*ORDER ITEMS*

${productMessage}

*ORDER SUMMARY*

Items: ${itemCount}
Subtotal: ${formatPrice(subtotal)}
Total: ${formatPrice(subtotal)}

Payment: ${paymentMethod}

Please confirm my order.

Thank you.
Camero Technology`;


    /* -----------------------------------------
       SAVE LAST ORDER
       ----------------------------------------- */

    const orderData = {

        orderNumber:

            orderNumber,


        customer: {

            name:
                customerName,

            phone:
                customerPhone,

            city:
                customerCity,

            address:
                customerAddress,

            notes:
                customerNotes

        },


        items:
            cart.map(
                function (item) {

                    return {
                        ...item
                    };

                }
            ),


        total:
            subtotal,


        paymentMethod:
            paymentMethod,


        date:
            new Date().toISOString()

    };


    try {

        localStorage.setItem(

            "cameroLastOrder",

            JSON.stringify(
                orderData
            )

        );

    }

    catch (error) {

        console.error(
            "Could not save order:",
            error
        );

    }


    /* -----------------------------------------
       WHATSAPP URL
       ----------------------------------------- */

    const whatsappURL =
        "https://wa.me/" +
        OWNER_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            message
        );


    /* -----------------------------------------
       CLEAR CART
       ----------------------------------------- */

    cart = [];


    saveCart();

    updateCartCount();

    renderCart();

    renderCheckoutPage();


    /* -----------------------------------------
       SUCCESS MESSAGE
       ----------------------------------------- */

    showOrderSuccess(
        orderNumber
    );


    /* -----------------------------------------
       OPEN WHATSAPP
       ----------------------------------------- */

    setTimeout(
        function () {

            window.location.href =
                whatsappURL;

        },
        1200
    );

}


/* =========================================================
   ORDER SUCCESS MESSAGE
   ========================================================= */

function showOrderSuccess(
    orderNumber
) {

    let success =
        document.getElementById(
            "orderSuccessMessage"
        );


    if (!success) {

        success =
            document.createElement(
                "div"
            );


        success.id =
            "orderSuccessMessage";


        success.className =
            "order-success-message";


        success.innerHTML = `

            <div class="order-success-box">

                <div class="order-success-icon">

                    <i class="fa-solid fa-check"></i>

                </div>


                <h2>
                    Order Ready!
                </h2>


                <p>

                    Your order

                    <strong>
                        ${escapeHtml(orderNumber)}
                    </strong>

                    is being sent to
                    Camero Technology
                    on WhatsApp.

                </p>


                <small>
                    Please wait...
                </small>

            </div>

        `;


        document.body.appendChild(
            success
        );

    }


    success.classList.add(
        "show"
    );

}


/* =========================================================
   INITIALIZE CHECKOUT
   ========================================================= */

function initializeCheckoutPage() {

    const checkoutPage =
        document.getElementById(
            "checkoutPage"
        );


    if (!checkoutPage) {

        console.warn(
            "No #checkoutPage found. Checkout section has not been added to the HTML yet."
        );

        return;

    }


    /*
       IMPORTANT:
       Checkout is hidden initially.
       We do NOT redirect to another HTML file.
    */

    checkoutPage.style.display =
        "none";


    renderCheckoutPage();

    setupCheckoutForm();

}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

function initializeWebsite() {

    console.log(
        "Camero Technology JavaScript loaded successfully."
    );


    /* -----------------------------------------
       LOAD DATA
       ----------------------------------------- */

    loadStoredData();


    /* -----------------------------------------
       CART
       ----------------------------------------- */

    updateCartCount();

    renderCart();


    /* -----------------------------------------
       WISHLIST
       ----------------------------------------- */

    updateWishlistCount();

    loadWishlistState();


    /* -----------------------------------------
       WEBSITE FEATURES
       ----------------------------------------- */

    setupCartEvents();

    setupMobileMenu();

    setupCategoryDropdown();

    setupOutsideMenuClose();

    setupTechnologyGlider();

    setupSmoothScroll();

    setupBackToTop();

    setupSearch();

    setupEscapeKey();

    setupImageFallbacks();


    /* -----------------------------------------
       CHECKOUT
       ----------------------------------------- */

    initializeCheckoutPage();


    console.log(
        "Camero Technology initialization complete."
    );

}


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite,
        {
            once: true
        }
    );

}

else {

    initializeWebsite();

}