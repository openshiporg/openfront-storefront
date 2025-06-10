import repeat from "@/features/storefront/lib/util/repeat"
// Removed HttpTypes and Table imports from Medusa
import {
  Table,
  TableBody,
  // Import other Table parts if needed (e.g., TableRow, TableCell)
} from "@/components/ui/table"; 

import Divider from "@/features/storefront/modules/common/components/divider"
import Item from "@/features/storefront/modules/order/components/item"
import SkeletonLineItem from "@/features/storefront/modules/skeletons/components/skeleton-line-item"

// Define inline types based on GraphQL schema and component usage
type OrderLineItem = {
  id: string;
  title?: string | null; // Correct field name from schema
  quantity: number;
  thumbnail?: string | null;
  unitPrice?: number | null; // Correct field name from schema
  total?: number | null; // Correct field name from schema
  variant?: { // Structure based on Item component usage
    id: string;
    title?: string | null;
    // Add other variant fields if needed by Item
  } | null;
  createdAt?: string | null; // Correct field name from schema
  // Add other fields if needed by Item component
};

type RegionInfoForOrder = {
  id: string;
  currencyCode: string;
  // Add other fields if needed by Item component
};


type ItemsProps = {
  items: OrderLineItem[];
  region: RegionInfoForOrder;
};

const Items = ({ items, region }: ItemsProps) => { // Destructure region

  return (
    <div className="flex flex-col">
      <Divider className="!mb-0" />
      <Table>
        <TableBody data-testid="products-table"> 
          {items?.length
            ? items
                .sort((a: OrderLineItem, b: OrderLineItem) => { // Use OrderLineItem type
                  // Use correct property name
                  return (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1; // Corrected field name
                })
                .map((item: OrderLineItem) => { // Use OrderLineItem type
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      region={region}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </TableBody>
      </Table>
    </div>
  )
}

export default Items
