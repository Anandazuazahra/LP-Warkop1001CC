import { useState, useEffect } from 'react';
import { DEFAULT_CMS_DATA } from './defaultData';

const STORAGE_KEY = 'warkop_1001cc_cms_data';
const CMS_EVENT = 'warkop_cms_update';

/**
 * Retrieve current CMS data from localStorage or fallback to defaults
 */
export function getCMSData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CMS_DATA;
    const parsed = JSON.parse(stored);
    
    // Merge with default data to ensure structure completeness if new keys are added
    return {
      siteInfo: { ...DEFAULT_CMS_DATA.siteInfo, ...(parsed.siteInfo || {}) },
      signatureMenu: parsed.signatureMenu || DEFAULT_CMS_DATA.signatureMenu,
      events: parsed.events || DEFAULT_CMS_DATA.events,
      testimonials: parsed.testimonials || DEFAULT_CMS_DATA.testimonials,
      gallery: parsed.gallery || DEFAULT_CMS_DATA.gallery,
      articles: parsed.articles || DEFAULT_CMS_DATA.articles
    };
  } catch (err) {
    console.error('Failed to parse CMS data from localStorage:', err);
    return DEFAULT_CMS_DATA;
  }
}

/**
 * Save updated CMS data to localStorage and dispatch update event
 */
export function saveCMSData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CMS_EVENT, { detail: data }));
    return true;
  } catch (err) {
    console.error('Failed to save CMS data to localStorage:', err);
    return false;
  }
}

/**
 * Reset CMS data back to factory defaults
 */
export function resetCMSData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CMS_EVENT, { detail: DEFAULT_CMS_DATA }));
  return DEFAULT_CMS_DATA;
}

/**
 * Export CMS Data as JSON string download
 */
export function exportCMSDataJSON() {
  const data = getCMSData();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `warkop1001cc_cms_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Custom React Hook to consume live CMS data with real-time sync
 */
export function useCMSData() {
  const [data, setData] = useState(() => getCMSData());

  useEffect(() => {
    const handleUpdate = () => {
      setData(getCMSData());
    };

    window.addEventListener(CMS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CMS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    cmsData: data,
    updateCMSData: (newData) => saveCMSData(newData),
    resetCMSData: () => resetCMSData()
  };
}
