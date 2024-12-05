import { Box, Link as ChakraLink, List, ListItem } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  TbAlarm,
  TbAlarmPlus,
  TbClipboardList,
  TbReportAnalytics,
  TbSettings,
  TbUsers,
  TbUsersGroup,
} from "react-icons/tb";
import { NavLink as ReactRouterLink } from "react-router-dom";
import { useAuthStore } from "../services/redux/slices/useAuthStore";
import BadgeIcon from "./BadgeIcon";

type NavLinkItemProps = {
  path: string;
  label: string;
  icon?: ReactElement | null | undefined;
};

function NavLinkItem({ path, label, icon }: NavLinkItemProps) {
  return (
    <ListItem w='100%'>
      <ChakraLink
        as={ReactRouterLink}
        to={path}
        display='flex'
        gap='0.5rem'
        _hover={{
          backgroundColor: " var(--color-primary-500)",
          color: "white",
        }}
        borderRadius='var(--radius-sm)'
        // padding='0 var(--scale-00000)'
        paddingInline={"var(--scale-0)"}
        flexGrow={1}
        fontSize='var(--scale-5)'
        _activeLink={{
          fontWeight: "bold",
          color: "teal.900",
          backgroundColor: " var(--color-primary-300)",
        }}
      >
        {icon}
        <Box as='span' margin='2px'>
          {label}
        </Box>
      </ChakraLink>
    </ListItem>
  );
}
function MainNav() {
  const { t } = useTranslation("appLayout", { keyPrefix: "sidebar" });
  const isAdmin = useAuthStore((state) => state.isAdmin());

  return (
    <List
      listStyleType='none'
      display='flex'
      flexDir={"column"}
      gap='1rem'
      alignItems={"start"}
      w='100%'
      padding='0 2rem'
    >
      <NavLinkItem
        icon={<TbUsers />}
        path='/customers'
        label={t("customers")}
      />
      <NavLinkItem
        icon={<BadgeIcon icon={<TbAlarm />} amountNotification={100} />}
        path='/product-renews'
        label={t("product-renews")}
      />
      {isAdmin && (
        <NavLinkItem
          icon={<BadgeIcon icon={<TbAlarmPlus />} />}
          path='/service-renews'
          label={t("service-renews")}
        />
      )}

      <NavLinkItem
        icon={<TbClipboardList />}
        path='/activities'
        label={t("activities")}
      />
      <NavLinkItem
        icon={<TbReportAnalytics />}
        path='/reports'
        label={t("reports")}
      />
      {isAdmin && (
        <NavLinkItem icon={<TbUsersGroup />} path='/users' label={t("users")} />
      )}
      <NavLinkItem
        icon={<TbSettings />}
        path='/settings'
        label={t("settings")}
      />
    </List>
  );
}

export default MainNav;
