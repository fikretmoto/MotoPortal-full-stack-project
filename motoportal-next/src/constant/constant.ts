export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "youtube";
};

export type CategoryMenuSection = {
  title: string;
  items: NavItem[];
};

export type HomeCategoryItem = {
  label: string;
  href: string;
};

export const topBarContent = {
  message: "MotoPortal | Motosiklet dünyasının rehberi",
};

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "#",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "#",
    icon: "facebook",
  },
  {
    label: "YouTube",
    href: "#",
    icon: "youtube",
  },
];

export const mainNavContent = {
  brandName: "MotoPortal",
  searchLabel: "Arama",
};

export const mobileNavContent = {
  label: "Menü",
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
    title: "Araçlar",
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
        label: "Yedek Parça",
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

export const homeCategoryItems: HomeCategoryItem[] = [
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
  {
    label: "Bisiklet",
    href: "/bicycles/bisiklet",
  },
  {
    label: "E-Bisiklet",
    href: "/bicycles/e-bisiklet",
  },
  {
    label: "Yedek Parça",
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
];
