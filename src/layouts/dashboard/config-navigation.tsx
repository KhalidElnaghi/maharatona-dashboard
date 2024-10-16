import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  <Iconify icon={name} width={24} height={24} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  home: icon('solar:home-bold'),
  sections: icon('lucide:network'),
  categories: icon('bi:grid-fill'),
  subCategories: icon('fluent:list-bar-16-filled'),
  brands: icon('solar:bag-bold'),
  products: icon('dashicons:products'),
  mostSelling: icon('mdi:stars'),
  financialReports: icon('icon-park-outline:table-report'),
  clients: icon('fluent:people-32-light'),
  otp: icon('teenyicons:otp-solid'),
  clientsWallet: icon('ic_clients-wallet'),
  orders: icon('ion:cart-outline'),
  offers: icon('bxs:offer'),
  coupons: icon('mdi:coupon-outline'),
  employees: icon('clarity:employee-group-line'),
  drivers: icon('healthicons:truck-driver-outline'),
  driversWallet: icon('ph:wallet-duotone'),
  warehouses: icon('iconoir:delivery-truck'),
  paymentMethods: icon('tdesign:money'),
  currencies: icon('ic_currencies'),
  return: icon('carbon:deployment-policy'),
  notifications: icon('ic:outline-notifications-active'),
  advertisements: icon('tabler:ad'),
  appPages: icon('gravity-ui:square-bars-vertical'),
  reports: icon('oui:app-reporting'),
  loyaltySystem: icon('material-symbols:loyalty-outline'),
  settings: icon('teenyicons:cog-outline'),
  sliders: icon('ph:sliders'),
  workingArea: icon('mdi:locations'),
  reasons: icon('ph:question'),
  terms: icon('fluent-mdl2:entitlement-policy'),
  about: icon('mdi:about-circle-outline'),
  returnRequests: icon('fontisto:arrow-return-left'),
  privacy: icon('iconoir:privacy-policy'),
  banars: icon('material-symbols:wallpaper'),
  posters: icon('mingcute:announcement-line'),
  dataManagements: icon('fa:cogs'),
  promocodes: icon('mdi:coupon'),
  support: icon('streamline:customer-support-1-solid'),
  building: icon('fa-solid:building'),
};

export function useNavData() {
  const { t } = useTranslate();
  const data = useMemo(
    () => [
      {
        items: [
          { title: t('SIDEBAR.MAIN'), path: paths.dashboard.root, icon: ICONS.home },
          { title: t('SIDEBAR.CENTERS'), path: paths.dashboard.centers, icon: ICONS.building },
          { title: t('SIDEBAR.CLIENTS'), path: paths.dashboard.clients, icon: ICONS.clients },
        ],
      },
    ],
    [t]
  );

  return data;
}
