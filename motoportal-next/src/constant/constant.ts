export type NavItem = {
  label: string;
  href: string;
};

export type CategoryMenuSection = {
  title: string;
  items: NavItem[];
};

export const topBarContent = {
  brandName: "MotoPortal",
  message: "MotoPortal ana sayfa yapisi yeniden kuruluyor.",
};

export const mobileNavContent = {
  label: "Menu",
};

export const mainMenuItems: NavItem[] = [
  {
    label: "Ana Sayfa",
    href: "/",
  },
  {
    label: "Markalar",
    href: "/brands",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

export const categoryMenuSections: CategoryMenuSection[] = [
  {
    title: "Araclar",
    items: [
      {
        label: "Motosiklet",
        href: "/vehicles/motosiklet",
      },
      {
        label: "Scooter",
        href: "/vehicles/scooter",
      },
      {
        label: "ATV",
        href: "/vehicles/atv",
      },
      {
        label: "UTV",
        href: "/vehicles/utv",
      },
    ],
  },
  {
    title: "Bisiklet",
    items: [
      {
        label: "Bisiklet",
        href: "/bicycles/bisiklet",
      },
      {
        label: "E-Bisiklet",
        href: "/bicycles/e-bisiklet",
      },
    ],
  },
  {
    title: "Market",
    items: [
      {
        label: "Yedek Parca",
        href: "/market/yedek-parca",
      },
      {
        label: "Aksesuar",
        href: "/market/aksesuar",
      },
      {
        label: "Ekipman",
        href: "/market/ekipman",
      },
    ],
  },
];
