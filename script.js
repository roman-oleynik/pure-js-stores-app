/**Stores stores' and products' data and makes HTTP-requests.
 * @constructor
 */
class Model {
    constructor() {
        const _URLToStores = "http://localhost:4000/stores";
        this.getURLToStores = () => _URLToStores;
        const _URLToProducts = "http://localhost:4000/rel_Products";
        this.getURLToProducts = () => _URLToProducts;
        let _STORES = []; // Variable that contains an actual local copy of stores' data in order to HTTP-requestless rendering (in case of using search bar).
        this.initStores = stores => _STORES = stores; // Assigns array of stores to the _STORES varialbe after fetching ones.
        this.getStores = () => _STORES;
        this.setStores = stores => _STORES = stores;
        let _PRODUCTS = []; // Variable that contains an actual local copy of products' data in order to HTTP-requestless rendering (in case of using search bar, sorting, filtration by "Status" property etc.).
        this.initProducts = products => _PRODUCTS = products; // Assigns array of products to the _PRODUCTS varialbe after fetching ones.
        this.getProducts = () => _PRODUCTS;
        this.setProducts = products => _PRODUCTS = products;
    };
    /** Makes a GET-request and assigns a result to the _STORES variable. 
     * @returns - Object of the Model class.
    */
    fetchStores() {
        return fetch(this.getURLToStores())
			.then((data) => data.json())
            .then(data => {
                this.initStores(data);
                return this;
            })
    };
    /** Makes a POST-request and adds a result to the _STORES variable. 
     * @param {object} store - Hash that contains the new store's data.
     * @returns - Object of the Model class.
    */
    addStore(store) {
        return fetch(this.getURLToStores(), {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(store)
        })
        .then((data) => data.json())
        .then(data => {
            this.setStores([...this.getStores(), data]);
            return this;
        })
    };
    /** Makes a GET-request and assigns a result to the _PRODUCTS variable. 
     * @returns - Object of the Model class.
    */
    fetchProducts() {
        return fetch(this.getURLToProducts())
			.then((data) => data.json())
            .then(data => {
                this.initProducts(data);
                return this;
            })
    };
    /** Makes a POST-request and adds a result to the _PRODUCTS variable. 
     * @param {object} product - Hash that contains the new product's data.
     * @returns - Object of the Model class.
    */
    addProduct(product) {
        return fetch(this.getURLToProducts(), {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product)
        })
        .then((data) => data.json())
        .then(data => {
            this.setProducts([...this.getProducts(), data]);
            return this;
        })
    };
    /** Makes a PATCH-request and updates a result in the _PRODUCTS variable. 
     * @param {object} product - Hash that contains the product's data to update.
     * @returns - Object of the Model class.
    */
    editProduct(product) {
        return fetch(`${this.getURLToProducts()}/${product.id}`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product)
        })
        .then((data) => data.json())
        .then(data => {
            this.setProducts([...this.getProducts().filter(el => el.id !== product.id), data]);
            return this;
        })
    };
    /** Makes a DELETE-request and updates a result in the _PRODUCTS variable. 
     * @param {object} id - Identifier of product a user wants to delete.
     * @returns - Object of the Model class.
    */
    deleteProduct(id) {
        return fetch(`${this.getURLToProducts()}/${id}`, {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        })
        .then((data) => data.json())
        .then(data => {
            this.setProducts(this.getProducts().filter(product => product.id !== id));
            return this;
        })
    };
};

