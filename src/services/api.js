const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const DUMMYJSON_BASE = 'https://dummyjson.com';

export const fetchMeals = async (search = '') => {
  const endpoint = search
    ? `${MEALDB_BASE}/search.php?s=${search}`
    : `${MEALDB_BASE}/search.php?s=`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Failed to fetch meals');
  const data = await response.json();
  return data.meals || [];
};

export const fetchMealById = async (id) => {
  const response = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`);
  if (!response.ok) throw new Error('Failed to fetch meal details');
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
};

const restaurantList = [
  { name: 'Monal Restaurant', cuisine: 'Continental', address: '72-A Liberty Market, Gulberg', hours: '11:00 AM - 11:00 PM' },
  { name: 'Omania Restaurant', cuisine: 'Arabic', address: '42 Main Boulevard, Johar Town', hours: '12:00 PM - 12:00 AM' },
  { name: 'Bundu Khan', cuisine: 'BBQ', address: '55 MM Alam Road', hours: '12:00 PM - 2:00 AM' },
  { name: 'Howdy Restaurant', cuisine: 'American', address: '88-C, Phase 4, DHA', hours: '10:00 AM - 10:00 PM' },
  { name: 'Lal Qila Restaurant', cuisine: 'Mughlai', address: '37-A, Block E, Gulberg', hours: '11:00 AM - 11:00 PM' },
  { name: 'Cafe Zouk', cuisine: 'Italian', address: '100-B MM Alam Road', hours: '9:00 AM - 11:00 PM' },
  { name: 'Salt n Pepper', cuisine: 'Pakistani', address: '23-24 Block C, F-7 Markaz', hours: '11:00 AM - 11:30 PM' },
  { name: 'Pizza Hut', cuisine: 'Fast Food', address: '15 Main Market, Gulberg', hours: '11:00 AM - 11:00 PM' },
  { name: 'China King', cuisine: 'Chinese', address: '5-B, Block C, Satellite Town', hours: '12:00 PM - 10:30 PM' },
  { name: 'Bar.B.Q Tonight', cuisine: 'BBQ', address: '61-L, Block 6, PECHS', hours: '12:00 PM - 12:00 AM' },
  { name: 'Freddy’s Cafe', cuisine: 'Bakery', address: '43-C, Main Market, Gulberg', hours: '8:00 AM - 10:00 PM' },
  { name: 'Tandoori Hut', cuisine: 'Indian', address: '12-A, Block B, Gulshan', hours: '11:00 AM - 11:00 PM' },
  { name: 'The Noodle House', cuisine: 'Asian', address: '77-B, Phase 5, DHA', hours: '12:00 PM - 10:00 PM' },
  { name: 'Subway', cuisine: 'Sandwiches', address: '32, Main Market, Gulberg', hours: '9:00 AM - 10:00 PM' },
  { name: 'Bella Vista', cuisine: 'Italian', address: '19-A, Sunset Boulevard', hours: '12:00 PM - 11:00 PM' },
  { name: 'Al Fresco', cuisine: 'Continental', address: '90, Main Plaza, Blue Area', hours: '10:00 AM - 10:00 PM' },
  { name: 'Dawat-e-Khaas', cuisine: 'Pakistani', address: '55-B, Block H, Gulberg', hours: '11:00 AM - 11:00 PM' },
  { name: 'Sakura Japanese', cuisine: 'Japanese', address: '28-C, Phase 3, DHA', hours: '12:00 PM - 10:00 PM' },
  { name: 'Roll Inn', cuisine: 'Fast Food', address: '7-A, Main Boulevard, Gulberg', hours: '11:00 AM - 12:00 AM' },
  { name: 'Desi Junction', cuisine: 'Pakistani', address: '94, Block D, F-11 Markaz', hours: '11:00 AM - 10:30 PM' },
];

export const fetchRestaurants = async (search = '') => {
  const filtered = search
    ? restaurantList.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase())
      )
    : restaurantList;

  try {
    const response = await fetch(`${DUMMYJSON_BASE}/recipes?limit=20`);
    if (response.ok) {
      const data = await response.json();
      const recipes = data.recipes || [];
      return filtered.map((r, i) => ({
        ...r,
        id: i + 1,
        image: recipes[i]?.image || `https://picsum.photos/seed/${r.name}/400/300`,
        rating: recipes[i]?.rating || (4 + Math.random()).toFixed(1),
        reviewCount: recipes[i]?.reviewCount || Math.floor(Math.random() * 500),
        tags: [r.cuisine],
      }));
    }
  } catch (_) {}

  return filtered.map((r, i) => ({
    ...r,
    id: i + 1,
    image: `https://picsum.photos/seed/${r.name}/400/300`,
    rating: (4 + Math.random()).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500),
    tags: [r.cuisine],
  }));
};
