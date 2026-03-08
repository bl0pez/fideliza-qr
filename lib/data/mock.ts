export interface Business {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  rewardsAvailable: number;
}

export interface Category {
  id: string;
  name: string;
}

export const mockBusinesses: Business[] = [
  {
    id: "b1",
    name: "Central Coffee",
    type: "Cafetería",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7PNP8fhtvfez41Q7b24iUa1Hxi0futyGFDfuCynE0_6j4XBtHQ1Dk_WOprK-3uy2DCcpiFv-70FmR7Gocdw4JiKVvXG-REIlWGlJ_MbaD3_lvxBqgx33UviftQZqXqK6XCRfrTtuTI--C2Da2nYexPaADP98jxb-A72sPNJz6iayK7ZnTBDk6Umh2eOPdCTRDK5VCqMJOwBWAKJS4QDsU8szL7sF2-Zt4zc0xiSpcjsr9KfMf-NSSW19sGtvqvWWW0WKMQVlFPw",
    rewardsAvailable: 5,
  },
  {
    id: "b2",
    name: "Urban Style Cuts",
    type: "Barbería",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy4gzHEHxfqNxeImq9xGznAnOBtTfw1srCmJNhytpb_XkCaZ93TUyTE_mWKNYRFLIuDUpR4BnbmCWRw-jWkOky_kPnimLrai1BE60jEbM3xhb_fJaMMuCWbpavuuiwH-pUG1IA60KVRJEww0eWPx_i1mz1jXmQ5k5e2RGg7IYEj1Vnx1r80Evlxab6lQ5HzCp0BugQv0v1FtLhJZpdWRLVdLqkl7tv_TiJU83lqeL0nDcIPRS4_dev1OKjHFSTp50v7rbXY6gn4w",
    rewardsAvailable: 3,
  },
  {
    id: "b3",
    name: "La Abuela Panadería",
    type: "Panadería",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQqA8Qk3N_2C4w44V-A0gO3q5Uf3s5oUQq1gB_xYJ3GQQJ2o0qR1H9I_5qYwz6UeXQc_120r2sQcM13q1nQ-Z8q1q3oZQYJm_P0XlE1rVb3L_715M3oKqV91b4P0O6sVz2wY6L7Q75mOq1J1K9mP_0A8Z--qPZ1w8aJ1Y1_6c_6A_7",
    rewardsAvailable: 2,
  }
];

export const mockCategories: Category[] = [
  { id: "c1", name: "Cafeterías" },
  { id: "c2", name: "Barberías" },
  { id: "c3", name: "Restaurantes" },
  { id: "c4", name: "Panaderías" },
];

// simulate async fetch
export async function getBusinesses() {
  return new Promise<Business[]>((resolve) => {
    setTimeout(() => resolve(mockBusinesses), 800);
  });
}

export async function getCategories() {
  return new Promise<Category[]>((resolve) => {
    setTimeout(() => resolve(mockCategories), 300);
  });
}
