import { Product } from '../types/product';
import { StoreSettings } from '../types/settings';

export const INITIAL_CATEGORIES = [
  'TODAS',
  'CARNES NOBRES',
  'CARNES DO DIA A DIA',
  'CHURRASCO',
  'ESPETINHOS'
] as const;

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "Butique da Carne",
  logoUrl: "/images/logo.png",
  whatsappNumber: "79999088400",
  deliveryFee: 5.00,
  isFreeDelivery: false,
  deliveryEnabled: true,
  pickupEnabled: true,
  storeAddress: "Av. Principal das Carnes, 1500 - Centro",
  openingHours: "Seg a Sáb: 07h às 19h | Dom: 07h às 13h",
  instagramUrl: "https://instagram.com/butiquedacarne",
  welcomeMessage: "Olá! Gostaria de fazer o seguinte pedido no açougue:"
};

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Picanha aparada
  {
    id: "prod-1",
    name: "Picanha aparada",
    price: 67.00,
    unit: "kg",
    category: "CARNES NOBRES",
    imageUrl: "/images/meats/picanha.png",
    description: "Capa de gordura uniforme, maciez incomparável para churrasco ou forno.",
    isActive: true,
    isFeatured: true,
    stockStatus: "available",
    sortOrder: 1
  },
  // 2. Filé
  {
    id: "prod-2",
    name: "Filé",
    price: 55.00,
    unit: "kg",
    category: "CARNES NOBRES",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "Extremamente macio e suculento. Ideal para medalhões, estrogonofe e bifes nobres.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 2
  },
  // 3. Contra-filé
  {
    id: "prod-3",
    name: "Contra-filé",
    price: 48.00,
    unit: "kg",
    category: "CARNES NOBRES",
    imageUrl: "/images/meats/contra_file.jpg",
    description: "Sabor marcante com capa de gordura lateral. Excelente para grelha e frigideira.",
    isActive: true,
    isFeatured: true,
    stockStatus: "available",
    sortOrder: 3
  },
  // 4. Alcatra
  {
    id: "prod-4",
    name: "Alcatra",
    price: 48.00,
    unit: "kg",
    category: "CARNES NOBRES",
    imageUrl: "/images/meats/alcatra.png",
    description: "Corte clássico, fibras curtas e muito versátil para bifes, assados e picadinho.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 4
  },
  // 5. Maminha
  {
    id: "prod-5",
    name: "Maminha",
    price: 48.00,
    unit: "kg",
    category: "CARNES NOBRES",
    imageUrl: "/images/meats/maminha.jpg",
    description: "Parte nobre da alcatra com formato triangular, maciez e suculência.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 5
  },
  // 6. Patinho
  {
    id: "prod-6",
    name: "Patinho",
    price: 45.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/patinho.webp",
    description: "Carne magra de primeira. Perfeita para moer na hora, quibe e bifes finos.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 6
  },
  // 7. Coxão mole
  {
    id: "prod-7",
    name: "Coxão mole",
    price: 45.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/coxao_mole.webp",
    description: "Fibras curtas e macias. Excelente para bifes à milanesa, rolê e cozidos.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 7
  },
  // 8. Cupim
  {
    id: "prod-8",
    name: "Cupim",
    price: 45.00,
    unit: "kg",
    category: "CHURRASCO",
    imageUrl: "/images/meats/cupim.webp",
    description: "Carne entremeada de gordura muito saborosa. Sensacional no papel celofane e bafo.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 8
  },
  // 9. Fraldinha
  {
    id: "prod-9",
    name: "Fraldinha",
    price: 42.00,
    unit: "kg",
    category: "CHURRASCO",
    imageUrl: "/images/meats/fraldinha.jpg",
    description: "Corte com fibras longas e suculentas, presença obrigatória no churrasco.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 9
  },
  // 10. Coxão duro
  {
    id: "prod-10",
    name: "Coxão duro",
    price: 42.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/coxao_duro.webp",
    description: "Ideal para carnes de panela, ensopados e carne desfiada suculenta.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 10
  },
  // 11. Lagarto
  {
    id: "prod-11",
    name: "Lagarto",
    price: 42.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/lagarto.webp",
    description: "Formato arredondado com capa fina. Clássico para rosbife, carpaccio e carne recheada.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 11
  },
  // 12. Acém
  {
    id: "prod-12",
    name: "Acém",
    price: 28.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/acem.jpg",
    description: "Carne macia de panela, rica em colágeno e muito sabor para cozidos diários.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 12
  },
  // 13. Paleta
  {
    id: "prod-13",
    name: "Paleta",
    price: 28.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/paleta.webp",
    description: "Muito saborosa para refogados, molhos encorpados e carne moída de qualidade.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 13
  },
  // 14. Músculo sem osso
  {
    id: "prod-14",
    name: "Músculo sem osso",
    price: 28.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/musculo_sem_osso.jpg",
    description: "Rico em colágeno, macio após o cozimento lento. Imbatível para sopas e ensopados.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 14
  },
  // 15. Peito
  {
    id: "prod-15",
    name: "Peito",
    price: 25.00,
    unit: "kg",
    category: "CARNES DO DIA A DIA",
    imageUrl: "/images/meats/peito.webp",
    description: "Corte tradicional com fibras resistentes que derretem na panela ou defumador (brisket).",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 15
  },
  // 16. Costela
  {
    id: "prod-16",
    name: "Costela",
    price: 25.00,
    unit: "kg",
    category: "CHURRASCO",
    imageUrl: "/images/meats/costela.webp",
    description: "Costela de ripa e ponta de agulha. Gordura e osso que conferem aroma inigualável.",
    isActive: true,
    isFeatured: true,
    stockStatus: "available",
    sortOrder: 16
  },
  // 17. Espetinho de carne
  {
    id: "prod-17",
    name: "Espetinho de carne",
    price: 5.50,
    unit: "unidade",
    category: "ESPETINHOS",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    description: "Cubos de carne bovina selecionada temperados na medida certa para a brasa.",
    isActive: true,
    isFeatured: true,
    stockStatus: "available",
    sortOrder: 17
  },
  // 18. Coração
  {
    id: "prod-18",
    name: "Coração",
    price: 5.00,
    unit: "unidade",
    category: "ESPETINHOS",
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80",
    description: "Coração de frango limpo e marinado com ervas e alho fresco. Clássico do churrasco.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 18
  },
  // 19. Frango
  {
    id: "prod-19",
    name: "Frango",
    price: 4.50,
    unit: "unidade",
    category: "ESPETINHOS",
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
    description: "Cubos macios de peito de frango selecionado com tempero caseiro especial.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 19
  },
  // 20. Porco
  {
    id: "prod-20",
    name: "Porco",
    price: 4.50,
    unit: "unidade",
    category: "ESPETINHOS",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "Cubos suculentos de lombo suíno temperado com limão e especiarias.",
    isActive: true,
    isFeatured: false,
    stockStatus: "available",
    sortOrder: 20
  }
];
