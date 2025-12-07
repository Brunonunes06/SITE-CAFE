/**
 * Cafe Aroma - main.js (consolidated)
 * Replaces old, duplicated script.js
 */

const produtoData = [
  {
    id: 1,
    nome: "Café Especial Bourbon",
    categoria: "especiais",
    preco: 45.9,
    descricao: "Notas de chocolate e caramelo.",
    imagem:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    nome: "Café Gourmet Arábica",
    categoria: "gourmet",
    preco: 38.5,
    descricao: "Blend premium arábica.",
    imagem:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    nome: "Café Orgânico Sustentável",
    categoria: "organicos",
    preco: 52.0,
    descricao: "100% orgânico, sem agrotóxicos.",
    imagem:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    nome: "Café Catuaí",
    categoria: "especiais",
    preco: 41.9,
    descricao: "Sabor frutado.",
    imagem:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 5,
    nome: "Café Gourmet Sumatra",
    categoria: "gourmet",
    preco: 49.9,
    descricao: "Notas intensas, corpo encorpado e final persistente — origem Sumatra.",
    imagem:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80&ixlib=rb-4.0.3&fm=jpg&name=cafe_gourmet_sumatra.jpg",
    rating: 4.6,
    reviews: 54,
  },
];

const avaliacoesData = [
  {
    id: 1,
    produtoId: 1,
    nome: "Maria Silva",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
    cargo: "Empresária",
    texto: "O melhor café que já experimentei!",
    rating: 5,
  },
  {
    id: 2,
    produtoId: 2,
    nome: "João Santos",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    cargo: "Chef de Cozinha",
    texto: "Aroma incrível e sabor equilibrado.",
    rating: 5,
  },
  {
    id: 3,
    produtoId: 3,
    nome: "Ana Costa",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    cargo: "Barista",
    texto: "Grãos de alta qualidade.",
    rating: 5,
  },
];

let currentProductSlide = 0;
let productSlideInterval = null;
let lastFocusedElement = null;

const focusableSelectors =
  'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

function formatCurrency(v) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}
function makeStarsHTML(count) {
  const full = Math.round(count);
  return Array.from(
    { length: 5 },
    (_, i) =>
      `<span class=\"star ${i < full ? "filled" : ""}\">${
        i < full ? "★" : "☆"
      }</span>`
  ).join("");
}
function ratingLabel(n) {
  return (
    { 1: "Ruim", 2: "Regular", 3: "Bom", 4: "Muito Bom", 5: "Excelente" }[n] ||
    ""
  );
}

