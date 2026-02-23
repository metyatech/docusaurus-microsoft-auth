import type { ComponentType } from 'react';

import DefaultNavbarItem from '@theme-original/NavbarItem/DefaultNavbarItem';
import DocNavbarItem from '@theme-original/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme-original/NavbarItem/DocSidebarNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import DocsVersionNavbarItem from '@theme-original/NavbarItem/DocsVersionNavbarItem';
import DropdownNavbarItem from '@theme-original/NavbarItem/DropdownNavbarItem';
import HtmlNavbarItem from '@theme-original/NavbarItem/HtmlNavbarItem';
import LocaleDropdownNavbarItem from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme-original/NavbarItem/SearchNavbarItem';

import CustomAuthAccountNavbarItem from '../CustomAuthAccount';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Docusaurus theme components have heterogeneous props
type ComponentTypesMap = Record<string, ComponentType<any>>;

const ComponentTypes: ComponentTypesMap = {
  default: DefaultNavbarItem,
  dropdown: DropdownNavbarItem,
  html: HtmlNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  'custom-auth-account': CustomAuthAccountNavbarItem,
};

export default ComponentTypes;
