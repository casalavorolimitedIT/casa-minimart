export type StockLevel = "critical" | "low" | "medium" | "plenty";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export const categories: Category[] = [
  { id: "all", label: "All Products", icon: "grid" },
  { id: "best-sellers", label: "Best Sellers", icon: "star" },
  { id: "fresh-produce", label: "Fresh Produce", icon: "leaf" },
  { id: "pantry", label: "Pantry", icon: "package" },
  { id: "household", label: "Household", icon: "home" },
  { id: "toiletries", label: "Toiletries", icon: "droplets", description: "Essentials for your daily routine" },
  { id: "tea-coffee", label: "Tea & Coffee", icon: "coffee", description: "Morning pick-me-ups" },
  { id: "snacks", label: "Snacks", icon: "cookie", description: "Delicious treats for any time" },
];

export const toiletries: Product[] = [
  {
    id: "t1",
    name: "Gillette Shaving Stick",
    price: 20000,
    stock: 4,
    category: "toiletries",
    imageUrl: "https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=300&q=80",
  },
  {
    id: "t2",
    name: "Kids Oral B Toothbrush",
    price: 20000,
    stock: 4,
    category: "toiletries",
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80",
  },
  {
    id: "t3",
    name: "Sensodyne Toothpaste",
    price: 7840,
    stock: 1,
    category: "toiletries",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80",
  },
  {
    id: "t4",
    name: "Oral B 3D White",
    price: 6670,
    stock: 2,
    category: "toiletries",
    imageUrl: "https://images.unsplash.com/photo-1606206078456-e44d45e50c3f?w=300&q=80",
  },
];

export const bodycare: Product[] = [
  {
    id: "b1",
    name: "Cocoa Butter Body Lotion",
    price: 14350,
    stock: 2,
    category: "bodycare",
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4de8b42?w=300&q=80",
  },
  {
    id: "b2",
    name: "Dove Body Cream",
    price: 6670,
    stock: 4,
    category: "bodycare",
    imageUrl: "https://images.unsplash.com/photo-1591375275624-e80ab2b5e90b?w=300&q=80",
  },
  {
    id: "b3",
    name: "Evoluderm Moisturizing",
    price: 30000,
    stock: 2,
    category: "bodycare",
    imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&q=80",
  },
  {
    id: "b4",
    name: "Garnier Cleansing",
    price: 17500,
    stock: 1,
    category: "bodycare",
    imageUrl: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=300&q=80",
  },
];

export const beverages: Product[] = [
  {
    id: "bev1",
    name: "Eminent Tea Bags",
    price: 18000,
    stock: 11,
    category: "tea-coffee",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80",
  },
  {
    id: "bev2",
    name: "Eminent Premium Tea",
    price: 18000,
    stock: 3,
    category: "tea-coffee",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&q=80",
  },
  {
    id: "bev3",
    name: "Eminent Black Tea",
    price: 18000,
    stock: 1,
    category: "tea-coffee",
    imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&q=80",
  },
  {
    id: "bev4",
    name: "Clipper Tea",
    price: 40000,
    stock: 10,
    category: "tea-coffee",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=80",
  },
];

export const sweets: Product[] = [
  {
    id: "s1",
    name: "Extra Ice Chewing Gum",
    price: 101000,
    stock: 1,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=300&q=80",
  },
  {
    id: "s2",
    name: "Cartwright Cake",
    price: 62000,
    stock: 2,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80",
  },
  {
    id: "s3",
    name: "Lizis Granola",
    price: 39000,
    stock: 1,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1543252504-2a2c4c7a0b88?w=300&q=80",
  },
  {
    id: "s4",
    name: "Skittles",
    price: 3200,
    stock: 1,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&q=80",
  },
];

export const seasoning: Product[] = [
  {
    id: "se1",
    name: "Dunns River All Purpose",
    price: 12000,
    stock: 4,
    category: "pantry",
    imageUrl: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300&q=80",
  },
  {
    id: "se2",
    name: "Hot Curry Powder",
    price: 16000,
    stock: 2,
    category: "pantry",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80",
  },
  {
    id: "se3",
    name: "Ground Black Pepper",
    price: 10000,
    stock: 2,
    category: "pantry",
    imageUrl: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=300&q=80",
  },
  {
    id: "se4",
    name: "Ground White Pepper",
    price: 11000,
    stock: 2,
    category: "pantry",
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=300&q=80",
  },
];

export const popularProducts: Product[] = [
  {
    id: "pop1",
    name: "Plantain Chips (Gourmet)",
    price: 1200,
    stock: 15,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&q=80",
    featured: true,
  },
  {
    id: "pop2",
    name: "Kelloggs Coco Pops",
    price: 6500,
    stock: 8,
    category: "pantry",
    imageUrl: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=300&q=80",
    featured: true,
  },
  {
    id: "pop3",
    name: "Baylis & Harding Candle",
    price: 14000,
    stock: 5,
    category: "household",
    imageUrl: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=300&q=80",
    featured: true,
  },
];

export function getStockLevel(stock: number): StockLevel {
  if (stock <= 1) return "critical";
  if (stock <= 4) return "low";
  if (stock <= 8) return "medium";
  return "plenty";
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString("en-NG")}`;
}