// Scroll-spy functionality
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  if (!navLinks.length || !sections.length) return;

  // Utility to set active link by section id
  function setActiveById(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        const isActive = targetId === id;
        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    });
  }

  // IntersectionObserver-based approach (more reliable than scrollY math)
  if ("IntersectionObserver" in window) {
    const observerOpts = {
      root: null,
      rootMargin: "-35% 0px -40% 0px", // roughly center of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    let visibleSections = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting) {
          visibleSections.set(id, entry.intersectionRatio);
        } else {
          visibleSections.delete(id);
        }
      });

      // Choose the most visible section
      if (visibleSections.size > 0) {
        let bestId = null;
        let bestRatio = 0;
        visibleSections.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActiveById(bestId);
      }
    }, observerOpts);

    sections.forEach((s) => observer.observe(s));
  } else {
    // Fallback to scroll-based approach
    function fallbackUpdate() {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = "";
      sections.forEach((section) => {
        const rectTop = section.offsetTop;
        const rectBottom = rectTop + section.offsetHeight;
        if (scrollPosition >= rectTop && scrollPosition < rectBottom) {
          currentSection = section.getAttribute("id");
        }
      });
      if (currentSection) setActiveById(currentSection);
    }
    window.addEventListener("scroll", throttle(fallbackUpdate, 100));
    fallbackUpdate();
  }

  // Ensure nav link clicks behave (smooth scroll and set active immediately)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          // Smooth scroll to section
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
          // Update active now (IntersectionObserver will confirm afterwards)
          setActiveById(targetId);
          // Update the URL hash without jumping (replaceState to avoid new history entry)
          try {
            history.replaceState(null, "", `#${targetId}`);
          } catch (e) {
            /* ignore */
          }
        }
      }
    });
  });

  // Helper: simple throttle
  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  // Initialize active state on load (maybe there is a hash)
  const initialHash = location.hash && location.hash.replace("#", "");
  if (initialHash) {
    const el = document.getElementById(initialHash);
    if (el) {
      // Scroll to element (if anchor), then set active
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveById(initialHash);
      }, 50);
    }
  } else {
    // If no hash, ensure the 'home' link is active by default
    setActiveById("home");
  }

  // Also listen to hashchange (e.g., external anchor links)
  window.addEventListener("hashchange", () => {
    const newHash = location.hash && location.hash.replace("#", "");
    if (newHash) {
      const el = document.getElementById(newHash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveById(newHash);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProdutos();
  initFilters();
  initProductModalControls();
  initReviewModalControls();
  initNavProdutosLink();
  initScrollSpy(); // Initialize scroll-spy
});
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const responseEl = document.getElementById("form-response");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const data = {
      nome: form.nome.value,
      email: form.email.value,
      assunto: form.assunto ? form.assunto.value : "Contato via site",
      mensagem: form.mensagem.value,
    };
    try {
      btn && (btn.disabled = true);
      responseEl && (responseEl.textContent = "Enviando...");
      const resp = await fetch("http://localhost:3000/api/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await resp.json();
      if (json && json.success) {
        responseEl &&
          (responseEl.textContent =
            json.message || "Mensagem enviada com sucesso!");
        form.reset();
        showToast("Mensagem enviada com sucesso!", "success");
      } else {
        responseEl &&
          (responseEl.textContent =
            json.message || "Erro ao enviar a mensagem.");
        showToast("Erro ao enviar mensagem", "error");
      }
    } catch (err) {
      console.error("Erro ao enviar formulário", err);
      responseEl && (responseEl.textContent = "Erro ao enviar a mensagem.");
      showToast("Erro ao enviar mensagem", "error");
    } finally {
      btn && (btn.disabled = false);
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  const cartBtn = document.getElementById("cart-btn");
  cartBtn &&
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCartPanel();
    });
  initContactForm();
});

// Search implementation
const searchInput = document.getElementById("search-products");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const items = q
      ? produtoData.filter(
          (p) =>
            p.nome.toLowerCase().includes(q) ||
            p.descricao.toLowerCase().includes(q)
        )
      : produtoData;
    renderProdutosFromArray(items);
  });
}

// Initialize navigation hamburger
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", (!expanded).toString());
    hamburger.classList.toggle("active");
    navMenu && navMenu.classList.toggle("active");
  });
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      hamburger.click();
    }
  });
}

