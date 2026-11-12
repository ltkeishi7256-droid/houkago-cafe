(function () {
  const grid = document.querySelector('#product-grid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const trayButton = document.querySelector('.tray-button');
  const trayCount = document.querySelector('.tray-button__count');
  const toast = document.querySelector('.toast');
  let selectedFilter = 'all';
  let itemCount = 0;
  let toastTimer;

  function formatPrice(price) {
    return `${price.toLocaleString('ja-JP')}円`;
  }

  function renderProducts() {
    const visibleProducts = selectedFilter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === selectedFilter);

    if (visibleProducts.length === 0) {
      grid.innerHTML = '<p class="empty-state">商品は準備中です。</p>';
      return;
    }

    grid.innerHTML = visibleProducts.map((product) => `
      <article class="product-card">
        <div class="product-card__image-wrap">
          <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-card__tag">${product.category === 'drink' ? 'ドリンク' : 'おやつ'}</span>
        </div>
        <div class="product-card__body">
          <div class="product-card__title-row">
            <h3 class="product-card__title">${product.name}</h3>
            <p class="product-card__price">${formatPrice(product.price)}</p>
          </div>
          <p class="product-card__description">${product.description}</p>
          <button class="product-card__add" type="button" data-product="${product.id}" aria-label="${product.name}をおやつトレイに追加">
            <span aria-hidden="true">＋</span> トレイに追加
          </button>
        </div>
      </article>
    `).join('');
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectedFilter = tab.dataset.filter;
      filterTabs.forEach((filterTab) => {
        const isSelected = filterTab === tab;
        filterTab.classList.toggle('is-active', isSelected);
        filterTab.setAttribute('aria-pressed', String(isSelected));
      });
      renderProducts();
    });
  });

  grid.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-product]');
    if (!addButton) return;

    const product = PRODUCTS.find((item) => item.id === addButton.dataset.product);
    if (!product) return;
    itemCount += 1;
    trayCount.textContent = String(itemCount);
    trayButton.setAttribute('aria-label', `おやつトレイ、${itemCount}点`);
    showToast(`${product.name}をトレイに追加しました`);
  });

  trayButton.addEventListener('click', () => {
    showToast(itemCount ? `トレイに${itemCount}点入っています` : '気になるおやつを追加してね');
  });

  renderProducts();
}());