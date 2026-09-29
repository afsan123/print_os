'use client';

import { useState, useEffect, useCallback } from 'react';
import { JOB_CATEGORIES, PAPER_TYPES, FULL_SHEET_SIZES } from '@/lib/constants';

export interface CustomPaperType {
  id: string;
  label: string;
  defaultGsm: number;
  defaultReamPrice: number;
  isCustom?: boolean;
}

const STORAGE_KEYS = {
  CATEGORIES: 'print_os_custom_categories',
  PAPER_TYPES: 'print_os_custom_paper_types',
  SHEET_SIZES: 'print_os_custom_sheet_sizes',
};

export function useCustomSpecs() {
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const [paperTypes, setPaperTypes] = useState<CustomPaperType[]>(PAPER_TYPES);
  const [sheetSizes, setSheetSizes] = useState<string[]>(FULL_SHEET_SIZES);

  // Load saved custom specifications from localStorage
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCats) {
        const parsed = JSON.parse(savedCats) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = Array.from(new Set([...JOB_CATEGORIES, ...parsed]));
          setCategories(merged);
        }
      }

      const savedPapers = localStorage.getItem(STORAGE_KEYS.PAPER_TYPES);
      if (savedPapers) {
        const parsed = JSON.parse(savedPapers) as CustomPaperType[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultIds = new Set(PAPER_TYPES.map((p) => p.id));
          const customOnly = parsed.filter((p) => !defaultIds.has(p.id));
          setPaperTypes([...PAPER_TYPES, ...customOnly]);
        }
      }

      const savedSizes = localStorage.getItem(STORAGE_KEYS.SHEET_SIZES);
      if (savedSizes) {
        const parsed = JSON.parse(savedSizes) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = Array.from(new Set([...FULL_SHEET_SIZES, ...parsed]));
          setSheetSizes(merged);
        }
      }
    } catch (e) {
      console.error('Error loading custom specs:', e);
    }
  }, []);

  // Add new Category
  const addCategory = useCallback((newCategory: string): string | null => {
    const trimmed = newCategory.trim();
    if (!trimmed) return null;

    setCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const updated = [...prev, trimmed];
      try {
        const customItems = updated.filter((c) => !JOB_CATEGORIES.includes(c));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(customItems));
      } catch {}
      return updated;
    });

    return trimmed;
  }, []);

  // Add new Paper Type
  const addPaperType = useCallback(
    (paper: { label: string; defaultGsm: number; defaultReamPrice: number }): CustomPaperType | null => {
      const trimmedLabel = paper.label.trim();
      if (!trimmedLabel) return null;

      const newType: CustomPaperType = {
        id: `custom_${Date.now().toString(36)}`,
        label: trimmedLabel,
        defaultGsm: Math.max(1, Number(paper.defaultGsm) || 120),
        defaultReamPrice: Math.max(1, Number(paper.defaultReamPrice) || 3000),
        isCustom: true,
      };

      setPaperTypes((prev) => {
        const exists = prev.find((p) => p.label.toLowerCase() === trimmedLabel.toLowerCase());
        if (exists) return prev;
        const updated = [...prev, newType];
        try {
          const customItems = updated.filter((p) => p.isCustom);
          localStorage.setItem(STORAGE_KEYS.PAPER_TYPES, JSON.stringify(customItems));
        } catch {}
        return updated;
      });

      return newType;
    },
    []
  );

  // Add new Sheet Size
  const addSheetSize = useCallback((sizeStr: string): string | null => {
    const trimmed = sizeStr.trim();
    if (!trimmed) return null;

    setSheetSizes((prev) => {
      if (prev.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const updated = [...prev, trimmed];
      try {
        const customItems = updated.filter((s) => !FULL_SHEET_SIZES.includes(s));
        localStorage.setItem(STORAGE_KEYS.SHEET_SIZES, JSON.stringify(customItems));
      } catch {}
      return updated;
    });

    return trimmed;
  }, []);

  return {
    categories,
    paperTypes,
    sheetSizes,
    addCategory,
    addPaperType,
    addSheetSize,
  };
}