function renderProdutos(filter = "todos") {
  const grid = document.getElementById("produtos-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const items =
    filter === "todos"
      ? produtoData
      : produtoData.filter((p) => p.categoria === filter);
  items.forEach((p, idx) => {
    const card = createProdutoCard(p);
    grid.appendChild(card);
    setTimeout(() => card.classList.add("show"), idx * 80);
  });
}
// Helper to render a list of products from an array
function renderProdutosFromArray(items) {
  const grid = document.getElementById("produtos-grid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!items || !items.length) {
    document.getElementById("produtos-empty").style.display = "block";
  } else {
    document.getElementById("produtos-empty").style.display = "none";
    items.forEach((p, idx) => {
      const card = createProdutoCard(p);
      grid.appendChild(card);
      setTimeout(() => card.classList.add("show"), idx * 80);
    });
  }
}

function createProdutoCard(prod) {
  const card = document.createElement("div");
  card.className = "produto-card";
  // Use loading=lazy for images, add aria label for actions
  // badges
  let badges = "";
  if (prod.categoria === "organicos")
    badges += `<span class='badge badge-organic'>Orgânico</span>`;
  if (prod.rating >= 4.8)
    badges += `<span class='badge badge-top'>Mais votado</span>`;

  card.innerHTML = `
    <div class='produto-image-wrap'>${badges}<img src=\"${
    prod.imagem
  }\" alt=\"${prod.nome}\" class=\"produto-image\" loading=\"lazy\"></div>
    <div class=\"produto-info\">
      <span class=\"produto-categoria\">${prod.categoria}</span>
      <h3 class=\"produto-nome\">${prod.nome}</h3>
      <p class=\"produto-descricao\">${prod.descricao}</p>
      <div class=\"produto-rating\">${makeStarsHTML(
        prod.rating
      )} <span class='rating-text'>${prod.rating} (${prod.reviews})</span></div>
      <div class='produto-preco'>${formatCurrency(prod.preco)}</div>
      <div class='produto-actions'>
        <button class='produto-btn' data-add='${
          prod.id
        }' aria-label=\"Adicionar ${
    prod.nome
  } ao carrinho\">Adicionar ao Carrinho</button>
        <button class='produto-btn btn-outline' data-review='${
          prod.id
        }' aria-label=\"Ver avaliações de ${prod.nome}\">Ver Avaliações</button>
      </div>
    </div>`;
  const img = card.querySelector(".produto-image");
  img &&
    img.addEventListener("click", () =>
      openProductsModal(produtoData.findIndex((x) => x.id === prod.id))
    );
  const add = card.querySelector("[data-add]");
  add && add.addEventListener("click", () => addToCart(prod.id, 1));
  const rev = card.querySelector("[data-review]");
  rev && rev.addEventListener("click", () => openReviewsModal(prod.id));
  return card;
}

function initFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach((b) => {
    b.setAttribute("role", "tab");
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      btns.forEach((x) => {
        x.classList.remove("active");
        x.setAttribute("aria-pressed", "false");
      });
      b.classList.add("active");
      b.setAttribute("aria-pressed", "true");
      renderProdutos(b.dataset.filter || "todos");
    });
  });
}
function adicionarAoCarrinho(id) {
  addToCart(id, 1);
}

