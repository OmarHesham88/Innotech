import { uniqueId } from 'lodash'; 
// Color palette: #85bfd3 #afdded #237895
import {
  IconPoint,
  IconAppWindow,
  IconUserShare,
  IconBrandDatabricks,
  IconCarGarage,
  IconCategory,
} from '@tabler/icons-react';
import { IconAddressBook, IconPhoneOutgoing, IconWritingSign } from '@tabler/icons';

const Menuitems = [
  {
    id: uniqueId(),
    title: ' قسم البيانات الأساسية',
    icon: IconBrandDatabricks,
    href: '/maininfo',
    tooltipContent: 'إدارة وعرض البيانات الأساسية للنظام',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: ' جهات الإتصال',
    icon: IconAddressBook,
    href: '/contacts',
    tooltipContent: 'إدارة قائمة جهات الاتصال وبيانات التواصل',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'إدارة الردود والتأكيد والمراجعة',
    icon: IconPhoneOutgoing,
    href: '/response',
    tooltipContent: 'متابعة وتنظيم الردود وعمليات التأكيد والمراجعة',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: '  إدارة توثيق العقود ',
    icon: IconWritingSign,
    href: '/contractManagement',
    tooltipContent: 'إدارة وتوثيق وأرشفة العقود',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'إدارة تصنيف الأصول',
    icon: IconCategory,
    href: '/AssetsClassifications',
    tooltipContent: 'تصنيف وإدارة قوائم الأصول',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: ' إدارة تصنيف الأصول والمعدات',
    icon: IconCarGarage,
    href: '/EquipmentsClassifications',
    tooltipContent: 'تصنيف وإدارة قوائم الأصول والمعدات',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: ' تسجيل بيانات المفوض ',
    icon: IconUserShare,
    href: '/delegateData',
    tooltipContent: 'إدارة وتسجيل بيانات المفوضين والوكلاء',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'لوحة تحكم مدير النظام',
    icon: IconAppWindow,
    href: '/',
    tooltipContent: 'إعدادات وصلاحيات مدير النظام',
    children: [
      {
        id: uniqueId(),
        title: 'Pricing',
        icon: IconPoint,
        href: '/',
        tooltipContent: 'إعدادات التسعير وخطط الدفع',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'إدارة طلبات الشركات',
    icon: IconAppWindow,
    href: '/',
    tooltipContent: 'إدارة وعرض طلبات الشركات',
    children: [
      {
        id: uniqueId(),
        title: 'Pricing',
        icon: IconPoint,
        href: '/',
        tooltipContent: 'تفاصيل التسعير',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'الجدول الرئيسى للطلبات',
    icon: IconAppWindow,
    href: '/',
    tooltipContent: 'عرض وتتبع حالة جميع الطلبات',
    children: [
      {
        id: uniqueId(),
        title: 'Pricing',
        icon: IconPoint,
        href: '/',
        tooltipContent: 'تفاصيل التسعير',
      },
    ],
  },
  {
    id: uniqueId(),
    title: ' وحدة تسجيل الكيانات',
    icon: IconAppWindow,
    href: '/',
    tooltipContent: 'إدارة وتسجيل الكيانات والشركات',
    children: [
      {
        id: uniqueId(),
        title: 'ادارة تسجيل بيانات المؤسسة',
        icon: IconPoint,
        href: '/',
        tooltipContent: 'إدخال وتعديل بيانات المؤسسات',
      },
    ],
  },
  {
    id: uniqueId(),
    title: '( العناوين الرئيسية / الوحدات )',
    icon: IconAppWindow,
    href: '/',
    tooltipContent: 'إدارة العناوين الرئيسية والوحدات الفرعية',
    children: [
      {
        id: uniqueId(),
        title: 'Pricing',
        icon: IconPoint,
        href: '/',
        tooltipContent: 'تفاصيل التسعير',
      },
    ],
  },
];

export default Menuitems;