/**Stores all DOM-elements and controls their displaying in some cases. 
 * @constructor
*/
class View {
    /**Allows the Controller getting message toasts. */
    getMessages() {
        return {
            message_CP: document.querySelector(".message-after-creating-product"),
            message_DP: document.querySelector(".message-after-deleting-product"),
            message_EP: document.querySelector(".message-after-editing-product")
        };
    };
    /**Allows the Controller getting "Create a store" button. */
    getCSButton() {
        return document.querySelector(".stores-footer__create-button");
    };
    /**Allows the Controller getting "Create a store" dialog's controls. */
    getCSDialog() {
        return {
            container: document.querySelector(".add-store-modal__form"),
            cancel: document.querySelector(".add-store-modal__form-button_close")
        }
    };
    /**Allows the Controller getting "Stores list" container. */
    getStoresListCotainer() {
        return document.querySelector('.stores-list');
    };
    /**Allows the Controller getting "Store details" container. */
    getStoresDetailsCotainer() {
        return document.querySelector(".store-details-container");
    }
    /**Allows the Controller getting "Stores list's" "Search bar" controls. */
    getStoresSearchBar() {
        return {
            container: document.querySelector(".stores-list-form"),
            input: document.querySelector(".stores-list-form__text-input"),
            clearButton: document.querySelector(".stores-list-form__clear-button"),
            searchButton: document.querySelector(".stores-list-form__search-button")
        };
    };
    /**Allows the Controller getting "Products list's" "Search bar" controls. */
    getProductsSearchBar() {
        return {
            container: document.querySelector(".products-list-form"),
            input: document.querySelector(".products-list-form__text-input"),
            clearButton: document.querySelector(".products-list-form__clear-button"),
            searchButton: document.querySelector(".products-list-form__search-button")
        };
    };
    /**Allows the Controller getting "Icon tab bar's" controls. */
    getIconTabBar() {
        return {
            all: document.querySelector(".store-details-container__products-stats_all"),
            ok: document.querySelector(".store-details-container__products-stats_ok"),
            storage: document.querySelector(".store-details-container__products-stats_storage"),
            outOfStock: document.querySelector(".store-details-container__products-stats_out")
        };
    };
    /**Allows the Controller getting "Confirm of deleting" dialog's controls. */
    getConfirmDialog() {
        return {
            container: document.querySelector(".confirm-popup-container"),
            yes: document.querySelector(".confirm-popup__yes-button"),
            no: document.querySelector(".confirm-popup__no-button"),
        };
    };
    /**Allows the Controller getting the "Edit product" form and "Cancel" button. */
    getEPDialog() {
        return {
            container: document.querySelector(".edit-product-modal__form"),
            cancel: document.querySelector(".edit-product-modal__form-button_close")
        }
    }
    /**Allows the Controller getting "Edit product" dialog's inputs of a form. */
    getEPFormFields() {
        return {
            name: document.querySelector(".edit-product-modal__form-input_name"),
            price: document.querySelector(".edit-product-modal__form-input_price"),
            specs: document.querySelector(".edit-product-modal__form-input_specs"),
            rating: document.querySelector(".edit-product-modal__form-input_rating"),
            supplier: document.querySelector(".edit-product-modal__form-input_supplier"),
            madeIn: document.querySelector(".edit-product-modal__form-input_madein"),
            company: document.querySelector(".edit-product-modal__form-input_company")
        }
    };
    /**Allows the Controller getting the "Create product" form and "Cancel" button. */
    getCPDialog() {
        return {
            container: document.querySelector(".add-product-modal__form"),
            cancel: document.querySelector(".add-product-modal__form-button_close")
        }
    }
    /**Allows the Controller getting "Create product" dialog's inputs of a form. */
    getCPFormFields() {
        return {
            name: document.querySelector(".add-product-modal__form-input_name"),
            price: document.querySelector(".add-product-modal__form-input_price"),
            specs: document.querySelector(".add-product-modal__form-input_specs"),
            rating: document.querySelector(".add-product-modal__form-input_rating"),
            supplier: document.querySelector(".add-product-modal__form-input_supplier"),
            madeIn: document.querySelector(".add-product-modal__form-input_madein"),
            company: document.querySelector(".add-product-modal__form-input_company"),
            status: document.querySelector(".add-product-modal__select")
        }
    };
    /**Allows the Controller getting "Create store" dialog's inputs of a form. */
    getCSFormFields() {
        return {
            name: document.querySelector(".add-store-modal__form-input_name"),
            email: document.querySelector(".add-store-modal__form-input_email"),
            phoneNumber: document.querySelector(".add-store-modal__form-input_phone-num"),
            address:  document.querySelector(".add-store-modal__form-input_address"),
            established: document.querySelector(".add-store-modal__form-input_date"),
            floorArea:  document.querySelector(".add-store-modal__form-input_area")
        }
    };
    /**Makes the visibility of "Clear" button of "Stores search bar" hidden. */
    showClearButtonOfStoresSearchBar() {
        this.getStoresSearchBar().clearButton.style.display = "block";
    };
    /**Makes "Clear" button of "Stores search bar" visible. */
    hideClearButtonOfStoresSearchBar() {
        this.getStoresSearchBar().clearButton.style.display = "none";
    };
    /**Clears the input of "Stores search bar". */
    clearInputOfStoresSearchBar() {
        this.getStoresSearchBar().input.value = "";
    };
    /**
     * Converts store's data into the HTML-representation injecting there unique parameters.
     * @param {object} store - Object of a store.
     */
    getLayoutOfStore(store) {
        return `<a href="#/${store.id}" id="${store.id}" class="stores-list__store-item-link">
            <li class="stores-list__store-item">
                <div class="stores-list__store-item-title-container">
                    <h3 class="stores-list__store-item-title">${store.Name}</h3>
                    <span class="stores-list__store-item-area">${store.FloorArea}</span>
                </div>
                <address class="stores-list__store-item-address">${store.Address}</address>
            </li>
        </a>`
    };
    /**Clears the input of "Stores search bar". */
    getSortButtons() {
        return document.querySelectorAll('.sort-button');
    };
    /**Allows the Controller getting the "Delete" button of every product. */
    getDeleteButtons() {
        return document.querySelectorAll('.delete-product');
    };
    /**Allows the Controller getting the "Edit" button of every product. */
    getEditButtons() {
        return document.querySelectorAll('.edit-product');
    };
    /**
     * Converts product's data into the HTML-representation injecting there unique parameters.
     * @param {object} product - Object of a product.
     */
    getLayoutOfProduct(product) {
        return `<tr class="tbody-row">
            <td><span class="products-table__value products-table__value_name products-table__value_bold">${product.Name}</span></td>
            <td class="products-table__value products-table__value_price products-table__value_bold">${product.Price}</td>
            <td class="products-table__value products-table__value_specs">${product.Specs}</td>
            <td class="products-table__value products-table__value_supplier">${product.SupplierInfo}</td>
            <td class="products-table__value products-table__value_country">${product.MadeIn}</td>
            <td class="products-table__value products-table__value_company">${product.ProductionCompanyName}</td>
            <td class="products-table__value products-table__value_rating">
                <div class="rating-container">
                    <div class="star-rating">
                        <input type="radio" value="1" id='rating-${product.id}-1' ${product.Rating === 1 ? "checked" : ""} name="rating-${product.id}" class="star-input">
                        <label for="rating-${product.id}-1" class="rating-label"></label>
                            
                        <input type="radio" value="2" id='rating-${product.id}-2' ${product.Rating === 2 ? "checked" : ""} name="rating-${product.id}" class="star-input">
                        <label for="rating-${product.id}-2" class="rating-label"></label>
                            
                        <input type="radio" value="3" id='rating-${product.id}-3' ${product.Rating === 3 ? "checked" : ""} name="rating-${product.id}" class="star-input">
                        <label for="rating-${product.id}-3" class="rating-label"></label>
                            
                        <input type="radio" value="4" id='rating-${product.id}-4' ${product.Rating === 4 ? "checked" : ""} name="rating-${product.id}" class="star-input">
                        <label for="rating-${product.id}-4" class="rating-label"></label>
                            
                        <input type="radio" value="5" id='rating-${product.id}-5' ${product.Rating === 5 ? "checked" : ""} name="rating-${product.id}" class="star-input">
                        <label for="rating-${product.id}-5" class="rating-label"></label>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                    <button class="edit-product" data-id=${product.id}><i class="fas fa-pen"></i></button>
                    <button class="delete-product" data-id=${product.id}><i class="fas fa-times-circle"></i></button>
                </div>
            </td>
        </tr>`;
    };
    /**
     * Converts store's data into the HTML-representation of "Store's info bar" injecting there it's own parameters.
     * @param {object} store - Object of the selected store.
     */
    getStoreInfoLayout(store) {
        return  `<div class="store-details-container__store-info">
            <span class="store-details-container__store-info-email"><strong>Email: </strong>${store.Email}</span>
            <span class="store-details-container__store-info-phone"><strong>Phone number: </strong><a href="tel:+375333461232">${store.PhoneNumber}</a></span>
            <address class="store-details-container__store-info-address"><strong>Address: </strong>${store.Address}</address>
            <time class="store-details-container__store-info-date"><strong>Established date: </strong>${new Date(store.Established).toLocaleDateString()}</time>
            <span class="store-details-container__store-info-area"><strong>Floor area: </strong>${store.FloorArea}</span>
        </div>`;
    };
    /**Gets the "Expand" and "Pin" buttons. */
    getExpandPinButtons() {
        return `<div class="store-details-container__collapse-pin-container">
            <button class="store-details-container__collapse-button"><i class="fas fa-chevron-up"></i></button>
            <button class="store-details-container__pin-button"><i class="fas fa-thumbtack"></i></button>
        </div>`;
    };
    /**
     * Returns HTML-representation of "icon tab bar" and injects the information about the amount of products 
     * by "Status" property and what filtration's option is activated now. 
     * @param {array} products - Array of all products that are owned by the selected store.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    getIconTabBarLayout(products, iconTabBarConfig = {selected: "All"}) {
        return `<div class="store-details-container__products-stats">
            <span class="store-details-container__products-stats_all ${iconTabBarConfig.selected === "All" ? "store-details-container__products-stats_all_selected" : ""}">
                <strong class="stats-bold">${products.length}</strong> 
                All
            </span>
            <span class="store-details-container__border"></span>
            <div class="store-details-container__products-stats_ok ${iconTabBarConfig.selected === "OK" ? "store-details-container__products-stats_ok_selected" : ""}">
                <span class="products-stats-ok__after">${products.filter(product => product.Status === "OK").length}</span>
                <i class="fas fa-check-square"></i>
            </div>
            <div class="store-details-container__products-stats_storage ${iconTabBarConfig.selected === "STORAGE" ? "store-details-container__products-stats_storage_selected" : ""}">
                <span class="products-stats-storage__after">${products.filter(product => product.Status === "STORAGE").length}</span>
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="store-details-container__products-stats_out ${iconTabBarConfig.selected === "OUT_OF_STOCK" ? "store-details-container__products-stats_out_selected" : ""}">
                <span class="products-stats-out__after">${products.filter(product => product.Status === "OUT_OF_STOCK").length}</span>
                <i class="fas fa-exclamation-circle"></i>
            </div>
        </div>`
    };
    /**Gets the "Store details'" footer. */
    getFooter() {
        return `<footer class="store-details__footer">
            <button class="products-footer__create-button"><i class="fas fa-plus"></i> Create</button>
            <button class="products-footer__delete-button"><i class="fas fa-trash"></i> Delete</button>
        </footer>`;
    };
    /**
     * Renders the "Store details" section and inserts there the app's state. 
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    renderStoreDetails(store, allProducts, products, sortParams = { sortCategory: "Name", sortMode: "Default"}, iconTabBarConfig = {selected: "All"}) {
        this.getStoresDetailsCotainer().innerHTML = `
            <h2 class="store-details-container__title">Store details</h2>
            ${this.getStoreInfoLayout(store)}
            ${this.getExpandPinButtons()}
            ${this.getIconTabBarLayout(allProducts, iconTabBarConfig)}
            <table class="products-table">
            <thead>
                <tr class="thead-row">
                    <th colspan="7" class="products-table__title">
                        Products
                        <form class="products-list-form">
                            <input type="text" class="products-list-form__text-input" value="" placeholder="Search">
                            <button class="products-list-form__clear-button"><i class="fas fa-times-circle"></i></button>
                            <input type="submit" class="products-list-form__search-button" value="&#128270">
                        </form>    
                    </th>
                </tr>
                <tr class="thead-row">
                    <th class="products-table__category products-table__category_name">
                        <button class="sort-button" data-sort-category="Name" data-sort-mode=${sortParams.sortCategory === "Name" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Name" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Name" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"}
                        </button>
                        Name
                    </th>
                    <th class="products-table__category products-table__category_price">
                        <button class="sort-button" data-sort-category="Price" data-sort-mode=${sortParams.sortCategory === "Price" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Price" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Price" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"}
                        </button>
                        Price
                    </th>
                    <th class="products-table__category products-table__category_specs">
                        <button class="sort-button" data-sort-category="Specs" data-sort-mode=${sortParams.sortCategory === "Specs" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Specs" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Specs" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"}      
                        </button>
                        Specs
                    </th>
                    <th class="products-table__category products-table__category_supplier">
                        <button class="sort-button" data-sort-category="Supplier" data-sort-mode=${sortParams.sortCategory === "Supplier" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Supplier" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Supplier" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"}
                        </button>
                        Supplier info
                    </th>
                    <th class="products-table__category products-table__category_country">
                        <button class="sort-button" data-sort-category="Country" data-sort-mode=${sortParams.sortCategory === "Country" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Country" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Country" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"}
                        </button>  
                        Country of origin
                    </th>
                    <th class="products-table__category products-table__category_company">
                        <button class="sort-button" data-sort-category="Company" data-sort-mode=${sortParams.sortCategory === "Company" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Company" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Company" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"} 
                        </button>  
                        Prod. company
                    </th>
                    <th class="products-table__category products-table__category_rating">
                        <button class="sort-button" data-sort-category="Rating" data-sort-mode=${sortParams.sortCategory === "Rating" ? sortParams.sortMode : "Default"}>
                            ${sortParams.sortCategory === "Rating" && sortParams.sortMode === "Desc" ? "<i class='fas fa-sort-down'></i>" : sortParams.sortCategory === "Rating" && sortParams.sortMode === "Asc" ? "<i class='fas fa-sort-up'></i>" : "<i class='fas fa-sort'></i>"}
                        </button>
                        Rating
                    </th>
                </tr>    
            </thead>
            <tbody>
                ${
                    iconTabBarConfig.selected === "All"
                    ?
                    products.length && products
                        .map(product => this.getLayoutOfProduct(product))
                        .reduce((product1, product2) => product1 + product2)
                    :
                    iconTabBarConfig.selected !== "All"
                    ?
                    products.length && products
                        .filter(product => product.Status === iconTabBarConfig.selected)
                        .map(product => this.getLayoutOfProduct(product))
                        .reduce((product1, product2) => product1 + product2)
                    :
                    null
                }
            </tbody>                    
        </table>
        ${this.getFooter()}
        `;
    }
    /**Renders the current stores' list.
     * @param {array} stores - Array of stores.
     */
    renderStoresList(stores) {
        if (stores === null) {
            this.getStoresListCotainer().innerHTML = "Not Found";
            return;
        } else {
            this.getStoresListCotainer().innerHTML = stores.map(store => this.getLayoutOfStore(store)).reduce((store1, store2) => {
                return store1 + store2;
            });
        }
    }
    /**
     * Runs a preloader in the selected container
     * @param {HTMLElement} container - Container that is preloaded.
     */
    preload(container) {
        container.innerHTML = `<img class="preloader_lg" src="img/preloader.gif" alt="Loading...">`;
    };
    /**
     * Shows the message after the successful operation of creating, editing or deleting.
     * @param {HTMLElement} selector - an optional message toast.
     */
    showMessage(selector) {
        selector.classList.add('message-active');
        setTimeout(() => {
            selector.classList.remove('message-active');
        }, 3000);
    };
    /**Opens the "Create store" dialog. */
    openCSPopup() {
        document.querySelector(".add-store-modal-container").style.display = "flex";
    };
    /**Closes the "Create store" dialog. */
    closeCSPopup() {
        this.getCSDialog().container.reset();
        document.querySelector(".add-store-modal-container").style.display = "none";
    };
    /**Shows the button that resets the products' search input. */
    showClearButtonOfProductsSearchForm() {
        this.getProductsSearchBar().clearButton.style.display = "block";
    };
    /**Hides the button that resets the products' search input. */
    hideClearButtonOfProductsSearchForm() {
        this.getProductsSearchBar().clearButton.style.display = "none";
    };
    /**Resets the products' search input. */
    clearInputOfProductsSearchForm() {
        this.getProductsSearchBar().input.value = "";
    };
    /**Opens the "Confirm" dialog. */
    openConfirmPopup() {
        this.getConfirmDialog().container.style.display = "flex";
    };
    /**Closes the "Confirm" dialog. */
    closeConfirmPopup() {
        this.getConfirmDialog().container.style.display = "none";
    };
    /**Opens the "Edit product" dialog. */
    openEPPopup() {
        document.querySelector(".edit-product-modal-container").style.display = "flex";
    };
    /**Closes the "Edit product" dialog. */
    closeEPPopup() {
        this.getEPDialog().container.reset();
        document.querySelector(".edit-product-modal-container").style.display = "none";
    };
    /**Opens the "Create product" popup. */
    openCPPopup() {
        document.querySelector(".add-product-modal-container").style.display = "flex";
    };
    /**Closes the "Create product" popup. */
    closeCPPopup() {
        this.getCPDialog().container.reset();
        document.querySelector(".add-product-modal-container").style.display = "none";
    };
};