// Mini cart (localStorage)
const CART_KEY = "cafearoma_cart_v1";
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}
// Normaliza dados do carrinho (garante numbers) e migra chaves antigas
function initCartFromStorage() {
  // Robust normalization/migration of persisted cart data
  try {
    const altKey = localStorage.getItem("cafearoma_cart");
    if (!localStorage.getItem(CART_KEY) && altKey) {
      localStorage.setItem(CART_KEY, altKey);
    }

    const rawStr = localStorage.getItem(CART_KEY);
    let raw = null;
    try {
      raw = JSON.parse(rawStr || "null");
    } catch (e) {
      // parsing failed; we'll attempt simple recovery from string formats below
      raw = null;
    }

    let normalized = [];

    const extractId = (it) => {
      if (it == null) return null;
      if (typeof it === "number") return Number(it);
      if (typeof it === "string" && /^\d+$/.test(it)) return Number(it);
      if (typeof it === "object") {
        const keys = ["id", "productId", "produtoId", "produto_id", "produto", "codigo"];
        for (const k of keys) if (k in it) return Number(it[k]);
        // fallback: first numeric property
        for (const k of Object.keys(it)) {
          const v = Number(it[k]);
          if (!isNaN(v)) return v;
        }
      }
      return null;
    };

    const extractQty = (it) => {
      if (it == null) return 1;
      if (typeof it === "number") return Math.max(0, Number(it) || 0);
      if (typeof it === "string" && /^\d+$/.test(it)) return Number(it);
      if (typeof it === "object") {
        const keys = ["qty", "quantity", "quantidade", "q", "amount", "count"];
        for (const k of keys) if (k in it) return Math.max(0, Number(it[k]) || 0);
        // fallback: try to find a key that looks like a count
        for (const k of Object.keys(it)) {
          if (k.toLowerCase().includes("qty") || k.toLowerCase().includes("quant") || k.toLowerCase().includes("count")) {
            const v = Number(it[k]);
            if (!isNaN(v)) return Math.max(0, v);
          }
        }
      }
      return 1;
    };

    if (Array.isArray(raw)) {
      // raw can be array of numbers, array of objects, or array of ids
      raw.forEach((it) => {
        if (typeof it === "number" || typeof it === "string") {
          const id = extractId(it);
          if (id != null) normalized.push({ id, qty: 1 });
        } else if (typeof it === "object") {
          const id = extractId(it);
          const qty = extractQty(it);
          if (id != null && qty > 0) normalized.push({ id, qty });
        }
      });
    } else if (raw && typeof raw === "object") {
      // could be map of id->qty: { "1": 2, "3": 1 }
      const numericKeys = Object.keys(raw).filter((k) => /^\d+$/.test(k));
      if (numericKeys.length > 0) {
        numericKeys.forEach((k) => {
          const id = Number(k);
          const qty = Math.max(0, Number(raw[k]) || 0);
          if (qty > 0) normalized.push({ id, qty });
        });
      } else {
        // maybe single object representing one item
        const id = extractId(raw);
        const qty = extractQty(raw);
        if (id != null && qty > 0) normalized.push({ id, qty });
      }
    }

    // if parsing failed and we didn't get normalized items, try a simple numeric-list recovery
    if (normalized.length === 0 && raw == null && rawStr) {
      // try to extract digits like "[1,2,3]" or "1,2,3"
      const s = rawStr.replace(/[^0-9,]/g, "").trim();
      if (s) {
        const parts = s.split(/,+/).map((x) => x.trim()).filter(Boolean);
        parts.forEach((p) => {
          const id = Number(p);
          if (!isNaN(id)) normalized.push({ id, qty: 1 });
        });
      }
    }

    // ensure unique ids sum quantities
    const merged = {};
    normalized.forEach((it) => {
      if (!it || !it.id) return;
      const key = Number(it.id);
      merged[key] = (merged[key] || 0) + (Number(it.qty) || 0);
    });

    const finalCart = Object.keys(merged).map((k) => ({ id: Number(k), qty: merged[k] })).filter((i) => i.qty > 0);
    // Only overwrite storage if we actually recovered items; avoid erasing possibly-valid but unparsable data
    if (finalCart.length > 0) saveCart(finalCart);
  } catch (err) {
    console.warn("initCartFromStorage error:", err);
  }

  // atualizar badge ao receber mudanças de outra aba
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) updateCartUI();
  });
}
function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  showToast(
    `${produtoData.find((p) => p.id === id)?.nome} adicionado ao carrinho!`
  );
}
function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// wire up cart UI
document.addEventListener("DOMContentLoaded", () => {
  initCartFromStorage();
  updateCartUI();
  const cartBtn = document.getElementById("cart-btn");
  cartBtn &&
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCartPanel();
    });
});

function toggleCartPanel() {
  let panel = document.getElementById("mini-cart");
  if (!panel) {
    panel = createMiniCartPanel();
    document.body.appendChild(panel);
  }
  panel.classList.toggle("open");
  renderMiniCart();
}

function createMiniCartPanel() {
  const panel = document.createElement("aside");
  panel.id = "mini-cart";
  panel.className = "mini-cart";
  panel.innerHTML = `<div class='mini-cart-header'><h4>Seu Carrinho</h4><button aria-label='Fechar carrinho' class='mini-cart-close'>&times;</button></div><div class='mini-cart-body'></div><div class='mini-cart-footer'><div class='mini-cart-total'></div><button class='btn btn-primary mini-cart-checkout'>Finalizar Compra</button></div>`;
  panel
    .querySelector(".mini-cart-close")
    .addEventListener("click", () => panel.classList.remove("open"));
  panel.querySelector(".mini-cart-checkout").addEventListener("click", () => {
    showToast("Checkout não implementado — é apenas um protótipo.", "success");
  });
  return panel;
}

