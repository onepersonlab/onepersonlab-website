import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'vision', label: 'Our Vision', href: '#' },
  { id: 'repos', label: 'Agents', href: '#repos' },
  { id: 'papers', label: 'Papers', href: '#papers' },
  { id: 'skills', label: 'Skills & Templates', href: '#skills' },
];