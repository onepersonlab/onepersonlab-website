/**
 * GA4 Event Tracking Utilities
 * Centralized event logging for Google Analytics 4.
 */

// Extend Window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean>;

function gtagEvent(action: string, params: EventParams = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
}

// ── Section Views ──
export function trackSectionView(section: string) {
  gtagEvent('section_view', {
    section_name: section,
  });
}

// ── CTA Clicks ──
export function trackCTAClick(label: string, destination?: string) {
  gtagEvent('cta_click', {
    cta_label: label,
    cta_destination: destination || '',
  });
}

// ── Tab / Toggle ──
export function trackTabSwitch(category: string, value: string) {
  gtagEvent('tab_switch', {
    tab_category: category,
    tab_value: value,
  });
}

// ── Sort Change ──
export function trackSortChange(section: string, mode: string) {
  gtagEvent('sort_change', {
    sort_section: section,
    sort_mode: mode,
  });
}

// ── Expand / Collapse ──
export function trackExpand(section: string, expanded: boolean, itemCount: number) {
  gtagEvent(expanded ? 'list_expand' : 'list_collapse', {
    list_section: section,
    item_count: itemCount,
  });
}

// ── External Link Clicks ──
export function trackExternalLink(label: string, url: string) {
  // Truncate URL for privacy
  const shortUrl = url.replace(/^https?:\/\//, '').split('/').slice(0, 2).join('/');
  gtagEvent('external_link_click', {
    link_label: label,
    link_domain: shortUrl,
  });
}

// ── Page View (manual, for SPA) ──
export function trackPageView(path: string, title?: string) {
  gtagEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}