function renderMiniCart() {
  const panel = document.getElementById("mini-cart");
  if (!panel) return;
  const body = panel.querySelector(".mini-cart-body");
  const totalElem = panel.querySelector(".mini-cart-total");
  const cart = getCart();
  body.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    body.innerHTML =
      '<p style="text-align:center; padding:20px; color:var(--text-muted);">Seu carrinho está vazio</p>';
    totalElem.innerHTML = `Total: <strong>${formatCurrency(0)}</strong>`;
    return;
  }

  cart.forEach((item) => {
    const p = produtoData.find((k) => k.id === item.id);
    if (!p) return;
    const subtotal = item.qty * p.preco;
    const row = document.createElement("div");
    row.className = "mini-cart-item";
    row.innerHTML = `
      <div class='mini-cart-item-img'>
        <img src='${p.imagem}' alt='${p.nome}' loading='lazy'>
      </div>
      <div class='mini-cart-item-info'>
        <div class='mini-cart-item-name'>${p.nome}</div>
        <div class='mini-cart-item-price'>Preço: ${formatCurrency(p.preco)}</div>
        <div class='mini-cart-item-subtotal'>
          Subtotal: <strong>${formatCurrency(subtotal)}</strong>
        </div>
      </div>
      <div class='mini-cart-item-controls'>
        <div class='qty-controls'>
          <button class='qty-btn qty-minus' data-id='${p.id}' aria-label="Diminuir quantidade">−</button>
          <span class='qty-display'>${item.qty}</span>
          <button class='qty-btn qty-plus' data-id='${p.id}' aria-label="Aumentar quantidade">+</button>
        </div>
        <button class='btn btn-remove' data-remove='${p.id}' aria-label="Remover ${p.nome}">🗑️ Remover</button>
      </div>
    `;
    body.appendChild(row);
    total += subtotal;

    // Event listeners para aumentar/diminuir quantidade
    row.querySelector(".qty-plus").addEventListener("click", () => {
      updateCartQty(p.id, 1);
    });
    row.querySelector(".qty-minus").addEventListener("click", () => {
      updateCartQty(p.id, -1);
    });
    row.querySelector("[data-remove]").addEventListener("click", () => {
      removeFromCart(p.id);
    });
  });
  totalElem.innerHTML = `
    <div style="padding: 12px 0; border-top: 1px solid rgba(0,0,0,0.1); margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Subtotal:</span>
        <span>${formatCurrency(total)}</span>
      </div>
      <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 8px;">
        Frete calculado no checkout
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1.1em; font-weight: bold;">
        <span>Total:</span>
        <span>${formatCurrency(total)}</span>
      </div>
    </div>
  `;
}

function updateCartQty(id, change) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cart);
      renderMiniCart();
    }
  }
}

function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderMiniCart();
  showToast("Item removido do carrinho");
}

function initProductModalControls() {
  const prev = document.getElementById("prod-prev");
  const next = document.getElementById("prod-next");
  const closeBtn = document.getElementById("close-produtos");
  const overlay = document.getElementById("modal-produtos-overlay");
  prev &&
    prev.addEventListener("click", () => {
      currentProductSlide =
        (currentProductSlide - 1 + produtoData.length) % produtoData.length;
      updateProductModal();
    });
  next &&
    next.addEventListener("click", () => {
      currentProductSlide = (currentProductSlide + 1) % produtoData.length;
      updateProductModal();
    });
  closeBtn && closeBtn.addEventListener("click", closeProductsModal);
  overlay && overlay.addEventListener("click", closeProductsModal);
  const modal = document.getElementById("modal-produtos");
  modal &&
    modal.addEventListener("mouseenter", () =>
      clearInterval(productSlideInterval)
    );
  modal && modal.addEventListener("mouseleave", () => startProductAutoplay());
  document.addEventListener("keydown", (e) => {
    const m = document.getElementById("modal-produtos");
    if (m && !m.classList.contains("hidden")) {
      if (e.key === "ArrowLeft")
        (currentProductSlide =
          (currentProductSlide - 1 + produtoData.length) % produtoData.length),
          updateProductModal();
      if (e.key === "ArrowRight")
        (currentProductSlide = (currentProductSlide + 1) % produtoData.length),
          updateProductModal();
      if (e.key === "Escape") closeProductsModal();
    }
  });
}

