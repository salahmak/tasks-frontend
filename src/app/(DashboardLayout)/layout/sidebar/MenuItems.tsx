import { IconListCheck } from "@tabler/icons-react";
import {
  IconAperture,
  IconChartDonut,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Tasks",
    icon: IconListCheck,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Statistics",
    icon: IconChartDonut,
    href: "/statistics",
  },
];

export default Menuitems;