/**
 * Controls the View and Model.
 * @param {object} view - The instance of View class.
 * @param {object} model - The instance of Model class.
 */
class Controller {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        let _routes = []; // stores all routes in the app.
        /**
         * Pushes all stores' routes after their fetching.
         * @param {array} stores - Array of stores.
         */
        this.initRoutes = (stores) => {
            const routesOfStore = stores.map(store => {
                return {url: String(store.id), execute: (store, products) => {
                    const allProductsOfStore = this.model.getProducts().filter(product => product.storeId === store.id);
                    this.view.renderStoreDetails(store, allProductsOfStore, products)
                }};
            });
            _routes = [
                {
                    url: '*incorrect*', execute: () => {
                        document.querySelector(".wrapper").innerHTML = "Store not found! Redirecting..."
                        setTimeout(() => {window.location.href = "";}, 1000)
                    }
                },
                {
                    url: '', execute: () => {
                        this.renderStoresList(this._STORES);
                    }
                },
                ...routesOfStore
            ]
        };
        this.getRoutes = () => _routes;
        /**
         * Adds a route after creating a new store.
         * @param {object} store - Object of the created store.
         */
        this.addRoute = store => {
            _routes = [...this.getRoutes(), 
                {
                    url: String(store.id), 
                    execute: (store, products) => {
                        const allProductsOfStore = this.model.getProducts().filter(product => product.storeId === store.id);
                        this.view.renderStoreDetails(store, allProductsOfStore, products);
                    }
                }
            ];
        }
    };
    /**
     * 1) Adds listeners on routes' changing
     * 2) Loads stores and executes the adding ones to _routes
     * 3) Adds listeners to "Stores list" controls.
     */
    async init() {
        // 1)
        window.addEventListener("popstate", () => this.executeRoute(this.getRoute()));
        // 2)
        const stores = await this.model.fetchStores();
        this.initRoutes(stores.getStores());
        this.view.renderStoresList(stores.getStores());
        this.executeRoute(this.getRoute());
        // 3)
        this.view.getStoresSearchBar().container.onsubmit = (EO) => {
            EO.preventDefault();
            const inputValue = this.view.getStoresSearchBar().input.value;
            this.onStoresSearchBarActive(inputValue);
        };
        this.view.getStoresSearchBar().clearButton.onclick = (EO) => {
            EO.preventDefault();
            this.onStoresSearchBarInactive();
        };
        this.view.getStoresSearchBar().input.oninput = (EO) => {
            const inputValue = EO.target.value;
            if (inputValue === "") {
                this.view.hideClearButtonOfStoresSearchBar();
            } else {
                this.view.showClearButtonOfStoresSearchBar();
            }
        };
        this.view.getCSButton().onclick = () => {
            this.view.openCSPopup();
            this.addListenersToCSForm();
        };
    };
    /**
     * Reads the current URL and finds the suitable route. 
     * @returns - Current route object.
    */
    getRoute() {
        const hash = window.location.hash.substr(2).replace(/\//ig, '/');
        const currentRoute = this.getRoutes().find(route => route.url === hash) || this.getRoutes()[0];
        return currentRoute;
    };
    /**
     * Runs a preloader then get all necessary data from Model, executes the route and adds listeners to the interface to interract with it.
     * @param {object} route - Route that has got from the "getRoute" function.
     */
    async executeRoute(route) {
        if (route.url === "" || route.url === "*incorrect*") {
            route.execute();
        } else {
            this.view.preload(this.view.getStoresDetailsCotainer());
            const store = this.model.getStores().find(store => String(store.id) === route.url);
            
            await this.model.fetchProducts();
            
            const productsOfCurrentStore = this.model.getProducts().filter(product => product.storeId === store.id);
            route.execute(store, productsOfCurrentStore);
            this.addListenersToActiveElementsInStoreDetails(store, productsOfCurrentStore, productsOfCurrentStore)
        }
    };
    /** Handles the "click" and "submit" events of "Create a store" form. */
    addListenersToCSForm() {
        this.view.getCSDialog().cancel.onclick = (EO) => {
            EO.preventDefault();
            this.view.closeCSPopup();
        };
        this.view.getCSDialog().container.onsubmit = (EO) => {
            EO.preventDefault();
            this.submitCSFormData();            
        };
    };
    /** Submits new store's data and renders updated stores' list. */
    async submitCSFormData() {
        const newStore = {
            Name: this.view.getCSFormFields().name.value,
            Email: this.view.getCSFormFields().email.value,
            PhoneNumber: this.view.getCSFormFields().phoneNumber.value,
            Address: this.view.getCSFormFields().address.value,
            Established: this.view.getCSFormFields().established.value,
            FloorArea:  this.view.getCSFormFields().floorArea.value,
            id: Math.floor(Math.random()*10000) + 10
        };
        this.view.preload(this.view.getStoresListCotainer());
        this.view.closeCSPopup();

        await this.model.addStore(newStore);

        this.addRoute(newStore);
        this.view.renderStoresList(this.model.getStores());        
    };
    /**
     * Gets the value of "Stores' search" input and renders the matched stores.
     * @param {string} inputValue - Value of "Stores' search" input. 
     */
    onStoresSearchBarActive(inputValue) {
        const filteredStores = this.model.getStores().filter(store => {
            if (isNaN(Number(inputValue))) { // search by store's name criteria
                return store.Name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
            } else {                         // search by floor area criteria
                return store.FloorArea.toString().indexOf(inputValue) !== -1;
            }
        }); 
        if (!filteredStores.length) {
            this.view.renderStoresList(null);
        } else {
            this.view.renderStoresList(filteredStores);
        }
    };
    /**Clears "Stores' search" input value and renders the full list of stores. */
    onStoresSearchBarInactive() {
        this.view.clearInputOfStoresSearchBar();
        this.view.renderStoresList(this.model.getStores());
        this.view.hideClearButtonOfStoresSearchBar();
    };
    /**
     * Adds listeners to all rerendered interactive elements. It's required because after rendering all event handlers destroy
     * due to rendering mechanics (all DOM-elemtnts of "Store Details" erase and create from scratch).
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToActiveElementsInStoreDetails(store, allProductsOfStore, products, sortParams = { sortCategory: "Name", sortMode: "Default"}, iconTabBarConfig = {selected: "All"}) {
        this.addListenersToSortButtons(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
        this.addListenersToIconTabBar(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
        this.addListenersToDPButtons(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
        this.addListenersToEPButtons(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
        this.addListenerToCPButton(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
        this.addListenersToProductsSearchForm(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
    };
    /**
     * Adds listeners to "Products' search" bar.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToProductsSearchForm(store, allProductsOfStore, products, sortParams, iconTabBarConfig) {
        /**Stores the actual value of the input. */
        let inputValue = "";
        /**Shows the reset button when user is focused on the search input */
        this.view.getProductsSearchBar().input.onfocus = () => {
            this.view.showClearButtonOfProductsSearchForm();
        };
        /**Writes the value of input to the inputValue variable and controls the visibility of reset button. */
        this.view.getProductsSearchBar().input.oninput = (EO) => {
            inputValue = EO.target.value;
            if (inputValue === "") {
                this.view.hideClearButtonOfProductsSearchForm();
            } else {
                this.view.showClearButtonOfProductsSearchForm();
            }
        };
        /**Filters stores by value of inputValue variable and renders the result. */
        this.view.getProductsSearchBar().container.onsubmit = (EO) => {
            EO.preventDefault();
            const filteredProducts = products.filter(product => product.Name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);
            this.view.renderStoreDetails(store, allProductsOfStore, filteredProducts, sortParams, iconTabBarConfig);
        };
        /**Executes the clearing actions and renders the full list of products. */
        this.view.getProductsSearchBar().clearButton.onclick = (EO) => {
            EO.preventDefault();
            inputValue = "";
            this.view.clearInputOfProductsSearchForm();
            this.view.renderStoreDetails(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
            this.view.hideClearButtonOfProductsSearchForm();
        };
    };
    /**
     * Adds listeners to "Products' sort" bar.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToSortButtons(store, allProducts, products, sortParams = { sortCategory: "Name", sortMode: "Default"}, iconTabBarConfig = {selected: "All"}) {
        this.view.getSortButtons().forEach(button => {
            button.onclick = (EO) => {
                const dataset = EO.target.parentNode.dataset; 
                /**Sets the "Default" sort mode to every button except a clicked button. */
                this.view.getSortButtons().forEach(button => {
                    if (button.dataset.sortCategory !== dataset.sortCategory) {
                        button.dataset.sortMode = "Default"; // reset all sort buttons to the default state except the active one
                    }
                });
                /**Forming the sortConfig object. */
                switch (dataset.sortMode) {
                    case "Default":
                        dataset.sortMode = "Asc";
                        break;
                    case "Asc":
                        dataset.sortMode = "Desc";
                        break;
                    case "Desc": 
                        dataset.sortMode = "Default";
                        break;
                    default: 
                        break;
                }
                const sortConfig = {
                    sortCategory: dataset.sortCategory, 
                    sortMode: dataset.sortMode
                };
                /**Returns the sorted array of products */
                const sortedData = this.sortStoreDetails(store, products, sortConfig, iconTabBarConfig);

                /**Renders the sorted list of products. */
                this.view.renderStoreDetails(store, allProducts, sortedData, sortConfig, iconTabBarConfig);
                this.addListenersToActiveElementsInStoreDetails(store, allProducts, sortedData, sortConfig, iconTabBarConfig)
            };
        });
    }
    /**
     * Adds listeners to "Products' sort" bar including "iconTabBarConfig" options.
     * @param {object} store - Current store.
     * @param {array} products - Array of all products that are owned by the selected store.
     * @param {{sortCategory: string, sortMode: string}} sortConfig - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    sortStoreDetails(store, products, sortConfig, iconTabBarConfig) {
        const unsortedProducts = [...this.model.getProducts().filter(product => product.storeId === store.id)];
        const productsCopy = [...products];
        if (sortConfig.sortCategory === "Name") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 0);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => a.Name.toLowerCase() < b.Name.toLowerCase() ? 1 : a.Name.toLowerCase() > b.Name.toLowerCase() ? -1 : 0);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            } 
        } else if (sortConfig.sortCategory === "Price") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.Price - b.Price);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => b.Price - a.Price);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            }        
        } else if (sortConfig.sortCategory === "Specs") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.Specs.toLowerCase() > b.Specs.toLowerCase() ? 1 : a.Specs.toLowerCase() < b.Specs.toLowerCase() ? -1 : 0);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => a.Specs.toLowerCase() < b.Specs.toLowerCase() ? 1 : a.Specs.toLowerCase() > b.Specs.toLowerCase() ? -1 : 0);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            } 
        } else if (sortConfig.sortCategory === "Supplier") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.SupplierInfo.toLowerCase() > b.SupplierInfo.toLowerCase() ? 1 : a.SupplierInfo.toLowerCase() < b.SupplierInfo.toLowerCase() ? -1 : 0);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => a.SupplierInfo.toLowerCase() < b.SupplierInfo.toLowerCase() ? 1 : a.SupplierInfo.toLowerCase() > b.SupplierInfo.toLowerCase() ? -1 : 0);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            }                                     
        } else if (sortConfig.sortCategory === "Country") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.MadeIn.toLowerCase() > b.MadeIn.toLowerCase() ? 1 : a.MadeIn.toLowerCase() < b.MadeIn.toLowerCase() ? -1 : 0);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => a.MadeIn.toLowerCase() < b.MadeIn.toLowerCase() ? 1 : a.MadeIn.toLowerCase() > b.MadeIn.toLowerCase() ? -1 : 0);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            }                                     
        } else if (sortConfig.sortCategory === "Company") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.ProductionCompanyName.toLowerCase() > b.ProductionCompanyName.toLowerCase() ? 1 : a.ProductionCompanyName.toLowerCase() < b.ProductionCompanyName.toLowerCase() ? -1 : 0);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => a.ProductionCompanyName.toLowerCase() < b.ProductionCompanyName.toLowerCase() ? 1 : a.ProductionCompanyName.toLowerCase() > b.ProductionCompanyName.toLowerCase() ? -1 : 0);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            }                                   
        } else if (sortConfig.sortCategory === "Rating") {
            if (sortConfig.sortMode === "Asc") {
                productsCopy.sort((a, b) => a.Rating - b.Rating);
            } else if (sortConfig.sortMode === "Desc") {
                productsCopy.sort((a, b) => b.Rating - a.Rating);
            } else {
                if (iconTabBarConfig.selected === "All") {
                    return unsortedProducts;
                } else {
                    return unsortedProducts.filter(product => product.Status === iconTabBarConfig.selected)
                }
            }                               
        }
        return productsCopy;
    };
    /**
     * Adds listeners to "icon tab bar" filters.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToIconTabBar(store, allProductsOfStore, products, sortData = { sortCategory: "Name", sortMode: "Default"}, iconTabBarConfig) {
        /**Creates the store's copy in order to do immutable changes of store's data. */
        const storeCopy = this.model.getStores().find(el => store.id === el.id);
        const allProductsOfCurrentStore = this.model.getProducts().filter(product => product.storeId === storeCopy.id);
        
        /**Renders all products the current store has on click the "All" button */
        this.view.getIconTabBar().all.onclick = () => {
            this.view.renderStoreDetails(storeCopy, allProductsOfCurrentStore, allProductsOfCurrentStore, sortData, {selected: "All"});
            this.addListenersToActiveElementsInStoreDetails(store, allProductsOfCurrentStore, allProductsOfCurrentStore, sortData, {selected: "All"})
        };
        /**Renders all products with OK status the current store has on click the "OK" button */
        this.view.getIconTabBar().ok.onclick = () => {
            const productsWithStatusOK = allProductsOfCurrentStore.filter(product => product.Status === "OK");
            this.view.renderStoreDetails(storeCopy, allProductsOfCurrentStore, productsWithStatusOK, sortData, {selected: "OK"});
            this.addListenersToActiveElementsInStoreDetails(store, allProductsOfCurrentStore, productsWithStatusOK, sortData, {selected: "OK"})
        };
        /**Renders all products with STORAGE status the current store has on click the "STORAGE" button */
        this.view.getIconTabBar().storage.onclick = () => {
            const productsWithStatusSTORAGE = allProductsOfCurrentStore.filter(product => product.Status === "STORAGE");
            this.view.renderStoreDetails(storeCopy, allProductsOfCurrentStore, productsWithStatusSTORAGE, sortData, {selected: "STORAGE"});
            this.addListenersToActiveElementsInStoreDetails(store, allProductsOfCurrentStore, productsWithStatusSTORAGE, sortData, {selected: "STORAGE"})
        };
        /**Renders all products with OUT_OF_STOCK status the current store has on click the "OUT_OF_STOCK" button */
        this.view.getIconTabBar().outOfStock.onclick = () => {
            const productsWithStatusOUT_OF_STOCK = allProductsOfCurrentStore.filter(product => product.Status === "OUT_OF_STOCK");
            this.view.renderStoreDetails(storeCopy, allProductsOfCurrentStore, productsWithStatusOUT_OF_STOCK, sortData, {selected: "OUT_OF_STOCK"});
            this.addListenersToActiveElementsInStoreDetails(store, allProductsOfCurrentStore, productsWithStatusOUT_OF_STOCK, sortData, {selected: "OUT_OF_STOCK"})
        };
        
    };
    /**
     * Adds listeners to "Delete product" buttons.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    async addListenersToDPButtons(store, allProductsOfStore, products, sortParams, iconTabBarConfig) {
        this.view.getDeleteButtons().forEach(button => button.addEventListener("click", (EO) => {
            /**Opens the popup of confirmation and is waiting for the click on "Yes" ot "No" button by user side. */
            this.view.openConfirmPopup();
            /**Also it makes a focus on "Yes" button. */
            this.view.getConfirmDialog().yes.focus();
            /**When a user has clicked "Yes": */
            this.view.getConfirmDialog().yes.onclick = async () => {
                /**The popup closes */
                this.closeConfirmPopup();
                /**A preloader runs */
                this.view.preload(this.view.getStoresDetailsCotainer());
                /**DELETE-request */
                await this.model.deleteProduct(EO.target.parentNode.dataset.id);
                /**The data for rendering is preparing... */
                const updatedProducts = allProductsOfStore.filter(product => product.id !== +EO.target.parentNode.dataset.id);
                const productsIncludingFilters = products.filter(product => product.id !== +EO.target.parentNode.dataset.id);
                /** ...and renders. */
                this.view.renderStoreDetails(store, updatedProducts, productsIncludingFilters, sortParams, {selected: "All"});
                this.addListenersToActiveElementsInStoreDetails(store, updatedProducts, updatedProducts, sortParams, {selected: "All"});
                /**In the end showing the message. */
                this.view.showMessage(this.view.getMessages().message_DP);
            };
            /**When a user clicks th "No" button the popup of confirmation closes. */
            this.view.getConfirmDialog().no.onclick = () => {
                this.view.closeConfirmPopup();
                return false;
            };
        }));
    };
    /**
     * Adds listeners to "Edit product" buttons for calling the dialog.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToEPButtons(store, allProductsOfStore, products, sortParams, iconTabBarConfig) {
        this.view.getEditButtons().forEach(button => {
            /**When user has clicked the "Edit" button: */
            button.onclick = (EO) => {
                /**The program finds the product a user has clicked */
                const productOnEditing = products.find(product => product.id === +EO.target.parentNode.dataset.id);
                /**Opens the popup. */
                this.view.openEPPopup();
                /**Pushes the current product's data to every input. */
                this.pushValuesIntoInputs(productOnEditing);
                /**And adds listeners to the form. */
                this.addListenersToEPForm(store, allProductsOfStore, products, sortParams, iconTabBarConfig, productOnEditing);
            };
        });
    };
    /**Pushes the current values of edited product into form fields. */
    pushValuesIntoInputs(product) {
        this.view.getEPFormFields().name.value = product.Name;
        this.view.getEPFormFields().price.value = product.Price;
        this.view.getEPFormFields().specs.value = product.Specs;
        this.view.getEPFormFields().supplier.value = product.SupplierInfo;
        this.view.getEPFormFields().madeIn.value = product.MadeIn;
        this.view.getEPFormFields().rating.value = product.Rating;
        this.view.getEPFormFields().company.value = product.ProductionCompanyName;
    };
    /**
     * Adds listeners to "Edit product" form's buttons.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToEPForm(store, allProductsOfStore, products, sortParams, iconTabBarConfig, productOnEditing) {
        /**Closes the popup on click. */
        this.view.getEPDialog().cancel.onclick = (EO) => {
            EO.preventDefault();
            this.view.closeEPPopup();
        };
        /**Submits the form dat. */
        this.view.getEPDialog().container.onsubmit = (EO) => {
            EO.preventDefault();
            this.submitEPFormData(store, allProductsOfStore, products, sortParams, iconTabBarConfig, productOnEditing);
        }
    };
    /**
     * Submits the edited product's data to a server via PATCH-request and renders edited products.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    async submitEPFormData(store, allProductsOfStore, products, sortParams, iconTabBarConfig, productOnEditing) {
        const productToEdit = {
            Name: document.querySelector(".edit-product-modal__form-input_name").value,
            Price: document.querySelector(".edit-product-modal__form-input_price").value,
            Photo: "https://s3.amazonaws.com/uifaces/faces/twitter/victorerixon/128.jpg",
            Specs: document.querySelector(".edit-product-modal__form-input_specs").value,
            Rating: +document.querySelector(".edit-product-modal__form-input_rating").value,
            SupplierInfo: document.querySelector(".edit-product-modal__form-input_supplier").value,
            MadeIn: document.querySelector(".edit-product-modal__form-input_madein").value,
            ProductionCompanyName: document.querySelector(".edit-product-modal__form-input_company").value,
            Status: document.querySelector(".edit-product-modal__select").value,
            storeId: store.id,
            id: productOnEditing.id
        };
        this.view.preload(this.view.getStoresDetailsCotainer());
        this.view.closeEPPopup(); //view

        await this.model.editProduct(productToEdit);

        /**Finds index of edited product to place it to the right place. */
        const editedProducts = this.model.getProducts().filter(el => el.storeId === productOnEditing.storeId);
        const indexOfEditedProduct = products.findIndex(el => el.id === productOnEditing.id)
        products[indexOfEditedProduct] = this.model.getProducts().find(el => el.id === productOnEditing.id);

        this.view.renderStoreDetails(store, editedProducts, products, sortParams, iconTabBarConfig);
        this.addListenersToActiveElementsInStoreDetails(store, editedProducts, products, sortParams, iconTabBarConfig);
        this.view.showMessage(this.view.getMessages().message_EP);
    };
    /**
     * Adds listener to the "Create product" button in a footer.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenerToCPButton(store, allProductsOfStore, products, sortParams, iconTabBarConfig) {
        document.querySelector(".products-footer__create-button").onclick = () => {
            this.view.openCPPopup();
            this.addListenersToCPForm(store, allProductsOfStore, products, sortParams, iconTabBarConfig);
        };
    }
    /**
     * Adds listeners to the "Create product" form.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    addListenersToCPForm(store, allProductsOfStore, products, sortParams, iconTabBarConfig) {
        /**Closes the popup on click the "Close" button. */
        this.view.getCPDialog().cancel.onclick = (EO) => {
            EO.preventDefault();
            this.view.closeCPPopup();
        };
        /**Sublits the form data on click the "Submit" button. */
        this.view.getCPDialog().container.onsubmit = (EO) => {
            EO.preventDefault();
            this.submitCPFormData(store, allProductsOfStore, products, sortParams, iconTabBarConfig);            
        };
    };
    /**
     * Submits the fresh product to a server and renders product's list.
     * @param {object} store - Current store.
     * @param {array} allProducts - Array of all products that are owned by the selected store.
     * @param {array} products - Array of products that is going to be rendered (includes the parameters of filtering).
     * @param {{sortCategory: string, sortMode: string}} sortParams - Parameters of sorting.
     * @param {{selected: string}} iconTabBarConfig - The "selected" parameter that has the information about selected "Status" of product ("All" by default).
     */
    async submitCPFormData(store, allProductsOfStore, products, sortParams, iconTabBarConfig) {
         /**Creates the newProduct object. */
         const newProduct = {
            Name: this.view.getCPFormFields().name.value,
            Price: this.view.getCPFormFields().price.value,
            Photo: "https://s3.amazonaws.com/uifaces/faces/twitter/victorerixon/128.jpg",
            Specs: this.view.getCPFormFields().specs.value,
            Rating: +this.view.getCPFormFields().rating.value,
            SupplierInfo: this.view.getCPFormFields().supplier.value,
            MadeIn: this.view.getCPFormFields().madeIn.value,
            ProductionCompanyName: this.view.getCPFormFields().company.value,
            Status:  this.view.getCPFormFields().status.value,
            storeId: store.id,
            id: Math.floor(Math.random()*10000) + 100
        };
        /**Closes the popup and runs the preloader. */
        this.view.closeCPPopup();
        this.view.preload(this.view.getStoresDetailsCotainer());
        
        await this.model.addProduct(newProduct);

        const updatedProducts = [...allProductsOfStore, newProduct];
        const updatedProductsIncludingFiltration = [...products, newProduct];

        this.view.renderStoreDetails(store, updatedProducts, updatedProductsIncludingFiltration, sortParams, iconTabBarConfig);
        this.addListenersToActiveElementsInStoreDetails(store, updatedProducts, updatedProductsIncludingFiltration, sortParams, iconTabBarConfig);
        
        this._showMessage(this.view.getMessages().message_CP);
    }
}


new Controller(new View, new Model()).init();