function openProductsModal(startIndex = 0) {
  const modal = document.getElementById("modal-produtos");
  const slidesWrap = document.getElementById("modal-product-slides");
  const thumbsWrap = document.getElementById("modal-product-thumbs");
  if (!modal || !slidesWrap || !thumbsWrap) return;
  slidesWrap.innerHTML = "";
  thumbsWrap.innerHTML = "";
  const list = document.createElement("div");
  list.className = "modal-slide-list";
  produtoData.forEach((p, idx) => {
    const slide = document.createElement("div");
    slide.className = "modal-slide";
    slide.innerHTML = `<img src=\"${p.imagem}\" alt=\"${p.nome}\" loading=\"lazy\">`;
    list.appendChild(slide);
    const t = document.createElement("div");
    t.className = "modal-thumb";
    t.setAttribute("tabindex", "0");
    t.setAttribute("role", "button");
    t.setAttribute("aria-label", `Ir para ${p.nome}`);
    t.innerHTML = `<img src=\"${p.imagem}\" alt=\"${p.nome}\" loading=\"lazy\">`;
    t.addEventListener("click", () => {
      currentProductSlide = idx;
      updateProductModal();
    });
    t.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        currentProductSlide = idx;
        updateProductModal();
      }
    });
    thumbsWrap.appendChild(t);
  });
  slidesWrap.appendChild(list);
  currentProductSlide = startIndex;
  updateProductModal();
  openModal(modal);
  startProductAutoplay();
}

function updateProductModal() {
  const list = document.querySelector(".modal-slide-list");
  const thumbs = document.querySelectorAll(".modal-thumb");
  if (!list) return;
  list.style.transform = `translateX(-${currentProductSlide * 100}%)`;
  thumbs.forEach((t, i) =>
    t.classList.toggle("active", i === currentProductSlide)
  );
}
// Also render details whenever the active slide changes
const originalUpdate = updateProductModal;
updateProductModal = function () {
  originalUpdate();
  renderProductDetails(currentProductSlide);
};
function renderProductDetails(idx) {
  const details = document.getElementById("modal-product-details");
  if (!details) return;
  const p = produtoData[idx];
  details.innerHTML = `<img src='${p.imagem}' alt='${
    p.nome
  }' loading='lazy'><div class='details'><h3>${p.nome}</h3><p>${
    p.descricao
  }</p><div class='price'>${formatCurrency(
    p.preco
  )}</div><div class='actions'><button class='btn btn-primary modal-add' data-add='${
    p.id
  }'>Adicionar ao Carrinho</button><button class='btn btn-outline modal-reviews' data-review='${
    p.id
  }'>Ver Avaliações</button></div></div>`;
  const addBtn = details.querySelector(".modal-add");
  addBtn && addBtn.addEventListener("click", () => addToCart(p.id));
  const revBtn = details.querySelector(".modal-reviews");
  revBtn && revBtn.addEventListener("click", () => openReviewsModal(p.id));
}

// Ensure details update on slide change
const originalUpdateProductModal = updateProductModal;
updateProductModal = function () {
  originalUpdateProductModal();
  renderProductDetails(currentProductSlide);
};
function closeProductsModal() {
  const modal = document.getElementById("modal-produtos");
  closeModal(modal);
}
function startProductAutoplay() {
  if (productSlideInterval) clearInterval(productSlideInterval);
  productSlideInterval = setInterval(() => {
    currentProductSlide = (currentProductSlide + 1) % produtoData.length;
    updateProductModal();
  }, 3500);
}

