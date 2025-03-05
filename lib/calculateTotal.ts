import { MenuItem } from "@/types";

const calculateTotal = (menu: MenuItem[]): number => {
  return menu.reduce((acc, item) => acc + item.cost * item.quantity, 0);
};

export default calculateTotal;
