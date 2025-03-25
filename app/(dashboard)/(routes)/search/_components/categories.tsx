"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import {
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMaps: Record<Category["name"], IconType> = {
  Fruits: FcMusic,
  Vegetables: FcOldTimeCamera,
  Dairy: FcSportsMode,
  Meat: FcSalesPerformance,
  Fish: FcMultipleDevices,
  Bakery: FcFilmReel,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          value={item.id}
          icon={iconMaps[item.name]}
        />
      ))}
    </div>
  );
};

export default Categories;
