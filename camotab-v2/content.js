// CamoTab Content Script

(function () {
  let activeDisguise = null;
  let observer = null;

  function lockTitle() {
    if (!activeDisguise) return;
    if (document.title !== activeDisguise.title) document.title = activeDisguise.title;
  }

  function lockFavicon() {
    if (!activeDisguise?.favicon) return;
    document.querySelectorAll(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon'], " +
      "link[rel='fluid-icon'], link[rel='mask-icon'], link[rel*='icon']"
    ).forEach(el => { if (el.id !== "camotab-favicon") el.remove(); });

    let link = document.getElementById("camotab-favicon");
    if (!link) {
      link = document.createElement("link");
      link.id = "camotab-favicon";
      link.rel = "icon";
      link.type = "image/x-icon";
      document.head.appendChild(link);
    }
    if (link.href !== activeDisguise.favicon) link.href = activeDisguise.favicon;
  }

  function startObserver() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            const rel = node.getAttribute?.("rel") || "";
            if (rel.includes("icon") && node.id !== "camotab-favicon") node.remove();
          }
        }
        if (mutation.type === "attributes" && mutation.attributeName === "href" && mutation.target.id !== "camotab-favicon") {
          const rel = mutation.target.getAttribute("rel") || "";
          if (rel.includes("icon")) mutation.target.remove();
        }
      }
      lockTitle();
      lockFavicon();
    });
    observer.observe(document.head, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ["href", "rel"],
    });
    if (window._camoTabInterval) clearInterval(window._camoTabInterval);
    window._camoTabInterval = setInterval(() => { lockTitle(); lockFavicon(); }, 300);
  }

  function stopObserver() {
    if (observer) { observer.disconnect(); observer = null; }
    if (window._camoTabInterval) { clearInterval(window._camoTabInterval); window._camoTabInterval = null; }
  }

  function applyDisguise(disguise) {
    activeDisguise = disguise;
    lockTitle();
    lockFavicon();
    startObserver();
  }

  // original = { title, favicon } passed from background via event detail
  function removeDisguise(original) {
    stopObserver();
    activeDisguise = null;

    // Remove our favicon override
    const ourLink = document.getElementById("camotab-favicon");
    if (ourLink) ourLink.remove();

    // Restore original title
    if (original?.title) {
      document.title = original.title;
    }

    // Restore original favicon using the URL Chrome had before disguise
    if (original?.favicon) {
      const el = document.createElement("link");
      el.rel = "icon";
      el.href = original.favicon;
      document.head.appendChild(el);
    }
  }

  window.addEventListener("camotab-update", (e) => applyDisguise(e.detail));
  // original info arrives in event detail from background
  window.addEventListener("camotab-remove", (e) => removeDisguise(e.detail));

  chrome.runtime.sendMessage({ type: "GET_DISGUISE" }, (disguise) => {
    if (disguise) applyDisguise(disguise);
  });
})();