function initReviewModalControls() {
  const closeR = document.getElementById("close-avaliacoes");
  const overlayR = document.getElementById("modal-avaliacoes-overlay");
  closeR && closeR.addEventListener("click", closeReviewsModal);
  overlayR && overlayR.addEventListener("click", closeReviewsModal);
}
function openReviewsModal(produtoId = null) {
  const modal = document.getElementById("modal-avaliacoes");
  const list = document.getElementById("modal-review-list");
  const modalTitle = document.querySelector(".review-modal h3");
  if (!modal || !list) return;

  list.innerHTML = "";
  const filtered = produtoId
    ? avaliacoesData.filter((a) => a.produtoId === produtoId)
    : avaliacoesData;

  // Atualizar título com nome do produto
  if (produtoId) {
    const produto = produtoData.find((p) => p.id === produtoId);
    if (produto && modalTitle) {
      modalTitle.innerHTML = `AVALIAÇÕES - ${produto.nome.toUpperCase()}`;
    }
  }

  // Calcular estatísticas
  let totalRating = 0;
  let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  filtered.forEach((av) => {
    totalRating += av.rating;
    ratingDistribution[av.rating]++;
  });

  const averageRating =
    filtered.length > 0 ? (totalRating / filtered.length).toFixed(1) : 0;

  // Adicionar resumo de avaliações
  const summary = document.createElement("div");
  summary.className = "review-summary";
  summary.innerHTML = `
    <div style="display: flex; gap: 40px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.1);">
      <div style="text-align: center;">
        <div style="font-size: 2.5em; font-weight: bold; color: var(--primary-color);">${averageRating}</div>
        <div style="display: flex; justify-content: center; gap: 2px;">${makeStarsHTML(
          averageRating
        )}</div>
        <div style="font-size: 0.9em; color: var(--text-muted); margin-top: 4px;">${
          filtered.length
        } avaliações</div>
      </div>
      <div style="flex: 1;">
        ${[5, 4, 3, 2, 1]
          .map((rating) => {
            const count = ratingDistribution[rating];
            const percentage =
              filtered.length > 0
                ? ((count / filtered.length) * 100).toFixed(0)
                : 0;
            return `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 0.85em; width: 40px;">${rating} ${
              rating === 1 ? "★" : "★"
            }</span>
              <div style="width: 120px; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                <div style="width: ${percentage}%; height: 100%; background: #f59e0b; border-radius: 4px;"></div>
              </div>
              <span style="font-size: 0.85em; color: var(--text-muted);">${count}</span>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
  list.appendChild(summary);

  // Adicionar avaliações individuais
  filtered.forEach((av) => {
    const card = document.createElement("div");
    card.className = "review-card";
    const stars = makeStarsHTML(av.rating);
    card.innerHTML = `
      <div class='review-avatar'>
        <img src='${av.avatar}' alt='${av.nome}' loading='lazy'>
      </div>
      <div class='review-content'>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <h4>${av.nome}</h4>
            <p class='review-cargo'>${av.cargo || ""}</p>
          </div>
          <div style="text-align: right;">
            <div class='review-stars' style="display: flex; gap: 2px;">${stars}</div>
            <p class='rating-label' style="font-size: 0.85em; color: var(--primary-color); font-weight: 600;">${ratingLabel(
              av.rating
            )}</p>
          </div>
        </div>
        <p style="margin: 12px 0; line-height: 1.5;">${av.texto}</p>
      </div>
    `;
    list.appendChild(card);
  });

  openModal(modal);
}
function closeReviewsModal() {
  const modal = document.getElementById("modal-avaliacoes");
  closeModal(modal);
}

// Focus management for modals
function openModal(modal) {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("tabindex", "-1"); // ensure focusable
  const focusable = modal.querySelectorAll(focusableSelectors);
  if (focusable && focusable.length) focusable[0].focus();
  trapFocus(modal);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (productSlideInterval) clearInterval(productSlideInterval);
  if (modal._untrap) {
    modal._untrap();
    delete modal._untrap;
  }
  if (lastFocusedElement) lastFocusedElement.focus();
}

function trapFocus(modal) {
  const nodes = modal.querySelectorAll(focusableSelectors);
  if (!nodes || nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  function handleKey(e) {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  modal.addEventListener("keydown", handleKey);
  modal._untrap = () => {
    modal.removeEventListener("keydown", handleKey);
  };
}

function initNavProdutosLink() {
  const anchors = document.querySelectorAll('a[href="#produtos"]');
  anchors.forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openProductsModal(0);
    })
  ); // aria-current handling
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      navLinks.forEach((l) => l.classList.remove("active"));
      e.currentTarget.classList.add("active");
      navLinks.forEach((l) => l.removeAttribute("aria-current"));
      e.currentTarget.setAttribute("aria-current", "page");
    })
  );
}
// Enhance nav accessibility: set aria-current on active link
// nav current handling will be initialized in initNavProdutosLink
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  existing && existing.remove();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `<div class='toast-content'><i class='fas fa-check-circle toast-icon'></i><span>${message}</span></div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 60);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.CafeAroma = {
  showToast,
  adicionarAoCarrinho,
  openProductsModal,
  openReviewsModal,
};

app.listen(3000, '26.193.0.31');

