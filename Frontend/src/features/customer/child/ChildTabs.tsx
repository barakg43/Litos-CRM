import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../services/redux/slices/useAuthStore";
import ProductHistoryTable from "./product-renews/ProductHistoryTable";
import ServiceRenewsHistoryTable from "./service-renews/ServiceRenewsHistoryTable";
function ChildTabs() {
  const { t } = useTranslation("customers", { keyPrefix: "child" });
  const [tabIndex, setTabIndex] = useState(0);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <Tabs isLazy onChange={handleTabsChange}>
      <TabList>
        <Tab fontSize='large'>{t("activities")}</Tab>
        {isAdmin && <Tab fontSize='large'>{t("service-contracts")}</Tab>}
        <Tab fontSize='large'>{t("product-renews")}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>Activities</p>
        </TabPanel>
        {isAdmin && (
          <TabPanel>
            <ServiceRenewsHistoryTable />
          </TabPanel>
        )}
        <TabPanel>
          <ProductHistoryTable />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ChildTabs;
