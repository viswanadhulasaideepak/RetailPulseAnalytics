import type { Inventory } from "../../types/inventory";
import InventoryTable from "../../components/tables/InventoryTable";
import InventoryCharts from "./InventoryCharts";

interface Props {
  inventory: Inventory[];
  loading: boolean;
  refresh: () => void;
}

const InventoryContent = ({
  inventory,
  loading,
  refresh,
}: Props) => {
  return (
    <>
      <InventoryCharts inventory={inventory} />

      <InventoryTable
        inventory={inventory}
        loading={loading}
        refresh={refresh}
      />
    </>
  );
};

export default InventoryContent;